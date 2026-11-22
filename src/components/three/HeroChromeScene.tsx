"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { StudioEnvironment } from "./ChromeMaterial";
import { ChromeHead } from "./ChromeHead";

type Props = {
  /** false pauses the render loop (off-screen or hidden tab) */
  active: boolean;
  lite: boolean;
  /** prefers-reduced-motion */
  still: boolean;
  onError?: () => void;
  /** called once the model and environment are ready, so the page can fade the 3D in */
  onReady?: () => void;
};

/**
 * Pointer rig: the head slowly turns to follow the cursor and the camera drifts a little for depth.
 * On wide screens the head sits on the left (the Arabic headline is on the right in RTL).
 */
function Rig({ still, children }: { still: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const wide = viewport.width > 7.5;
  const offsetX = wide ? -viewport.width * 0.2 : 0;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const px = still ? 0 : state.pointer.x;
    const py = still ? 0 : state.pointer.y;
    // scroll-linked: as the hero leaves the screen the head turns away and recedes a little
    const p = still ? 0 : Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.42 - p * 1.1, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.18, 3, delta);
    const s = THREE.MathUtils.damp(g.scale.x, 1 - p * 0.14, 3, delta);
    g.scale.setScalar(s);
    g.position.x = THREE.MathUtils.damp(g.position.x, offsetX + px * 0.15, 3, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, px * 0.3, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, py * 0.2, 2, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

function Ready({ onReady }: { onReady?: () => void }) {
  // mounted only after Suspense resolved (model + environment loaded)
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function HeroChromeScene({ active, lite, still, onError, onReady }: Props) {
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 38 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onError?.();
        });
      }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <StudioEnvironment />
        {/* coloured rim lights: small specular glints in the brand blue and pink */}
        <directionalLight position={[-4, 2, -3]} intensity={2.2} color="#536cff" />
        <directionalLight position={[4, 1, -3]} intensity={1.8} color="#f18ddb" />
        <Rig still={still}>
          <ChromeHead lite={lite} still={still} />
        </Rig>
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
