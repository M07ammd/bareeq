"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { services, categories } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";
import { Button } from "@/components/ui/Button";

// ── Distinct Luxury Book Covers for each service ────────────────────────────
export const BOOK_COVERS: Record<
  string,
  {
    bg: string;
    spine: string;
    accent: string;
    glow: string;
    foil: string;
    title: string;
    volume: string;
  }
> = {
  "ai-automation": {
    bg: "#0c1b40", // Deep Midnight Cobalt
    spine: "#081026",
    accent: "#536cff",
    glow: "rgb(83 108 255 / 0.4)",
    foil: "#e8edfa",
    title: "حلول الذكاء الاصطناعي\nوالأتمتة",
    volume: "VOL. 01",
  },
  nobtak: {
    bg: "#0a3628", // Imperial Emerald
    spine: "#062219",
    accent: "#00d084",
    glow: "rgb(0 208 132 / 0.4)",
    foil: "#fce9b8",
    title: "نـوبـتـك\nNOBTAK",
    volume: "VOL. 02",
  },
  raseed: {
    bg: "#2b1044", // Royal Amethyst
    spine: "#1b0a2c",
    accent: "#a66aff",
    glow: "rgb(166 106 255 / 0.4)",
    foil: "#f1dfff",
    title: "رصـيـد\nRASEED",
    volume: "VOL. 03",
  },
  qarrab: {
    bg: "#5a2412", // Terracotta Amber Clay
    spine: "#3a160a",
    accent: "#ff7043",
    glow: "rgb(255 112 67 / 0.4)",
    foil: "#ffe3b3",
    title: "قـــرّب\nQARRAB",
    volume: "VOL. 04",
  },
  "ai-video-ads": {
    bg: "#4e0f24", // Deep Velvet Ruby
    spine: "#320816",
    accent: "#f18ddb",
    glow: "rgb(241 141 219 / 0.4)",
    foil: "#ffcfe2",
    title: "إعلانات الفيديو\nبالذكاء الاصطناعي",
    volume: "VOL. 05",
  },
  "ai-motion-graphics": {
    bg: "#0c3242", // Midnight Petrol Teal
    spine: "#07202b",
    accent: "#00bcd4",
    glow: "rgb(0 188 212 / 0.4)",
    foil: "#daf5fa",
    title: "موشن جرافيك\nبالذكاء الاصطناعي",
    volume: "VOL. 06",
  },
};

/**
 * Procedural high-resolution canvas texture generator for book covers.
 * Creates an authentic clothbound book texture with embossed foil typography.
 */
function useBookCoverTexture(config: (typeof BOOK_COVERS)[string]) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1152;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Base cloth gradient
    const grad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      120,
      canvas.width / 2,
      canvas.height / 2,
      720
    );
    grad.addColorStop(0, config.bg);
    grad.addColorStop(1, config.spine);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Cloth weave / texture stippling
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let i = 0; i < canvas.width; i += 4) {
      ctx.fillRect(i, 0, 1, canvas.height);
    }
    for (let j = 0; j < canvas.height; j += 4) {
      ctx.fillRect(0, j, canvas.width, 1);
    }

    // 3. Double thin embossed foil border
    ctx.strokeStyle = config.foil;
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner diamond markers
    const corners = [
      [58, 58],
      [canvas.width - 58, 58],
      [58, canvas.height - 58],
      [canvas.width - 58, canvas.height - 58],
    ];
    ctx.fillStyle = config.foil;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Volume top header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "500 24px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(config.volume, canvas.width / 2, 120);

    // 5. Service Title in Arabic (Centered, Embossed Foil)
    ctx.fillStyle = config.foil;
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;

    const lines = config.title.split("\n");
    const isSingleLine = lines.length === 1;
    const fontSize = isSingleLine ? 74 : 54;
    ctx.font = `bold ${fontSize}px 'Alexandria', 'IBM Plex Sans Arabic', sans-serif`;

    const lineHeight = fontSize * 1.38;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, idx) => {
      ctx.fillText(line.trim(), canvas.width / 2, startY + idx * lineHeight);
    });

    // Reset shadow
    ctx.shadowColor = "transparent";

    // 6. Foil line ornament below title
    const lineY = startY + (lines.length - 1) * lineHeight + fontSize * 0.95;
    ctx.strokeStyle = config.foil;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 70, lineY);
    ctx.lineTo(canvas.width / 2 + 70, lineY);
    ctx.stroke();

    // Small diamond in center of line
    ctx.fillStyle = config.foil;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, lineY - 5);
    ctx.lineTo(canvas.width / 2 + 6, lineY);
    ctx.lineTo(canvas.width / 2, lineY + 5);
    ctx.lineTo(canvas.width / 2 - 6, lineY);
    ctx.closePath();
    ctx.fill();

    // 7. Brand signature at bottom
    ctx.font = "600 22px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("B A R E E Q", canvas.width / 2, canvas.height - 110);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [config]);
}

