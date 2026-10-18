// The kite collection: every kite has its own traditional shape, tail and way of flying.
// All art shares one frame (120 × 220) with the bridle at (60, 104), so the sky can fly any of them the same way.

export type TailKind = 'ribbon' | 'streamer' | 'tassel' | 'feather' | 'dragon';

export interface Tail {
  kind: TailKind;
  /** Where the tail hangs from, in the kite frame. */
  at: [number, number];
  color: string;
  /** Bows on a ribbon, the second colour of a tassel or feather. */
  color2?: string;
  /** Length in kite-frame units. */
  length: number;
}

export interface KiteArt {
  /** The sail, outlines and decoration, as SVG markup inside the 120 × 220 frame. */
  sail: string;
  /** The top of the kite, where the bamboo flutes sit. */
  top: number;
  tails: Tail[];
  /** How much the kite rocks in the wind (1 = the classic diều sáo). */
  sway: number;
  /** Wing beat for bird and butterfly kites: 0 for rigid frames. */
  flap: number;
}

const INK = '#1f1b16';
const O = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"`;

function star5(cx: number, cy: number, R: number, r: number, rot = -Math.PI / 2) {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    p.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${p.join('L')}Z`;
}

const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(120 - Number(x)).toFixed(1)} ${y}`);

/* ---------------------------------------------------------------- shared drawing pieces */

/** A bamboo spar: dark cane with a lit edge, so the frame reads as real wood under the paper. */
const bamboo = (d: string, w = 3.2) =>
  `<path d="${d}" stroke="#5e3b1c" stroke-width="${w}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#d9a65a" stroke-width="${(w * 0.4).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
/** The lashing where two spars cross. */
const knot = (x: number, y: number, c = '#c0392b') =>
  `<circle cx="${x}" cy="${y}" r="3.4" fill="${c}" stroke="${INK}" stroke-width="1.4"/><path d="M${x - 2.4} ${y - 2.4} L${x + 2.4} ${y + 2.4} M${x + 2.4} ${y - 2.4} L${x - 2.4} ${y + 2.4}" stroke="#fff3d6" stroke-width="1" opacity=".8"/>`;
/** A stitched hem a little inside the edge. */
const hem = (d: string, c: string, w = 1.5) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="3.5 3" stroke-linecap="round"/>`;
/** Light falling on the paper from the upper left. */
const sheen = (d: string, o = 0.18) => `<path d="${d}" fill="#fff" opacity="${o}"/>`;

/** A shape scaled about a point: insets for hems and borders. */
function inset(d: string, k: number, cx = 60, cy = 110) {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(cx + (Number(x) - cx) * k).toFixed(1)} ${(cy + (Number(y) - cy) * k).toFixed(1)}`);
}

/** A cloud scroll, the curling mây of temple carvings and old paper kites. */
function curl(cx: number, cy: number, r: number, dir = 1) {
  const pts: string[] = [];
  const turns = 1.35 * Math.PI * 2;
  for (let i = 0; i <= 28; i++) {
    const u = i / 28;
    const a = dir * u * turns + Math.PI;
    const rr = r * (1 - u * 0.78);
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

/** Interpolates two cubic edges of a leaf-like sail, for veins and inner bands that follow its outline. */
function between(a: number[], b: number[], f: number) {
  return a.map((v, i) => +(v + (b[i] - v) * f).toFixed(1));
}

/* ---------------------------------------------------------------- the kites */

// Diều sáo: the classic leaf of the northern villages, red paper, a gold heart and a lotus sun.
const sonOut = 'M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z';
const son: KiteArt = {
  top: 30,
  sway: 1,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 214], color: '#b8321f', color2: '#f2b630', length: 120 }],
  sail: `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2523a"/><stop offset="1" stop-color="#9c2416"/></linearGradient>
      <linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd877"/><stop offset="1" stop-color="#e09a1f"/></linearGradient>
    </defs>
    <path d="${sonOut}" fill="url(#g)" ${O}/>
    ${hem(inset(sonOut, 0.88, 60, 116), '#ffd36b')}
    <path d="M60 64 C 84 82, 88 120, 60 172 C 32 120, 36 82, 60 64 Z" fill="url(#h)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
    <g fill="#fff4d2" stroke="#9c2416" stroke-width="1.2">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="60" cy="113" rx="4.4" ry="10" transform="rotate(${a} 60 124)"/>`).join('')}
    </g>
    <circle cx="60" cy="124" r="8.5" fill="#c0392b" stroke="${INK}" stroke-width="1.6"/>
    <circle cx="60" cy="124" r="3.6" fill="#ffd36b"/>
    <g fill="#ffd36b"><circle cx="60" cy="52" r="2.4"/><circle cx="60" cy="186" r="2.4"/><circle cx="60" cy="196" r="1.6"/></g>
    ${sheen('M60 34 C 34 52, 26 92, 38 140 C 34 100, 40 64, 60 40 Z')}
    ${bamboo('M60 30 L60 214')}${bamboo('M20 100 Q60 86 100 100', 2.6)}
    ${knot(60, 93)}`,
};

// Diều mây: a diamond of open sky with the curling clouds of old carvings.
const mayOut = 'M60 24 L108 96 L60 212 L12 96 Z';
const cloud = (x: number, y: number, s: number, flip = 1) => `
    <g transform="translate(${x} ${y}) scale(${s * flip} ${s})">
      <path d="M-22 6 C -30 6, -32 -6, -22 -8 C -22 -18, -8 -22, -2 -14 C 4 -24, 22 -22, 22 -8 C 32 -8, 32 6, 22 6 Z" fill="#fff" stroke="#8cc6ee" stroke-width="1.4"/>
      <path d="${curl(-12, -6, 7, 1)}" fill="none" stroke="#7fbbe6" stroke-width="1.6" stroke-linecap="round"/>
      <path d="${curl(10, -8, 8, -1)}" fill="none" stroke="#7fbbe6" stroke-width="1.6" stroke-linecap="round"/>
    </g>`;
