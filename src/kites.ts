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
const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
const SPAR = `stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none" opacity=".75"`;

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

/* ---------------------------------------------------------------- the kites */

const son: KiteArt = {
  top: 30,
  sway: 1,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 214], color: '#c0392b', color2: '#e2a72e', length: 120 }],
  sail: `
    <path d="M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z" fill="#c0392b" ${O}/>
    <path d="M60 60 C 82 76, 86 118, 60 170 C 34 118, 38 76, 60 60 Z" fill="#e2a72e"/>
    <path d="M60 78 C 72 90, 74 114, 60 146 C 46 114, 48 90, 60 78 Z" fill="#f6d27a" opacity=".7"/>
    <path d="M60 30 L60 214 M18 100 Q60 84 102 100" ${SPAR}/>
    <circle cx="60" cy="104" r="7" fill="#c0392b" ${O}/>`,
};

const may: KiteArt = {
  top: 24,
  sway: 1.1,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 212], color: '#7cc4ff', color2: '#ffffff', length: 140 }],
  sail: `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc0f2"/><stop offset="1" stop-color="#2f7fcc"/></linearGradient>
    <clipPath id="c"><path d="M60 24 L108 96 L60 212 L12 96 Z"/></clipPath></defs>
    <path d="M60 24 L108 96 L60 212 L12 96 Z" fill="url(#g)"/>
    <g clip-path="url(#c)" fill="#fff">
      <circle cx="34" cy="86" r="11"/><circle cx="47" cy="80" r="14"/><circle cx="60" cy="88" r="10"/><rect x="28" y="86" width="40" height="11" rx="5.5"/>
      <circle cx="70" cy="140" r="10"/><circle cx="82" cy="134" r="13"/><circle cx="94" cy="142" r="9"/><rect x="64" y="140" width="36" height="10" rx="5"/>
      <circle cx="50" cy="176" r="7" opacity=".9"/><circle cx="59" cy="172" r="9" opacity=".9"/><rect x="45" y="175" width="22" height="7" rx="3.5" opacity=".9"/>
    </g>
    <path d="M60 24 L108 96 L60 212 L12 96 Z" fill="none" ${O}/>
    <path d="M60 24 L60 212 M12 96 L108 96" ${SPAR}/>`,
};

const cau: KiteArt = {
  top: 20,
  sway: 0.7,
  flap: 0,
  tails: [{ kind: 'tassel', at: [60, 198], color: '#e5533d', color2: '#f5c242', length: 46 }],
  sail: `
    <defs><clipPath id="c"><path d="M60 22 C 100 22, 112 60, 104 98 C 98 126, 76 144, 70 160 L50 160 C 44 144, 22 126, 16 98 C 8 60, 20 22, 60 22 Z"/></clipPath>
    <radialGradient id="sh" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <g clip-path="url(#c)">
      <rect x="0" y="0" width="120" height="170" fill="#f5c242"/>
      <path d="M60 10 C 30 40, 26 120, 50 170 L38 170 C 10 120, 8 40, 40 10 Z" fill="#e5533d"/>
      <path d="M60 10 C 90 40, 94 120, 70 170 L82 170 C 110 120, 112 40, 80 10 Z" fill="#e5533d"/>
      <path d="M54 10 L66 10 L66 170 L54 170 Z" fill="#3a8fd8"/>
      <rect x="0" y="0" width="120" height="170" fill="url(#sh)"/>
    </g>
    <path d="M60 22 C 100 22, 112 60, 104 98 C 98 126, 76 144, 70 160 L50 160 C 44 144, 22 126, 16 98 C 8 60, 20 22, 60 22 Z" fill="none" ${O}/>
    <path d="M14 100 Q60 116 106 100" stroke="${INK}" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M51 160 L49 176 M69 160 L71 176" stroke="${INK}" stroke-width="2"/>
    <rect x="44" y="176" width="32" height="22" rx="3" fill="#b07a3e" ${O}/>
    <path d="M44 183 H76 M44 190 H76 M52 176 V198 M60 176 V198 M68 176 V198" stroke="#7a4f22" stroke-width="1.5"/>`,
};