// ── Realistic 3D Hardcover Book ─────────────────────────────────────────────
function ServiceBookMesh({
  index,
  total,
  isActive,
  onClick,
  slug,
  still,
}: {
  index: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
  slug: string;
  still: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = BOOK_COVERS[slug] ?? BOOK_COVERS["ai-automation"];
  const coverTexture = useBookCoverTexture(config);

  const targetX = (index - (total - 1) / 2) * 1.58;

  useFrame((state, delta) => {
    if (!groupRef.current || still) return;
    const t = state.clock.elapsedTime;

    // Position damping
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      5,
      delta
    );

    // Interactive mouse / touch tilt for active book
    const pointerTiltY = isActive ? state.pointer.x * 0.22 : 0;
    const pointerTiltX = isActive ? -state.pointer.y * 0.14 : 0;

    // When active: lifts up, floats gently, steps forward, and faces viewer
    const targetY = isActive ? 0.28 + Math.sin(t * 1.5) * 0.04 : 0;
    const targetZ = isActive ? 0.75 : 0;
    const targetRotY = isActive
      ? Math.sin(t * 0.6) * 0.03 + pointerTiltY
      : 0.22 + (index - (total - 1) / 2) * -0.05; // 3/4 display angle showing spine & cover

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      4,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      4,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      4,
      delta
    );

    // Subtle idle breathing tilt or active pointer tilt
    if (!isActive) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        Math.sin(t * 0.5 + index) * 0.02,
        3,
        delta
      );
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        pointerTiltX,
        3,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[targetX, 0, 0]} onClick={onClick}>
      {/* ── 1. Front Hardcover Board with Foil Title Texture ── */}
      <group position={[0, 0, 0.07]}>
        <RoundedBox args={[1.15, 1.68, 0.024]} radius={0.035} smoothness={4}>
          <meshPhysicalMaterial
            color={config.bg}
            roughness={0.4}
            metalness={0.15}
            clearcoat={0.7}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>
        {/* Cover Face Plate with high-res Canvas Texture */}
        {coverTexture && (
          <mesh position={[0, 0, 0.013]}>
            <planeGeometry args={[1.14, 1.67]} />
            <meshPhysicalMaterial
              map={coverTexture}
              roughness={0.35}
              metalness={0.12}
              clearcoat={0.9}
              clearcoatRoughness={0.1}
            />
          </mesh>
        )}
      </group>

      {/* ── 2. Back Hardcover Board ── */}
      <group position={[0, 0, -0.07]}>
        <RoundedBox args={[1.15, 1.68, 0.024]} radius={0.035} smoothness={4}>
          <meshPhysicalMaterial
            color={config.bg}
            roughness={0.4}
            metalness={0.15}
            clearcoat={0.7}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>
      </group>

      {/* ── 3. Spine Binding (Left Edge) ── */}
      <group position={[-0.575, 0, 0]}>
        <RoundedBox args={[0.026, 1.68, 0.16]} radius={0.02} smoothness={4}>
          <meshPhysicalMaterial
            color={config.spine}
            roughness={0.45}
            metalness={0.2}
            clearcoat={0.6}
          />
        </RoundedBox>
        {/* Golden bookmark ribbon edge at top of spine */}
        <mesh position={[0, 0.842, 0]}>
          <boxGeometry args={[0.028, 0.012, 0.06]} />
          <meshBasicMaterial color={config.foil} />
        </mesh>
      </group>

      {/* ── 4. Inner Paper Core (Ivory Book Pages Block) ── */}
      <group position={[0.02, 0, 0]}>
        <RoundedBox args={[1.11, 1.63, 0.125]} radius={0.02} smoothness={3}>
          <meshStandardMaterial
            color="#f7f3eb"
            roughness={0.9}
            metalness={0.05}
          />
        </RoundedBox>
      </group>

      {/* ── 5. Active Ambient Glow Halo ── */}
      {isActive && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[1.7, 2.3]} />
          <meshBasicMaterial
            color={config.accent}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// ── Shelf Platform ───────────────────────────────────────────────────────────
