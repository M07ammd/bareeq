"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { StudioEnvironment } from "./ChromeMaterial";
import { BareeqSculpture } from "./BareeqSculpture";

type Props = {
  active: boolean;
  lite: boolean;
  still: boolean;
  onError?: () => void;
  onReady?: () => void;
};

/**
 * Camera & Model Rig with gentle mouse tracking and responsive positioning.
 */
function Rig({ still, children }: { still: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const px = still ? 0 : state.pointer.x;
    const py = still ? 0 : state.pointer.y;

    // Smooth tilt towards pointer
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.45, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.35, 2.5, delta);

    // Parallax camera displacement
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, px * 0.35, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, py * 0.25, 2, delta);
    state.camera.lookAt(0, 0, 0);
  });

  // Responsive scale based on viewport width
  const scale = Math.min(1.05, Math.max(0.72, viewport.width * 0.14));

  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  );
}

function ReadyNotifier({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function HeroSculptureScene({ active, lite, still, onError, onReady }: Props) {
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 7.8], fov: 42 }}
      gl={{
        antialias: !lite,
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop={active ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onError?.();
        });
      }}
      style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        {/* Studio environment for HDR metallic reflections */}
        <StudioEnvironment />

        {/* Ambient & Rim directional lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[-5, 4, 3]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={2.8} color="#536cff" />
        <directionalLight position={[4, 2, -3]} intensity={2.4} color="#f18ddb" />
        <pointLight position={[0, 0, 0]} intensity={1.8} color="#a66aff" distance={4} />

        <Rig still={still}>
          <BareeqSculpture lite={lite} still={still} />
        </Rig>

        <ReadyNotifier onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
