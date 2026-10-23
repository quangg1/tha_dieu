import { mascotSvg } from './mascot';
// The countryside at the foot of the sky, in a flat, rounded, modern style: a bamboo hedge, areca palms,
// a banyan, today's village houses, and the kite flyer on the dyke.

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

/* ---------------------------------------------------------------- bamboo */

/** A clump of bamboo: arching culms with drooping, feathery leaf sprays in three greens. */
export function bambooSvg(seed = 1, W = 200, H = 190) {
  const r = rng(seed);
  const culms: { x0: number; cx: number; cy: number; x1: number; y1: number }[] = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const x0 = W * (0.42 + (u - 0.5) * 0.14);
    const x1 = W * (0.06 + u * 0.88) + (r() - 0.5) * 16;
    const y1 = H * (0.08 + Math.abs(u - 0.5) * 0.5) + r() * 14;
    culms.push({ x0, cx: x0 + (x1 - x0) * 0.15, cy: y1 + (H - y1) * 0.25, x1, y1 });
  }
  const at = (c: (typeof culms)[0], t: number) => {
    const m = 1 - t;
    return { x: m * m * c.x0 + 2 * m * t * c.cx + t * t * c.x1, y: m * m * H + 2 * m * t * c.cy + t * t * c.y1 };
  };
  const leaf = (x: number, y: number, a: number, len: number, wd: number, fill: string) => {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const tx = x + cos * len;
    const ty = y + sin * len;
    const mx = x + cos * len * 0.45;
    const my = y + sin * len * 0.45;
    return `<path d="M${f(x)} ${f(y)} Q ${f(mx - sin * wd)} ${f(my + cos * wd)}, ${f(tx)} ${f(ty)} Q ${f(mx + sin * wd)} ${f(my - cos * wd)}, ${f(x)} ${f(y)} Z" fill="${fill}"/>`;
  };
  let back = '';
  let stems = '';
  let front = '';
  for (const c of culms) {
    stems += `<path d="M${f(c.x0)} ${H} Q ${f(c.cx)} ${f(c.cy)}, ${f(c.x1)} ${f(c.y1)}" fill="none" stroke="#6f9a3e" stroke-width="2.4" stroke-linecap="round"/>`;
    for (let t = 0.38; t <= 1.001; t += 0.07) {
      const p = at(c, t);
      const q = at(c, Math.min(1, t + 0.02));
      const dir = Math.atan2(q.y - p.y, q.x - p.x);
      const sprays = 3 + Math.floor(r() * 3);
      for (let k = 0; k < sprays; k++) {
        const side = r() < 0.5 ? -1 : 1;
        const a = dir + side * (0.9 + r() * 0.9) + 0.5;
        const len = 11 + r() * 9;
        const wd = 2.6 + r() * 1.4;
        back += leaf(p.x + (r() - 0.5) * 6, p.y + 2 + (r() - 0.5) * 6, a + 0.25, len * 1.15, wd * 1.2, '#2f6a35');
        front += leaf(p.x, p.y, a, len, wd, r() < 0.22 ? '#9cc95a' : '#5c9a44');
      }
    }
  }
  return { svg: svg(W, H, back + stems + front), w: W, h: H };
}

/* ---------------------------------------------------------------- areca palm */

