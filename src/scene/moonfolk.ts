// Cung Trăng's folk, drawn in the same chibi style as bé Bi: chú Cuội under the banyan, chị Hằng drifting by
// with a lantern, and the jade rabbit pounding medicine. Two frames each for a little life.

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const ink = '#3a2a22';
const skin = '#ffd9b8';
const o = `stroke="${ink}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
const limb = (d: string, w: number, fill = skin) =>
  `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + 4.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const hand = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="5" fill="${skin}" ${o}/>`;
const eyes = (y: number, xs: [number, number]) =>
  xs.map((x) => `<ellipse cx="${x}" cy="${y}" rx="5.4" ry="6.8" fill="#2b1d18"/><circle cx="${x + 1.7}" cy="${y - 2.7}" r="2" fill="#fff"/><circle cx="${x - 1.5}" cy="${y + 2.8}" r="1" fill="#fff"/>`).join('');
const blush = (y: number, xs: [number, number]) => xs.map((x) => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3" fill="#ff9e9e" opacity=".7"/>`).join('');

/** Chú Cuội sitting cross-legged under the banyan, waving; a little axe beside him. */
export function cuoiSvg(frame: 0 | 1) {
  const W = 130;
  const H = 130;
  let b = '';
  b += `<ellipse cx="62" cy="124" rx="40" ry="4.5" fill="rgba(120,90,30,.28)"/>`;
  // The axe leaning on the trunk side.
  b += `<path d="M108 122 L 116 78" stroke="${ink}" stroke-width="6.4" stroke-linecap="round"/><path d="M108 122 L 116 78" stroke="#a8743f" stroke-width="2.6" stroke-linecap="round"/>`;
  b += `<path d="M110 80 Q 124 70 128 86 Q 120 84 114 90 Z" fill="#c9d3dc" ${o}/>`;
  // Crossed legs in dark trousers, bare feet.
  b += `<path d="M30 112 Q 32 98 50 98 L 76 98 Q 94 98 96 112 Q 80 122 62 120 Q 44 122 30 112 Z" fill="#3a3a4a" ${o}/>`;
  b += `<ellipse cx="40" cy="114" rx="8" ry="5" fill="${skin}" ${o}/><ellipse cx="86" cy="114" rx="8" ry="5" fill="${skin}" ${o}/>`;
  // Brown áo cánh with knotted buttons.
  b += `<path d="M42 66 Q 62 60 82 66 Q 90 84 88 102 Q 62 108 36 102 Q 34 84 42 66 Z" fill="#9a6338" ${o}/>`;
  b += `<path d="M62 64 L 62 102" stroke="${ink}" stroke-width="1.6"/>`;
  for (const y of [74, 84, 94]) b += `<circle cx="62" cy="${y}" r="2" fill="#f2d39a" stroke="${ink}" stroke-width="1"/>`;
  // Left hand resting on the knee.
  b += limb('M44 74 Q 34 90 44 102', 7.5, '#9a6338') + hand(46, 103);
  // Right arm waving: two frames.
  b += frame === 0 ? limb('M80 72 Q 94 64 98 44', 7.5, '#9a6338') + hand(98, 40) : limb('M80 72 Q 98 66 106 50', 7.5, '#9a6338') + hand(107, 46);
  b += `<rect x="55" y="54" width="14" height="12" rx="5" fill="${skin}" ${o}/>`;
  // Head: shaved crown with the boy's tuft (để chỏm) on top.
  b += `<circle cx="36" cy="38" r="5" fill="${skin}" ${o}/><circle cx="88" cy="38" r="5" fill="${skin}" ${o}/>`;
  b += `<ellipse cx="62" cy="34" rx="26" ry="24" fill="${skin}" ${o}/>`;
  b += `<path d="M38 28 Q 44 12 62 11 Q 80 12 86 28 Q 76 20 62 20 Q 48 20 38 28 Z" fill="#3b2a25" ${o}/>`;
  b += `<path d="M58 12 Q 52 2 60 0 Q 70 0 66 12 Z" fill="#3b2a25" ${o}/><path d="M57 11 Q 62 14 67 11" stroke="#d9573b" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  b += eyes(37, [53, 71]) + blush(45, [45, 79]);
  b += `<path d="M56 46 Q 62 53 68 46 Z" fill="#a8372c" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/** Chị Hằng drifting on a cloud: hair in a high bun with a golden pin, a pink gown, a long silk ribbon and a lantern. */
export function hangSvg() {
  const W = 150;
  const H = 200;
  let b = '';
  // The silk ribbon draped over her arms, trailing away in two long waves.
  const ribbon = 'M42 128 C 30 140, 14 138, 8 152 C 2 166, 16 178, 6 196 M110 122 C 126 118, 140 104, 136 86 C 132 70, 144 58, 148 46';
  b += `<path d="${ribbon}" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="${ribbon}" fill="none" stroke="#c9b6f2" stroke-width="5.6" stroke-linecap="round"/>`;
  // Cloud she rides.
  b += `<g fill="#ffffff" ${o}><path d="M24 182 Q 20 168 36 166 Q 42 154 58 160 Q 70 150 84 160 Q 100 154 106 168 Q 122 168 118 182 Q 70 192 24 182 Z"/></g>`;
  // Long gown flaring into the cloud.
  b += `<path d="M56 96 Q 74 90 92 96 Q 112 136 124 172 Q 74 184 24 172 Q 38 136 56 96 Z" fill="#ffc7d6" ${o}/>`;
  b += `<path d="M74 96 L 74 176" stroke="#f29bb4" stroke-width="2"/><path d="M40 152 Q 74 162 108 152" fill="none" stroke="#f29bb4" stroke-width="2"/><path d="M58 172 Q 62 150 60 128 M90 172 Q 86 150 88 128" fill="none" stroke="#f29bb4" stroke-width="1.6"/>`;
  // Inner white yếm and a red sash.
  b += `<path d="M62 96 Q 74 112 86 96 Z" fill="#fff6ea" ${o}/>`;
  b += `<path d="M56 116 Q 74 122 94 116 L 95 124 Q 74 130 54 124 Z" fill="#d9573b" ${o}/>`;
  b += `<path d="M70 124 Q 66 140 62 150 M78 124 Q 82 140 88 150" stroke="#d9573b" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
  // Wide sleeves; one hand holds a red lantern.
  b += `<path d="M58 100 Q 40 112 42 132 Q 52 134 60 124 Z" fill="#ffc7d6" ${o}/>`;
  b += `<path d="M90 100 Q 108 108 112 124 Q 104 132 94 122 Z" fill="#ffc7d6" ${o}/>`;
  b += hand(108, 124);
  b += `<path d="M108 128 L 108 138" stroke="${ink}" stroke-width="1.6"/>`;
  b += `<ellipse cx="108" cy="150" rx="11" ry="13" fill="#e5533d" ${o}/><path d="M100 150 Q 108 146 116 150 M100 156 Q 108 152 116 156" stroke="#ffcf6b" stroke-width="1.6" fill="none"/>`;
  b += `<rect x="103" y="136" width="10" height="4" rx="1.5" fill="#ffcf6b" ${o}/><rect x="103" y="162" width="10" height="4" rx="1.5" fill="#ffcf6b" ${o}/><path d="M108 166 L 108 174" stroke="#ffcf6b" stroke-width="2"/>`;
  b += `<rect x="67" y="82" width="14" height="14" rx="5" fill="${skin}" ${o}/>`;
  // Long black hair falling behind, then the head and the high bun with its pin and flower.
  b += `<path d="M48 54 Q 40 92 50 112 L 60 104 Q 52 84 56 62 Z M100 54 Q 108 92 98 112 L 88 104 Q 96 84 92 62 Z" fill="#2a1d1f" ${o}/>`;
  b += `<ellipse cx="74" cy="58" rx="27" ry="25" fill="${skin}" ${o}/>`;
  b += `<path d="M47 56 Q 46 34 74 32 Q 102 34 101 56 Q 92 42 80 44 Q 74 52 68 44 Q 56 42 47 56 Z" fill="#2a1d1f" ${o}/>`;
  b += `<ellipse cx="74" cy="22" rx="15" ry="12" fill="#2a1d1f" ${o}/>`;
  b += `<path d="M54 18 L 96 26" stroke="${ink}" stroke-width="4.6" stroke-linecap="round"/><path d="M54 18 L 96 26" stroke="#f2c14e" stroke-width="2.2" stroke-linecap="round"/><circle cx="96" cy="26" r="3.4" fill="#f2c14e" ${o}/>`;
  b += `<g transform="translate(58 30)"><circle r="6" fill="#ff8fb0" ${o}/><circle r="2.4" fill="#ffe08a"/></g>`;
  // Gentle face: smiling closed eyes with lashes.
  b += `<path d="M60 61 Q 65 56 70 61 M78 61 Q 83 56 88 61" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`;
  b += `<path d="M59 59 L 57 57 M89 59 L 91 57" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>`;
  b += blush(67, [58, 90]);
  b += `<path d="M70 70 Q 74 74 78 70" fill="none" stroke="#c2413a" stroke-width="2.2" stroke-linecap="round"/>`;
  b += `<circle cx="74" cy="47" r="1.8" fill="#e5533d"/>`;
  return { svg: svg(W, H, b), w: W, h: H, lantern: { x: 108 / W, y: 150 / H } };
}

/** The jade rabbit pounding medicine in a mortar: pestle up (0) or down (1). */
export function rabbitSvg(frame: 0 | 1) {
  const W = 90;
  const H = 80;
  const py = frame === 0 ? -10 : 0;
  let b = '';
  b += `<ellipse cx="44" cy="76" rx="34" ry="3.5" fill="rgba(120,90,30,.25)"/>`;
  // Mortar.
  b += `<path d="M50 58 L 78 58 L 74 76 L 54 76 Z" fill="#b98b5e" ${o}/><ellipse cx="64" cy="58" rx="14" ry="4" fill="#7a5a43" ${o}/>`;
  // Body and head.
  b += `<ellipse cx="34" cy="60" rx="20" ry="16" fill="#ffffff" ${o}/>`;
  b += `<ellipse cx="18" cy="72" rx="8" ry="4" fill="#ffffff" ${o}/>`;
  b += `<circle cx="14" cy="58" r="6" fill="#ffffff" ${o}/>`;
  b += `<g transform="rotate(-12 32 20)"><ellipse cx="26" cy="16" rx="5.5" ry="15" fill="#ffffff" ${o}/><ellipse cx="26" cy="17" rx="2.4" ry="10" fill="#ffc2cf"/></g>`;
  b += `<g transform="rotate(14 40 20)"><ellipse cx="40" cy="16" rx="5.5" ry="15" fill="#ffffff" ${o}/><ellipse cx="40" cy="17" rx="2.4" ry="10" fill="#ffc2cf"/></g>`;
  b += `<circle cx="36" cy="38" r="15" fill="#ffffff" ${o}/>`;
  b += `<ellipse cx="42" cy="37" rx="2.6" ry="3.2" fill="#2b1d18"/><circle cx="42.8" cy="35.8" r="1" fill="#fff"/>`;
  b += `<ellipse cx="44" cy="44" rx="3.4" ry="2.2" fill="#ff9e9e" opacity=".75"/><circle cx="49" cy="40" r="1.8" fill="#ff8fa3"/>`;
  // Arms on the pestle.
  b += `<g transform="translate(0 ${py})"><rect x="60" y="24" width="8" height="36" rx="4" fill="#d9a85a" ${o}/></g>`;
  b += `<ellipse cx="58" cy="${42 + py}" rx="6" ry="4.5" fill="#ffffff" ${o}/><ellipse cx="66" cy="${48 + py}" rx="5" ry="4" fill="#ffffff" ${o}/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}
