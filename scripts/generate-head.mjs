/**
 * Generates public/models/chrome-head.glb: a stylised mannequin head + neck, built from a signed-distance
 * field and meshed with naive Surface Nets. Pure Node, no dependencies.
 *
 *   node scripts/generate-head.mjs            -> writes the GLB
 *   node scripts/generate-head.mjs --preview  -> also writes a shaded PNG preview (needs `sharp`)
 *
 * To use a different head, drop any GLB at public/models/chrome-head.glb. The site only reads its geometry
 * and applies the shared chrome material, so any head/bust mesh works.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";

const OUT = new URL("../public/models/chrome-head.glb", import.meta.url).pathname;
const PREVIEW = new URL("./head-preview.png", import.meta.url).pathname;
const H = Number(process.env.STEP ?? 0.018); // grid step: smaller = denser mesh

/* ---------------- signed distance helpers ---------------- */
const len = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smax = (a, b, k) => -smin(-a, -b, k);

function ell(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx, py = (y - cy) / ry, pz = (z - cz) / rz;
  const k0 = len(px, py, pz);
  const qx = px / rx, qy = py / ry, qz = pz / rz;
  const k1 = len(qx, qy, qz);
  return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}

function cap(x, y, z, ax, ay, az, bx, by, bz, r) {
  const pax = x - ax, pay = y - ay, paz = z - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const t = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  return len(pax - bax * t, pay - bay * t, paz - baz * t) - r;
}

/** Head + neck + shoulders. Face looks toward +Z, up is +Y. Units ~ 1 = half head height. */
function sdf(x, y, z) {
  const ax = Math.abs(x); // symmetric features use |x|

  // cranium and jaw
  let d = ell(x, y, z, 0, 0.2, -0.1, 0.68, 0.76, 0.79);
  d = smin(d, ell(x, y, z, 0, -0.28, 0.1, 0.55, 0.6, 0.58), 0.3);
  d = smin(d, ell(x, y, z, 0, -0.58, 0.22, 0.36, 0.32, 0.4), 0.2); // chin / jaw taper
  // cheekbones
  d = smin(d, ell(ax, y, z, 0.37, -0.03, 0.4, 0.2, 0.14, 0.19), 0.14);
  // brow ridge: soft, blended into the forehead (no visor)
  d = smin(d, ell(x, y, z, 0, 0.19, 0.54, 0.46, 0.085, 0.15), 0.24);

  // closed eyes: shallow socket + thin lash line, no eyeball bulge
  d = smax(d, -ell(ax, y, z, 0.25, 0.08, 0.76, 0.16, 0.085, 0.09), 0.13);
  d = smax(d, -ell(ax, y, z, 0.25, 0.085, 0.8, 0.125, 0.011, 0.1), 0.02);

  // nose: bridge, tip, wings (a touch larger and longer)
  d = smin(d, cap(x, y, z, 0, 0.16, 0.6, 0, -0.17, 0.85, 0.07), 0.14);
  d = smin(d, ell(x, y, z, 0, -0.22, 0.88, 0.105, 0.085, 0.1), 0.08);
  d = smin(d, ell(ax, y, z, 0.115, -0.21, 0.77, 0.08, 0.075, 0.08), 0.1);
  d = smax(d, -ell(ax, y, z, 0.062, -0.285, 0.88, 0.032, 0.03, 0.05), 0.03); // nostrils

  // lips: fuller and closer together, mouth line between
  d = smin(d, ell(x, y, z, 0, -0.425, 0.665, 0.17, 0.046, 0.08), 0.085);
  d = smin(d, ell(x, y, z, 0, -0.505, 0.655, 0.15, 0.056, 0.08), 0.085);
  d = smax(d, -ell(x, y, z, 0, -0.462, 0.76, 0.2, 0.011, 0.1), 0.02);
  d = smin(d, ell(x, y, z, 0, -0.72, 0.62, 0.14, 0.09, 0.09), 0.12); // chin

  // ears (gentle concha instead of a hole)
  d = smin(d, ell(ax, y, z, 0.7, 0.0, -0.08, 0.07, 0.19, 0.12), 0.05);
  d = smax(d, -ell(ax, y, z, 0.775, 0.0, -0.03, 0.035, 0.085, 0.05), 0.05);

  // neck + shoulders
  let neck = cap(x, y, z, 0, -0.5, -0.14, 0, -1.4, -0.1, 0.35);
  neck = smin(neck, ell(x, y, z, 0, -1.32, -0.1, 0.95, 0.28, 0.5), 0.35);
  d = smin(d, neck, 0.32);
  // flat cut at the base so it reads as a bust
  d = Math.max(d, -(y + 1.46));
  return d;
}

