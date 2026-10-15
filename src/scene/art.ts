// Woodblock-style illustrations for the sky, in the Giấy Điệp manner: flat colour plates, ink line on top,
// and an ink plate printed a few pixels off-register underneath. Motifs come from real Vietnamese sources:
// the Đông Sơn bronze drum face (14-ray sun, tangent-circle rings, Lạc birds flying counter-clockwise),
// the scrolling "mây cuộn" cloud of temple carving, the upturned "đầu đao" eaves of a village đình,
// rice terraces under Fansipan, and the Trung thu moon with chú Cuội under the banyan tree.

const INK = '#1f1b16';
const DIEP = '#f4ead2';
const DIEP2 = '#e9dcbc';
const SON = '#c0392b';
const SON2 = '#8f2a1f';
const HOE = '#e2a72e';
const LA = '#3f6b2c';
const LA2 = '#2c4f1f';
const LA3 = '#7fa04a';
const CHAM = '#26476f';
const CHAM2 = '#142640';
const TRANG = '#f3dc8a';
const BRONZE = '#c9963a';
const BRONZE2 = '#a6762a';

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
const f = (n: number) => n.toFixed(1);

/* ---------------------------------------------------------------- Đông Sơn sun */

function lacBird(cx: number, cy: number, angle: number, s: number) {
  // A Lạc bird seen from the side: long beak, crest, raised wing, long tail. Points along +x, then rotated.
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(angle)}) scale(${s})">
    <path d="M-14 0 C -8 -3, 4 -4, 10 -2 L 22 -1 L 10 1 C 4 3, -8 3, -14 0 Z" fill="${INK}"/>
    <path d="M-2 -2 L -10 -11 L 2 -4 Z" fill="${INK}"/>
    <path d="M6 -3 L 4 -9 L 8 -4 Z" fill="${INK}"/>
    <path d="M-14 0 L -24 -4 L -22 0 L -24 4 Z" fill="${INK}"/>
  </g>`;
}

export function sunSvg() {
  const S = 260;
  const c = S / 2;
  let body = `<circle cx="${c + 5}" cy="${c + 5}" r="122" fill="${INK}"/>`;
  body += `<circle cx="${c}" cy="${c}" r="122" fill="${BRONZE}" stroke="${INK}" stroke-width="3"/>`;
  for (const r of [114, 98, 84, 60, 48]) body += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${INK}" stroke-width="${r === 84 || r === 60 ? 2.4 : 1.6}"/>`;
  // Outer ring: comb teeth.
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    body += `<line x1="${f(c + Math.cos(a) * 99)}" y1="${f(c + Math.sin(a) * 99)}" x2="${f(c + Math.cos(a) * 113)}" y2="${f(c + Math.sin(a) * 113)}" stroke="${INK}" stroke-width="1.4"/>`;
  }
  // Lạc birds flying counter-clockwise between r=60 and r=84.
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = c + Math.cos(a) * 72;
    const y = c + Math.sin(a) * 72;
    body += lacBird(x, y, (a * 180) / Math.PI - 90, 0.85);
  }
  // Tangent circles ring between r=48 and r=60.
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const x = c + Math.cos(a) * 54;
    const y = c + Math.sin(a) * 54;
    body += `<circle cx="${f(x)}" cy="${f(y)}" r="4.2" fill="${BRONZE2}" stroke="${INK}" stroke-width="1.3"/><circle cx="${f(x)}" cy="${f(y)}" r="1.4" fill="${INK}"/>`;
  }
  // Fourteen-ray star with feather hatching between the rays.
  let star = '';
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 46 : 12;
    star += `${i ? 'L' : 'M'}${f(c + Math.cos(a) * r)} ${f(c + Math.sin(a) * r)} `;
  }
  body += `<circle cx="${c}" cy="${c}" r="47" fill="${BRONZE2}"/>`;
  for (let i = 0; i < 14; i++) {
    const a = ((i + 0.5) / 14) * Math.PI * 2 - Math.PI / 2;
    for (const k of [0.45, 0.7]) {
      body += `<line x1="${f(c + Math.cos(a) * 46 * k)}" y1="${f(c + Math.sin(a) * 46 * k)}" x2="${f(c + Math.cos(a) * 46 * (k + 0.18))}" y2="${f(c + Math.sin(a) * 46 * (k + 0.18))}" stroke="${INK}" stroke-width="1.2"/>`;
    }
  }
  body += `<path d="${star}Z" fill="${TRANG}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  body += `<circle cx="${c}" cy="${c}" r="9" fill="${HOE}" stroke="${INK}" stroke-width="2"/>`;
  return { svg: svg(S + 6, S + 6, body), w: S + 6, h: S + 6 };
}

/* ---------------------------------------------------------------- mây cuộn */

function spiral(cx: number, cy: number, r: number, turns: number, dir: 1 | -1) {
  let d = '';
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = dir * t * turns * Math.PI * 2;
    const rr = r * (1 - t * 0.85);
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)} `;
  }
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
}

