"use client";

import { useEffect, useState } from "react";

/** null = not checked yet (SSR / first paint), true/false afterwards. */
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

/** Phones and low-core devices get a lighter scene (fewer vertices, particles, lower pixel ratio). */
export function useLiteMode() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const compute = () => setLite(mq.matches || (navigator.hardwareConcurrency ?? 8) <= 4);
    compute();
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);
  return lite;
}