const may: KiteArt = {
  top: 24,
  sway: 1.1,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 212], color: '#5fb3ec', color2: '#ffffff', length: 140 }],
  sail: `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad7fb"/><stop offset=".55" stop-color="#4fa6e6"/><stop offset="1" stop-color="#2c74c4"/></linearGradient>
      <clipPath id="c"><path d="${mayOut}"/></clipPath>
    </defs>
    <path d="${mayOut}" fill="url(#g)"/>
    <g clip-path="url(#c)">
      <circle cx="84" cy="66" r="11" fill="#fff6c8" opacity=".95"/><circle cx="84" cy="66" r="18" fill="#fff6c8" opacity=".25"/>
      ${cloud(40, 92, 0.95)}${cloud(80, 140, 0.85, -1)}${cloud(52, 178, 0.6)}
      ${sheen('M60 24 L12 96 L36 96 Z', 0.2)}
    </g>
    <path d="${mayOut}" fill="none" ${O}/>
    ${hem(inset(mayOut, 0.86, 60, 104), '#ffffff', 1.4)}
    ${bamboo('M60 24 L60 212')}${bamboo('M12 96 L108 96', 2.6)}
    ${knot(60, 96, '#2c74c4')}`,
};

// Diều khinh khí cầu: a striped balloon with its gores, a gold belt and a woven basket.
const cauOut = 'M60 22 C 100 22, 112 60, 104 98 C 98 126, 76 144, 70 160 L50 160 C 44 144, 22 126, 16 98 C 8 60, 20 22, 60 22 Z';
const gore = (k: number) => `M60 22 C ${60 + k * 1.15} 40, ${60 + k * 1.2} 110, ${60 + k * 0.22} 160`;
const goreC = (k: number) => [60 + k * 1.15, 40, 60 + k * 1.2, 110, 60 + k * 0.22, 160];
const stripe = (a: number, b: number, c: string) => {
  const p = goreC(a), q = goreC(b);
  return `<path d="M60 22 C ${p[0]} ${p[1]}, ${p[2]} ${p[3]}, ${p[4]} ${p[5]} L${q[4]} ${q[5]} C ${q[2]} ${q[3]}, ${q[0]} ${q[1]}, 60 22 Z" fill="${c}"/>`;
};
const cau: KiteArt = {
  top: 20,
  sway: 0.7,
  flap: 0,
  tails: [{ kind: 'tassel', at: [60, 198], color: '#e5533d', color2: '#f5c242', length: 46 }],
  sail: `
    <defs>
      <clipPath id="c"><path d="${cauOut}"/></clipPath>
      <radialGradient id="sh" cx=".32" cy=".26" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a1a10" stop-opacity=".28"/></radialGradient>
    </defs>
    <g clip-path="url(#c)">
      <rect x="0" y="0" width="120" height="170" fill="#e5533d"/>
      ${stripe(-48, -24, '#fbf1dc')}${stripe(-24, -8, '#3a8fd8')}${stripe(-8, 8, '#f5c242')}${stripe(8, 24, '#3a8fd8')}${stripe(24, 48, '#fbf1dc')}
      <g stroke="${INK}" stroke-width="1.1" fill="none" opacity=".45">${[-48, -24, -8, 8, 24, 48].map((k) => `<path d="${gore(k)}"/>`).join('')}</g>
      <path d="M0 96 Q60 112 120 96 L120 106 Q60 122 0 106 Z" fill="#c0392b" stroke="${INK}" stroke-width="1.4"/>
      <g fill="#ffd36b">${[14, 28, 44, 60, 76, 92, 106].map((x) => `<circle cx="${x}" cy="${(103 + 8 * Math.sin((x / 120) * Math.PI)).toFixed(1)}" r="1.9"/>`).join('')}</g>
      <rect x="0" y="0" width="120" height="170" fill="url(#sh)"/>
    </g>
    <path d="${cauOut}" fill="none" ${O}/>
    <path d="M48 154 L72 154 L70 162 L50 162 Z" fill="#7a2a1a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M50 162 L46 176 M70 162 L74 176 M56 162 L54 176 M64 162 L66 176" stroke="${INK}" stroke-width="1.5"/>
    <path d="M42 176 L78 176 L75 198 L45 198 Z" fill="#b8803f" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M43 183 H77 M44 190 H76" stroke="#6e4618" stroke-width="1.6"/>
    <path d="M50 176 V198 M56 176 V198 M62 176 V198 M68 176 V198" stroke="#6e4618" stroke-width="1.1" opacity=".7"/>
    <rect x="40" y="173" width="40" height="5" rx="2.5" fill="#d9a65a" stroke="${INK}" stroke-width="1.6"/>`,
};