/** Scrolling cloud. Lobes are drawn ink-first then paper, so only the outer edge keeps its outline. */
export function cloudSvg(variant: number) {
  const W = 300;
  const H = 120;
  const lobes: [number, number, number][] =
    variant === 0
      ? [[60, 78, 30], [100, 60, 36], [148, 50, 40], [196, 62, 34], [236, 78, 28], [130, 86, 30], [180, 88, 28]]
      : [[70, 80, 26], [108, 64, 32], [150, 58, 30], [190, 70, 28], [224, 84, 22], [140, 90, 24]];
  let body = '';
  body += lobes.map(([x, y, r]) => `<circle cx="${x + 5}" cy="${y + 5}" r="${r + 2.5}" fill="${INK}"/>`).join('');
  body += lobes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="${INK}"/>`).join('');
  body += lobes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${DIEP}"/>`).join('');
  // Scroll curls at both ends and an inner wave line.
  body += spiral(lobes[0][0] - 2, lobes[0][1] + 2, lobes[0][2] * 0.62, 1.4, -1);
  const last = lobes[variant === 0 ? 4 : 4];
  body += spiral(last[0] + 2, last[1] + 2, last[2] * 0.6, 1.4, 1);
  body += `<path d="M${lobes[1][0] - 10} ${lobes[1][1] + 6} q 14 -16 30 -4 q 16 -16 32 -2" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
  return { svg: svg(W, H, body), w: W, h: H };
}

/* ---------------------------------------------------------------- cò trắng */

export function storkSvg(frame: 0 | 1) {
  const wing =
    frame === 0
      ? `<path d="M30 22 C 22 4, 44 -2, 58 4 C 48 8, 40 14, 36 24 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M50 3 L 58 4 L 52 9 Z" fill="${INK}"/>`
      : `<path d="M30 24 C 24 40, 44 48, 58 44 C 48 38, 40 32, 36 24 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M50 45 L 58 44 L 52 39 Z" fill="${INK}"/>`;
  const body = `
    <path d="M14 26 C 20 18, 40 18, 48 24 C 40 30, 22 32, 14 26 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>
    <path d="M47 24 C 56 22, 60 16, 66 18 C 70 19, 70 23, 66 24" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M66 18 L 82 20 L 66 22 Z" fill="${HOE}" stroke="${INK}" stroke-width="1.2"/>
    <path d="M15 26 L 0 28 M15 27 L 1 31" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    ${wing}`;
  return { svg: svg(84, 50, body), w: 84, h: 50 };
}

/* ---------------------------------------------------------------- village đình and bamboo */

export function dinhSvg() {
  const W = 320;
  const H = 170;
  const body = `
    <path d="M18 70 C 40 60, 60 40, 82 36 L 238 36 C 260 40, 280 60, 302 70 C 306 60, 314 54, 318 50 C 314 66, 306 78, 292 84 L 28 84 C 14 78, 6 66, 2 50 C 6 54, 14 60, 18 70 Z" fill="${INK}" transform="translate(5 5)"/>
    <rect x="58" y="84" width="204" height="70" fill="${DIEP2}" stroke="${INK}" stroke-width="2.5"/>
    <g fill="${SON2}" stroke="${INK}" stroke-width="2">
      <rect x="66" y="84" width="10" height="70"/><rect x="118" y="84" width="10" height="70"/><rect x="192" y="84" width="10" height="70"/><rect x="244" y="84" width="10" height="70"/>
    </g>
    <path d="M136 104 L 184 104 L 184 154 L 136 154 Z" fill="${CHAM2}" stroke="${INK}" stroke-width="2"/>
    <path d="M160 104 L 160 154" stroke="${HOE}" stroke-width="2"/>
    <path d="M18 70 C 40 60, 60 40, 82 36 L 238 36 C 260 40, 280 60, 302 70 C 306 60, 314 54, 318 50 C 314 66, 306 78, 292 84 L 28 84 C 14 78, 6 66, 2 50 C 6 54, 14 60, 18 70 Z" fill="${SON}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <g stroke="${INK}" stroke-width="1.3" fill="none" opacity="0.75">
      <path d="M40 66 C 70 56, 250 56, 280 66"/><path d="M30 76 C 70 66, 250 66, 290 76"/><path d="M60 50 C 100 44, 220 44, 260 50"/>
    </g>
    <path d="M78 36 L 242 36" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="160" cy="26" r="8" fill="${TRANG}" stroke="${INK}" stroke-width="2"/>
    <path d="M150 30 C 132 32, 118 22, 104 30 C 112 22, 126 18, 134 24 M170 30 C 188 32, 202 22, 216 30 C 208 22, 194 18, 186 24" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M2 50 C 0 42, 6 36, 12 40 M318 50 C 320 42, 314 36, 308 40" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="40" y="154" width="240" height="12" fill="${DIEP2}" stroke="${INK}" stroke-width="2"/>`;
  return { svg: svg(W + 6, H + 6, body), w: W + 6, h: H + 6 };
}

