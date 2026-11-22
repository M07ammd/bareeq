"use client";

import { Environment, Lightformer } from "@react-three/drei";

type ChromeProps = {
  color?: string;
  roughness?: number;
  /** thin-film tint on the chrome, gives the blue/purple/pink reflections */
  iridescence?: number;
  envMapIntensity?: number;
};

/** The one chrome material used everywhere, so every object on the site matches. */
export function ChromeMaterial({
  color = "#dce0e9",
  roughness = 0.06,
  iridescence = 0.4,
  envMapIntensity = 1.5,
}: ChromeProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={roughness}
      clearcoat={1}
      clearcoatRoughness={0.04}
      iridescence={iridescence}
      iridescenceIOR={1.7}
      iridescenceThicknessRange={[180, 620]}
      envMapIntensity={envMapIntensity}
    />
  );
}

/**
 * Procedural studio environment built from softbox-style Lightformers.
 * Rendered once on the GPU (frames=1): no HDR download, and chrome still gets crisp, high-contrast
 * reflections. Mostly white + black like a studio chrome shot; the brand colours are small, controlled zones.
 * Must be rendered inside a <Canvas>.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* big soft key from above: the bright crown highlight */}
      <Lightformer form="rect" intensity={4.5} color="#ffffff" position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
      {/* tall strip on the left: the long sweeping highlight down the cheek */}
      <Lightformer form="rect" intensity={3.6} color="#ffffff" position={[-6, 0.5, 1.5]} rotation-y={Math.PI / 2} scale={[9, 2.2, 1]} />
      {/* dimmer silver strip on the right */}
      <Lightformer form="rect" intensity={1.8} color="#dce0e9" position={[6, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[9, 1.4, 1]} />
      {/* brand colour zones: small, so the metal stays silver first and holographic second */}
      <Lightformer form="circle" intensity={4} color="#536cff" position={[-4.5, -2.5, 3]} scale={3} />
      <Lightformer form="circle" intensity={3.6} color="#a66aff" position={[4.5, 2.5, -2]} scale={2.8} />
      <Lightformer form="ring" intensity={2.8} color="#f18ddb" position={[-2, 3, 4]} scale={2.2} />
      {/* near-black floor and back: gives chrome its contrast */}
      <Lightformer form="rect" intensity={1.1} color="#3f5cf6" position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[14, 14, 1]} />
    </Environment>
  );
}