// Diều lá tre: one long bamboo leaf with its parallel veins, the way children fold them in the fields.
const leafR = [60, 16, 96, 58, 92, 140, 62, 216];
const leafL = [60, 16, 26, 62, 28, 150, 62, 216];
const leafM = [60, 16, 63, 72, 66, 150, 62, 216];
const vein = (a: number[]) => `M${a[0]} ${a[1]} C ${a[2]} ${a[3]}, ${a[4]} ${a[5]}, ${a[6]} ${a[7]}`;
const leafOut = `M60 16 C 96 58, 92 140, 62 216 C 28 150, 26 62, 60 16 Z`;
const chuoi: KiteArt = {
  top: 16,
  sway: 1.25,
  flap: 0,
  tails: [
    { kind: 'streamer', at: [61, 214], color: '#c8e88a', length: 120 },
    { kind: 'streamer', at: [61, 214], color: '#4f9a4f', length: 100 },
  ],
  sail: `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ad46e"/><stop offset=".55" stop-color="#4c9a4a"/><stop offset="1" stop-color="#235f33"/></linearGradient>
      <clipPath id="c"><path d="${leafOut}"/></clipPath>
    </defs>
    <path d="${leafOut}" fill="url(#g)"/>
    <g clip-path="url(#c)">
      <path d="${vein(leafL)} L60 216 C ${between(leafL, leafM, 0.5).slice(4, 6).join(' ')}, ${between(leafL, leafM, 0.5).slice(2, 4).join(' ')}, 60 16 Z" fill="#d6f0a0" opacity=".28"/>
      <g fill="none" stroke="#1f5a2c" stroke-linecap="round">
        ${[0.3, 0.6].map((f) => `<path d="${vein(between(leafM, leafR, f))}" stroke-width="1.1" opacity=".55"/><path d="${vein(between(leafM, leafL, f))}" stroke-width="1.1" opacity=".55"/>`).join('')}
        ${[0.15, 0.45, 0.78].map((f) => `<path d="${vein(between(leafM, leafR, f))}" stroke-width=".6" opacity=".35"/><path d="${vein(between(leafM, leafL, f))}" stroke-width=".6" opacity=".35"/>`).join('')}
      </g>
      <path d="M44 96 C 46 70, 52 48, 60 30" stroke="#f2ffd8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".45"/>
      <ellipse cx="74" cy="132" rx="3.2" ry="4" fill="#e8fbff" opacity=".85"/><circle cx="73" cy="130.6" r="1.1" fill="#fff"/>
    </g>
    <path d="${leafOut}" fill="none" ${O}/>
    <path d="${vein(leafM)}" stroke="#d9efa6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="${vein(leafM)}" stroke="#1f5a2c" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".6"/>
    ${bamboo('M32 100 Q60 90 88 100', 2.4)}
    ${knot(63, 95, '#e2a72e')}`,
};

// Diều đêm: a hexagon of night sky with a crescent moon and the Big Dipper, sao Bắc Đẩu.
const demOut = 'M60 22 L102 62 L102 142 L60 212 L18 142 L18 62 Z';
const dipper: [number, number][] = [[30, 150], [42, 158], [54, 156], [64, 166], [66, 184], [84, 186], [86, 168]];
const dem: KiteArt = {
  top: 22,
  sway: 0.9,
  flap: 0,
  tails: [{ kind: 'tassel', at: [60, 212], color: '#f3dc8a', color2: '#e2a72e', length: 56 }],
  sail: `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c4a86"/><stop offset=".6" stop-color="#14254a"/><stop offset="1" stop-color="#080f24"/></linearGradient>
      <radialGradient id="m"><stop offset="0" stop-color="#fff4c2" stop-opacity=".55"/><stop offset="1" stop-color="#fff4c2" stop-opacity="0"/></radialGradient>
      <clipPath id="c"><path d="${demOut}"/></clipPath>
    </defs>
    <path d="${demOut}" fill="url(#g)"/>
    <g clip-path="url(#c)">
      <circle cx="62" cy="96" r="40" fill="url(#m)"/>
      <path d="M72 70 A 28 28 0 1 0 72 124 A 22 22 0 1 1 72 70 Z" fill="#f6dc86" stroke="#c99a3a" stroke-width="1"/>
      <g fill="#d9b55a" opacity=".55"><circle cx="50" cy="88" r="2.6"/><circle cx="46" cy="104" r="1.8"/><circle cx="54" cy="114" r="2"/></g>
      <path d="M${dipper.map(([x, y]) => `${x} ${y}`).join(' L')} L84 186" stroke="#bcd2ff" stroke-width=".9" fill="none" opacity=".6" stroke-dasharray="2 2.5"/>
      <g fill="#fff8d6">${dipper.map(([x, y], i) => `<path d="${star5(x, y, i === 0 ? 4.2 : 3.2, 1.4)}"/>`).join('')}</g>
      <path d="${star5(86, 54, 6.5, 2.6)}" fill="#fff6c8"/>
      <g fill="#fff">${[[30, 72, 1.2], [38, 58, 0.9], [92, 100, 1.1], [26, 118, 1], [88, 130, 0.8], [50, 136, 0.9], [76, 150, 1], [40, 186, 0.8], [62, 196, 1.1], [94, 80, 0.7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <path d="M18 200 C 34 190, 46 198, 60 192 C 74 186, 86 194, 102 186 L102 220 L18 220 Z" fill="#2c4a86" opacity=".55"/>
    </g>
    <path d="${demOut}" fill="none" ${O}/>
    ${hem(inset(demOut, 0.9, 60, 117), '#f3dc8a', 1.4)}
    ${hem(inset(demOut, 0.82, 60, 117), '#f3dc8a', 0.8)}
    ${bamboo('M60 22 L60 212', 2.8)}${bamboo('M18 102 L102 102', 2.4)}
    ${knot(60, 102, '#e2a72e')}`,
};

