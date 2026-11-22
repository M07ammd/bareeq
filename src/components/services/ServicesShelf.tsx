"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { services, categories } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";
import { Button } from "@/components/ui/Button";

// ── Palette per category ────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { accent: string; glow: string }> = {
  automation: { accent: "#536cff", glow: "rgb(83 108 255 / 0.35)" },
  hospitality: { accent: "#a66aff", glow: "rgb(166 106 255 / 0.35)" },
  creative:    { accent: "#f18ddb", glow: "rgb(241 141 219 / 0.35)" },
};

// ── Spine colors per card ────────────────────────────────────────────────────
const SPINE_COLORS = [
  "#1a2080", "#0d1540", "#2a1060",
  "#1a0d50", "#1a0940", "#0d1540",
];

// ── Image-textured Card Face ─────────────────────────────────────────────────
function CardFace({
  imageUrl,
  catColor,
  isActive,
  spineColor,
}: {
  imageUrl: string;
  catColor: string;
  isActive: boolean;
  spineColor: string;
}) {
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      {/* Full-bleed photo on the face */}
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[1.1, 1.65]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Dark gradient overlay — bottom half for legibility */}
      <mesh position={[0, -0.42, 0.040]}>
        <planeGeometry args={[1.1, 0.82]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.65}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Holographic category accent bar at top */}
      <mesh position={[0, 0.75, 0.041]}>
        <planeGeometry args={[1.1, 0.12]} />
        <meshPhysicalMaterial
          color={catColor}
          emissive={catColor}
          emissiveIntensity={isActive ? 1.6 : 0.7}
          roughness={0.1}
          metalness={1}
          iridescence={1}
          iridescenceIOR={1.9}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Vignette rim glow on edges */}
      <mesh position={[0, 0, 0.037]}>
        <planeGeometry args={[1.1, 1.65]} />
        <meshBasicMaterial
          color={catColor}
          transparent
          opacity={isActive ? 0.18 : 0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// ── 3D Service Card ─────────────────────────────────────────────────────────
function ServiceCardMesh({
  index,
  total,
  isActive,
  onClick,
  categoryId,
  imageUrl,
  still,
}: {
  index: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
  categoryId: string;
  imageUrl: string;
  still: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const targetX = (index - (total - 1) / 2) * 1.6;
  const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];
  const catColor = CATEGORY_COLORS[categoryId]?.accent ?? "#536cff";

  useFrame((state, delta) => {
    if (!meshRef.current || still) return;
    const t = state.clock.elapsedTime;

    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x, targetX, 5, delta
    );

    // Active card: lift + gentle float
    const targetY = isActive ? 0.22 + Math.sin(t * 1.4) * 0.04 : 0;
    const targetZ = isActive ? 0.65 : 0;
    const targetRotY = isActive
      ? Math.sin(t * 0.5) * 0.03
      : (index - (total - 1) / 2) * -0.04;

    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 4, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 4, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 4, delta);

    if (!isActive) {
      meshRef.current.rotation.x = THREE.MathUtils.damp(
        meshRef.current.rotation.x,
        Math.sin(t * 0.4 + index) * 0.025,
        3, delta
      );
    }
  });

  return (
    <group ref={meshRef} position={[targetX, 0, 0]} onClick={onClick}>
      {/* Card body — dark spine + depth */}
      <RoundedBox args={[1.1, 1.65, 0.075]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color={spineColor}
          roughness={0.3}
          metalness={0.3}
          clearcoat={0.95}
          clearcoatRoughness={0.08}
        />
      </RoundedBox>

      {/* Photo + overlays on the front face */}
      <CardFace
        imageUrl={imageUrl}
        catColor={catColor}
        isActive={isActive}
        spineColor={spineColor}
      />

      {/* Back-glow halo when active */}
      {isActive && (
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[1.6, 2.4]} />
          <meshBasicMaterial
            color={catColor}
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// ── Shelf Platform ───────────────────────────────────────────────────────────
function Shelf({ count }: { count: number }) {
  const width = count * 1.6 + 1.2;
  return (
    <group position={[0, -1.08, 0]}>
      {/* shelf board */}
      <RoundedBox args={[width, 0.1, 0.5]} radius={0.03} smoothness={4}>
        <meshPhysicalMaterial
          color="#1a1d33"
          roughness={0.3}
          metalness={0.6}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      {/* subtle shadow plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.051, 0]}>
        <planeGeometry args={[width + 1, 1.6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

// ── Ambient Environment Lights ───────────────────────────────────────────────
function SceneLights({ activeCategory }: { activeCategory: string }) {
  const catColor = CATEGORY_COLORS[activeCategory]?.accent ?? "#536cff";
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-4, 2, 3]} intensity={1.6} color={catColor} />
      <pointLight position={[0, 2, 3]} intensity={2} color={catColor} distance={8} decay={2} />
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
  const { camera } = useThree();
  const prevCat = useRef<string>(services[0].category);

  useFrame((state, delta) => {
    if (still) return;
    // Lazy camera drift toward active card
    const targetX = (activeIndex - (services.length - 1) / 2) * -0.35;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.15, 2, delta);
  });

  return (
    <>
      <SceneLights activeCategory={services[activeIndex].category} />
      <Shelf count={services.length} />
      {services.map((s, i) => (
        <ServiceCardMesh
          key={s.slug}
          index={i}
          total={services.length}
          isActive={i === activeIndex}
          onClick={() => onSelect(i)}
          categoryId={s.category}
          imageUrl={s.image.src}
          still={still}
        />
      ))}
    </>
  );
}

// ── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ service, categoryLabel }: { service: (typeof services)[0]; categoryLabel: string }) {
  const catColor = CATEGORY_COLORS[service.category];
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
        <div className="mb-5 flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: catColor.accent, boxShadow: `0 0 10px ${catColor.accent}` }}
          />
          <span className="font-latin text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/50">
            {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 font-display text-3xl font-bold leading-snug text-white lg:text-4xl">
          {service.nameAr}
        </h3>
        <p className="font-latin mb-2 text-sm font-medium tracking-widest text-white/35 uppercase">
          {service.nameEn}
        </p>

        {/* Divider */}
        <div
          className="my-5 h-px w-full"
          style={{
            background: `linear-gradient(to right, ${catColor.accent}, transparent)`,
          }}
        />

        {/* Short description */}
        <p className="mb-8 text-base leading-relaxed text-white/70">
          {service.short}
        </p>

        {/* Features preview */}
        {service.features.slice(0, 3).map((f) => (
          <div key={f.title} className="mb-3 flex items-start gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: catColor.accent }}
            />
            <span className="text-sm text-white/65">{f.title}</span>
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
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="transition-all duration-300"
          aria-label={`الخدمة ${i + 1}`}
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              background: i === active
                ? CATEGORY_COLORS[services[i].category]?.accent ?? "#536cff"
                : "rgb(255 255 255 / 0.2)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── Root Component ───────────────────────────────────────────────────────────
export function ServicesShelf() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const service = services[active];
  const category = categories.find((c) => c.id === service.category);
  const catColor = CATEGORY_COLORS[service.category];

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
    <div className="bg-night grain relative overflow-hidden py-20 md:py-28 lg:py-32"
      style={{ "--gx": "60%", "--gy": "30%" } as React.CSSProperties}
    >
      {/* Ambient category glow */}
      <motion.div
        key={service.category}
        className="pointer-events-none absolute inset-0 -z-0"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${catColor.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-[1] mx-auto max-w-7xl px-6">
        {/* ── Section Header ── */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-px w-10 bg-white/30" />
            <span className="font-latin text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/45">
              Our Services
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

        {/* ── Two-Column: Shelf Canvas + Detail Panel ── */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">

          {/* ── LEFT: 3D Shelf Canvas ── */}
          <div>
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ height: "clamp(280px, 50vw, 460px)" }}
            >
              {/* Canvas */}
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.4, 7.5], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ background: "transparent" }}
              >
                <ShelfScene
                  activeIndex={active}
                  onSelect={setActive}
                  still={!!reduced}
                />
              </Canvas>

              {/* Touch swipe hint on mobile */}
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden">
                <span className="glass-dark rounded-full px-4 py-1.5 text-xs text-white/50">
                  انقر على الكارت لاختياره
                </span>
              </div>
            </div>

            {/* Nav Dots */}
            <div className="mt-6 flex items-center justify-between">
              <IndexDots total={services.length} active={active} onSelect={setActive} />
              {/* Prev/Next */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActive((p) => Math.max(p - 1, 0))}
                  disabled={active === 0}
                  className="glass-dark grid h-10 w-10 place-items-center rounded-full text-white/60 transition-all hover:text-white disabled:opacity-30"
                  aria-label="السابق"
                >
                  ←
                </button>
                <button
                  onClick={() => setActive((p) => Math.min(p + 1, services.length - 1))}
                  disabled={active === services.length - 1}
                  className="glass-dark grid h-10 w-10 place-items-center rounded-full text-white/60 transition-all hover:text-white disabled:opacity-30"
                  aria-label="التالي"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Editorial Detail Panel ── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:ps-6">
            {/* Service icon */}
            <motion.div
              key={service.slug + "-icon"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${catColor.accent}22, ${catColor.accent}44)`,
                border: `1px solid ${catColor.accent}44`,
              }}
            >
              <ServiceIcon name={service.icon} className="h-9 w-9" />
            </motion.div>

            <DetailPanel service={service} categoryLabel={category?.titleEn ?? ""} />
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="mt-16 flex flex-wrap gap-3">
          {categories.map((cat) => {
            const isActive = services[active].category === cat.id;
            const color = CATEGORY_COLORS[cat.id];
            const firstIdx = services.findIndex((s) => s.category === cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActive(firstIdx)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
                style={{
                  background: isActive ? `${color.accent}22` : "rgb(255 255 255 / 0.05)",
                  border: `1px solid ${isActive ? color.accent : "rgb(255 255 255 / 0.1)"}`,
                  color: isActive ? color.accent : "rgb(255 255 255 / 0.5)",
                  boxShadow: isActive ? `0 0 20px ${color.glow}` : "none",
                }}
              >
                {cat.titleEn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