export function bambooSvg() {
  const W = 300;
  const H = 230;
  let body = '';
  let leaves = '';
  const culms = [26, 58, 92, 124, 160, 196, 232, 268];
  const leaf = (x: number, y: number, a: number, col: string) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M0 0 C 6 -3.5, 20 -3, 27 0 C 20 3, 6 3.5, 0 0 Z" fill="${col}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/></g>`;
  for (const [i, x] of culms.entries()) {
    // Each culm rises then arches over at the top, the way bamboo along a village edge bows.
    const dir = i % 2 ? 1 : -1;
    const top = 26 + (i % 3) * 16;
    const tipX = x + dir * 34;
    const tipY = top + 22;
    const d = `M${x} ${H} C ${x} ${H * 0.55}, ${x + dir * 4} ${top + 10}, ${x + dir * 14} ${top} S ${tipX} ${tipY - 6}, ${tipX} ${tipY}`;
    body += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>`;
    body += `<path d="${d}" fill="none" stroke="${LA3}" stroke-width="2.6" stroke-linecap="round"/>`;
    for (let k = 1; k < 6; k++) {
      const yy = H - (H - top - 30) * (k / 6);
      body += `<line x1="${x - 4}" y1="${f(yy)}" x2="${x + 4}" y2="${f(yy)}" stroke="${INK}" stroke-width="1.6"/>`;
    }
    // Drooping leaf clusters along the arch and on short side twigs.
    const points: [number, number][] = [[x + dir * 4, top + 30], [x + dir * 12, top + 6], [x + dir * 24, top + 6], [tipX, tipY], [x - dir * 10, top + 52], [x + dir * 6, top + 74]];
    for (const [j, [px, py]] of points.entries()) {
      const base = dir > 0 ? 60 : 120;
      for (let n = 0; n < 4; n++) {
        const a = base + (n - 1.5) * 22 * dir + (j % 2) * 8;
        leaves += leaf(px, py, a, (n + j) % 3 === 0 ? LA2 : LA);
      }
    }
  }
  return { svg: svg(W, H, body + leaves), w: W, h: H };
}

/* ---------------------------------------------------------------- Fansipan with rice terraces */

