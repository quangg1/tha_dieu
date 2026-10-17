// The upper sky, from the airliner to the Milky Way. Light-bearing things (planets, the moon, comets,
// the galaxy) are painted with gradients on offscreen canvases so they glow; man-made craft are crisp
// SVG plates with a thin ink line.

import type { Paint } from './land';

const INK = '#2a3346';
const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
const f = (n: number) => n.toFixed(1);

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number, dpr: number): [Paint, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return [c, ctx];
}

/* ================================================================ craft (SVG) */

export function airlinerSvg() {
  const W = 280;
  const H = 84;
  let b = '<defs><linearGradient id="fu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef0f2"/><stop offset="1" stop-color="#c9d0d8"/></linearGradient></defs>';
  // Far wing and engine, then the fuselage, then the near wing.
  b += `<path d="M150 40 L 176 40 L 214 18 L 200 18 Z" fill="#b9c1ca" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
  b += `<path d="M262 41 C 262 35, 252 31, 236 31 L 72 31 L 30 23 L 22 26 L 42 45 C 48 49, 58 51, 72 51 L 236 51 C 252 51, 262 47, 262 41 Z" fill="url(#fu)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
  b += `<path d="M30 24 L 14 2 L 32 2 L 66 31 Z" fill="#26476f" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
  b += `<path d="M24 6 L 30 6 L 46 22 L 40 22 Z" fill="#e2a72e"/>`;
  b += `<path d="M44 40 L 14 47 L 24 50 L 60 44 Z" fill="#dfe3e8" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
  b += `<path d="M70 44 L 250 44 C 256 44, 259 43, 261 42 L 260 45 C 256 47, 250 47, 244 47 L 70 47 Z" fill="#c0392b"/>`;
  b += `<g fill="#26476f">${Array.from({ length: 17 }, (_, i) => `<rect x="${84 + i * 9}" y="35.5" width="4.4" height="4.6" rx="1.6"/>`).join('')}</g>`;
  b += `<path d="M244 34.5 C 250 35, 255 37, 258 39 L 246 39 Z" fill="#26476f"/>`;
  b += `<path d="M120 47 L 152 47 L 112 78 L 94 78 Z" fill="#dfe3e8" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
  b += `<rect x="108" y="55" width="34" height="12" rx="6" fill="#26476f" stroke="${INK}" stroke-width="1.3"/>`;
  b += `<ellipse cx="141" cy="61" rx="2.4" ry="5" fill="#9aa4b0"/>`;
  return { svg: svg(W, H, b), w: W, h: H, tail: { x: 20 / W, y: 40 / H }, engine: { x: 108 / W, y: 61 / H } };
}

/** A hot-air balloon (khinh khí cầu) with striped gores and a wicker basket. */
export function hotAirSvg(palette: 0 | 1 | 2 = 0) {
  const W = 100;
  const H = 150;
  const [c1, c2] = [['#e5533d', '#f5c242'], ['#3a78c2', '#f4f4f4'], ['#3f8f6b', '#f08a3c']][palette];
  const env = 'M50 4 C 82 4, 96 30, 94 52 C 92 74, 70 92, 62 104 L 38 104 C 30 92, 8 74, 6 52 C 4 30, 18 4, 50 4 Z';
  let b = `<defs><clipPath id="env${palette}"><path d="${env}"/></clipPath></defs>`;
  b += `<path d="${env}" fill="${c1}"/>`;
  b += `<g clip-path="url(#env${palette})">`;
  const n = 7;
  const edge = (k: number) => {
    const xm = -4 + (108 * k) / n;
    const xb = 36 + (28 * k) / n;
    return { cx: 2 * xm - (50 + xb) / 2, cy: 2 * 54 - (4 + 104) / 2, xb };
  };
  for (let k = 0; k < n; k += 2) {
    const e0 = edge(k);
    const e1 = edge(k + 1);
    b += `<path d="M50 4 Q ${f(e0.cx)} ${f(e0.cy)}, ${f(e0.xb)} 104 L ${f(e1.xb)} 104 Q ${f(e1.cx)} ${f(e1.cy)}, 50 4 Z" fill="${c2}"/>`;
  }
  b += `<path d="M0 78 C 30 84, 70 84, 100 78 L 100 86 C 70 92, 30 92, 0 86 Z" fill="rgba(0,0,0,.12)"/>`;
  b += `<ellipse cx="30" cy="34" rx="14" ry="22" fill="rgba(255,255,255,.28)" transform="rotate(-18 30 34)"/>`;
  b += `<path d="M60 0 C 96 20, 100 60, 70 104 L 100 104 L 100 0 Z" fill="rgba(20,30,60,.14)"/>`;
  b += `</g>`;
  b += `<path d="M38 104 L 62 104 L 59 112 L 41 112 Z" fill="#7a5a43"/>`;
  b += `<path d="M41 112 L 43 126 M59 112 L 57 126 M50 112 L 50 126" stroke="#5a4636" stroke-width="1.2"/>`;
  b += `<rect x="40" y="125" width="20" height="16" rx="3" fill="#a8763f"/>`;
  b += `<path d="M40 130 h 20 M40 135 h 20" stroke="#8a5f30" stroke-width="1.4"/>`;
  b += `<rect x="38" y="123" width="24" height="4" rx="2" fill="#7a5a43"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/** A weather balloon (bóng thám không) drifting in the stratosphere with its parachute and sonde. */
export function balloonSvg() {
  const W = 90;
  const H = 210;
  let b = '<defs><radialGradient id="bl" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef2f6"/><stop offset="1" stop-color="#b9c6d4"/></radialGradient></defs>';
  b += `<path d="M45 6 C 78 6, 86 40, 74 64 C 66 80, 54 88, 48 92 L 42 92 C 36 88, 24 80, 16 64 C 4 40, 12 6, 45 6 Z" fill="url(#bl)" stroke="${INK}" stroke-width="1.4"/>`;
  b += `<path d="M28 24 C 32 16, 40 13, 46 13" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>`;
  b += `<path d="M42 92 L 48 92 L 47 100 L 43 100 Z" fill="#cfd6de" stroke="${INK}" stroke-width="1.2"/>`;
  b += `<path d="M45 100 L 45 138" stroke="${INK}" stroke-width="1"/>`;
  b += `<path d="M31 150 C 31 138, 59 138, 59 150 Z" fill="#e26a2c" stroke="${INK}" stroke-width="1.3"/>`;
  b += `<path d="M31 150 L 45 138 M59 150 L 45 138 M45 150 L 45 138" stroke="${INK}" stroke-width=".8"/>`;
  b += `<path d="M33 151 L 43 176 M57 151 L 47 176" stroke="${INK}" stroke-width=".9"/>`;
  b += `<rect x="38" y="176" width="14" height="16" rx="2" fill="#f4ead2" stroke="${INK}" stroke-width="1.3"/>`;
  b += `<rect x="40" y="180" width="10" height="4" fill="#c0392b"/>`;
  b += `<path d="M45 192 L 45 206" stroke="${INK}" stroke-width="1.2"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

function cells(x: number, y: number, w: number, h: number, cols: number, rows: number, base: string, line: string, sheen: string) {
  let g = `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${base}" stroke="${INK}" stroke-width="1.2"/>`;
  g += `<path d="M${f(x)} ${f(y + h)} L ${f(x + w * 0.55)} ${f(y)} L ${f(x + w * 0.8)} ${f(y)} L ${f(x + w * 0.25)} ${f(y + h)} Z" fill="${sheen}" opacity=".22"/>`;
  for (let i = 1; i < cols; i++) g += `<line x1="${f(x + (w * i) / cols)}" y1="${f(y)}" x2="${f(x + (w * i) / cols)}" y2="${f(y + h)}" stroke="${line}" stroke-width=".8"/>`;
  for (let j = 1; j < rows; j++) g += `<line x1="${f(x)}" y1="${f(y + (h * j) / rows)}" x2="${f(x + w)}" y2="${f(y + (h * j) / rows)}" stroke="${line}" stroke-width=".8"/>`;
  return g;
}

export function issSvg() {
  const W = 320;
  const H = 160;
  let b = '';
  // Truss.
  b += `<rect x="8" y="76" width="304" height="8" fill="#aeb4bc" stroke="${INK}" stroke-width="1.2"/>`;
  for (let x = 12; x < 308; x += 10) b += `<path d="M${x} 77 L ${x + 6} 83" stroke="#7d848d" stroke-width="1"/>`;
  // Eight golden solar wings.
  for (const x of [16, 62, 222, 268]) {
    b += cells(x, 12, 36, 58, 2, 8, '#b7782a', '#e0ad55', '#ffffff');
    b += cells(x, 90, 36, 58, 2, 8, '#b7782a', '#e0ad55', '#ffffff');
    b += `<rect x="${x + 16}" y="70" width="4" height="20" fill="#8d949c"/>`;
  }
  // Radiators.
  b += `<path d="M124 86 L 138 86 L 132 132 L 118 132 Z M182 86 L 196 86 L 202 132 L 188 132 Z" fill="#f2f3f5" stroke="${INK}" stroke-width="1.1"/>`;
  // Pressurised modules.
  b += `<rect x="116" y="62" width="88" height="22" rx="11" fill="#ecebe6" stroke="${INK}" stroke-width="1.4"/>`;
  b += `<rect x="148" y="34" width="24" height="94" rx="12" fill="#e3e1da" stroke="${INK}" stroke-width="1.4"/>`;
  for (const x of [134, 186]) b += `<line x1="${x}" y1="63" x2="${x}" y2="83" stroke="#9aa0a8" stroke-width="1.2"/>`;
  for (const y of [56, 104]) b += `<line x1="149" y1="${y}" x2="171" y2="${y}" stroke="#9aa0a8" stroke-width="1.2"/>`;
  b += `<rect x="204" y="68" width="18" height="10" rx="5" fill="#d8d6cf" stroke="${INK}" stroke-width="1.1"/>`;
  b += `<path d="M120 66 L 196 66" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

export function vinasatSvg() {
  const W = 320;
  const H = 150;
  let b = '<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1cb6b"/><stop offset=".5" stop-color="#d9a43a"/><stop offset="1" stop-color="#a8761e"/></linearGradient></defs>';
  // Solar wings on yokes.
  b += `<path d="M118 75 L 132 75 M188 75 L 202 75" stroke="#8d949c" stroke-width="3"/>`;
  b += cells(8, 58, 110, 34, 5, 2, '#22408e', '#5577cc', '#bcd0ff');
  b += cells(202, 58, 110, 34, 5, 2, '#22408e', '#5577cc', '#bcd0ff');
  // Gold-foil body with crinkles and a tiny flag.
  b += `<rect x="132" y="50" width="56" height="52" rx="2" fill="url(#gold)" stroke="${INK}" stroke-width="1.5"/>`;
  b += `<path d="M136 58 l 8 5 l 7 -4 l 9 7 l 8 -5 l 12 7 M136 92 l 10 -6 l 8 4 l 11 -8 l 8 6 l 9 -4" fill="none" stroke="#9c6c18" stroke-width="1.1" opacity=".8"/>`;
  b += `<rect x="168" y="84" width="14" height="9" fill="#da251d" stroke="${INK}" stroke-width=".8"/>`;
  b += `<path d="M175 85.6 l 1 2.9 h 3 l -2.4 1.8 l .9 2.9 l -2.5 -1.8 l -2.5 1.8 l .9 -2.9 l -2.4 -1.8 h 3 Z" fill="#ffdd00"/>`;
  // Two dish antennas.
  b += `<path d="M134 52 C 116 44, 112 22, 124 12 C 134 24, 146 38, 150 50 Z" fill="#f4f2ec" stroke="${INK}" stroke-width="1.4"/>`;
  b += `<path d="M126 18 C 132 28, 140 38, 146 46" fill="none" stroke="#c9ccd2" stroke-width="2"/>`;
  b += `<path d="M138 40 L 128 22" stroke="${INK}" stroke-width="1.2"/><circle cx="128" cy="21" r="2.4" fill="#c0392b" stroke="${INK}" stroke-width="1"/>`;
  b += `<path d="M186 100 C 204 108, 210 128, 200 140 C 190 128, 178 114, 172 102 Z" fill="#f4f2ec" stroke="${INK}" stroke-width="1.4"/>`;
  b += `<rect x="154" y="40" width="12" height="10" fill="#e6e8ec" stroke="${INK}" stroke-width="1.1"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/** A rocket on its way to the moon: white body, red nose and fins, a porthole. Flame is drawn live. */
export function rocketSvg() {
  const W = 70;
  const H = 150;
  let b = '';
  b += `<path d="M35 4 C 52 20, 56 52, 54 104 L 16 104 C 14 52, 18 20, 35 4 Z" fill="#f4f4f6"/>`;
  b += `<path d="M35 4 C 52 20, 56 52, 54 104 L 38 104 C 40 60, 40 24, 35 4 Z" fill="#d9dde3"/>`;
  b += `<path d="M35 4 C 43 11, 48 20, 50 30 L 20 30 C 22 20, 27 11, 35 4 Z" fill="#e5533d"/>`;
  b += `<circle cx="35" cy="54" r="9" fill="#3a78c2"/><circle cx="35" cy="54" r="9" fill="none" stroke="#c9cfd8" stroke-width="3"/>`;
  b += `<circle cx="32" cy="51" r="2.6" fill="rgba(255,255,255,.7)"/>`;
  b += `<path d="M16 80 L 2 112 L 18 104 Z M54 80 L 68 112 L 52 104 Z" fill="#e5533d"/>`;
  b += `<rect x="22" y="104" width="26" height="10" rx="2" fill="#5a6372"/>`;
  b += `<path d="M30 86 L 30 104 M40 86 L 40 104" stroke="#c9cfd8" stroke-width="2"/>`;
  return { svg: svg(W, H, b), w: W, h: H, nozzle: { x: 35 / W, y: 114 / H } };
}

/** A magpie of the Ô Thước bridge, wings spread: black with white shoulders and belly, a long blue-black tail. */
export function magpieSvg(frame: 0 | 1) {
  const W = 90;
  const H = 46;
  const up = frame === 0;
  let b = '';
  b += `<path d="M30 26 L 2 ${up ? 22 : 30} L 4 ${up ? 26 : 34} L 30 30 Z" fill="#1b2347"/>`;
  b += up
    ? `<path d="M40 22 C 34 8, 24 2, 12 2 C 22 8, 30 16, 34 26 Z M50 22 C 58 8, 70 2, 82 4 C 72 10, 62 18, 56 26 Z" fill="#0d0c14"/><path d="M38 20 C 34 12, 28 8, 22 7 C 28 12, 32 16, 34 22 Z" fill="#f4ead2"/>`
    : `<path d="M40 28 C 32 38, 22 44, 10 44 C 20 38, 28 32, 34 26 Z M52 28 C 60 38, 72 44, 84 42 C 74 36, 64 30, 56 26 Z" fill="#0d0c14"/><path d="M38 30 C 34 36, 28 40, 22 41 C 28 36, 32 32, 34 28 Z" fill="#f4ead2"/>`;
  b += `<ellipse cx="46" cy="27" rx="16" ry="6.5" fill="#0d0c14"/>`;
  b += `<path d="M36 29 C 42 33, 52 33, 56 28" fill="#f4ead2"/>`;
  b += `<circle cx="62" cy="23" r="5" fill="#0d0c14"/><path d="M66 22 L 72 23 L 66 25 Z" fill="#0d0c14"/><circle cx="63.5" cy="22" r="1" fill="#f4ead2"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/* ================================================================ light-bearing bodies (canvas) */

function glowDisc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) {
  const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.6);
  g.addColorStop(0, color.replace('A', String(alpha)));
  g.addColorStop(1, color.replace('A', '0'));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
  ctx.fill();
}

/** Shades a lit sphere: light from the upper left, night side to the lower right. */
function terminator(ctx: CanvasRenderingContext2D, c: number, R: number) {
  const g = ctx.createRadialGradient(c - R * 0.45, c - R * 0.45, R * 0.2, c - R * 0.1, c - R * 0.1, R * 1.45);
  g.addColorStop(0, 'rgba(255,255,255,.18)');
  g.addColorStop(0.45, 'rgba(0,0,0,0)');
  g.addColorStop(0.8, 'rgba(6,6,20,.55)');
  g.addColorStop(1, 'rgba(4,4,14,.92)');
  ctx.fillStyle = g;
  ctx.fillRect(c - R, c - R, R * 2, R * 2);
}

export function paintPlanet(kind: 'mars' | 'jupiter' | 'neptune' | 'venus' | 'saturn', size: number, dpr: number): Paint {
  const S = size * (kind === 'saturn' ? 1.9 : 1.5);
  const [cv, ctx] = canvas(S, S, dpr);
  const c = S / 2;
  const R = size / 2;
  const r = rng(kind.length * 7);
  const halo = kind === 'mars' ? 'rgba(255,140,90,A)' : kind === 'jupiter' || kind === 'saturn' ? 'rgba(255,220,170,A)' : kind === 'venus' ? 'rgba(255,236,190,A)' : 'rgba(120,170,255,A)';
  glowDisc(ctx, c, c, R, halo, 0.22);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.clip();
  if (kind === 'venus') {
    const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.1, c, c, R);
    g.addColorStop(0, '#fff6dc');
    g.addColorStop(1, '#e6c27a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = 'rgba(214,170,96,.35)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(c + (r() - 0.5) * R, c + (r() - 0.5) * R * 1.6, R * (0.5 + r() * 0.4), R * 0.07, -0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'saturn') {
    const bands = ['#f3e2b8', '#e2c58c', '#f6e9c8', '#d9b77c', '#efdcae', '#d4ad70'];
    bands.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(c - R, c - R + (i / bands.length) * R * 2, R * 2, (R * 2) / bands.length + 1);
    });
  } else if (kind === 'mars') {
    const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.1, c, c, R);
    g.addColorStop(0, '#f0915e');
    g.addColorStop(1, '#b4482a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = 'rgba(120,40,22,.45)';
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.ellipse(c + (r() - 0.5) * R * 1.6, c + (r() - 0.3) * R * 1.2, R * (0.12 + r() * 0.25), R * (0.05 + r() * 0.1), r() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,248,240,.9)';
    ctx.beginPath();
    ctx.ellipse(c - R * 0.1, c - R * 0.9, R * 0.42, R * 0.16, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'jupiter') {
    const bands = ['#e9d6b6', '#c9965f', '#f3e6cc', '#b5784a', '#ead2a8', '#c48a58', '#f1e1c2', '#b98058', '#e6cfa6'];
    const n = bands.length;
    for (let i = 0; i < n; i++) {
      const y0 = c - R + (i / n) * R * 2;
      ctx.fillStyle = bands[i];
      ctx.beginPath();
      ctx.moveTo(c - R, y0);
      for (let x = -R; x <= R; x += R / 8) ctx.lineTo(c + x, y0 + Math.sin(x * 0.08 + i) * R * 0.025);
      ctx.lineTo(c + R, y0 + (R * 2) / n + 2);
      ctx.lineTo(c - R, y0 + (R * 2) / n + 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    for (let i = 0; i < 14; i++) ctx.fillRect(c - R + r() * R * 2, c - R + r() * R * 2, R * (0.1 + r() * 0.25), R * 0.025);
    ctx.fillStyle = '#c4573a';
    ctx.beginPath();
    ctx.ellipse(c + R * 0.32, c + R * 0.28, R * 0.2, R * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,230,210,.6)';
    ctx.lineWidth = Math.max(1, R * 0.025);
    ctx.stroke();
  } else {
    const g = ctx.createLinearGradient(0, c - R, 0, c + R);
    g.addColorStop(0, '#5b8fe8');
    g.addColorStop(0.5, '#3a6fd2');
    g.addColorStop(1, '#2a56b4');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = 'rgba(30,60,150,.35)';
    for (let i = 0; i < 5; i++) ctx.fillRect(c - R, c - R * 0.7 + i * R * 0.34, R * 2, R * 0.08);
    ctx.fillStyle = '#1d3c8c';
    ctx.beginPath();
    ctx.ellipse(c - R * 0.2, c + R * 0.12, R * 0.2, R * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    for (const [x, y, w] of [[0.05, 0.02, 0.22], [-0.5, -0.35, 0.18], [0.3, 0.45, 0.16]]) {
      ctx.beginPath();
      ctx.ellipse(c + x * R, c + y * R, w * R, R * 0.025, -0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  terminator(ctx, c, R);
  ctx.restore();
  if (kind === 'saturn') {
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-0.38);
    for (const [rr, w, col] of [[1.62, 0.16, 'rgba(226,200,150,.85)'], [1.38, 0.12, 'rgba(240,222,180,.9)'], [1.2, 0.05, 'rgba(200,170,120,.7)']] as const) {
      ctx.strokeStyle = col;
      ctx.lineWidth = R * w;
      ctx.beginPath();
      ctx.ellipse(0, 0, R * rr, R * rr * 0.28, 0, -0.02, Math.PI + 0.02);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.strokeStyle = halo.replace('A', '.5');
  ctx.lineWidth = Math.max(1, R * 0.02);
  ctx.beginPath();
  ctx.arc(c, c, R, Math.PI * 0.95, Math.PI * 1.75);
  ctx.stroke();
  return cv;
}

/** The full moon of Trung thu: a warm, glowing disc whose shadows are the banyan, chú Cuội and the jade rabbit. */
export function paintMoon(size: number, dpr: number): { img: Paint; arm: { x: number; y: number }; shadow: string } {
  const S = size;
  const [cv, ctx] = canvas(S, S, dpr);
  const c = S / 2;
  const R = S / 2;
  const u = (v: number) => v * S;
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.clip();
  // Warm full moon, lit from the upper left.
  const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.35, R * 0.05, c, c, R * 1.02);
  g.addColorStop(0, '#fffdf2');
  g.addColorStop(0.45, '#fdf0c4');
  g.addColorStop(0.8, '#f5dc93');
  g.addColorStop(1, '#e9c26a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // Soft maria: overlapping blobs that fade at the edges, like the "Cuội under the banyan" shapes seen from Earth.
  const blob = (x: number, y: number, rx: number, ry: number, a: number) => {
    const bg = ctx.createRadialGradient(u(x), u(y), 0, u(x), u(y), u(Math.max(rx, ry)));
    bg.addColorStop(0, `rgba(218,182,104,${a})`);
    bg.addColorStop(0.7, `rgba(218,182,104,${a * 0.55})`);
    bg.addColorStop(1, 'rgba(218,182,104,0)');
    ctx.fillStyle = bg;
    ctx.save();
    ctx.translate(u(x), u(y));
    ctx.scale(1, ry / rx);
    ctx.translate(-u(x), -u(y));
    ctx.beginPath();
    ctx.arc(u(x), u(y), u(rx), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  for (const [x, y, rx, ry, a] of [
    [0.36, 0.3, 0.13, 0.1, 0.34], [0.5, 0.24, 0.1, 0.07, 0.28], [0.64, 0.34, 0.12, 0.1, 0.3],
    [0.3, 0.46, 0.09, 0.08, 0.26], [0.72, 0.52, 0.08, 0.1, 0.24], [0.46, 0.4, 0.07, 0.06, 0.2], [0.24, 0.62, 0.06, 0.05, 0.18],
  ] as const) blob(x, y, rx, ry, a);
  // Craters: a dark bowl with a light rim on the side facing the light.
  const r = rng(23);
  for (let i = 0; i < 16; i++) {
    const x = 0.14 + r() * 0.72;
    const y = 0.12 + r() * 0.76;
    if (Math.hypot(x - 0.5, y - 0.5) > 0.42) continue;
    const rad = 0.012 + r() * (i < 4 ? 0.04 : 0.02);
    ctx.fillStyle = 'rgba(205,165,85,.32)';
    ctx.beginPath();
    ctx.arc(u(x), u(y), u(rad), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,252,236,.75)';
    ctx.lineWidth = Math.max(1, u(rad * 0.28));
    ctx.beginPath();
    ctx.arc(u(x), u(y), u(rad), Math.PI * 0.15, Math.PI * 0.95);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(190,148,68,.4)';
    ctx.beginPath();
    ctx.arc(u(x), u(y), u(rad), Math.PI * 1.15, Math.PI * 1.95);
    ctx.stroke();
  }
  // A soft pale mound low on the disc where the banyan grows and chú Cuội sits.
  const m = ctx.createRadialGradient(u(0.48), u(0.86), 0, u(0.48), u(0.86), u(0.34));
  m.addColorStop(0, 'rgba(255,250,228,.85)');
  m.addColorStop(1, 'rgba(255,250,228,0)');
  ctx.fillStyle = m;
  ctx.fillRect(0, u(0.5), S, u(0.5));
  // Limb darkening at the lower right, then a thin bright rim.
  const limb = ctx.createRadialGradient(c - R * 0.2, c - R * 0.2, R * 0.7, c, c, R);
  limb.addColorStop(0, 'rgba(200,150,60,0)');
  limb.addColorStop(1, 'rgba(200,150,60,.28)');
  ctx.fillStyle = limb;
  ctx.fillRect(0, 0, S, S);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,248,220,.9)';
  ctx.lineWidth = Math.max(1.5, S * 0.006);
  ctx.beginPath();
  ctx.arc(c, c, R - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();
  // The folk of the moon (chú Cuội, chị Hằng) are painted sprites drawn by the scene.
  return { img: cv, arm: { x: 0.655, y: 0.755 }, shadow: 'rgba(176,128,46,.62)' };
}

/** A comet: a glowing head with a straight blue ion tail and a curved golden dust tail. Head at the right. */
export function paintComet(w: number, dpr: number): Paint {
  const h = w * 0.36;
  const [cv, ctx] = canvas(w, h, dpr);
  const hx = w * 0.88;
  const hy = h * 0.3;
  ctx.globalCompositeOperation = 'lighter';
  const tail = (tx: number, ty: number, cx: number, cy: number, width: number, col: string) => {
    const g = ctx.createLinearGradient(hx, hy, tx, ty);
    g.addColorStop(0, col.replace('A', '.85'));
    g.addColorStop(1, col.replace('A', '0'));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(hx, hy - width * 0.15);
    ctx.quadraticCurveTo(cx, cy - width, tx, ty - width * 0.4);
    ctx.lineTo(tx, ty + width * 0.4);
    ctx.quadraticCurveTo(cx, cy + width, hx, hy + width * 0.15);
    ctx.closePath();
    ctx.fill();
  };
  tail(0, h * 0.82, w * 0.45, h * 0.62, h * 0.16, 'rgba(255,214,140,A)');
  tail(w * 0.02, h * 0.55, w * 0.45, h * 0.44, h * 0.07, 'rgba(140,200,255,A)');
  const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, h * 0.22);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(210,240,255,.9)');
  g.addColorStop(1, 'rgba(140,200,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(hx, hy, h * 0.22, 0, Math.PI * 2);
  ctx.fill();
  return cv;
}

/** The Milky Way: a luminous band of star clouds and dark dust lanes, rising gently to the right. */
export function paintGalaxy(W: number, h: number, dpr: number): Paint {
  const [cv, ctx] = canvas(W, h, dpr);
  const r = rng(41);
  const yAt = (x: number) => h * 0.62 - (x / W) * h * 0.24 + Math.sin(x * 0.006) * h * 0.05;
  ctx.globalCompositeOperation = 'lighter';
  const cols = ['rgba(120,90,200,A)', 'rgba(80,110,220,A)', 'rgba(210,110,170,A)', 'rgba(250,215,150,A)', 'rgba(120,170,240,A)'];
  for (let i = 0; i < 90; i++) {
    const x = r() * W;
    const y = yAt(x) + (r() - 0.5) * h * 0.28;
    const rad = h * (0.08 + r() * 0.16);
    const col = cols[Math.floor(r() * cols.length)];
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, col.replace('A', String(0.06 + r() * 0.06)));
    g.addColorStop(1, col.replace('A', '0'));
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // Bright core along the middle of the band.
  for (let x = 0; x < W; x += h * 0.12) {
    const y = yAt(x);
    const rad = h * 0.14;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, 'rgba(255,236,200,.07)');
    g.addColorStop(1, 'rgba(255,236,200,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(8,6,20,.32)';
  for (let i = 0; i < 26; i++) {
    const x = r() * W;
    ctx.beginPath();
    ctx.ellipse(x, yAt(x) + (r() - 0.5) * h * 0.06, h * (0.05 + r() * 0.12), h * (0.012 + r() * 0.02), -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < Math.min(2600, W * 2.2); i++) {
    const x = r() * W;
    const spread = Math.pow(r(), 1.8) * (r() < 0.5 ? -1 : 1);
    const y = yAt(x) + spread * h * 0.3;
    const big = r() < 0.04;
    ctx.fillStyle = `rgba(255,${230 + Math.floor(r() * 25)},${200 + Math.floor(r() * 55)},${0.35 + r() * 0.6})`;
    ctx.fillRect(x, y, big ? 2.2 : 1.2, big ? 2.2 : 1.2);
  }
  return cv;
}

/* ================================================================ beyond the Milky Way */

function gauss(r: () => number) {
  return (r() + r() + r() + r() - 2) / 2;
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
  g.addColorStop(0, `rgba(${col},1)`);
  g.addColorStop(0.25, `rgba(${col},.35)`);
  g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - size * 4, y - size * 4, size * 8, size * 8);
  ctx.fillStyle = `rgba(${col},.55)`;
  ctx.fillRect(x - size * 7, y - 0.5, size * 14, 1);
  ctx.fillRect(x - 0.5, y - size * 7, 1, size * 14);
}

/** Fades a painting out towards its top and bottom edges so it melts into the sky. */
function fadeEdges(ctx: CanvasRenderingContext2D, w: number, h: number, frac = 0.25) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const H = ctx.canvas.height;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(frac, 'rgba(0,0,0,1)');
  g.addColorStop(1 - frac, 'rgba(0,0,0,1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, H);
  ctx.restore();
  void w;
  void h;
}

/** A tall backdrop of colourful nebulae and layered stars for deep space, tiled as the camera climbs. */
export function paintNebulaField(W: number, h: number, dpr: number, seed: number, hues: string[]): Paint {
  const [cv, ctx] = canvas(W, h, dpr);
  const r = rng(seed);
  // Every blob is drawn three times, a tile apart, so stacked tiles meet without a seam.
  const wrap = (fn: (dy: number) => void) => [-h, 0, h].forEach(fn);
  ctx.globalCompositeOperation = 'lighter';
  // Big soft clouds, then smaller bright wisps.
  for (let i = 0; i < 70; i++) {
    const x = r() * W;
    const y = r() * h;
    const rad = (0.2 + r() * 0.35) * Math.min(Math.max(W, 420), 760);
    const col = hues[Math.floor(r() * hues.length)];
    const al = 0.025 + r() * 0.035;
    wrap((dy) => {
      const g = ctx.createRadialGradient(x, y + dy, 0, x, y + dy, rad);
      g.addColorStop(0, `rgba(${col},${al})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - rad, y + dy - rad, rad * 2, rad * 2);
    });
  }
  for (let i = 0; i < 140; i++) {
    const x = r() * W;
    const y = r() * h;
    const rad = 20 + r() * 90;
    const col = hues[Math.floor(r() * hues.length)];
    const rot = r() * Math.PI;
    const sq = 0.3 + r() * 0.45;
    const al = 0.04 + r() * 0.06;
    wrap((dy) => {
      ctx.save();
      ctx.translate(x, y + dy);
      ctx.rotate(rot);
      ctx.scale(1, sq);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      g.addColorStop(0, `rgba(${col},${al})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
      ctx.restore();
    });
  }
  // Dark dust that gives the clouds shape.
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 40; i++) {
    const x = r() * W;
    const y = r() * h;
    const rad = 30 + r() * 120;
    const rot = r() * Math.PI;
    const sq = 0.45 + r() * 0.4;
    wrap((dy) => {
      ctx.save();
      ctx.translate(x, y + dy);
      ctx.rotate(rot);
      ctx.scale(1, sq);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      g.addColorStop(0, 'rgba(4,2,12,.22)');
      g.addColorStop(1, 'rgba(4,2,12,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
      ctx.restore();
    });
  }
  ctx.globalCompositeOperation = 'lighter';
  const n = Math.round((W * h) / 480);
  for (let i = 0; i < n; i++) {
    const b = Math.pow(r(), 6);
    ctx.fillStyle = `rgba(${r() < 0.2 ? '255,220,190' : r() < 0.4 ? '190,215,255' : '255,255,255'},${0.25 + r() * 0.6})`;
    const sz = 0.6 + b * 1.6;
    ctx.fillRect(r() * W, r() * h, sz, sz);
  }
  for (let i = 0; i < Math.round(n / 300); i++) star(ctx, r() * W, r() * h, 1 + r() * 1.6, r() < 0.5 ? '255,240,220' : '200,220,255');
  return cv;
}

/** A spiral galaxy built from thousands of stars on logarithmic arms, with dust lanes and a blazing core. */
function spiral(ctx: CanvasRenderingContext2D, R: number, r: () => number, opt: { arms: number; twist: number; stars: number; armCol: string; coreCol: string; pink: boolean }) {
  ctx.globalCompositeOperation = 'lighter';
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.1);
  halo.addColorStop(0, `rgba(${opt.coreCol},.5)`);
  halo.addColorStop(0.3, `rgba(${opt.armCol},.14)`);
  halo.addColorStop(1, `rgba(${opt.armCol},0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.1, 0, Math.PI * 2);
  ctx.fill();
  const disc = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  disc.addColorStop(0, `rgba(${opt.coreCol},.35)`);
  disc.addColorStop(0.35, `rgba(${opt.armCol},.12)`);
  disc.addColorStop(0.8, `rgba(${opt.armCol},.04)`);
  disc.addColorStop(1, `rgba(${opt.armCol},0)`);
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < opt.stars; i++) {
    const t = Math.min(1, -Math.log(1 - r() * 0.93) / 2.2);
    const arm = Math.floor(r() * opt.arms);
    const inArm = r() < 0.6;
    const a = (arm * Math.PI * 2) / opt.arms + opt.twist * Math.log(1 + t * 9) + (inArm ? gauss(r) * (0.5 - t * 0.2) : r() * Math.PI * 2);
    const rad = R * t + gauss(r) * R * 0.03;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    const inner = t < 0.22;
    const col = inner ? opt.coreCol : opt.pink && r() < 0.05 ? '255,140,200' : opt.armCol;
    ctx.fillStyle = `rgba(${col},${(inArm ? 0.2 : 0.08) + r() * 0.4})`;
    const sz = r() < 0.015 ? 2.2 : 0.8 + r() * 0.8;
    ctx.fillRect(x, y, sz, sz);
  }
  // Pink star-forming knots strung along the arms.
  if (opt.pink) {
    for (let i = 0; i < 40; i++) {
      const t = 0.3 + r() * 0.6;
      const arm = Math.floor(r() * opt.arms);
      const a = (arm * Math.PI * 2) / opt.arms + opt.twist * Math.log(1 + t * 9) + gauss(r) * 0.12;
      const x = Math.cos(a) * R * t;
      const y = Math.sin(a) * R * t;
      const k = R * (0.012 + r() * 0.02);
      const g = ctx.createRadialGradient(x, y, 0, x, y, k * 3);
      g.addColorStop(0, 'rgba(255,150,200,.45)');
      g.addColorStop(1, 'rgba(255,120,190,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - k * 3, y - k * 3, k * 6, k * 6);
    }
  }
  // Dust lanes along the inner edge of each arm.
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(10,6,20,.4)';
  ctx.lineCap = 'round';
  for (let arm = 0; arm < opt.arms; arm++) {
    ctx.lineWidth = R * 0.035;
    ctx.beginPath();
    for (let t = 0.12; t < 0.9; t += 0.01) {
      const a = (arm * Math.PI * 2) / opt.arms + opt.twist * Math.log(1 + t * 9) - 0.18;
      const x = Math.cos(a) * R * t;
      const y = Math.sin(a) * R * t;
      if (t === 0.12) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'lighter';
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.22);
  core.addColorStop(0, 'rgba(255,252,240,1)');
  core.addColorStop(0.3, `rgba(${opt.coreCol},.8)`);
  core.addColorStop(1, `rgba(${opt.coreCol},0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

/** Andromeda, big enough to fill the sky: tilted spiral, dust lanes, two little companion galaxies. */
export function paintAndromeda(size: number, dpr: number): Paint {
  const w = size;
  const h = size * 0.7;
  const [cv, ctx] = canvas(w, h, dpr);
  const r = rng(77);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.42);
  ctx.scale(1, 0.5);
  spiral(ctx, w * 0.47, r, { arms: 2, twist: 2.8, stars: 20000, armCol: '170,200,255', coreCol: '255,226,180', pink: true });
  ctx.restore();
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, s] of [[0.68, 0.3, 0.05], [0.3, 0.74, 0.07]]) {
    const g = ctx.createRadialGradient(w * x, h * y, 0, w * x, h * y, w * s);
    g.addColorStop(0, 'rgba(255,240,220,.9)');
    g.addColorStop(1, 'rgba(255,220,180,0)');
    ctx.fillStyle = g;
    ctx.fillRect(w * (x - s), h * y - w * s, w * s * 2, w * s * 2);
  }
  return cv;
}

/** The Virgo cluster: the giant elliptical M87 with its blue jet, a few grand spirals and a swarm of small galaxies. */
export function paintCluster(W: number, h: number, dpr: number): Paint {
  const [cv, ctx] = canvas(W, h, dpr);
  const r = rng(91);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 110; i++) {
    const x = r() * W;
    const y = h * 0.5 + gauss(r) * h * 0.5;
    const s = 3 + Math.pow(r(), 3) * 16;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r() * Math.PI);
    ctx.scale(1, 0.3 + r() * 0.6);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
    g.addColorStop(0, r() < 0.5 ? 'rgba(255,236,205,.9)' : 'rgba(210,225,255,.9)');
    g.addColorStop(1, 'rgba(150,170,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-s, -s, s * 2, s * 2);
    ctx.restore();
  }
  const spirals: [number, number, number, number, string][] = [[0.18, 0.28, 0.13, 0.5, '190,215,255'], [0.84, 0.66, 0.11, 2.1, '255,210,190'], [0.22, 0.8, 0.08, 1.2, '200,190,255']];
  for (const [x, y, s, rot, col] of spirals) {
    ctx.save();
    ctx.translate(W * x, h * y);
    ctx.rotate(rot);
    ctx.scale(1, 0.55);
    spiral(ctx, Math.min(W, 520) * s, r, { arms: 3, twist: 2, stars: 2600, armCol: col, coreCol: '255,236,200', pink: true });
    ctx.restore();
  }
  // M87: a giant glowing ball of old stars with a jet.
  const cx = W * 0.38;
  const cy = h * 0.55;
  const R = Math.min(W, 520) * 0.2;
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
  g.addColorStop(0, 'rgba(255,248,230,1)');
  g.addColorStop(0.12, 'rgba(255,226,180,.75)');
  g.addColorStop(0.45, 'rgba(255,190,140,.18)');
  g.addColorStop(1, 'rgba(255,170,120,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.6);
  for (const [lw, al] of [[14, 0.08], [6, 0.2], [2, 0.8]] as const) {
    const jg = ctx.createLinearGradient(0, 0, R * 1.8, 0);
    jg.addColorStop(0, `rgba(150,200,255,${al})`);
    jg.addColorStop(1, 'rgba(150,200,255,0)');
    ctx.strokeStyle = jg;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R * 1.8, 0);
    ctx.stroke();
  }
  for (let k = 1; k <= 4; k++) {
    ctx.fillStyle = 'rgba(210,235,255,.8)';
    ctx.beginPath();
    ctx.arc(R * 0.35 * k, 0, 2.4 - k * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  fadeEdges(ctx, W, h);
  return cv;
}

/** The cosmic web: filaments made of countless faint galaxies, meeting in bright knots. */
export function paintWeb(W: number, h: number, dpr: number): Paint {
  const [cv, ctx] = canvas(W, h, dpr);
  const r = rng(123);
  const nodes = Array.from({ length: Math.max(10, Math.round(W / 55)) }, () => ({ x: r() * W, y: r() * h, m: 0.5 + r() }));
  ctx.globalCompositeOperation = 'lighter';
  const done = new Set<string>();
  for (const [ai, a] of nodes.entries()) {
    const near = nodes
      .map((b, bi) => ({ b, bi, d: Math.hypot(b.x - a.x, b.y - a.y) }))
      .filter((o) => o.bi !== ai)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3);
    for (const { b, bi } of near) {
      const key = ai < bi ? `${ai}-${bi}` : `${bi}-${ai}`;
      if (done.has(key)) continue;
      done.add(key);
      const mx = (a.x + b.x) / 2 + gauss(r) * 60;
      const my = (a.y + b.y) / 2 + gauss(r) * 60;
      for (const [lw, al] of [[46, 0.035], [22, 0.05], [8, 0.07]] as const) {
        ctx.strokeStyle = `rgba(150,140,255,${al})`;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.stroke();
      }
      const count = 700;
      for (let i = 0; i < count; i++) {
        const t = r();
        const m = 1 - t;
        const sp = r() < 0.6 ? 6 : 18;
        const x = m * m * a.x + 2 * m * t * mx + t * t * b.x + gauss(r) * sp;
        const y = m * m * a.y + 2 * m * t * my + t * t * b.y + gauss(r) * sp;
        const hue = t < 0.5 ? '190,170,255' : '140,210,255';
        ctx.fillStyle = `rgba(${hue},${0.1 + r() * 0.3})`;
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }
  }
  for (const n of nodes) {
    const s = 40 * n.m;
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, s);
    g.addColorStop(0, 'rgba(255,240,220,.85)');
    g.addColorStop(0.25, 'rgba(255,190,240,.3)');
    g.addColorStop(1, 'rgba(160,120,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(255,245,230,.7)';
      ctx.fillRect(n.x + gauss(r) * s * 0.3, n.y + gauss(r) * s * 0.3, 1.4, 1.4);
    }
  }
  fadeEdges(ctx, W, h);
  return cv;
}

/** The first light: a fabric of warm and cool patches, like the sky maps of the cosmic background. */
export function paintFirstLight(W: number, h: number, dpr: number): Paint {
  const [cv, ctx] = canvas(W, h, dpr);
  const r = rng(321);
  ctx.globalCompositeOperation = 'lighter';
  for (const [n, smin, smax, al] of [[50, 60, 140, 0.07], [220, 18, 50, 0.09], [600, 5, 16, 0.12]] as const) {
    for (let i = 0; i < n; i++) {
      const x = r() * W;
      const y = r() * h;
      const s = smin + r() * (smax - smin);
      const v = r();
      const col = v < 0.35 ? '255,120,60' : v < 0.6 ? '255,200,90' : v < 0.8 ? '110,150,255' : '255,90,120';
      const g = ctx.createRadialGradient(x, y, 0, x, y, s);
      g.addColorStop(0, `rgba(${col},${al})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
    }
  }
  fadeEdges(ctx, W, h);
  return cv;
}
