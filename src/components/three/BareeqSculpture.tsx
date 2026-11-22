"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChromeMaterial } from "./ChromeMaterial";
import { HolographicMaterial } from "./HolographicMaterial";

/**
 * An orbital ring representing automation cycles & digital networks.
 */
function OrbitalRing({
  radius,
  tube,
  color,
  rotationSpeed,
  tilt,
  nodeCount = 2,
}: {
  radius: number;
  tube: number;
  color: string;
  rotationSpeed: number;
  tilt: [number, number, number];
  nodeCount?: number;
}) {
  const ringRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * rotationSpeed;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.z += delta * rotationSpeed * 1.4;
    }
  });

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }, [radius, nodeCount]);

  return (
    <group rotation={tilt}>
      {/* The slender orbital ring */}
      <mesh ref={ringRef as unknown as React.Ref<THREE.Mesh>}>
        <torusGeometry args={[radius, tube, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Orbiting data nodes */}
      <group ref={nodesRef}>
        {nodes.map((n, i) => (
          <mesh key={i} position={[n.x, n.y, 0]}>
            <sphereGeometry args={[tube * 3.2, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Ambient floating sparkles & light micro-diamonds ("بريق")
 */
function AmbientSparkles({ count = 35 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.4 + Math.random() * 1.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sc[i] = 0.5 + Math.random() * 1.2;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.2;
    pointsRef.current.rotation.y = t * 0.5;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#f18ddb"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * The Hero Kinetic Sculpture ("بريق" - Prism of Innovation)
 * Consists of:
 * 1. Flowing chrome & iridescent Torus Knot core
 * 2. Faceted inner glowing energy crystal (Icosahedron)
 * 3. 3 High-tech orbital gyroscope rings (Automation, Marketing, Creative)
 * 4. Micro sparkles and directional sheen
 */
export function BareeqSculpture({ lite, still }: { lite: boolean; still: boolean }) {
  const masterGroup = useRef<THREE.Group>(null);
  const coreKnotRef = useRef<THREE.Mesh>(null);
  const glowShellRef = useRef<THREE.Mesh>(null);
  const innerGemRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (still) return;
    const t = state.clock.elapsedTime;

    // Gentle levitation float
    if (masterGroup.current) {
      masterGroup.current.position.y = Math.sin(t * 1.2) * 0.12;
    }

    // Kinetic Knot dynamic rotation
    if (coreKnotRef.current) {
      coreKnotRef.current.rotation.x = t * 0.35;
      coreKnotRef.current.rotation.y = t * 0.45;
    }

    if (glowShellRef.current) {
      glowShellRef.current.rotation.x = t * 0.35;
      glowShellRef.current.rotation.y = t * 0.45;
    }

    // Inner gem counter-rotates and pulses
    if (innerGemRef.current) {
      innerGemRef.current.rotation.x = -t * 0.6;
      innerGemRef.current.rotation.y = -t * 0.8;
      const pulse = 1 + Math.sin(t * 2.5) * 0.08;
      innerGemRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={masterGroup}>
      {/* ── 1. The Main Kinetic Torus Knot Core ── */}
      <mesh ref={coreKnotRef} scale={1.12}>
        <torusKnotGeometry args={[1.1, 0.36, lite ? 70 : 130, lite ? 18 : 34, 2, 3]} />
        <ChromeMaterial
          color="#f4f6fa"
          roughness={0.05}
          iridescence={0.85}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* ── 2. Holographic Fresnel Rim Shell ── */}
      <mesh ref={glowShellRef} scale={1.145}>
        <torusKnotGeometry args={[1.1, 0.36, lite ? 60 : 100, lite ? 14 : 26, 2, 3]} />
        <HolographicMaterial opacity={0.7} intensity={1.3} rimOnly speed={1.2} />
      </mesh>

      {/* ── 3. Inner Prismatic Crystal Gem ── */}
      <mesh ref={innerGemRef} scale={0.68}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#536cff"
          emissive="#7b5aff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.2}
          transmission={0.85}
          ior={1.6}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>

      {/* ── 4. Orbital Gyroscope Tech Rings (3 Planes) ── */}
      {/* Ring 1: Electric Blue - Automation */}
      <OrbitalRing
        radius={2.35}
        tube={0.015}
        color="#536cff"
        rotationSpeed={0.45}
        tilt={[Math.PI / 4, Math.PI / 6, 0]}
        nodeCount={2}
      />

      {/* Ring 2: Holographic Purple - Marketing */}
      <OrbitalRing
        radius={2.65}
        tube={0.014}
        color="#a66aff"
        rotationSpeed={-0.35}
        tilt={[-Math.PI / 3, Math.PI / 4, Math.PI / 8]}
        nodeCount={3}
      />

      {/* Ring 3: Iris Pink - Creative / Brilliance */}
      <OrbitalRing
        radius={2.95}
        tube={0.012}
        color="#f18ddb"
        rotationSpeed={0.25}
        tilt={[Math.PI / 5, -Math.PI / 3, Math.PI / 4]}
        nodeCount={2}
      />

      {/* ── 5. Ambient Micro-Sparkles ("بريق") ── */}
      {!lite && <AmbientSparkles count={40} />}
    </group>
  );
}
