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
export function houseSvg(variant: 0 | 1) {
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

/* ---------------------------------------------------------------- the kids */

/** Two kids on the dyke: the older one holds the kite string up high, the younger points at the kite. */
/** The kite flyer, the game's mascot: a village kid with a hair tuft, a red shirt with a kite on it and a bamboo reel. */
export function kidsSvg() {
  const W = 120;
  const H = 150;
  const ink = '#1f1b16';
  const skin = '#f6cfa3';
  const hair = '#2b2420';
  const o = `stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"`;
  // A limb drawn as an inked stroke with a skin stroke on top.
  const limb = (d: string, w = 8) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + 4.5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let b = '';
  b += `<ellipse cx="58" cy="145" rx="34" ry="4" fill="rgba(30,60,20,.28)"/>`;
  // Legs and red sandals.
  b += limb('M51 112 L 50 136', 8) + limb('M64 112 L 66 136', 8);
  b += `<rect x="42" y="135" width="15" height="7" rx="3.5" fill="#e5533d" ${o}/><rect x="60" y="135" width="15" height="7" rx="3.5" fill="#e5533d" ${o}/>`;
  // Shorts.
  b += `<path d="M41 100 L 75 100 L 77 118 L 60 118 L 58 110 L 56 118 L 39 118 Z" fill="#2f5d9e" ${o}/>`;
  // Arm on the hip, behind the shirt.
  b += limb('M43 80 L 31 94 L 41 104', 7.5);
  // Shirt with the kite on the chest.
  b += `<path d="M44 71 C 50 68, 64 68, 70 71 L 76 80 L 74 104 C 64 107, 50 107, 40 104 L 38 80 Z" fill="#e5533d" ${o}/>`;
  b += `<path d="M57 79 L 64 88 L 57 98 L 50 88 Z" fill="#f5c242" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/><path d="M57 79 L 57 98 M50 88 L 64 88" stroke="${ink}" stroke-width="1.1"/>`;
  b += `<path d="M57 98 q -3 4 0 7 q 3 3 0 6" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/>`;
  // Arm raised to the kite, holding the bamboo reel.
  b += limb('M70 78 L 85 60 L 96 36', 7.5);
  b += `<g transform="rotate(-25 98 30)"><rect x="89" y="25" width="18" height="10" rx="3" fill="#c99b4a" ${o}/><path d="M93 25 L 93 35 M103 25 L 103 35" stroke="${ink}" stroke-width="1.4"/></g>`;
  b += `<circle cx="97" cy="33" r="5.2" fill="${skin}" ${o}/>`;
  // Head.
  b += `<circle cx="33" cy="50" r="5.5" fill="${skin}" ${o}/>`;
  b += `<circle cx="57" cy="46" r="24" fill="${skin}" ${o}/>`;
  b += `<path d="M33 45 C 31 27, 44 19, 58 19 C 72 19, 83 28, 81 44 C 76 34, 67 30, 57 31 C 47 31, 39 36, 33 45 Z" fill="${hair}" ${o}/>`;
  // The tuft, the mascot's signature.
  b += `<path d="M54 21 C 49 11, 57 3, 65 7 C 60 9, 58 13, 61 20 Z" fill="${hair}" ${o}/>`;
  b += `<path d="M45 40 q 4 -3 8 -1 M62 39 q 4 -2 8 1" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
  b += `<ellipse cx="50" cy="48" rx="4.2" ry="4.8" fill="#fff" stroke="${ink}" stroke-width="1.6"/><ellipse cx="66" cy="48" rx="4.2" ry="4.8" fill="#fff" stroke="${ink}" stroke-width="1.6"/>`;
  b += `<circle cx="51.4" cy="46.6" r="2.6" fill="${ink}"/><circle cx="67.4" cy="46.6" r="2.6" fill="${ink}"/>`;
  b += `<circle cx="52.3" cy="45.6" r=".9" fill="#fff"/><circle cx="68.3" cy="45.6" r=".9" fill="#fff"/>`;
  b += `<ellipse cx="43" cy="56" rx="4" ry="2.6" fill="#f08a7a" opacity=".55"/><ellipse cx="72" cy="56" rx="4" ry="2.6" fill="#f08a7a" opacity=".55"/>`;
  b += `<path d="M51 57 Q 58 66 66 57 Z" fill="#8a2c22" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><path d="M55 61.5 Q 58.5 59.5 62 61.5 Q 58.5 64 55 61.5 Z" fill="#e5735f"/>`;
  return { svg: svg(W, H, b), w: W, h: H, hand: { x: 100 / W, y: 27 / H } };
}
