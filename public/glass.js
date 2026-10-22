// Stained-glass drawing: medallions (lesson nodes), unit windows (banners), and rose windows (section progress).
export const GLASS = { gold: "#E8B339", ruby: "#E2445A", sapphire: "#4A86F5", emerald: "#2DBA80", amethyst: "#A06AF2", aqua: "#2DB8C2" };
const LEAD = "#07090E";

function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l * 100];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s * 100, l * 100];
}
const hsl = (h, s, l) => `hsl(${h.toFixed(0)} ${Math.max(0, Math.min(100, s)).toFixed(0)}% ${Math.max(0, Math.min(100, l)).toFixed(0)}%)`;
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

const litFill = (base, r) => { const [h, s, l] = hexToHsl(base); return hsl(h + (r() - 0.5) * 14, s - 6 + r() * 14, l - 12 + r() * 22); };
const darkFill = (base, r) => { const [h] = hexToHsl(base); return hsl(h + (r() - 0.5) * 20, 22 + r() * 14, 11 + r() * 7); };

const arc = (r1, r2, a1, a2) => {
  const p = (r, a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const big = a2 - a1 > Math.PI ? 1 : 0;
  return `M${p(r1, a1)}L${p(r2, a1)}A${r2} ${r2} 0 ${big} 1 ${p(r2, a2)}L${p(r1, a2)}A${r1} ${r1} 0 ${big} 0 ${p(r1, a1)}Z`;
};

/* A round medallion used as a lesson node. state: done | current | locked */
export function medallion(hex, state, iconPath, seed = 1) {
  const r = rng(seed), locked = state === "locked", done = state === "done";
  const base = locked ? "#3A4256" : hex;
  const fillFor = () => (locked ? darkFill("#5A6780", r) : litFill(base, r));
  let petals = "";
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a1 = -Math.PI / 2 + (i * 2 * Math.PI) / n, a2 = a1 + (2 * Math.PI) / n;
    petals += `<path d="${arc(26, 44, a1, a2)}" fill="${fillFor()}" stroke="${LEAD}" stroke-width="3"/>`;
  }
  const [h, s, l] = hexToHsl(base);
  const center = locked ? hsl(h, 12, 22) : hsl(h, s, Math.min(78, l + 14));
  const iconFill = locked ? "#69748C" : done ? "#1D1606" : "#FFFFFF";
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="49" fill="${LEAD}"/>
    ${done ? `<circle cx="50" cy="50" r="47.5" fill="none" stroke="#E6C36A" stroke-width="2"/>` : ""}
    <g transform="translate(50 50)">${petals}</g>
    <circle cx="50" cy="50" r="24" fill="${done ? "#E6C36A" : center}" stroke="${LEAD}" stroke-width="3"/>
    <path d="${iconPath}" transform="translate(38 38)" fill="${iconFill}"/>
  </svg>`;
}

/* A unit banner: shattered glass panes. Fraction p of panes are lit (unit progress). */
export function unitWindow(hex, key, p) {
  const r = rng(hash(key)), cols = 9, rows = 3, W = 400, H = 140, cw = W / cols, ch = H / rows;
  const pts = [];
  for (let y = 0; y <= rows; y++) for (let x = 0; x <= cols; x++) {
    const edgeX = x === 0 || x === cols, edgeY = y === 0 || y === rows;
    pts.push([x * cw + (edgeX ? 0 : (r() - 0.5) * cw * 0.7), y * ch + (edgeY ? 0 : (r() - 0.5) * ch * 0.7)]);
  }
  const P = (x, y) => pts[y * (cols + 1) + x];
  const tris = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const a = P(x, y), b = P(x + 1, y), c = P(x + 1, y + 1), d = P(x, y + 1);
    if ((x + y) % 2) tris.push([a, b, c], [a, c, d]); else tris.push([a, b, d], [b, c, d]);
  }
  const order = tris.map((t, i) => ({ i, k: r() }));
  order.sort((a, b) => a.k - b.k);
  const litSet = new Set(order.slice(0, Math.round(p * tris.length)).map((o) => o.i));
  const r2 = rng(hash(key + "c"));
  const shapes = tris.map((t, i) => `<path d="M${t.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L")}Z" fill="${litSet.has(i) ? litFill(hex, r2) : darkFill(hex, r2)}" stroke="${LEAD}" stroke-width="3" stroke-linejoin="round"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${shapes}</svg>`;
}

/* A rose window for a section. units: [{lessons:[bool...], done:bool}] */
export function roseWindow(hex, units, iconPath, newest) {
  const total = units.reduce((n, u) => n + u.lessons.length, 0) || 1;
  const r = rng(7);
  let out = `<circle r="128" fill="${LEAD}"/><circle r="125" fill="none" stroke="#E6C36A" stroke-opacity=".55" stroke-width="1.5"/>`;
  // tracery: little circles around the rim
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; out += `<circle cx="${(118 * Math.cos(a)).toFixed(1)}" cy="${(118 * Math.sin(a)).toFixed(1)}" r="5" fill="${darkFill(hex, r)}" stroke="${LEAD}" stroke-width="2"/>`; }
  let k = 0, ui = 0;
  const gap = 0.012;
  for (const u of units) {
    const a0 = -Math.PI / 2 + (k / total) * Math.PI * 2;
    const a1 = -Math.PI / 2 + ((k + u.lessons.length) / total) * Math.PI * 2;
    const uLit = u.done || u.lessons.every(Boolean);
    out += `<path class="pane" d="${arc(32, 58, a0 + gap, a1 - gap)}" fill="${uLit ? litFill(hex, r) : darkFill(hex, r)}" stroke="${LEAD}" stroke-width="2.5"/>`;
    u.lessons.forEach((done, li) => {
      const b0 = -Math.PI / 2 + ((k + li) / total) * Math.PI * 2, b1 = -Math.PI / 2 + ((k + li + 1) / total) * Math.PI * 2;
      const cls = `pane${newest === `${ui}-${li}` ? " lit" : ""}`;
      out += `<path class="${cls}" d="${arc(62, 86, b0, b1)}" fill="${done ? litFill(hex, r) : darkFill(hex, r)}" stroke="${LEAD}" stroke-width="2"/>`;
      out += `<path class="${cls}" d="${arc(86, 110, b0, b1)}" fill="${done ? litFill(hex, r) : darkFill(hex, r)}" stroke="${LEAD}" stroke-width="2"/>`;
    });
    // heavier lead between units
    out += `<line x1="${(32 * Math.cos(a0)).toFixed(2)}" y1="${(32 * Math.sin(a0)).toFixed(2)}" x2="${(111 * Math.cos(a0)).toFixed(2)}" y2="${(111 * Math.sin(a0)).toFixed(2)}" stroke="${LEAD}" stroke-width="4"/>`;
    k += u.lessons.length; ui++;
  }
  const [h, s, l] = hexToHsl(hex);
  out += `<circle r="30" fill="${hsl(h, s, l + 8)}" stroke="${LEAD}" stroke-width="3"/><circle r="30" fill="url(#rg)"/>`;
  out += `<path d="${iconPath}" transform="translate(-15 -15) scale(1.25)" fill="${hexToHsl(hex)[2] > 55 ? "#1D1606" : "#fff"}"/>`;
  return `<svg class="rose" viewBox="-130 -130 260 260" role="img" aria-label="Progress window"><defs><radialGradient id="rg"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>${out}</svg>`;
}
