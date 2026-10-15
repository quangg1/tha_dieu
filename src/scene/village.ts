// The countryside at the foot of the sky, in a flat, rounded, modern style: a bamboo hedge, areca palms,
// a banyan, today's village houses, and two kids on the dyke flying the kite.

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
export function kidsSvg() {
  const W = 130;
  const H = 104;
  const skin = '#f1c79a';
  const hair = '#2b2420';
  let b = '';
  b += `<ellipse cx="62" cy="100" rx="52" ry="4" fill="rgba(30,60,20,.25)"/>`;
  // Older kid: red t-shirt, blue shorts, arm raised with the string.
  b += `<rect x="31" y="70" width="7" height="28" rx="3" fill="${skin}"/><rect x="42" y="70" width="7" height="28" rx="3" fill="${skin}"/>`;
  b += `<rect x="30" y="94" width="9" height="5" rx="2" fill="#f4f4f4"/><rect x="41" y="94" width="9" height="5" rx="2" fill="#f4f4f4"/>`;
  b += `<rect x="29" y="62" width="22" height="14" rx="4" fill="#2f5d9e"/>`;
  b += `<rect x="28" y="40" width="24" height="26" rx="8" fill="#e5533d"/>`;
  b += `<path d="M47 46 L 62 22" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`;
  b += `<circle cx="63" cy="20" r="4" fill="${skin}"/>`;
  b += `<path d="M32 46 L 26 62" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`;
  b += `<circle cx="40" cy="28" r="11" fill="${skin}"/>`;
  b += `<path d="M29 27 C 28 16, 38 13, 44 15 C 50 16, 53 22, 51 28 C 48 22, 40 21, 34 23 C 32 24, 30 26, 29 27 Z" fill="${hair}"/>`;
  b += `<circle cx="44" cy="29" r="1.4" fill="${hair}"/><circle cx="37" cy="29" r="1.4" fill="${hair}"/>`;
  // Younger kid: yellow t-shirt, green shorts, pigtails, pointing up.
  b += `<rect x="85" y="80" width="6" height="18" rx="3" fill="${skin}"/><rect x="95" y="80" width="6" height="18" rx="3" fill="${skin}"/>`;
  b += `<rect x="84" y="95" width="8" height="4" rx="2" fill="#f4f4f4"/><rect x="94" y="95" width="8" height="4" rx="2" fill="#f4f4f4"/>`;
  b += `<rect x="83" y="74" width="20" height="11" rx="4" fill="#3f8f6b"/>`;
  b += `<rect x="82" y="56" width="22" height="22" rx="7" fill="#f5c242"/>`;
  b += `<path d="M86 61 L 78 44" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<path d="M100 62 L 104 74" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<circle cx="93" cy="46" r="9.5" fill="${skin}"/>`;
  b += `<path d="M83.5 46 C 82 36, 90 33, 95 34 C 100 35, 104 40, 102.5 46 C 99 41, 92 40, 88 42 C 86 43, 84.5 44.5, 83.5 46 Z" fill="${hair}"/>`;
  b += `<circle cx="83" cy="42" r="3.4" fill="${hair}"/><circle cx="103" cy="42" r="3.4" fill="${hair}"/>`;
  b += `<circle cx="96" cy="47" r="1.3" fill="${hair}"/><circle cx="90" cy="47" r="1.3" fill="${hair}"/>`;
  b += `<path d="M91 51 q 2.5 2 5 0" stroke="#c0392b" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  return { svg: svg(W, H, b), w: W, h: H, hand: { x: 63 / W, y: 20 / H } };
}
