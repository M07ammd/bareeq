"use client";

import { useMemo } from "react";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ChromeMaterial } from "./ChromeMaterial";
import { HolographicMaterial } from "./HolographicMaterial";

/** Any GLB works: the first mesh found is used and re-skinned with the shared chrome material. */
export const HEAD_MODEL_URL = "/models/chrome-head.glb";

type Props = {
  lite?: boolean;
  still?: boolean;
  /** base turn toward the headline (positive = toward screen right) */
  yaw?: number;
};

function useHeadGeometry() {
  const { scene } = useGLTF(HEAD_MODEL_URL);
  return useMemo(() => {
    const found: { geometry: THREE.BufferGeometry | null } = { geometry: null };
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!found.geometry && mesh.isMesh) found.geometry = mesh.geometry;
    });
    const geometry = found.geometry;
    if (!geometry) return null;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return { geometry, size, center };
  }, [scene]);
}

export function ChromeHead({ lite = false, still = false, yaw = 0.4 }: Props) {
  const head = useHeadGeometry();
  const { viewport } = useThree();
  if (!head) return null;

  // fit the bust to ~84% of the visible height, whatever the screen
  const scale = (viewport.height * 0.84) / head.size.y;

  return (
    <Float
      speed={still ? 0 : 1.1}
      rotationIntensity={still ? 0 : 0.12}
      floatIntensity={still ? 0 : 0.35}
      floatingRange={[-0.05, 0.05]}
    >
      <group rotation={[0.04, yaw, 0]} scale={scale}>
        <group position={[-head.center.x, -head.center.y, -head.center.z]}>
          <mesh geometry={head.geometry}>
            <ChromeMaterial color="#e3e6ee" roughness={0.045} iridescence={0.35} envMapIntensity={1.7} />
          </mesh>
          {/* holographic glass shell: iridescent glow on the silhouette only (custom GLSL) */}
          {!lite && (
            <mesh geometry={head.geometry} scale={1.012}>
              <HolographicMaterial rimOnly opacity={0.9} intensity={1.15} speed={still ? 0 : 1} />
            </mesh>
          )}
        </group>
      </group>

      {!still && (
        <Sparkles
          count={lite ? 18 : 42}
          scale={[viewport.width * 0.7, viewport.height * 0.9, 3]}
          size={lite ? 2 : 2.8}
          speed={0.2}
          opacity={0.65}
          color="#d9deff"
        />
      )}
    </Float>
  );
}

useGLTF.preload(HEAD_MODEL_URL);