// Diều ông sao: the Mid-Autumn star lantern, red cellophane on a bamboo star, lit from inside.
const SP = (() => {
  const p: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? 25 : 58;
    p.push([+(60 + Math.cos(a) * rr).toFixed(1), +(100 + Math.sin(a) * rr).toFixed(1)]);
  }
  return p;
})();
const fringe = (x: number, y: number, ang: number) => {
  const out: string[] = [];
  for (let j = -2; j <= 2; j++) {
    const a = ang + j * 0.16;
    out.push(`M${x} ${y} L${(x + Math.cos(a) * 13).toFixed(1)} ${(y + Math.sin(a) * 13).toFixed(1)}`);
  }
  return `<path d="${out.join(' ')}" stroke="#ffd36b" stroke-width="1.6" stroke-linecap="round"/>`;
};
const ongsao: KiteArt = {
  top: 44,
  sway: 0.85,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 134], color: '#ffd36b', color2: '#d6402a', length: 150 }],
  sail: `
    <defs>
      <radialGradient id="l" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset=".45" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    </defs>
    ${SP.filter((_, i) => i % 2 === 0 && i > 0).map(([x, y]) => fringe(x, y, Math.atan2(y - 100, x - 60))).join('')}
    ${SP.map(([x, y], i) => {
      const [x2, y2] = SP[(i + 1) % 10];
      return `<path d="M60 100 L${x} ${y} L${x2} ${y2} Z" fill="${i % 2 ? '#e2382a' : '#ff6a4a'}"/>`;
    }).join('')}
    <circle cx="60" cy="100" r="40" fill="url(#l)"/>
    <path d="M${SP.map(([x, y]) => `${x} ${y}`).join(' L')} Z" fill="none" ${O}/>
    <g>${SP.filter((_, i) => i % 2 === 0).map(([x, y]) => bamboo(`M60 100 L${x} ${y}`, 2)).join('')}</g>
    <path d="M${SP.map(([x, y]) => `${x} ${y}`).join(' L')} Z" fill="none" stroke="#d9a65a" stroke-width="1" opacity=".8"/>
    <path d="M57 114 Q60 104 63 114 Q60 117 57 114 Z" fill="#fff" opacity=".95"/>
    <rect x="57" y="114" width="6" height="8" rx="1.5" fill="#f6efe0" stroke="${INK}" stroke-width="1.2"/>
    ${knot(60, 100, '#f2b630')}`,
};

// Diều trăng: the full moon of Tết Trung thu, with chú Cuội resting under the banyan.
const trang: KiteArt = {
  top: 44,
  sway: 0.75,
  flap: 0,
  tails: [
    { kind: 'streamer', at: [38, 150], color: '#fff3c4', length: 110 },
    { kind: 'streamer', at: [82, 150], color: '#ffe38a', length: 120 },
  ],
  sail: `
    <defs>
      <radialGradient id="g" cx=".38" cy=".32" r=".78"><stop offset="0" stop-color="#fffbe6"/><stop offset=".55" stop-color="#f9dc7a"/><stop offset="1" stop-color="#dc9a26"/></radialGradient>
      <clipPath id="c"><circle cx="60" cy="104" r="60"/></clipPath>
    </defs>
    <circle cx="60" cy="104" r="60" fill="url(#g)"/>
    <g clip-path="url(#c)">
      <g fill="#d99a24" opacity=".28"><circle cx="30" cy="74" r="9"/><circle cx="90" cy="136" r="12"/><circle cx="84" cy="62" r="6"/><circle cx="36" cy="142" r="7"/><circle cx="100" cy="98" r="5"/></g>
      <g fill="none" stroke="#c9861c" stroke-width="1" opacity=".35"><circle cx="30" cy="74" r="9"/><circle cx="90" cy="136" r="12"/></g>
      <g fill="#a86a14" opacity=".62">
        <path d="M58 140 C 58 124, 57 112, 60 100 L64 100 C 66 112, 66 126, 68 140 Z"/>
        <path d="M60 116 C 52 112, 46 112, 40 116 M64 112 C 72 108, 78 110, 82 114" stroke="#a86a14" stroke-width="3" stroke-linecap="round"/>
        <circle cx="62" cy="80" r="17"/><circle cx="46" cy="90" r="12"/><circle cx="78" cy="90" r="12"/><circle cx="52" cy="72" r="10"/><circle cx="72" cy="70" r="10"/><circle cx="62" cy="64" r="9"/>
        <path d="M40 98 L40 112 M48 100 L47 118 M76 100 L77 116 M84 98 L84 110" stroke="#a86a14" stroke-width="1.2"/>
        <circle cx="78" cy="128" r="3.6"/><path d="M74.5 132 Q78 129 81.5 132 L82 141 L74 141 Z"/><path d="M82 136 L88 134" stroke="#a86a14" stroke-width="2" stroke-linecap="round"/>
        <path d="M40 142 C 52 138, 70 138, 96 144 L96 150 L40 150 Z"/>
      </g>
      ${sheen('M20 70 C 30 46, 52 36, 72 40 C 50 44, 32 58, 24 84 Z', 0.4)}
    </g>
    <circle cx="60" cy="104" r="60" fill="none" ${O}/>
    ${hem('M60 50 A 54 54 0 1 1 59.9 50 Z', '#fff7d0', 1.3)}
    ${bamboo('M60 44 L60 164', 2.6)}${bamboo('M4 104 L116 104', 2.2)}
    ${knot(60, 104, '#e2a72e')}`,
};