export function fansipanSvg() {
  const W = 460;
  const H = 300;
  const ridge = 'M0 300 L 70 210 L 110 228 L 170 140 L 210 160 L 262 40 L 286 58 L 300 30 L 330 70 L 380 120 L 420 110 L 460 160 L 460 300 Z';
  let body = `<path d="${ridge}" fill="${INK}" transform="translate(5 5)"/>`;
  body += `<path d="${ridge}" fill="${LA}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  // Shadow side plate.
  body += `<path d="M300 30 L 330 70 L 380 120 L 420 110 L 460 160 L 460 300 L 300 300 L 290 150 Z" fill="${LA2}" opacity="0.85"/>`;
  // Rice terraces on the lower slopes, clipped to the mountain.
  body += `<defs><clipPath id="m"><path d="${ridge}"/></clipPath></defs><g clip-path="url(#m)">`;
  for (let i = 0; i < 9; i++) {
    const y = 196 + i * 12;
    const col = i % 2 ? LA3 : '#9bb84a';
    body += `<path d="M${10 + i * 4} ${y} C ${90} ${y - 16}, ${170} ${y + 10}, ${250} ${y - 8} S ${380} ${y + 6}, ${450} ${y - 10} L 450 ${y - 4} S ${380} ${y + 12}, ${250} ${y - 2} S ${90} ${y - 10}, ${10 + i * 4} ${y + 6} Z" fill="${col}" stroke="${INK}" stroke-width="1.2"/>`;
  }
  body += `</g><path d="${ridge}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  // Peak marker (the steel pyramid on the summit) and a cloud collar.
  body += `<path d="M294 30 L 300 14 L 306 30 Z" fill="${DIEP}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
  body += `<path d="M228 104 q 20 -18 44 -6 q 18 -14 40 0 q 20 -8 34 6 q -50 14 -118 0 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>`;
  return { svg: svg(W + 6, H + 6, body), w: W + 6, h: H + 6 };
}

/* ---------------------------------------------------------------- airliner (machine-age linocut) */

export function planeSvg() {
  const W = 260;
  const H = 110;
  const fuselage = 'M24 58 C 40 50, 170 48, 216 50 C 236 51, 248 55, 252 58 C 248 61, 236 64, 216 64 C 170 66, 40 66, 24 58 Z';
  const body = `
    <g stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55">
      <path d="M2 42 C 30 40, 60 46, 90 44"/><path d="M0 60 C 20 58, 40 62, 60 60"/><path d="M8 78 C 40 76, 70 82, 100 78"/>
    </g>
    <path d="${fuselage}" fill="${INK}" transform="translate(4 4)"/>
    <path d="M110 58 L 150 58 L 112 104 L 92 104 Z" fill="${DIEP2}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <path d="${fuselage}" fill="${DIEP}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M30 60 C 80 60, 180 60, 244 60 L 246 62 C 180 63, 80 63, 30 62 Z" fill="${SON}"/>
    <path d="M28 56 L 6 18 L 26 18 L 58 52 Z" fill="${SON}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M30 60 L 8 70 L 22 72 L 46 62 Z" fill="${DIEP2}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M110 56 L 150 56 L 118 14 L 98 14 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <rect x="114" y="32" width="26" height="10" rx="5" fill="${CHAM}" stroke="${INK}" stroke-width="1.8"/>
    <rect x="104" y="80" width="26" height="10" rx="5" fill="${CHAM}" stroke="${INK}" stroke-width="1.8"/>
    <g fill="${CHAM2}">${Array.from({ length: 14 }, (_, i) => `<rect x="${70 + i * 10}" y="53" width="4.5" height="4" rx="1.2"/>`).join('')}</g>
    <path d="M230 52 C 238 53, 244 55, 247 57 L 236 57 Z" fill="${CHAM2}"/>`;
  return { svg: svg(W, H, body), w: W, h: H };
}

/* ---------------------------------------------------------------- space station and Vinasat */

function panel(x: number, y: number, w: number, h: number, fill: string, grid: string) {
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${INK}" stroke-width="1.8"/>`;
  for (let i = 1; i < 4; i++) g += `<line x1="${f(x + (w * i) / 4)}" y1="${y}" x2="${f(x + (w * i) / 4)}" y2="${y + h}" stroke="${grid}" stroke-width="1"/>`;
  g += `<line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${grid}" stroke-width="1"/>`;
  return g;
}