const chuoi: KiteArt = {
  top: 16,
  sway: 1.25,
  flap: 0,
  tails: [
    { kind: 'streamer', at: [61, 214], color: '#bfe27a', length: 120 },
    { kind: 'streamer', at: [61, 214], color: '#5aa85a', length: 100 },
  ],
  sail: `
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc46a"/><stop offset="1" stop-color="#2f7a3f"/></linearGradient></defs>
    <path d="M60 16 C 92 56, 88 140, 62 216 C 30 150, 28 60, 60 16 Z" fill="url(#g)" ${O}/>
    <path d="M60 30 C 54 70, 50 120, 54 180 C 44 130, 44 70, 60 30 Z" fill="#bfe27a" opacity=".45"/>
    <path d="M60 18 C 66 80, 66 150, 62 214" stroke="#1d4f28" stroke-width="2.5" fill="none"/>
    <g stroke="#1d4f28" stroke-width="1.4" fill="none" opacity=".7">
      <path d="M63 60 Q74 64 80 74 M64 90 Q76 94 82 106 M64 120 Q76 124 80 138 M64 150 Q72 154 74 168"/>
      <path d="M62 60 Q50 64 44 74 M63 90 Q50 94 42 106 M63 120 Q50 126 46 140 M63 150 Q54 156 52 170"/>
    </g>
    <path d="M30 100 Q60 90 88 100" ${SPAR}/>`,
};

const dem: KiteArt = {
  top: 22,
  sway: 0.9,
  flap: 0,
  tails: [{ kind: 'tassel', at: [60, 212], color: '#f3dc8a', color2: '#e2a72e', length: 56 }],
  sail: `
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21396a"/><stop offset="1" stop-color="#0b1830"/></linearGradient></defs>
    <path d="M60 22 L102 62 L102 142 L60 212 L18 142 L18 62 Z" fill="url(#g)" ${O}/>
    <path d="M60 32 L94 66 L94 138 L60 198 L26 138 L26 66 Z" fill="none" stroke="#f3dc8a" stroke-width="1.6" stroke-dasharray="4 4" opacity=".8"/>
    <path d="M70 76 A 26 26 0 1 0 70 128 A 20 20 0 1 1 70 76 Z" fill="#f3dc8a"/>
    <path d="${star5(80, 70, 7, 3)}" fill="#fff6c8"/>
    <path d="${star5(36, 150, 5, 2.2)}" fill="#fff6c8"/>
    <path d="${star5(84, 156, 4, 1.8)}" fill="#fff6c8"/>
    <path d="${star5(40, 64, 4, 1.8)}" fill="#fff6c8"/>
    <circle cx="74" cy="114" r="1.6" fill="#fff6c8"/><circle cx="48" cy="178" r="1.4" fill="#fff6c8"/><circle cx="70" cy="180" r="1.8" fill="#fff6c8"/>
    <path d="M60 22 L60 212 M18 102 L102 102" stroke="#f3dc8a" stroke-width="1.6" opacity=".35"/>`,
};

const ongsao: KiteArt = {
  top: 44,
  sway: 0.85,
  flap: 0,
  tails: [{ kind: 'ribbon', at: [60, 134], color: '#ffd36b', color2: '#d6402a', length: 150 }],
  sail: `
    <path d="${star5(60, 100, 58, 25)}" fill="#d6402a" ${O}/>
    <g stroke="#9e2a18" stroke-width="1.6">${[0, 1, 2, 3, 4].map((i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `<line x1="60" y1="100" x2="${(60 + Math.cos(a) * 56).toFixed(1)}" y2="${(100 + Math.sin(a) * 56).toFixed(1)}"/>`;
    }).join('')}</g>
    <path d="${star5(60, 100, 30, 13)}" fill="#ffd36b"/>
    <path d="${star5(60, 100, 14, 6)}" fill="#fff4c2"/>
    <circle cx="60" cy="100" r="4" fill="#d6402a"/>`,
};