// Diều Ngân Hà: a swallow, cánh én, carrying the Milky Way across its wings.
const nganWing = 'M60 28 C 68 38, 72 50, 73 62 C 88 52, 106 50, 120 58 C 112 80, 94 100, 72 112 L 70 146 C 78 170, 86 196, 94 214 C 80 204, 68 186, 60 168 C 52 186, 40 204, 26 214 C 34 196, 42 170, 50 146 L 48 112 C 26 100, 8 80, 0 58 C 14 50, 32 52, 47 62 C 48 50, 52 38, 60 28 Z';
const ngan: KiteArt = {
  top: 24,
  sway: 1.1,
  flap: 0.04,
  tails: [
    { kind: 'streamer', at: [26, 212], color: '#c8b6ff', length: 90 },
    { kind: 'streamer', at: [94, 212], color: '#9fd8ff', length: 90 },
  ],
  sail: `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d62e0"/><stop offset=".5" stop-color="#3a2a92"/><stop offset="1" stop-color="#1a1250"/></linearGradient>
      <linearGradient id="mw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e6ddff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="c"><path d="${nganWing}"/></clipPath>
    </defs>
    <path d="${nganWing}" fill="url(#g)"/>
    <g clip-path="url(#c)">
      <path d="M-10 40 C 30 70, 70 110, 130 120 L130 140 C 70 132, 30 92, -10 62 Z" fill="url(#mw)"/>
      <g fill="none" stroke="#a996f0" stroke-width="1.1" opacity=".55">
        <path d="M58 66 C 40 62, 22 60, 6 60 M58 76 C 42 74, 26 76, 12 72 M56 86 C 44 86, 32 90, 22 88"/>
        <path d="M62 66 C 80 62, 98 60, 114 60 M62 76 C 78 74, 94 76, 108 72 M64 86 C 76 86, 88 90, 98 88"/>
      </g>
      <g fill="#fff">${[[18, 66, 1.4], [30, 76, 2], [42, 84, 1.1], [90, 74, 1.8], [104, 64, 1.3], [80, 96, 1.2], [70, 104, 1], [52, 150, 1.1], [66, 160, 1.4], [40, 196, 1.3], [82, 192, 1.5], [96, 112, 0.9], [24, 92, 0.9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <path d="${star5(28, 70, 4.4, 1.7)}" fill="#fff6c8"/><path d="${star5(96, 84, 3.6, 1.4)}" fill="#fff6c8"/><path d="${star5(60, 140, 3.4, 1.4)}" fill="#fff6c8"/>
    </g>
    <path d="${nganWing}" fill="none" ${O}/>
    <path d="M60 30 C 66 38, 69 48, 69 58 C 68 68, 66 74, 60 76 C 54 74, 52 68, 51 58 C 51 48, 54 38, 60 30 Z" fill="#1b1440" stroke="${INK}" stroke-width="1.6"/>
    <path d="M54 60 Q60 70 66 60 Q64 68 60 70 Q56 68 54 60 Z" fill="#d6402a"/>
    <path d="M52 72 Q60 82 68 72 L66 120 Q60 126 54 120 Z" fill="#f4efff" opacity=".9"/>
    <circle cx="56" cy="46" r="2" fill="#fff"/><circle cx="64" cy="46" r="2" fill="#fff"/>
    <circle cx="56.4" cy="46.4" r="1" fill="${INK}"/><circle cx="64.4" cy="46.4" r="1" fill="${INK}"/>
    ${bamboo('M60 30 L60 168', 2.4)}${bamboo('M2 60 Q60 68 118 60', 2.2)}
    ${knot(60, 64, '#9fd8ff')}`,
};

// Diều tinh vân: a butterfly cut from a nebula, eye-spots and a beaded hem of stars.
const bflyUp = 'M58 74 C 40 32, 8 16, 4 44 C 0 72, 22 98, 57 100 Z';
const bflyLow = 'M57 106 C 30 104, 10 130, 20 158 C 30 180, 52 164, 58 122 Z';
const tinhvan: KiteArt = {
  top: 40,
  sway: 0.9,
  flap: 0.1,
  tails: [
    { kind: 'streamer', at: [56, 148], color: '#c8b6ff', length: 150 },
    { kind: 'streamer', at: [64, 148], color: '#9fd8ff', length: 160 },
  ],
  sail: `
    <defs>
      <radialGradient id="u" cx=".3" cy=".45" r=".85"><stop offset="0" stop-color="#c8f2ff"/><stop offset=".35" stop-color="#8a62ec"/><stop offset=".75" stop-color="#3a2a9a"/><stop offset="1" stop-color="#18205e"/></radialGradient>
      <radialGradient id="l" cx=".4" cy=".35" r=".85"><stop offset="0" stop-color="#ffc8ee"/><stop offset=".45" stop-color="#a456d8"/><stop offset="1" stop-color="#22185e"/></radialGradient>
      <radialGradient id="e"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#ffb8e8"/><stop offset=".7" stop-color="#2a1a6a"/><stop offset="1" stop-color="#2a1a6a" stop-opacity="0"/></radialGradient>
    </defs>
    <path d="${bflyUp}" fill="url(#u)" ${O}/><path d="${mirror(bflyUp)}" fill="url(#u)" ${O}/>
    <path d="${bflyLow}" fill="url(#l)" ${O}/><path d="${mirror(bflyLow)}" fill="url(#l)" ${O}/>
    ${hem(inset(bflyUp, 0.86, 34, 66), '#e6dcff', 1)}${hem(inset(mirror(bflyUp), 0.86, 86, 66), '#e6dcff', 1)}
    <g stroke="#e6dcff" stroke-width="1.1" fill="none" opacity=".5">
      <path d="M56 80 Q34 52 12 44 M56 88 Q30 76 8 70 M56 96 Q36 92 18 88"/><path d="M64 80 Q86 52 108 44 M64 88 Q90 76 112 70 M64 96 Q84 92 102 88"/>
      <path d="M56 112 Q36 124 26 146 M64 112 Q84 124 94 146"/>
    </g>
    <circle cx="26" cy="58" r="10" fill="url(#e)"/><circle cx="94" cy="58" r="10" fill="url(#e)"/>
    <circle cx="26" cy="58" r="3" fill="#2a1a6a"/><circle cx="94" cy="58" r="3" fill="#2a1a6a"/>
    <circle cx="34" cy="146" r="6.5" fill="url(#e)"/><circle cx="86" cy="146" r="6.5" fill="url(#e)"/>
    <g fill="#fff">${[[12, 40, 1.6], [8, 54, 1.2], [6, 70, 1.4], [14, 84, 1.1], [108, 40, 1.6], [112, 54, 1.2], [114, 70, 1.4], [106, 84, 1.1], [22, 156, 1.3], [30, 168, 1.1], [98, 156, 1.3], [90, 168, 1.1], [44, 150, 1], [76, 150, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
    <path d="${star5(40, 82, 4, 1.6)}" fill="#fff6c8"/><path d="${star5(80, 82, 4, 1.6)}" fill="#fff6c8"/>
    <ellipse cx="60" cy="110" rx="6.5" ry="40" fill="#241a5a" ${O}/>
    <path d="M54.5 92 H65.5 M54 104 H66 M54 116 H66 M55 128 H65" stroke="#8a72e0" stroke-width="1.2"/>
    <circle cx="60" cy="72" r="6" fill="#241a5a" stroke="${INK}" stroke-width="2"/>
    <path d="M58 68 C 54 56, 48 46, 42 42 M62 68 C 66 56, 72 46, 78 42" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="42" r="3.5" fill="#ffd66b" stroke="${INK}" stroke-width="1.6"/><circle cx="78" cy="42" r="3.5" fill="#ffd66b" stroke="${INK}" stroke-width="1.6"/>`,
};