export function arecaSvg(lean = 0) {
  const W = 90;
  const H = 230;
  const topX = 45 + lean * 14;
  let b = '';
  b += `<path d="M42 ${H} Q ${f(44 + lean * 4)} 120, ${f(topX - 1)} 40 L ${f(topX + 3)} 40 Q ${f(48 + lean * 4)} 120, 48 ${H} Z" fill="#b9ad8c"/>`;
  b += `<path d="M45 ${H} Q ${f(46 + lean * 4)} 120, ${f(topX + 1)} 40 L ${f(topX + 3)} 40 Q ${f(48 + lean * 4)} 120, 48 ${H} Z" fill="#9c9274"/>`;
  b += `<path d="M${f(topX - 3)} 50 L ${f(topX + 6)} 50 L ${f(topX + 5)} 30 L ${f(topX - 2)} 30 Z" fill="#8bb04f"/>`;
  b += `<circle cx="${f(topX + 8)}" cy="52" r="4" fill="#e0892f"/><circle cx="${f(topX + 3)}" cy="56" r="3.6" fill="#f0a63a"/>`;
  const fronds: [number, number][] = [[-3.0, 42], [-2.55, 42], [-2.1, 36], [-1.62, 30], [-1.1, 36], [-0.62, 42], [-0.16, 42]];
  const cx = topX + 1.5;
  const cy = 30;
  for (const [a, len] of fronds) {
    const ex = cx + Math.cos(a) * len;
    const ey = cy + Math.sin(a) * len + len * (0.35 + Math.abs(Math.cos(a)) * 0.5);
    const mx = cx + Math.cos(a) * len * 0.55;
    const my = cy + Math.sin(a) * len * 0.55 - 6;
    for (let t = 0.15; t < 1; t += 0.1) {
      const m = 1 - t;
      const px = m * m * cx + 2 * m * t * mx + t * t * ex;
      const py = m * m * cy + 2 * m * t * my + t * t * ey;
      const l = 10 * (1 - t * 0.4);
      b += `<path d="M${f(px)} ${f(py)} l ${f(Math.cos(a + 1.25) * l)} ${f(Math.sin(a + 1.25) * l + 6)} M${f(px)} ${f(py)} l ${f(Math.cos(a - 1.25) * l)} ${f(Math.sin(a - 1.25) * l + 6)}" stroke="${t > 0.5 ? '#5c9a44' : '#468a3c'}" stroke-width="2.8" stroke-linecap="round"/>`;
    }
    b += `<path d="M${f(cx)} ${cy} Q ${f(mx)} ${f(my)}, ${f(ex)} ${f(ey)}" fill="none" stroke="#3c7a35" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return { svg: svg(W, H, b), w: W, h: H };
}

/* ---------------------------------------------------------------- banyan */

export function banyanSvg() {
  const W = 280;
  const H = 220;
  const r = rng(5);
  let b = '';
  b += `<path d="M118 220 C 124 180, 120 150, 108 120 L 126 116 C 134 140, 140 150, 142 130 L 156 128 C 156 160, 160 190, 170 220 Z" fill="#7a5a43"/>`;
  b += `<path d="M140 220 C 144 190, 146 160, 150 130 L 156 128 C 156 160, 160 190, 170 220 Z" fill="#664a36"/>`;
  b += `<path d="M96 220 C 100 200, 104 186, 112 170 M182 220 C 178 196, 172 180, 162 168 M84 150 L 84 214 M196 146 L 196 212 M70 140 L 70 196 M210 136 L 210 190" stroke="#7a5a43" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const lobes: [number, number, number][] = [];
  for (let i = 0; i < 18; i++) {
    const a = Math.PI + (i / 17) * Math.PI;
    lobes.push([140 + Math.cos(a) * (104 + r() * 10), 92 + Math.sin(a) * (58 + r() * 8), 26 + r() * 9]);
  }
  for (let i = 0; i < 7; i++) lobes.push([46 + i * 31 + r() * 6, 112 + r() * 8, 24 + r() * 6]);
  lobes.push([140, 84, 60], [96, 92, 46], [184, 92, 46]);
  let dark = '';
  let mid = '';
  let light = '';
  for (const [x, y, rad] of lobes) {
    dark += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}"/>`;
    mid += `<circle cx="${f(x - 2)}" cy="${f(y - rad * 0.26)}" r="${f(rad * 0.78)}"/>`;
    if (y < 70) light += `<circle cx="${f(x - rad * 0.2)}" cy="${f(y - rad * 0.42)}" r="${f(rad * 0.5)}"/>`;
  }
  b += `<g fill="#2c6232">${dark}</g><g fill="#3d7a3b">${mid}</g><g fill="#5c9a44">${light}</g>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/* ---------------------------------------------------------------- houses */

/** Today's village houses: a cream single-storey with a red tile roof, and a narrow two-storey "nhà ống" with a balcony. */
export function houseSvg(variant: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
  if (variant === 0) {
    const W = 140;
    const H = 92;
    let b = '';
    b += `<rect x="16" y="46" width="108" height="42" rx="3" fill="#f7ead0"/>`;
    b += `<rect x="16" y="46" width="108" height="8" fill="#e8d6b4"/>`;
    b += `<rect x="58" y="60" width="24" height="28" rx="2" fill="#7a5340"/>`;
    b += `<rect x="28" y="60" width="20" height="16" rx="2" fill="#8ec5e8"/><rect x="92" y="60" width="20" height="16" rx="2" fill="#8ec5e8"/>`;
    b += `<path d="M28 68 h 20 M102 60 v 16 M38 60 v 16 M92 68 h 20" stroke="#f7ead0" stroke-width="2"/>`;
    b += `<path d="M4 50 L 30 18 L 110 18 L 136 50 Z" fill="#d9573b"/>`;
    b += `<path d="M70 18 L 110 18 L 136 50 L 70 50 Z" fill="#c44a31"/>`;
    b += `<rect x="10" y="86" width="120" height="6" rx="2" fill="#d9cba8"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  if (variant === 1) return houseOng();
  return houseMore(variant);
}