export function stationSvg() {
  const W = 260;
  const H = 130;
  let body = `<rect x="20" y="61" width="220" height="7" fill="${DIEP2}" stroke="${INK}" stroke-width="1.8"/>`;
  for (const x of [26, 70, 156, 200]) {
    body += panel(x, 8, 34, 50, HOE, BRONZE2);
    body += panel(x, 72, 34, 50, HOE, BRONZE2);
    body += `<line x1="${x + 17}" y1="58" x2="${x + 17}" y2="72" stroke="${INK}" stroke-width="2"/>`;
  }
  body += `<rect x="110" y="48" width="44" height="34" rx="8" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>`;
  body += `<rect x="118" y="38" width="28" height="14" rx="6" fill="${DIEP2}" stroke="${INK}" stroke-width="1.8"/>`;
  body += `<rect x="118" y="78" width="28" height="16" rx="6" fill="${DIEP2}" stroke="${INK}" stroke-width="1.8"/>`;
  body += `<path d="M132 82 L 132 96 M124 60 L 140 60 M124 68 L 140 68" stroke="${INK}" stroke-width="1.4"/>`;
  return { svg: svg(W, H, body), w: W, h: H };
}

export function vinasatSvg() {
  const W = 260;
  const H = 120;
  let body = `<rect x="104" y="40" width="52" height="44" fill="${INK}" transform="translate(4 4)"/>`;
  body += panel(6, 48, 92, 28, CHAM2, CHAM);
  body += panel(162, 48, 92, 28, CHAM2, CHAM);
  body += `<line x1="98" y1="62" x2="104" y2="62" stroke="${INK}" stroke-width="3"/><line x1="156" y1="62" x2="162" y2="62" stroke="${INK}" stroke-width="3"/>`;
  body += `<rect x="104" y="40" width="52" height="44" fill="${HOE}" stroke="${INK}" stroke-width="2.2"/>`;
  body += `<path d="M108 46 l 8 6 l 6 -4 l 8 8 l 8 -6 l 10 8 M108 74 l 10 -6 l 8 4 l 10 -8 l 8 6 l 8 -4" fill="none" stroke="${BRONZE2}" stroke-width="1.4"/>`;
  body += `<path d="M112 40 C 108 22, 132 8, 150 16 C 146 26, 132 36, 112 40 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>`;
  body += `<path d="M130 26 L 142 14" stroke="${INK}" stroke-width="1.8"/><circle cx="143" cy="13" r="2.6" fill="${SON}" stroke="${INK}" stroke-width="1.2"/>`;
  body += `<path d="M146 84 C 150 98, 168 102, 176 96 C 166 92, 156 88, 146 84 Z" fill="${DIEP}" stroke="${INK}" stroke-width="1.8"/>`;
  return { svg: svg(W, H, body), w: W, h: H };
}

/* ---------------------------------------------------------------- Cung Trăng */

