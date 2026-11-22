"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;
  uniform float uRim;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorld;

  // cheap 3D value noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  // BAREEQ palette: electric blue -> holographic purple -> iridescent pink -> chrome silver
  vec3 palette(float t) {
    vec3 blue   = vec3(0.325, 0.424, 1.000);
    vec3 purple = vec3(0.651, 0.416, 1.000);
    vec3 pink   = vec3(0.945, 0.553, 0.859);
    vec3 silver = vec3(0.863, 0.878, 0.914);
    t = fract(t) * 4.0;
    if (t < 1.0) return mix(blue, purple, smoothstep(0.0, 1.0, t));
    if (t < 2.0) return mix(purple, pink, smoothstep(0.0, 1.0, t - 1.0));
    if (t < 3.0) return mix(pink, silver, smoothstep(0.0, 1.0, t - 2.0));
    return mix(silver, blue, smoothstep(0.0, 1.0, t - 3.0));
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    if (!gl_FrontFacing) n = -n;

    float ndv = clamp(dot(n, v), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 2.2);

    float nz = noise(vWorld * 1.6 + vec3(0.0, uTime * 0.25, 0.0));

    // view-dependent hue: shifts as the surface turns away from the camera
    float t = fresnel * 0.9 + nz * 0.5 + dot(n, vec3(0.3, 0.6, 0.2)) * 0.4 + uTime * 0.05;
    vec3 col = palette(t);

    // thin-film interference banding
    float film = 0.5 + 0.5 * sin(ndv * 9.0 + nz * 4.0 + uTime * 0.6);
    col = mix(col, palette(t + 0.33), film * 0.35);

    // smooth specular highlight
    vec3 l = normalize(vec3(0.5, 0.8, 0.6));
    vec3 h = normalize(l + v);
    float spec = pow(max(dot(n, h), 0.0), 90.0);
    col += spec * 1.2;

    // glassy: darker core, bright iridescent rim
    col = mix(vec3(0.07, 0.08, 0.16), col, 0.75 + 0.25 * fresnel);

    if (uRim > 0.5) {
      // rim-only mode: additive iridescent glow that hugs the silhouette, transparent in the middle
      float a = pow(fresnel, 1.7) * uOpacity * 1.3 + spec * 0.4;
      gl_FragColor = vec4(col * uIntensity * a, 1.0);
      return;
    }
    float alpha = clamp(uOpacity * (0.35 + 0.75 * fresnel) + spec, 0.0, 1.0);
    gl_FragColor = vec4(col * uIntensity, alpha);
  }
`;

type Props = {
  opacity?: number;
  intensity?: number;
  /** 0 freezes the shader animation (used for prefers-reduced-motion) */
  speed?: number;
  /** additive glow on the silhouette only; put it on a slightly enlarged copy of a mesh */
  rimOnly?: boolean;
};

/**
 * Reusable holographic glass material (custom GLSL: Fresnel + noise + thin-film colour shift).
 * Use inside any <mesh>:  <mesh><torusGeometry/><HolographicMaterial/></mesh>
 */
export function HolographicMaterial({ opacity = 0.95, intensity = 1, speed = 1, rimOnly = false }: Props) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: opacity },
          uIntensity: { value: intensity },
          uRim: { value: rimOnly ? 1 : 0 },
        },
        transparent: true,
        blending: rimOnly ? THREE.AdditiveBlending : THREE.NormalBlending,
        side: rimOnly ? THREE.FrontSide : THREE.DoubleSide,
        depthWrite: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rimOnly],
  );

  useEffect(() => {
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uIntensity.value = intensity;
  }, [material, opacity, intensity]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime * speed;
  });

  return <primitive object={material} attach="material" />;
}