const trang: KiteArt = {
  top: 44,
  sway: 0.75,
  flap: 0,
  tails: [
    { kind: 'streamer', at: [38, 150], color: '#fff3c4', length: 110 },
    { kind: 'streamer', at: [82, 150], color: '#ffe38a', length: 120 },
  ],
  sail: `
    <defs><radialGradient id="g" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fff7d0"/><stop offset=".7" stop-color="#f7cf5a"/><stop offset="1" stop-color="#e2a72e"/></radialGradient></defs>
    <circle cx="60" cy="104" r="60" fill="url(#g)" ${O}/>
    <g fill="#d99a24" opacity=".35"><circle cx="34" cy="78" r="8"/><circle cx="86" cy="132" r="10"/><circle cx="80" cy="70" r="5"/><circle cx="40" cy="140" r="6"/></g>
    <g fill="#b9781a" opacity=".55">
      <rect x="58" y="96" width="6" height="40" rx="2"/>
      <circle cx="61" cy="88" r="14"/><circle cx="49" cy="96" r="10"/><circle cx="73" cy="96" r="10"/><circle cx="56" cy="78" r="9"/><circle cx="68" cy="78" r="9"/>
      <circle cx="78" cy="132" r="4"/><rect x="75" y="134" width="6" height="10" rx="3"/>
    </g>
    <circle cx="60" cy="104" r="52" fill="none" stroke="#fff7d0" stroke-width="1.5" opacity=".6"/>`,
};

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
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6ae0"/><stop offset="1" stop-color="#33237a"/></linearGradient></defs>
    <path d="${nganWing}" fill="url(#g)" ${O}/>
    <ellipse cx="60" cy="104" rx="10" ry="30" fill="#c8b6ff" opacity=".8"/>
    <path d="M60 30 C 64 36, 66 44, 66 50 L54 50 C 54 44, 56 36, 60 30 Z" fill="#1b1440"/>
    <g fill="#fff">${[[18, 66, 1.6], [34, 78, 2.2], [88, 76, 2], [104, 64, 1.5], [48, 92, 1.2], [76, 94, 1.3], [40, 196, 1.4], [82, 192, 1.6], [56, 150, 1.2], [66, 160, 1.5]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
      .join('')}</g>
    <path d="${star5(24, 70, 4, 1.6)}" fill="#fff6c8"/><path d="${star5(96, 70, 4, 1.6)}" fill="#fff6c8"/>
    <path d="M60 28 L60 168 M2 60 Q60 66 118 60" ${SPAR}/>`,
};

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
      <radialGradient id="u" cx=".3" cy=".45" r=".8"><stop offset="0" stop-color="#b8ecff"/><stop offset=".45" stop-color="#7a52e0"/><stop offset="1" stop-color="#1c2a7a"/></radialGradient>
      <radialGradient id="l" cx=".4" cy=".4" r=".8"><stop offset="0" stop-color="#ffb8e8"/><stop offset=".5" stop-color="#8a4fd0"/><stop offset="1" stop-color="#241a6a"/></radialGradient>
    </defs>
    <path d="${bflyUp}" fill="url(#u)" ${O}/><path d="${mirror(bflyUp)}" fill="url(#u)" ${O}/>
    <path d="${bflyLow}" fill="url(#l)" ${O}/><path d="${mirror(bflyLow)}" fill="url(#l)" ${O}/>
    <g stroke="#e6dcff" stroke-width="1.2" fill="none" opacity=".55">
      <path d="M56 80 Q34 52 12 44 M56 88 Q30 76 8 70 M56 96 Q36 92 18 88"/><path d="M64 80 Q86 52 108 44 M64 88 Q90 76 112 70 M64 96 Q84 92 102 88"/>
      <path d="M56 112 Q36 124 26 146 M64 112 Q84 124 94 146"/>
    </g>
    <g fill="#fff">${[[22, 50, 2.4], [32, 68, 1.6], [98, 50, 2.4], [88, 68, 1.6], [30, 140, 2], [90, 140, 2], [16, 80, 1.2], [104, 80, 1.2], [44, 150, 1.3], [76, 150, 1.3]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
      .join('')}</g>
    <path d="${star5(24, 58, 5, 2)}" fill="#fff6c8"/><path d="${star5(96, 58, 5, 2)}" fill="#fff6c8"/>
    <ellipse cx="60" cy="110" rx="6" ry="40" fill="#241a5a" ${O}/>
    <path d="M58 72 C 54 56, 48 46, 42 42 M62 72 C 66 56, 72 46, 78 42" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="42" r="3.5" fill="#ffd66b" ${O}/><circle cx="78" cy="42" r="3.5" fill="#ffd66b" ${O}/>`,
};