// Diều phượng hoàng: the phoenix of palace roofs, layered flame feathers and a crested head.
const phWing = 'M58 68 C 40 48, 16 34, 0 42 C 6 52, 8 58, 6 68 C 16 68, 20 74, 16 84 C 26 82, 32 88, 28 98 C 38 96, 46 102, 46 112 C 52 108, 56 108, 58 110 Z';
const phFeather = (x2: number, y2: number, c: string) =>
  `<path d="M60 118 C ${60 + (x2 - 60) * 0.3 - 8} 150, ${x2 - 8} ${y2 - 30}, ${x2} ${y2} C ${x2 + 8} ${y2 - 30}, ${60 + (x2 - 60) * 0.3 + 8} 150, 60 118 Z" fill="${c}" ${O}/>
   <path d="M60 122 C ${60 + (x2 - 60) * 0.4} 152, ${x2} ${y2 - 40}, ${x2} ${y2 - 10}" stroke="#ffd36b" stroke-width="1.2" fill="none" opacity=".8"/>
   <circle cx="${x2}" cy="${y2 - 16}" r="7" fill="#ffd66b" stroke="${INK}" stroke-width="1.5"/><circle cx="${x2}" cy="${y2 - 16}" r="4" fill="#1f8f6f"/><circle cx="${x2}" cy="${y2 - 16}" r="1.6" fill="#0b3a2e"/>`;
