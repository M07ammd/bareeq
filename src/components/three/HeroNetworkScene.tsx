"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Types ──────────────────────────────────────────────────────────────────
type NodeData = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  scale: number;
};

// ── Palette ────────────────────────────────────────────────────────────────
const COLORS = [
  new THREE.Color("#536cff"), // electric blue
  new THREE.Color("#a66aff"), // holo purple
  new THREE.Color("#f18ddb"), // iris pink
  new THREE.Color("#dce0e9"), // chrome silver
];

// ── Node count by quality ──────────────────────────────────────────────────
const COUNT_FULL = 80;
const COUNT_LITE = 36;
const CONNECT_DIST = 2.8;

// ── The Network ───────────────────────────────────────────────────────────
function Network({ lite, still }: { lite: boolean; still: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  const count = lite ? COUNT_LITE : COUNT_FULL;
  const spread = Math.min(viewport.width * 0.55, 10);

  // Build initial node data
  const nodes = useMemo<NodeData[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * viewport.height * 0.9,
        (Math.random() - 0.5) * 4
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      ),
      phase: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.08,
    }));
  }, [count, spread, viewport.height]);

  // Shared geometry & materials
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const nodeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#536cff"),
        transparent: true,
        opacity: 0.18,
        vertexColors: false,
      }),
    []
  );

  // Instance colors
  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    nodes.forEach((_, i) => {
      const c = COLORS[i % COLORS.length];
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [nodes, count]);

  // Pointer tracking
  const pointer = useRef({ x: 0, y: 0 });
  useThree(({ gl }) => {
    const canvas = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * viewport.width;
      pointer.current.y = -((e.clientY - r.top) / r.height - 0.5) * viewport.height;
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    return () => canvas.removeEventListener("pointermove", onMove);
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const linePositions = useMemo(() => new Float32Array(count * count * 6), [count]);

  useFrame((state) => {
    if (!meshRef.current || still) return;
    const t = state.clock.elapsedTime;
    const px = pointer.current.x;
    const py = pointer.current.y;

    // Update nodes
    nodes.forEach((node, i) => {
      // Float
      node.position.x += node.velocity.x;
      node.position.y += node.velocity.y;
      node.position.z += node.velocity.z;

      // Soft cursor repulsion
      const dx = node.position.x - px;
      const dy = node.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5 && dist > 0.01) {
        const force = (2.5 - dist) * 0.003;
        node.position.x += (dx / dist) * force;
        node.position.y += (dy / dist) * force;
      }

      // Soft boundary wrap
      const bx = spread * 1.1;
      const by = viewport.height * 0.52;
      if (node.position.x > bx) node.position.x = -bx;
      if (node.position.x < -bx) node.position.x = bx;
      if (node.position.y > by) node.position.y = -by;
      if (node.position.y < -by) node.position.y = by;

      // Pulsing scale
      const pulse = 1 + 0.3 * Math.sin(t * 1.4 + node.phase);
      dummy.position.copy(node.position);
      dummy.scale.setScalar(node.scale * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Build edges
    if (!lineRef.current) return;
    let edgeIdx = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if (d < CONNECT_DIST) {
          linePositions[edgeIdx++] = nodes[i].position.x;
          linePositions[edgeIdx++] = nodes[i].position.y;
          linePositions[edgeIdx++] = nodes[i].position.z;
          linePositions[edgeIdx++] = nodes[j].position.x;
          linePositions[edgeIdx++] = nodes[j].position.y;
          linePositions[edgeIdx++] = nodes[j].position.z;
        }
      }
    }
    // Pad remaining
    while (edgeIdx < linePositions.length) linePositions[edgeIdx++] = 0;

    const geo = lineRef.current.geometry;
    (geo.attributes.position as THREE.BufferAttribute).set(linePositions);
    geo.attributes.position.needsUpdate = true;

    // Fade opacity by distance from cursor
    lineMat.opacity = 0.12 + 0.1 * Math.sin(t * 0.5);
  });

  return (
    <>
      {/* Nodes */}
      <instancedMesh ref={meshRef} args={[sphereGeo, nodeMat, count]}>
        <instancedBufferAttribute
          attach="instanceColor"
          args={[colorArray, 3]}
        />
      </instancedMesh>

      {/* Edges */}
      <lineSegments ref={lineRef} material={lineMat}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
      </lineSegments>
    </>
  );
}

// ── Ambient particles ─────────────────────────────────────────────────────
function AmbientParticles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * viewport.width * 2.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count, viewport.width, viewport.height]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.012;
    ref.current.rotation.x = clock.elapsedTime * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#8898ff" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
type Props = {
  active: boolean;
  lite: boolean;
  still: boolean;
  onError?: () => void;
  onReady?: () => void;
};

export default function HeroNetworkScene({ active, lite, still, onError, onReady }: Props) {
  return (
    <Canvas
      dpr={[1, lite ? 1.2 : 1.6]}
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onError?.();
        });
        onReady?.();
      }}
      style={{ touchAction: "pan-y" }}
    >
      <AmbientParticles count={lite ? 60 : 120} />
      <Network lite={lite} still={still} />
    </Canvas>
  );
}