export function moonSvg() {
  const S = 420;
  const c = S / 2;
  const R = 190;
  let body = `<circle cx="${c + 7}" cy="${c + 7}" r="${R}" fill="${INK}"/>`;
  body += `<circle cx="${c}" cy="${c}" r="${R}" fill="${TRANG}" stroke="${INK}" stroke-width="3"/>`;
  body += `<circle cx="${c}" cy="${c}" r="${R - 12}" fill="none" stroke="#e8cf73" stroke-width="10"/>`;
  for (const [x, y, r] of [[118, 120, 26], [300, 108, 14], [98, 250, 16], [322, 290, 22], [250, 340, 12], [150, 330, 10]]) {
    body += `<circle cx="${x}" cy="${y}" r="${r}" fill="#e2c46a" stroke="${INK}" stroke-width="1.2" opacity="0.9"/>`;
    body += `<path d="M${x - r * 0.6} ${y + r * 0.3} a ${r * 0.7} ${r * 0.7} 0 0 0 ${r * 1.2} 0" fill="none" stroke="#c9a94e" stroke-width="2"/>`;
  }
  // The banyan: trunk with aerial roots, canopy of leaf clusters (ink first, then leaves, then darker shade).
  body += `<path d="M196 330 C 198 290, 186 250, 172 222 L 188 214 C 200 236, 206 256, 210 270 C 214 250, 222 230, 236 212 L 250 222 C 232 250, 224 292, 226 330 Z" fill="${INK}"/>`;
  body += `<path d="M199 328 C 201 290, 190 252, 178 226 L 186 222 C 198 244, 205 262, 210 282 C 215 258, 224 236, 238 218 L 245 224 C 230 250, 222 292, 223 328 Z" fill="#6b5a2a"/>`;
  const clumps: [number, number, number][] = [[150, 196, 38], [192, 168, 44], [246, 170, 42], [292, 196, 36], [212, 208, 40], [128, 222, 26], [314, 224, 24], [170, 222, 30], [262, 216, 32]];
  body += clumps.map(([x, y, r]) => `<circle cx="${x + 5}" cy="${y + 5}" r="${r + 2.5}" fill="${INK}"/>`).join('');
  body += clumps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="${INK}"/>`).join('');
  body += clumps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LA}"/>`).join('');
  body += clumps.slice(4).map(([x, y, r]) => `<circle cx="${x + r * 0.15}" cy="${y + r * 0.25}" r="${r * 0.72}" fill="${LA2}"/>`).join('');
  for (const [x, y] of [[150, 190], [196, 160], [246, 164], [290, 190], [210, 200]]) {
    body += `<path d="M${x - 14} ${y} q 7 -9 14 0 q 7 -9 14 0" fill="none" stroke="${LA3}" stroke-width="2" stroke-linecap="round"/>`;
  }
  // Aerial roots.
  for (const [x, l] of [[150, 70], [168, 92], [262, 96], [286, 66], [304, 54]]) {
    body += `<path d="M${x} ${220} C ${x + 3} ${220 + l * 0.4}, ${x - 3} ${220 + l * 0.7}, ${x + 1} ${220 + l}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  }
  // Chú Cuội sitting against the trunk, one arm raised in greeting (drawn separately so it can wave).
  body += `<path d="M232 330 C 232 306, 244 296, 256 298 C 268 300, 274 314, 274 330 Z" fill="${CHAM}" stroke="${INK}" stroke-width="2.2"/>`;
  body += `<path d="M246 330 L 252 318 L 276 326 L 280 334 Z" fill="${CHAM2}" stroke="${INK}" stroke-width="2"/>`;
  body += `<circle cx="256" cy="286" r="12" fill="#e9c9a0" stroke="${INK}" stroke-width="2.2"/>`;
  body += `<path d="M242 282 C 246 268, 266 268, 270 282 Z" fill="${INK}"/>`;
  // Jade rabbit.
  body += `<path d="M120 334 C 116 318, 132 310, 146 316 C 154 308, 160 314, 156 322 C 160 330, 152 338, 140 338 L 124 338 Z" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>`;
  body += `<path d="M150 314 C 148 300, 154 296, 156 300 C 158 306, 156 312, 154 316 M156 316 C 160 304, 166 302, 166 308 C 166 312, 162 316, 158 318" fill="${DIEP}" stroke="${INK}" stroke-width="1.8"/>`;
  body += `<circle cx="154" cy="322" r="1.8" fill="${SON}"/>`;
  // Ground line of the moon garden.
  body += `<path d="M100 338 C 160 330, 270 330, 330 338" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return { svg: svg(S + 8, S + 8, body), w: S + 8, h: S + 8, arm: { x: 268 / (S + 8), y: 304 / (S + 8) } };
}

/* ---------------------------------------------------------------- planets */