const scallops = (pts: [number, number][], r: number, c: string) => pts.map(([x, y]) => `<path d="M${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y}" fill="none" stroke="${c}" stroke-width="1.3"/>`).join('');
const phuong: KiteArt = {
  top: 24,
  sway: 0.95,
  flap: 0.08,
  tails: [
    { kind: 'feather', at: [36, 200], color: '#ff8a3c', color2: '#ffd36b', length: 110 },
    { kind: 'feather', at: [60, 212], color: '#e5532d', color2: '#ffd36b', length: 140 },
    { kind: 'feather', at: [84, 200], color: '#ff8a3c', color2: '#ffd36b', length: 110 },
  ],
  sail: `
    <defs>
      <linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe08a"/><stop offset=".45" stop-color="#ff8a3c"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
      <linearGradient id="w2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffe08a"/><stop offset=".45" stop-color="#ff8a3c"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
      <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb05a"/><stop offset="1" stop-color="#b8141f"/></linearGradient>
    </defs>
    ${phFeather(36, 200, '#ff8a3c')}${phFeather(84, 200, '#ff8a3c')}${phFeather(60, 212, '#e5532d')}
    <path d="${phWing}" fill="url(#w)" ${O}/><path d="${mirror(phWing)}" fill="url(#w2)" ${O}/>
    <g opacity=".7">
      ${scallops([[44, 70], [36, 66], [28, 62], [20, 58], [12, 54]], 4, '#9e1a14')}
      ${scallops([[46, 82], [38, 79], [30, 77], [22, 76]], 4, '#9e1a14')}
      ${scallops([[48, 94], [40, 92], [33, 92]], 4, '#9e1a14')}
      ${scallops([[76, 70], [84, 66], [92, 62], [100, 58], [108, 54]], 4, '#9e1a14')}
      ${scallops([[74, 82], [82, 79], [90, 77], [98, 76]], 4, '#9e1a14')}
      ${scallops([[72, 94], [80, 92], [87, 92]], 4, '#9e1a14')}
    </g>
    <path d="M8 44 C 22 44, 40 52, 54 70 M112 44 C 98 44, 80 52, 66 70" stroke="#fff3c4" stroke-width="1.6" fill="none" opacity=".6"/>
    <ellipse cx="60" cy="96" rx="14" ry="30" fill="url(#b)" ${O}/>
    ${scallops([[60, 84], [54, 92], [66, 92], [60, 100], [54, 108], [66, 108]], 3.4, '#ffd36b')}
    <path d="M56 43 C 48 32, 42 26, 36 28 M60 41 C 58 30, 58 22, 54 16 M64 43 C 72 32, 78 26, 84 28" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round"/>
    <path d="M56 43 C 48 32, 42 26, 36 28 M60 41 C 58 30, 58 22, 54 16 M64 43 C 72 32, 78 26, 84 28" stroke="#ffd36b" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="28" r="3" fill="#e5532d" stroke="${INK}" stroke-width="1.2"/><circle cx="54" cy="16" r="3" fill="#e5532d" stroke="${INK}" stroke-width="1.2"/><circle cx="84" cy="28" r="3" fill="#e5532d" stroke="${INK}" stroke-width="1.2"/>
    <path d="M60 40 C 70 40, 74 48, 72 58 C 70 66, 64 70, 60 70 C 56 70, 50 66, 48 58 C 46 48, 50 40, 60 40 Z" fill="#ff8a3c" ${O}/>
    <path d="M60 58 L55 66 L60 72 L65 66 Z" fill="#ffd36b" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M51 52 Q55 48 58 52 M62 52 Q65 48 69 52" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="55" cy="53" r="1.6" fill="${INK}"/><circle cx="65" cy="53" r="1.6" fill="${INK}"/>
    <path d="M50 58 C 46 62, 44 66, 46 70 M70 58 C 74 62, 76 66, 74 70" stroke="#c0182a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
};

// Diều rồng ngọc: the jade dragon's head, antlers, flame brows and whiskers, its body the tail.
const rongHead = `
    <defs>
      <radialGradient id="h" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#6ff0c0"/><stop offset="1" stop-color="#0b6a50"/></radialGradient>
      <linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a5a"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
    </defs>
    <path d="M30 96 C 14 86, 10 66, 20 52 C 22 64, 28 70, 34 72 C 30 58, 34 42, 46 36 C 44 48, 48 56, 54 58 L66 58 C 72 56, 76 48, 74 36 C 86 42, 90 58, 86 72 C 92 70, 98 64, 100 52 C 110 66, 106 86, 90 96 Z" fill="url(#m)" ${O}/>
    <path d="M44 50 C 38 36, 30 28, 20 24 C 26 32, 28 36, 28 42 C 24 40, 20 40, 16 42 C 24 44, 30 48, 34 52 M76 50 C 82 36, 90 28, 100 24 C 94 32, 92 36, 92 42 C 96 40, 100 40, 104 42 C 96 44, 90 48, 86 52" stroke="${INK}" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44 50 C 38 36, 30 28, 20 24 C 26 32, 28 36, 28 42 C 24 40, 20 40, 16 42 C 24 44, 30 48, 34 52 M76 50 C 82 36, 90 28, 100 24 C 94 32, 92 36, 92 42 C 96 40, 100 40, 104 42 C 96 44, 90 48, 86 52" stroke="#f5c242" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60 52 C 86 52, 94 74, 92 92 C 90 112, 78 124, 60 124 C 42 124, 30 112, 28 92 C 26 74, 34 52, 60 52 Z" fill="url(#h)" ${O}/>
    ${scallops([[60, 60], [52, 62], [68, 62], [60, 66], [46, 66], [74, 66]], 3.4, '#0b5a44')}
    <path d="M34 74 C 40 64, 50 64, 56 72 C 50 70, 44 70, 40 74 Z M86 74 C 80 64, 70 64, 64 72 C 70 70, 76 70, 80 74 Z" fill="#f5c242" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="46" cy="84" rx="9" ry="9.5" fill="#fffbe8" ${O}/><ellipse cx="74" cy="84" rx="9" ry="9.5" fill="#fffbe8" ${O}/>
    <circle cx="47" cy="85" r="5" fill="#e2a72e"/><circle cx="73" cy="85" r="5" fill="#e2a72e"/>
    <ellipse cx="47" cy="85" rx="1.6" ry="4.2" fill="${INK}"/><ellipse cx="73" cy="85" rx="1.6" ry="4.2" fill="${INK}"/>
    <circle cx="49" cy="82" r="1.5" fill="#fff"/><circle cx="75" cy="82" r="1.5" fill="#fff"/>
    <ellipse cx="60" cy="104" rx="17" ry="11.5" fill="#2fbf8f" ${O}/>
    <path d="M51 100 Q54 97 57 101 M63 101 Q66 97 69 100" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M45 116 Q60 126 75 116 Q68 122 60 122 Q52 122 45 116 Z" fill="#c0182a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M48 116.6 L51 122 L54 118.4 M72 116.6 L69 122 L66 118.4" fill="#fff" stroke="${INK}" stroke-width="1"/>
    <path d="M44 106 C 30 106, 18 116, 8 134 C 14 130, 18 132, 20 136 M76 106 C 90 106, 102 116, 112 134 C 106 130, 102 132, 100 136" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <path d="M44 106 C 30 106, 18 116, 8 134 C 14 130, 18 132, 20 136 M76 106 C 90 106, 102 116, 112 134 C 106 130, 102 132, 100 136" stroke="#f5c242" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="58" r="5" fill="#eaf7ff" stroke="${INK}" stroke-width="1.8"/><circle cx="58.6" cy="56.6" r="1.6" fill="#fff"/>`;
const rong: KiteArt = {
  top: 30,
  sway: 0.7,
  flap: 0,
  tails: [{ kind: 'dragon', at: [60, 124], color: '#2fbf8f', color2: '#f5c242', length: 200 }],
  sail: rongHead,
};

export const KITES: Record<string, KiteArt> = { son, may, cau, chuoi, dem, ongsao, trang, ngan, tinhvan, phuong, rong };

export function kiteArt(id: string): KiteArt {
  return KITES[id] ?? son;
}

/** The sail alone, as a full SVG document (4× resolution so it stays crisp when drawn large). */
export function sailSvg(id: string, scale = 4) {
  const k = kiteArt(id);
  // Ids inside one kite must not clash with another kite drawn on the same page.
  const body = k.sail.replace(/id="(\w+)"/g, `id="${id}-$1"`).replace(/url\(#(\w+)\)/g, `url(#${id}-$1)`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${120 * scale}" height="${220 * scale}" viewBox="0 0 120 220">${body}</svg>`;
}

/* ---------------------------------------------------------------- tails as static SVG for previews */

/** A tail caught mid-flutter: a gentle S that drifts to one side, as it hangs on a still afternoon. */
function tailPath(x0: number, y0: number, length: number, phase = 0): [number, number][] {
  const n = 12;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([x0 + Math.sin(u * 4.4 + phase) * (2 + 11 * u) - u * 10, y0 + u * length]);
  }
  return pts;
}
const smooth = (pts: [number, number][]) => {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx.toFixed(1)} ${ly.toFixed(1)}`;
};

function tailSvg(t: Tail, k: number): string {
  const [x0, y0] = t.at;
  if (t.kind === 'ribbon') {
    const pts = tailPath(x0, y0, t.length, k);
    const d = smooth(pts);
    const bows = pts
      .filter((_, i) => i && i % 3 === 0)
      .map(([x, y]) => {
        const X = x.toFixed(1), Y = y.toFixed(1);
        return `<g transform="translate(${X} ${Y}) rotate(${(Math.sin(y) * 14).toFixed(0)})"><path d="M0 0 C -4 -6, -10 -6, -10 0 C -10 6, -4 6, 0 0 Z M0 0 C 4 -6, 10 -6, 10 0 C 10 6, 4 6, 0 0 Z" fill="${t.color2}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/><circle r="2" fill="${t.color}" stroke="${INK}" stroke-width="1"/></g>`;
      })
      .join('');
    return `<path d="${d}" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".55"/><path d="${d}" stroke="${t.color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>${bows}`;
  }
  if (t.kind === 'streamer') {
    const pts = tailPath(x0, y0, t.length, k * 1.7);
    const a = smooth(pts);
    const b = smooth(pts.map(([x, y], i) => [x + 3 + i * 0.25, y + 2] as [number, number]).reverse());
    return `<path d="${a} L${(pts[pts.length - 1][0] + 1).toFixed(1)} ${(pts[pts.length - 1][1] + 6).toFixed(1)} ${b.replace(/^M/, 'L')} Z" fill="${t.color}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round" opacity=".95"/>`;
  }
  if (t.kind === 'tassel') {
    return (
      `<rect x="${x0 - 5}" y="${y0 - 2}" width="10" height="7" rx="2.5" fill="${t.color2}" stroke="${INK}" stroke-width="1.3"/>` +
      [-7, -4.5, -2, 0.5, 3, 5.5, 8]
        .map((dx, i) => `<path d="M${x0 + dx * 0.4} ${y0 + 5} Q${x0 + dx} ${y0 + t.length * 0.5} ${x0 + dx * 1.5} ${y0 + t.length}" stroke="${i % 2 ? t.color2 : t.color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`)
        .join('')
    );
  }
  if (t.kind === 'feather') {
    const pts = tailPath(x0, y0, t.length, k * 2.1);
    const d = smooth(pts);
    const [ex, ey] = pts[pts.length - 1];
    return `<path d="${d}" stroke="${INK}" stroke-width="5.4" fill="none" stroke-linecap="round" opacity=".5"/><path d="${d}" stroke="${t.color}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M${ex} ${ey - 6} C ${ex - 8} ${ey + 2}, ${ex - 4} ${ey + 12}, ${ex} ${ey + 16} C ${ex + 4} ${ey + 12}, ${ex + 8} ${ey + 2}, ${ex} ${ey - 6} Z" fill="${t.color2}" stroke="${INK}" stroke-width="1.3"/><circle cx="${ex}" cy="${ey + 4}" r="2.4" fill="#1f8f6f"/>`;
  }
  // Dragon: scaled body segments with a gold fin on each, largest near the head, ending in a flame tail.
  let s = '';
  const segs: [number, number, number][] = [];
  for (let i = 0; i <= 9; i++) {
    const u = i / 9;
    segs.push([x0 + Math.sin(u * 5.2) * 15, y0 + 8 + u * t.length * 0.64, 14.5 - u * 8]);
  }
  const [tx, ty, tr] = segs[segs.length - 1];
  s += `<path d="M${tx - tr} ${ty} Q${tx - tr * 2.4} ${ty + tr * 3} ${tx + 3} ${ty + tr * 4.4} Q${tx + tr * 2.4} ${ty + tr * 3} ${tx + tr} ${ty} Z" fill="#e5533d" stroke="${INK}" stroke-width="2"/>`;
  for (let i = segs.length - 1; i >= 0; i--) {
    const [x, y, r] = segs[i];
    s += `<path d="M${x - r * 0.4} ${y - r * 0.6} L${x} ${y - r * 1.3} L${x + r * 0.4} ${y - r * 0.6} Z" fill="${t.color2}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
    s += `<path d="M${x - r * 1.5} ${y + 1} L${x - r * 1.5 - 5} ${y + 7} M${x + r * 1.5} ${y + 1} L${x + r * 1.5 + 5} ${y + 7}" stroke="${t.color2}" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r * 0.78}" fill="${i % 2 ? '#24a87e' : t.color}" stroke="${INK}" stroke-width="2.2"/>`;
    s += `<path d="M${x - r * 0.8} ${y} A ${r * 0.4} ${r * 0.3} 0 0 0 ${x} ${y} A ${r * 0.4} ${r * 0.3} 0 0 0 ${x + r * 0.8} ${y}" fill="none" stroke="#0b5a44" stroke-width="1"/>`;
  }
  return s;
}