/* ---------------- surface nets ---------------- */
const X0 = -1.15, X1 = 1.15, Y0 = -1.55, Y1 = 1.08, Z0 = -1.0, Z1 = 1.12;
const nx = Math.ceil((X1 - X0) / H) + 1;
const ny = Math.ceil((Y1 - Y0) / H) + 1;
const nz = Math.ceil((Z1 - Z0) / H) + 1;
const field = new Float32Array(nx * ny * nz);
const gi = (i, j, k) => i + nx * (j + ny * k);

for (let k = 0; k < nz; k++)
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) field[gi(i, j, k)] = sdf(X0 + i * H, Y0 + j * H, Z0 + k * H);

const cx = nx - 1, cy = ny - 1, cz = nz - 1;
const cellVert = new Int32Array(cx * cy * cz).fill(-1);
const ci = (i, j, k) => i + cx * (j + cy * k);
const pos = [];

const corner = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
const edges = [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];

for (let k = 0; k < cz; k++)
  for (let j = 0; j < cy; j++)
    for (let i = 0; i < cx; i++) {
      const v = corner.map(([a, b, c]) => field[gi(i + a, j + b, k + c)]);
      let mask = 0;
      for (let n = 0; n < 8; n++) if (v[n] < 0) mask |= 1 << n;
      if (mask === 0 || mask === 255) continue;
      let sx = 0, sy = 0, sz = 0, cnt = 0;
      for (const [a, b] of edges) {
        if (v[a] < 0 === v[b] < 0) continue;
        const t = v[a] / (v[a] - v[b]);
        sx += corner[a][0] + (corner[b][0] - corner[a][0]) * t;
        sy += corner[a][1] + (corner[b][1] - corner[a][1]) * t;
        sz += corner[a][2] + (corner[b][2] - corner[a][2]) * t;
        cnt++;
      }
      cellVert[ci(i, j, k)] = pos.length / 3;
      pos.push(X0 + (i + sx / cnt) * H, Y0 + (j + sy / cnt) * H, Z0 + (k + sz / cnt) * H);
    }

// project each vertex onto the true surface and take analytic normals
const EPS = 0.003;
function grad(x, y, z) {
  const gx = sdf(x + EPS, y, z) - sdf(x - EPS, y, z);
  const gy = sdf(x, y + EPS, z) - sdf(x, y - EPS, z);
  const gz = sdf(x, y, z + EPS) - sdf(x, y, z - EPS);
  const l = len(gx, gy, gz) || 1;
  return [gx / l, gy / l, gz / l];
}
const nv = pos.length / 3;
const nor = new Float32Array(nv * 3);
for (let v = 0; v < nv; v++) {
  let x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
  for (let it = 0; it < 3; it++) {
    const d = sdf(x, y, z);
    const g = grad(x, y, z);
    x -= g[0] * d; y -= g[1] * d; z -= g[2] * d;
  }
  pos[v * 3] = x; pos[v * 3 + 1] = y; pos[v * 3 + 2] = z;
  const g = grad(x, y, z);
  nor[v * 3] = g[0]; nor[v * 3 + 1] = g[1]; nor[v * 3 + 2] = g[2];
}

const tris = [];
function quad(a, b, c, d, flip) {
  if (a < 0 || b < 0 || c < 0 || d < 0) return;
  if (flip) tris.push(a, c, b, a, d, c);
  else tris.push(a, b, c, a, c, d);
}
for (let k = 0; k < nz; k++)
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const f0 = field[gi(i, j, k)] < 0;
      if (i < nx - 1 && j > 0 && k > 0 && f0 !== field[gi(i + 1, j, k)] < 0)
        quad(cellVert[ci(i, j - 1, k - 1)], cellVert[ci(i, j, k - 1)], cellVert[ci(i, j, k)], cellVert[ci(i, j - 1, k)], f0);
      if (j < ny - 1 && i > 0 && k > 0 && f0 !== field[gi(i, j + 1, k)] < 0)
        quad(cellVert[ci(i - 1, j, k - 1)], cellVert[ci(i - 1, j, k)], cellVert[ci(i, j, k)], cellVert[ci(i, j, k - 1)], f0);
      if (k < nz - 1 && i > 0 && j > 0 && f0 !== field[gi(i, j, k + 1)] < 0)
        quad(cellVert[ci(i - 1, j - 1, k)], cellVert[ci(i, j - 1, k)], cellVert[ci(i, j, k)], cellVert[ci(i - 1, j, k)], f0);
    }