export function planetSvg(kind: 'mars' | 'jupiter' | 'neptune') {
  const S = 200;
  const c = S / 2;
  const R = 86;
  const base = kind === 'mars' ? '#c4532f' : kind === 'jupiter' ? '#dba468' : '#3a7fbc';
  let body = `<circle cx="${c + 5}" cy="${c + 5}" r="${R}" fill="${INK}"/>`;
  body += `<defs><clipPath id="p"><circle cx="${c}" cy="${c}" r="${R}"/></clipPath></defs>`;
  body += `<circle cx="${c}" cy="${c}" r="${R}" fill="${base}"/>`;
  body += `<g clip-path="url(#p)">`;
  if (kind === 'mars') {
    body += `<path d="M0 70 C 50 60, 120 84, 200 66 L 200 92 C 120 108, 60 86, 0 98 Z" fill="#9e3a1f"/>`;
    body += `<path d="M0 128 C 60 118, 130 142, 200 124 L 200 138 C 130 156, 60 132, 0 144 Z" fill="#9e3a1f" opacity="0.8"/>`;
    body += `<ellipse cx="${c}" cy="20" rx="44" ry="16" fill="${DIEP}" stroke="${INK}" stroke-width="1.6"/>`;
    for (const [x, y, r] of [[70, 110, 9], [128, 80, 6], [118, 150, 7]]) body += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  } else if (kind === 'jupiter') {
    const bands = ['#b8743d', '#efd3a4', '#a65f2e', '#e7c48c', '#b8743d', '#efd3a4'];
    bands.forEach((col, i) => {
      const y = 34 + i * 24;
      // Wave-edged bands, after the "sóng nước" motif.
      let d = `M0 ${y}`;
      for (let x = 0; x <= 200; x += 20) d += ` Q ${x + 10} ${y + (i % 2 ? -6 : 6)} ${x + 20} ${y}`;
      d += ` L 200 ${y + 14} L 0 ${y + 14} Z`;
      body += `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="1.2"/>`;
    });
    body += `<ellipse cx="130" cy="126" rx="20" ry="11" fill="${SON}" stroke="${INK}" stroke-width="2"/>`;
    body += `<ellipse cx="130" cy="126" rx="9" ry="5" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
  } else {
    body += spiral(70, 90, 26, 1.6, 1).replace(INK, DIEP);
    body += spiral(132, 130, 18, 1.4, -1).replace(INK, DIEP);
    body += `<path d="M10 60 C 60 50, 140 66, 190 54 M20 150 C 70 140, 140 156, 190 144" fill="none" stroke="${CHAM2}" stroke-width="5" stroke-linecap="round"/>`;
  }
  body += `</g>`;
  body += `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${INK}" stroke-width="3"/>`;
  body += `<path d="M${c - R * 0.55} ${c - R * 0.62} a ${R * 0.9} ${R * 0.9} 0 0 1 ${R * 0.5} -${R * 0.2}" fill="none" stroke="${DIEP}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
  return { svg: svg(S + 6, S + 6, body), w: S + 6, h: S + 6 };
}

/* ---------------------------------------------------------------- Ô Thước magpie and comet */

export function magpieSvg() {
  const body = `
    <path d="M6 22 C 14 14, 30 12, 42 16 L 54 14 L 44 20 C 36 26, 18 28, 6 22 Z" fill="${INK}"/>
    <path d="M18 22 C 24 26, 34 26, 40 20" fill="${DIEP}"/>
    <path d="M24 16 C 22 2, 40 -2, 46 4 C 38 6, 32 12, 30 18 Z" fill="${INK}" stroke="${DIEP}" stroke-width="1"/>
    <path d="M6 22 L -20 30 L -18 26 L 4 20 Z" fill="${INK}"/>
    <circle cx="44" cy="16" r="1.4" fill="${DIEP}"/>`;
  return { svg: svg(76, 34, `<g transform="translate(22 2)">${body}</g>`), w: 76, h: 34 };
}

export function cometSvg() {
  const body = `
    <path d="M10 60 C 60 50, 110 34, 150 24 C 116 40, 70 58, 10 66 Z" fill="${CHAM}" opacity="0.8"/>
    <path d="M30 56 C 80 44, 120 30, 150 24 C 124 38, 84 52, 30 60 Z" fill="${DIEP}" opacity="0.9"/>
    <circle cx="152" cy="24" r="10" fill="${DIEP}" stroke="${INK}" stroke-width="2"/>`;
  return { svg: svg(170, 72, body), w: 170, h: 72 };
}

/* ---------------------------------------------------------------- loading */

export interface Sprite {
  img: HTMLImageElement;
  w: number;
  h: number;
  ready: boolean;
}

export function sprite(def: { svg: string; w: number; h: number }): Sprite {
  const img = new Image();
  const s: Sprite = { img, w: def.w, h: def.h, ready: false };
  img.onload = () => (s.ready = true);
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(def.svg);
  return s;
}