/** Bamboo flutes on top of the frame, as the sky draws them. */
function flutesSvg(top: number) {
  const y0 = top - 30;
  return [[40, 19, 40, 7], [34, 10, 52, 8], [28, 0, 64, 9]]
    .map(([x, y, w, h]) => `<rect x="${x}" y="${y0 + y - 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#c99b4a" stroke="${INK}" stroke-width="1.8"/><path d="M${x + 4} ${y0 + y + h / 2 - 3.4} H${x + w - 4}" stroke="#f0d08a" stroke-width="1.2" stroke-linecap="round"/><circle cx="${x + w / 2}" cy="${y0 + y + h / 2 - 2}" r="${h / 4}" fill="#5e3b1c"/>`)
    .join('') + `<path d="M60 ${y0 + 26} L60 ${top + 2}" stroke="${INK}" stroke-width="1.6"/>`;
}

/** The whole kite with its tails, for the collection and anywhere a still picture is needed. */
export function previewSvg(id: string, opts: { flutes?: boolean } = {}) {
  const k = kiteArt(id);
  const body = k.sail.replace(/id="(\w+)"/g, `id="p${id}-$1"`).replace(/url\(#(\w+)\)/g, `url(#p${id}-$1)`);
  // Tails drawn shorter than in the sky so the picture stays compact.
  const shorten = (t: Tail) => ({ ...t, length: t.length * (t.kind === 'dragon' ? 0.8 : 0.5) });
  const short = k.tails.map((t, i) => tailSvg(shorten(t), i)).join('');
  const bottom = Math.max(220, ...k.tails.map((t) => t.at[1] + shorten(t).length * (t.kind === 'dragon' ? 0.64 : 1) + (t.kind === 'dragon' ? 60 : 20)));
  const fl = opts.flutes === true;
  const top = fl ? k.top - 34 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 ${top} 136 ${(bottom - top).toFixed(0)}">${short}${fl ? flutesSvg(k.top) : ''}${body}</svg>`;
}