// make winding consistent with outward normals
let flipped = 0;
for (let t = 0; t < tris.length; t += 3) {
  const [a, b, c] = [tris[t], tris[t + 1], tris[t + 2]];
  const e1 = [pos[b*3]-pos[a*3], pos[b*3+1]-pos[a*3+1], pos[b*3+2]-pos[a*3+2]];
  const e2 = [pos[c*3]-pos[a*3], pos[c*3+1]-pos[a*3+1], pos[c*3+2]-pos[a*3+2]];
  const fn = [e1[1]*e2[2]-e1[2]*e2[1], e1[2]*e2[0]-e1[0]*e2[2], e1[0]*e2[1]-e1[1]*e2[0]];
  const nn = [nor[a*3]+nor[b*3]+nor[c*3], nor[a*3+1]+nor[b*3+1]+nor[c*3+1], nor[a*3+2]+nor[b*3+2]+nor[c*3+2]];
  if (fn[0]*nn[0] + fn[1]*nn[1] + fn[2]*nn[2] < 0) { tris[t+1] = c; tris[t+2] = b; flipped++; }
}

/* ---------------- GLB writer ---------------- */
function writeGLB() {
  const P = new Float32Array(pos);
  const use16 = nv < 65535;
  const I = use16 ? new Uint16Array(tris) : new Uint32Array(tris);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let v = 0; v < nv; v++) for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], P[v*3+a]); max[a] = Math.max(max[a], P[v*3+a]); }

  const pad4 = (n) => (n + 3) & ~3;
  const bufP = Buffer.from(P.buffer), bufN = Buffer.from(nor.buffer), bufI = Buffer.from(I.buffer, I.byteOffset, I.byteLength);
  const offP = 0, offN = pad4(bufP.length), offI = offN + pad4(bufN.length);
  const total = offI + pad4(bufI.length);
  const bin = Buffer.alloc(total);
  bufP.copy(bin, offP); bufN.copy(bin, offN); bufI.copy(bin, offI);

  const json = {
    asset: { version: "2.0", generator: "bareeq generate-head.mjs" },
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: "ChromeHead" }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
    materials: [{ name: "chrome", pbrMetallicRoughness: { baseColorFactor: [0.86, 0.88, 0.92, 1], metallicFactor: 1, roughnessFactor: 0.06 } }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: nv, type: "VEC3", min, max },
      { bufferView: 1, componentType: 5126, count: nv, type: "VEC3" },
      { bufferView: 2, componentType: use16 ? 5123 : 5125, count: tris.length, type: "SCALAR" },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: offP, byteLength: bufP.length, target: 34962 },
      { buffer: 0, byteOffset: offN, byteLength: bufN.length, target: 34962 },
      { buffer: 0, byteOffset: offI, byteLength: bufI.length, target: 34963 },
    ],
    buffers: [{ byteLength: total }],
  };
  let js = Buffer.from(JSON.stringify(json));
  js = Buffer.concat([js, Buffer.alloc(pad4(js.length) - js.length, 0x20)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + js.length + 8 + total, 8);
  const jh = Buffer.alloc(8); jh.writeUInt32LE(js.length, 0); jh.writeUInt32LE(0x4e4f534a, 4);
  const bh = Buffer.alloc(8); bh.writeUInt32LE(total, 0); bh.writeUInt32LE(0x004e4942, 4);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, Buffer.concat([header, jh, js, bh, bin]));
  return { bytes: header.readUInt32LE(8), min, max };
}

const info = writeGLB();
console.log(`vertices ${nv}, triangles ${tris.length / 3}, flipped ${flipped}, ${(info.bytes / 1024 / 1024).toFixed(2)} MB`);
console.log("bounds", info.min.map((n) => n.toFixed(2)), info.max.map((n) => n.toFixed(2)));