function houseOng() {
  const W = 90;
  const H = 150;
  let b = '';
  b += `<rect x="14" y="28" width="62" height="118" rx="3" fill="#f4d37c"/>`;
  b += `<rect x="58" y="28" width="18" height="118" fill="#e7c264"/>`;
  b += `<path d="M10 32 L 45 8 L 80 32 Z" fill="#d9573b"/>`;
  b += `<rect x="24" y="44" width="40" height="30" rx="2" fill="#8ec5e8"/><path d="M44 44 v 30" stroke="#f4d37c" stroke-width="3"/>`;
  b += `<rect x="18" y="74" width="54" height="5" fill="#e9eef2"/>`;
  for (let x = 20; x <= 70; x += 6) b += `<rect x="${x}" y="62" width="2" height="12" fill="#e9eef2"/>`;
  b += `<rect x="18" y="60" width="54" height="3" fill="#e9eef2"/>`;
  b += `<circle cx="24" cy="57" r="6" fill="#5c9a44"/><circle cx="64" cy="57" r="5" fill="#68a64c"/>`;
  b += `<rect x="24" y="96" width="42" height="50" rx="2" fill="#5a7f9e"/><path d="M45 96 v 50" stroke="#4a6c88" stroke-width="2"/>`;
  b += `<rect x="20" y="88" width="50" height="5" fill="#d9573b"/>`;
  b += `<rect x="6" y="144" width="78" height="6" rx="2" fill="#d9cba8"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}


/** More village buildings so no two stretches look alike: a Thai-roof villa, a thatched house, the communal house (đình), a tall townhouse, a tin-roof house and a corner shop. */
function houseMore(variant: 2 | 3 | 4 | 5 | 6 | 7) {
  let b = '';
  if (variant === 2) {
    const W = 160;
    const H = 124;
    b += `<rect x="22" y="64" width="116" height="54" rx="3" fill="#f7dcc6"/><rect x="100" y="64" width="38" height="54" fill="#ecc7ab"/>`;
    b += `<rect x="70" y="84" width="22" height="34" rx="11" fill="#7a5340"/><circle cx="87" cy="102" r="1.8" fill="#f0c36a"/>`;
    for (const x of [32, 112]) b += `<rect x="${x}" y="80" width="20" height="22" rx="2" fill="#8ec5e8"/><rect x="${x - 5}" y="80" width="5" height="22" fill="#4f8f5e"/><rect x="${x + 20}" y="80" width="5" height="22" fill="#4f8f5e"/><rect x="${x - 4}" y="103" width="28" height="4" rx="1" fill="#d9573b"/>`;
    b += `<path d="M6 68 L 40 38 L 120 38 L 154 68 Z" fill="#8f4a3a"/><path d="M80 38 L 120 38 L 154 68 L 80 68 Z" fill="#7d3f31"/>`;
    b += `<path d="M42 38 L 80 6 L 118 38 Z" fill="#b2604a"/><path d="M80 6 L 118 38 L 80 38 Z" fill="#9c5240"/>`;
    b += `<circle cx="80" cy="26" r="6" fill="#8ec5e8" stroke="#f7dcc6" stroke-width="2"/>`;
    b += `<rect x="76" y="2" width="8" height="6" rx="2" fill="#e2a72e"/>`;
    b += `<rect x="12" y="116" width="136" height="6" rx="2" fill="#d9cba8"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  if (variant === 3) {
    const W = 140;
    const H = 96;
    b += `<rect x="20" y="52" width="100" height="40" fill="#a47850"/>`;
    for (let x = 26; x < 118; x += 9) b += `<rect x="${x}" y="52" width="1.6" height="40" fill="#8b6240"/>`;
    b += `<rect x="58" y="62" width="26" height="30" rx="2" fill="#5e3f2b"/><rect x="28" y="64" width="18" height="14" rx="1.5" fill="#f2d68a"/><rect x="96" y="64" width="18" height="14" rx="1.5" fill="#f2d68a"/>`;
    b += `<path d="M4 58 C 18 40, 36 22, 70 12 C 104 22, 122 40, 136 58 C 112 52, 28 52, 4 58 Z" fill="#c99a4b"/>`;
    b += `<path d="M70 12 C 104 22, 122 40, 136 58 C 112 52, 90 52, 70 52 Z" fill="#b4853c"/>`;
    for (let i = 0; i < 9; i++) b += `<path d="M${10 + i * 14} 56 Q ${30 + i * 10} 34, ${68 + (i - 4) * 4} 16" fill="none" stroke="#a87b36" stroke-width="1.4" opacity=".7"/>`;
    b += `<path d="M56 52 v 6 M62 52 v 8 M80 52 v 7 M86 52 v 5" stroke="#d9573b" stroke-width="3" stroke-linecap="round"/>`;
    b += `<ellipse cx="124" cy="86" rx="10" ry="5" fill="#6f9a3e"/><rect x="8" y="90" width="124" height="5" rx="2" fill="#bfa77a"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  if (variant === 4) {
    const W = 200;
    const H = 138;
    b += `<rect x="30" y="112" width="140" height="8" fill="#c9bfa8"/><rect x="22" y="120" width="156" height="8" fill="#d9cfb8"/><rect x="14" y="128" width="172" height="8" fill="#e6dec9"/>`;
    b += `<rect x="40" y="62" width="120" height="50" fill="#b83a2c"/><rect x="40" y="62" width="120" height="6" fill="#8f2a20"/>`;
    for (const x of [48, 84, 116, 144]) b += `<rect x="${x}" y="68" width="8" height="44" fill="#d9573b"/><rect x="${x}" y="68" width="3" height="44" fill="#e8765a"/>`;
    b += `<rect x="86" y="78" width="28" height="34" rx="2" fill="#4a2a20"/><path d="M100 78 v 34" stroke="#e2a72e" stroke-width="2"/>`;
    b += `<path d="M10 66 C 40 66, 52 56, 62 42 L 138 42 C 148 56, 160 66, 190 66 C 176 70, 24 70, 10 66 Z" fill="#4b6578"/>`;
    b += `<path d="M100 42 L 138 42 C 148 56, 160 66, 190 66 C 176 70, 100 70, 100 70 Z" fill="#3e5568"/>`;
    b += `<path d="M44 44 C 66 44, 74 34, 82 22 L 118 22 C 126 34, 134 44, 156 44 C 148 48, 52 48, 44 44 Z" fill="#59748a"/>`;
    b += `<path d="M100 22 L 118 22 C 126 34, 134 44, 156 44 C 148 48, 100 48, 100 48 Z" fill="#4b6578"/>`;
    b += `<path d="M82 22 C 90 14, 110 14, 118 22 Z" fill="#6a86a0"/><circle cx="100" cy="9" r="4" fill="#e2a72e"/><rect x="99" y="9" width="2" height="8" fill="#e2a72e"/>`;
    b += `<path d="M8 66 q 4 -8 10 -6 M192 66 q -4 -8 -10 -6" stroke="#e2a72e" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    b += `<circle cx="100" cy="34" r="5" fill="#e2a72e"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  if (variant === 5) {
    const W = 104;
    const H = 178;
    b += `<rect x="12" y="32" width="80" height="142" rx="3" fill="#cfe3f0"/><rect x="68" y="32" width="24" height="142" fill="#b9d3e5"/>`;
    b += `<rect x="8" y="26" width="88" height="8" rx="2" fill="#98b5c9"/>`;
    for (let i = 0; i < 4; i++) b += `<rect x="30" y="${i * 34 + 6}" width="2" height="0" fill="none"/>`;
    b += `<rect x="30" y="2" width="30" height="24" rx="4" fill="#4a97d1"/><rect x="30" y="2" width="12" height="24" rx="4" fill="#5fa8de"/><rect x="28" y="24" width="34" height="3" fill="#8b9aa6"/>`;
    for (let r = 0; r < 3; r++) {
      const y = 44 + r * 40;
      b += `<rect x="20" y="${y}" width="24" height="24" rx="2" fill="#8ec5e8"/><rect x="54" y="${y}" width="24" height="24" rx="2" fill="#8ec5e8"/>`;
      b += `<path d="M32 ${y} v 24 M66 ${y} v 24" stroke="#cfe3f0" stroke-width="2"/><rect x="16" y="${y + 24}" width="32" height="4" fill="#f4f7fa"/><rect x="50" y="${y + 24}" width="32" height="4" fill="#f4f7fa"/>`;
      b += `<circle cx="${22 + (r % 2) * 3}" cy="${y + 22}" r="4.5" fill="#5c9a44"/><circle cx="${74 - (r % 2) * 3}" cy="${y + 22}" r="4" fill="#68a64c"/>`;
    }
    b += `<rect x="22" y="150" width="46" height="24" rx="2" fill="#5a7f9e"/><rect x="18" y="146" width="54" height="6" fill="#d9573b"/>`;
    b += `<rect x="6" y="172" width="92" height="6" rx="2" fill="#d9cba8"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  if (variant === 6) {
    const W = 140;
    const H = 88;
    b += `<rect x="16" y="40" width="108" height="46" fill="#d98a5f"/><rect x="16" y="40" width="108" height="6" fill="#c0764c"/>`;
    for (let y = 50; y < 84; y += 8) b += `<path d="M16 ${y} h 108" stroke="#c0764c" stroke-width="1" opacity=".6"/>`;
    b += `<rect x="60" y="56" width="24" height="30" rx="2" fill="#5f8fb3"/><rect x="26" y="56" width="22" height="16" rx="2" fill="#f2e2a2"/><rect x="96" y="56" width="22" height="16" rx="2" fill="#f2e2a2"/>`;
    b += `<path d="M6 46 L 28 14 L 112 14 L 134 46 Z" fill="#3f86c4"/>`;
    for (let x = 32; x < 112; x += 9) b += `<path d="M${x} 14 L ${x - 14 + (x - 70) * 0.28} 46" stroke="#2f6fa8" stroke-width="2" opacity=".75"/>`;
    b += `<path d="M70 14 L 112 14 L 134 46 L 70 46 Z" fill="#2f6fa8" opacity=".45"/>`;
    b += `<rect x="104" y="4" width="8" height="14" fill="#a07a5e"/><rect x="102" y="2" width="12" height="4" fill="#8a6650"/>`;
    b += `<rect x="6" y="84" width="128" height="5" rx="2" fill="#d9cba8"/>`;
    for (let x = 8; x < 130; x += 8) b += `<rect x="${x}" y="76" width="2.4" height="10" fill="#e9dcc0"/>`;
    return { svg: svg(W, H, b), w: W, h: H };
  }
  const W = 130;
  const H = 104;
  b += `<rect x="14" y="30" width="102" height="70" rx="3" fill="#f5efe0"/><rect x="92" y="30" width="24" height="70" fill="#e8dfc8"/>`;
  b += `<rect x="8" y="22" width="114" height="10" rx="2" fill="#c9bfa8"/>`;
  b += `<path d="M10 52 h 110 l -6 14 h -98 Z" fill="#d9573b"/>`;
  for (let x = 10; x < 120; x += 22) b += `<path d="M${x} 52 h 11 l -3 14 h -11 Z" fill="#ffffff"/>`;
  b += `<rect x="24" y="68" width="48" height="30" rx="2" fill="#8ec5e8"/><path d="M48 68 v 30" stroke="#f5efe0" stroke-width="3"/>`;
  b += `<rect x="30" y="86" width="14" height="12" rx="1" fill="#f0a63a"/><rect x="52" y="82" width="14" height="16" rx="1" fill="#6fae4f"/>`;
  b += `<rect x="82" y="66" width="24" height="34" rx="2" fill="#5a7f9e"/>`;
  b += `<rect x="30" y="34" width="30" height="12" rx="2" fill="#e2a72e"/><circle cx="78" cy="40" r="5" fill="#e2a72e"/>`;
  b += `<rect x="6" y="98" width="118" height="6" rx="2" fill="#d9cba8"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/* ---------------------------------------------------------------- the kids */

/** Two kids on the dyke: the older one holds the kite string up high, the younger points at the kite. */
/** The kite flyer, the game's mascot (see mascot.ts). */
export function kidsSvg() {
  const m = mascotSvg('village');
  return { svg: m.svg, w: m.w, h: m.h, hand: m.hand };
}