const phWing = 'M58 68 C 40 48, 16 34, 0 42 C 6 52, 8 58, 6 68 C 16 68, 20 74, 16 84 C 26 82, 32 88, 28 98 C 38 96, 46 102, 46 112 C 52 108, 56 108, 58 110 Z';
const phFeather = (x2: number, y2: number, c: string) =>
  `<path d="M60 118 C ${60 + (x2 - 60) * 0.3 - 8} 150, ${x2 - 8} ${y2 - 30}, ${x2} ${y2} C ${x2 + 8} ${y2 - 30}, ${60 + (x2 - 60) * 0.3 + 8} 150, 60 118 Z" fill="${c}" ${O}/>
   <circle cx="${x2}" cy="${y2 - 16}" r="6" fill="#ffd66b" stroke="${INK}" stroke-width="1.5"/><circle cx="${x2}" cy="${y2 - 16}" r="2.6" fill="#2fbf8f"/>`;
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
      <linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd36b"/><stop offset=".5" stop-color="#ff8a3c"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
      <linearGradient id="w2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffd36b"/><stop offset=".5" stop-color="#ff8a3c"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
      <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a4a"/><stop offset="1" stop-color="#c0182a"/></linearGradient>
    </defs>
    ${phFeather(36, 200, '#ff8a3c')}${phFeather(84, 200, '#ff8a3c')}${phFeather(60, 212, '#e5532d')}
    <path d="${phWing}" fill="url(#w)" ${O}/><path d="${mirror(phWing)}" fill="url(#w2)" ${O}/>
    <g stroke="#9e1a14" stroke-width="1.3" fill="none" opacity=".6"><path d="M54 76 Q30 56 8 48 M54 86 Q32 76 12 72 M54 96 Q38 90 22 88 M54 104 Q44 102 36 104"/><path d="M66 76 Q90 56 112 48 M66 86 Q88 76 108 72 M66 96 Q82 90 98 88 M66 104 Q76 102 84 104"/></g>
    <ellipse cx="60" cy="96" rx="14" ry="30" fill="url(#b)" ${O}/>
    <path d="M60 76 Q66 96 60 122 Q54 96 60 76 Z" fill="#ffd36b" opacity=".75"/>
    <circle cx="60" cy="54" r="12" fill="#ff8a3c" ${O}/>
    <path d="M60 32 L55 44 L65 44 Z" fill="#ffd36b" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="55" cy="54" r="2.2" fill="${INK}"/><circle cx="65" cy="54" r="2.2" fill="${INK}"/>
    <path d="M56 43 C 50 34, 44 30, 40 32 M60 42 C 60 32, 58 26, 54 22 M64 43 C 70 34, 76 30, 80 32" stroke="#ffd36b" stroke-width="3" fill="none" stroke-linecap="round"/>`,
};

const rongHead = `
    <path d="M30 96 C 14 86, 10 66, 20 52 C 22 64, 28 70, 34 72 C 30 58, 34 42, 46 36 C 44 48, 48 56, 54 58 L66 58 C 72 56, 76 48, 74 36 C 86 42, 90 58, 86 72 C 92 70, 98 64, 100 52 C 110 66, 106 86, 90 96 Z" fill="#e5533d" ${O}/>
    <path d="M44 50 C 38 36, 30 28, 22 26 C 30 34, 32 40, 34 48 M76 50 C 82 36, 90 28, 98 26 C 90 34, 88 40, 86 48" stroke="#f5c242" stroke-width="5" fill="none" stroke-linecap="round"/>
    <defs><radialGradient id="h" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#5fe0b0"/><stop offset="1" stop-color="#0b6a50"/></radialGradient></defs>
    <path d="M60 52 C 86 52, 94 74, 92 92 C 90 112, 78 124, 60 124 C 42 124, 30 112, 28 92 C 26 74, 34 52, 60 52 Z" fill="url(#h)" ${O}/>
    <ellipse cx="46" cy="82" rx="9" ry="10" fill="#fff" ${O}/><ellipse cx="74" cy="82" rx="9" ry="10" fill="#fff" ${O}/>
    <circle cx="47" cy="84" r="4.5" fill="${INK}"/><circle cx="73" cy="84" r="4.5" fill="${INK}"/><circle cx="48.5" cy="82.5" r="1.5" fill="#fff"/><circle cx="74.5" cy="82.5" r="1.5" fill="#fff"/>
    <path d="M38 70 Q46 64 54 70 M66 70 Q74 64 82 70" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="104" rx="16" ry="11" fill="#2fbf8f" ${O}/>
    <circle cx="54" cy="102" r="2.2" fill="${INK}"/><circle cx="66" cy="102" r="2.2" fill="${INK}"/>
    <path d="M46 116 Q60 124 74 116" stroke="${INK}" stroke-width="2.5" fill="#c0182a"/>
    <path d="M48 116 L51 121 L54 117 M72 116 L69 121 L66 117" fill="#fff" stroke="${INK}" stroke-width="1"/>
    <path d="M44 106 C 30 108, 18 118, 10 132 M76 106 C 90 108, 102 118, 110 132" stroke="#f5c242" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="62" r="4" fill="#f5c242" ${O}/>`;
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

function tailSvg(t: Tail, id: string): string {
  const [x0, y0] = t.at;
  const n = 8;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([x0 + Math.sin(u * 5 + x0) * (3 + 10 * u) - u * 8, y0 + u * t.length]);
  }
  const d = 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
  if (t.kind === 'ribbon') {
    const bows = pts
      .filter((_, i) => i && i % 2 === 0)
      .map(([x, y]) => `<path d="M${x} ${y} L${x - 8} ${y - 4} L${x - 8} ${y + 4} Z M${x} ${y} L${x + 8} ${y - 4} L${x + 8} ${y + 4} Z" fill="${t.color2}"/>`)
      .join('');
    return `<path d="${d}" stroke="${t.color}" stroke-width="2.4" fill="none"/>${bows}`;
  }
  if (t.kind === 'streamer') return `<path d="${d}" stroke="${t.color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (t.kind === 'tassel') {
    return [-6, -3, 0, 3, 6]
      .map((dx, i) => `<path d="M${x0} ${y0} Q${x0 + dx} ${y0 + t.length * 0.5} ${x0 + dx * 1.6} ${y0 + t.length}" stroke="${i % 2 ? t.color2 : t.color}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`)
      .join('');
  }
  if (t.kind === 'feather') return `<path d="${d}" stroke="${t.color}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${pts[n][0]}" cy="${pts[n][1]}" r="5" fill="${t.color2}"/>`;
  // Dragon: a chain of discs, largest near the head.
  let s = '';
  for (let i = 8; i >= 0; i--) {
    const u = i / 8;
    const x = x0 + Math.sin(u * 5) * 14;
    const y = y0 + 8 + u * t.length * 0.62;
    const r = 15 - u * 8;
    s += `<path d="M${x - r * 1.5} ${y} L${x - r - 6} ${y + 6} M${x + r * 1.5} ${y} L${x + r + 6} ${y + 6}" stroke="${t.color2}" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r * 0.75}" fill="${i % 2 ? t.color2 : t.color}" stroke="${INK}" stroke-width="2.5"/>`;
  }
  void id;
  return s;
}

/** The whole kite with its tails, for the collection and anywhere a still picture is needed. */
export function previewSvg(id: string) {
  const k = kiteArt(id);
  const body = k.sail.replace(/id="(\w+)"/g, `id="p${id}-$1"`).replace(/url\(#(\w+)\)/g, `url(#p${id}-$1)`);
  const tails = k.tails.map((t) => tailSvg(t, id)).join('');
  const bottom = Math.max(220, ...k.tails.map((t) => t.at[1] + t.length * (t.kind === 'dragon' ? 0.7 : 0.55) + 10));
  // Tails drawn shorter than in the sky so the picture stays compact.
  const short = k.tails.map((t) => tailSvg({ ...t, length: t.length * (t.kind === 'dragon' ? 1 : 0.55) }, id)).join('');
  void tails;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 0 132 ${bottom.toFixed(0)}">${short}${body}</svg>`;
}