/* ---------------- optional software preview (chrome-ish shading) ---------------- */
if (process.argv.includes("--preview")) {
  const sharp = createRequire(import.meta.url)(process.env.SHARP_PATH ?? "sharp");
  const yaw = Number(process.env.YAW ?? 0.35), pitch = Number(process.env.PITCH ?? 0.0);
  const W = 640, Hh = 820, buf = new Float32Array(W * Hh * 3), zb = new Float32Array(W * Hh).fill(1e9);
  const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const rot = (x, y, z) => {
    let X = x * cyaw + z * syaw, Z = -x * syaw + z * cyaw, Y = y;
    const Y2 = Y * cp - Z * sp, Z2 = Y * sp + Z * cp;
    return [X, Y2, Z2];
  };
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // studio environment: top softbox, side strips, brand-coloured zones, dark floor
  const env = (dx, dy, dz) => {
    let r = 0.02, g = 0.02, b = 0.035;
    const top = smooth(0.55, 0.85, dy) * (1 - smooth(0.9, 1.0, Math.abs(dx)));
    r += top * 1.6; g += top * 1.6; b += top * 1.7;
    const sl = smooth(0.55, 0.8, -dx) * (1 - smooth(0.35, 0.6, Math.abs(dy - 0.1))) * (dz > -0.6 ? 1 : 0.3);
    r += sl * 1.3; g += sl * 1.3; b += sl * 1.4;
    const sr = smooth(0.55, 0.8, dx) * (1 - smooth(0.2, 0.45, Math.abs(dy + 0.1)));
    r += sr * 0.8; g += sr * 0.85; b += sr * 1.0;
    const bl = smooth(0.5, 0.9, -dx - dy * 0.3 + dz * 0.3) * smooth(-0.9, -0.1, dy) * (1 - sl);
    r += bl * 0.1; g += bl * 0.25; b += bl * 0.95; // electric blue zone
    const pr = smooth(0.45, 0.85, dx + dy * 0.5 - dz * 0.2) * smooth(-0.2, 0.5, dy) * (1 - sr);
    r += pr * 0.7; g += pr * 0.2; b += pr * 1.0; // purple zone
    const pk = smooth(0.6, 0.95, -dy * 0.7 + dz * 0.6) * smooth(-0.4, 0.4, dx);
    r += pk * 0.9; g += pk * 0.35; b += pk * 0.7; // pink zone
    return [r, g, b];
  };
  const SC = Number(process.env.SCALE ?? 560); const fov = 2.9; // camera distance
  const project = (p) => { const s = 1 / (fov - p[2] * 0.35); return [W / 2 + p[0] * s * SC, Hh * 0.5 - (p[1] + 0.25) * s * SC, p[2]]; };
  const rp = [], rn = [];
  for (let v = 0; v < nv; v++) { rp.push(rot(pos[v*3], pos[v*3+1], pos[v*3+2])); rn.push(rot(nor[v*3], nor[v*3+1], nor[v*3+2])); }
  const sp2 = rp.map(project);
  for (let t = 0; t < tris.length; t += 3) {
    const ia = tris[t], ib = tris[t+1], ic = tris[t+2];
    const A = sp2[ia], B = sp2[ib], C = sp2[ic];
    const minX = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), maxX = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const minY = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), maxY = Math.min(Hh - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    const den = (B[1]-C[1])*(A[0]-C[0]) + (C[0]-B[0])*(A[1]-C[1]);
    if (Math.abs(den) < 1e-9) continue;
    for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
      const l1 = ((B[1]-C[1])*(x-C[0]) + (C[0]-B[0])*(y-C[1])) / den;
      const l2 = ((C[1]-A[1])*(x-C[0]) + (A[0]-C[0])*(y-C[1])) / den;
      const l3 = 1 - l1 - l2;
      if (l1 < 0 || l2 < 0 || l3 < 0) continue;
      const z = l1*A[2] + l2*B[2] + l3*C[2];
      const zi = y * W + x;
      // camera looks down -Z so larger z is nearer
      if (zb[zi] !== 1e9 && z < -zb[zi]) continue;
      let nx_ = l1*rn[ia][0]+l2*rn[ib][0]+l3*rn[ic][0], ny_ = l1*rn[ia][1]+l2*rn[ib][1]+l3*rn[ic][1], nz_ = l1*rn[ia][2]+l2*rn[ib][2]+l3*rn[ic][2];
      const nl = len(nx_, ny_, nz_) || 1; nx_ /= nl; ny_ /= nl; nz_ /= nl;
      if (nz_ < 0) continue; // back-facing
      zb[zi] = -z;
      const dot = -nz_; // incident (0,0,-1)
      const rx = 0 - 2 * dot * nx_, ry = 0 - 2 * dot * ny_, rz = -1 - 2 * dot * nz_;
      const e = env(rx, ry, rz);
      const fres = Math.pow(1 - nz_, 3) * 0.35 + 0.85;
      buf[zi*3] = e[0] * fres; buf[zi*3+1] = e[1] * fres; buf[zi*3+2] = e[2] * fres;
    }
  }
  const out = Buffer.alloc(W * Hh * 3);
  for (let i = 0; i < W * Hh; i++) for (let c = 0; c < 3; c++) {
    const covered = zb[i] !== 1e9;
    const bg = [7, 8, 15][c];
    const v = covered ? Math.pow(Math.min(1, buf[i*3+c] / (1 + buf[i*3+c] * 0.25)), 1 / 2.0) * 255 : bg;
    out[i*3+c] = Math.max(0, Math.min(255, v));
  }
  await sharp(out, { raw: { width: W, height: Hh, channels: 3 } }).png().toFile(PREVIEW);
  console.log("preview ->", PREVIEW);
}