function Shelf({ count }: { count: number }) {
  const width = count * 1.58 + 1.2;
  return (
    <group position={[0, -1.06, 0]}>
      {/* Sleek dark metallic shelf plank */}
      <RoundedBox args={[width, 0.09, 0.65]} radius={0.03} smoothness={4}>
        <meshPhysicalMaterial
          color="#16182e"
          roughness={0.25}
          metalness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      {/* Front metallic trim highlight */}
      <mesh position={[0, 0, 0.326]}>
        <boxGeometry args={[width, 0.02, 0.005]} />
        <meshBasicMaterial color="#536cff" transparent opacity={0.6} />
      </mesh>
      {/* Soft contact shadow */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.046, 0]}>
        <planeGeometry args={[width + 0.8, 1.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ── Ambient Environment Lights ───────────────────────────────────────────────
function SceneLights({ activeSlug }: { activeSlug: string }) {
  const config = BOOK_COVERS[activeSlug] ?? BOOK_COVERS["ai-automation"];
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 6]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-5, 3, 4]} intensity={2.0} color={config.accent} />
      <directionalLight position={[0, -3, 3]} intensity={0.8} color="#ffffff" />
      <pointLight
        position={[0, 2, 3]}
        intensity={2.2}
        color={config.accent}
        distance={7}
        decay={2}
      />
    </>
  );
}

// ── Main Canvas Scene ────────────────────────────────────────────────────────
function ShelfScene({
  activeIndex,
  onSelect,
  still,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
  still: boolean;
}) {
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((state, delta) => {
    if (still) return;
    // Camera gently centers slightly on the active book (more centered on mobile)
    const trackFactor = isMobile ? -1.18 : -0.32;
    const targetX = (activeIndex - (services.length - 1) / 2) * trackFactor;
    
    // Smooth pointer parallax for mouse & touch
    const parallaxX = state.pointer.x * 0.25;
    const parallaxY = state.pointer.y * 0.15;

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      targetX + parallaxX,
      2.5,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      0.16 + parallaxY,
      2,
      delta
    );
  });

  return (
    <>
      <SceneLights activeSlug={services[activeIndex].slug} />
      <Shelf count={services.length} />
      {services.map((s, i) => (
        <ServiceBookMesh
          key={s.slug}
          index={i}
          total={services.length}
          isActive={i === activeIndex}
          onClick={() => onSelect(i)}
          slug={s.slug}
          still={still}
        />
      ))}
    </>
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ service, categoryLabel }: { service: (typeof services)[0]; categoryLabel: string }) {
  const config = BOOK_COVERS[service.slug] ?? BOOK_COVERS["ai-automation"];
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.slug}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.55, ease }}
        className="flex flex-col"
      >
        {/* Category tag */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: config.accent, boxShadow: `0 0 12px ${config.accent}` }}
          />
          <span className="font-latin text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            {config.volume} • {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-display text-3xl font-bold leading-snug text-white lg:text-4xl">
          {service.nameAr}
        </h3>
        <p className="font-latin mb-2 text-sm font-medium tracking-widest text-white/40 uppercase">
          {service.nameEn}
        </p>

        {/* Distinctive accent divider */}
        <div
          className="my-5 h-px w-full"
          style={{
            background: `linear-gradient(to right, ${config.accent}, transparent)`,
          }}
        />

        {/* Short description */}
        <p className="mb-7 text-base leading-relaxed text-white/75">
          {service.short}
        </p>

        {/* Features preview */}
        {service.features.slice(0, 3).map((f) => (
          <div key={f.title} className="mb-3 flex items-start gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: config.accent }}
            />
            <span className="text-sm text-white/70">{f.title}</span>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-8">
          <Button href={`/services/${service.slug}`} size="lg" variant="chrome">
            اكتشف الخدمة
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Index Dots ───────────────────────────────────────────────────────────────
function IndexDots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const slug = services[i].slug;
        const config = BOOK_COVERS[slug] ?? BOOK_COVERS["ai-automation"];
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="transition-all duration-300"
            aria-label={`الكتاب ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? 28 : 8,
                height: 8,
                background: isActive ? config.accent : "rgb(255 255 255 / 0.2)",
                boxShadow: isActive ? `0 0 10px ${config.accent}` : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Root Component ───────────────────────────────────────────────────────────
export function ServicesShelf() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const service = services[active];
  const category = categories.find((c) => c.id === service.category);
  const config = BOOK_COVERS[service.slug] ?? BOOK_COVERS["ai-automation"];

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        // Swiped left
        setActive((p) => Math.min(p + 1, services.length - 1));
      } else {
        // Swiped right
        setActive((p) => Math.max(p - 1, 0));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null) {
      const deltaX = e.clientX - mouseStartX.current;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          setActive((p) => Math.min(p + 1, services.length - 1));
        } else {
          setActive((p) => Math.max(p - 1, 0));
        }
      }
    }
    mouseStartX.current = null;
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActive((p) => Math.min(p + 1, services.length - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActive((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="bg-night grain relative overflow-hidden py-20 md:py-28 lg:py-32"
      style={{ "--gx": "60%", "--gy": "30%" } as React.CSSProperties}
    >
      {/* Ambient glow matching the active book's distinct color */}
      <motion.div
        key={service.slug}
        className="pointer-events-none absolute inset-0 -z-0"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 65% 45%, ${config.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-[1] mx-auto max-w-7xl px-6">
        {/* ── Section Header ── */}
        <div className="mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-10 bg-white/30" />
            <span className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50">
              Working Volumes • Our Services
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            كل اللي بيزنسك محتاجه
            <br />
            <span className="holo-text-light">في مكان واحد.</span>
          </motion.h2>
        </div>

        {/* ── Two-Column: Bookshelf Canvas + Detail Panel ── */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_390px] lg:gap-12">

          {/* ── LEFT: 3D Bookshelf Canvas ── */}
          <div>
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                mouseStartX.current = null;
                setIsDragging(false);
              }}
              className={`relative w-full select-none overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                height: "clamp(300px, 52vw, 470px)",
                touchAction: "pan-y",
              }}
            >
              {/* Canvas */}
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.45, 7.4], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ background: "transparent" }}
              >
                <ShelfScene
                  activeIndex={active}
                  onSelect={setActive}
                  still={!!reduced}
                />
              </Canvas>

              {/* Touch hint for mobile */}
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden">
                <span className="glass-dark rounded-full px-4 py-1.5 text-xs text-white/55">
                  اسحب أو انقر على الكتاب لفتحه
                </span>
              </div>
            </div>

            {/* Nav Controls */}
            <div className="mt-6 flex items-center justify-between">
              <IndexDots total={services.length} active={active} onSelect={setActive} />
              {/* Prev/Next Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setActive((p) => Math.max(p - 1, 0))}
                  disabled={active === 0}
                  className="glass-dark grid h-10 w-10 place-items-center rounded-full text-white/70 transition-all hover:bg-white/15 hover:text-white disabled:opacity-25"
                  aria-label="الكتاب السابق"
                >
                  ←
                </button>
                <button
                  onClick={() => setActive((p) => Math.min(p + 1, services.length - 1))}
                  disabled={active === services.length - 1}
                  className="glass-dark grid h-10 w-10 place-items-center rounded-full text-white/70 transition-all hover:bg-white/15 hover:text-white disabled:opacity-25"
                  aria-label="الكتاب التالي"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Editorial Detail Panel ── */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:ps-6">
            {/* Service Icon with signature color */}
            <motion.div
              key={service.slug + "-icon"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${config.accent}25, ${config.accent}50)`,
                border: `1px solid ${config.accent}55`,
              }}
            >
              <ServiceIcon name={service.icon} className="h-9 w-9" />
            </motion.div>

            <DetailPanel service={service} categoryLabel={category?.titleEn ?? ""} />
          </div>
        </div>

        {/* ── Book Quick Selector Tabs ── */}
        <div className="mt-14 flex flex-wrap gap-2.5 sm:gap-3">
          {services.map((s, idx) => {
            const isSelected = active === idx;
            const bookCfg = BOOK_COVERS[s.slug] ?? BOOK_COVERS["ai-automation"];
            return (
              <button
                key={s.slug}
                onClick={() => setActive(idx)}
                className="flex items-center gap-2.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300"
                style={{
                  background: isSelected ? `${bookCfg.accent}25` : "rgb(255 255 255 / 0.04)",
                  border: `1px solid ${isSelected ? bookCfg.accent : "rgb(255 255 255 / 0.1)"}`,
                  color: isSelected ? "#ffffff" : "rgb(255 255 255 / 0.6)",
                  boxShadow: isSelected ? `0 0 16px ${bookCfg.glow}` : "none",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: bookCfg.accent }}
                />
                <span>{s.nameAr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
