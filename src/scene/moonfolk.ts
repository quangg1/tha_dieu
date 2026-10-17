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

/** Big glossy eyes and an open smile, as on bé Bi. */
const face = (cx: number, cy: number, k = 1, lashes = false) => {
  let b = '';
  for (const dx of [-11 * k, 11 * k]) {
    const x = cx + dx;
    b += `<ellipse cx="${x}" cy="${cy}" rx="${6.4 * k}" ry="${7.6 * k}" fill="#2a1a14"/>`;
    b += `<circle cx="${x + 2.2 * k}" cy="${cy - 2.8 * k}" r="${2.6 * k}" fill="#fff"/><circle cx="${x - 2 * k}" cy="${cy + 3.2 * k}" r="${1.2 * k}" fill="#fff"/>`;
    if (lashes) {
      const out = dx > 0 ? 1 : -1;
      b += `<path d="M${x + out * 5.6 * k} ${cy - 3 * k} l ${out * 3.4 * k} ${-0.6 * k}" stroke="#2a1a14" stroke-width="${1.8 * k}" stroke-linecap="round"/>`;
    }
  }
  b += `<ellipse cx="${cx - 19 * k}" cy="${cy + 9 * k}" rx="${5.4 * k}" ry="${3.4 * k}" fill="#ff9a9a" opacity=".65"/><ellipse cx="${cx + 19 * k}" cy="${cy + 9 * k}" rx="${5.4 * k}" ry="${3.4 * k}" fill="#ff9a9a" opacity=".65"/>`;
  return b;
};

/** Chú Cuội: messy hair under a cloth headband, rolled sleeves, an axe in his sash, sitting cross-legged and waving. */
export function cuoiSvg(frame: 0 | 1) {
  const W = 176;
  const H = 160;
  let b = '';
  b += `<ellipse cx="74" cy="154" rx="48" ry="5" fill="rgba(110,80,30,.28)"/>`;
  // Crossed legs: rolled beige trousers, bare feet.
  b += `<path d="M26 140 Q 26 120 50 116 L 98 116 Q 122 120 122 140 Q 100 152 74 148 Q 48 152 26 140 Z" fill="#d8bf93" ${o}/>`;
  b += `<path d="M40 128 Q 56 136 72 130 M108 128 Q 92 136 76 130" fill="none" stroke="#b89c6e" stroke-width="2"/>`;
  b += `<path d="M54 142 Q 64 132 80 138 Q 86 146 76 150 Q 62 152 54 142 Z" fill="${skin}" ${o}/><path d="M62 145 L 62 149 M67 146 L 67 150 M72 146 L 72 150" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/>`;
  // Brown shirt with rolled sleeves, frog buttons, a sash with the axe tucked in at the hip.
  b += `<path d="M46 78 Q 74 70 102 78 Q 112 98 108 122 Q 74 130 40 122 Q 36 98 46 78 Z" fill="#7b4a2a" ${o}/>`;
  b += `<path d="M66 76 Q 74 84 82 76" fill="none" stroke="${ink}" stroke-width="1.8"/>`;
  for (const y of [88, 99]) b += `<rect x="68" y="${y}" width="12" height="3.4" rx="1.6" fill="#5a3418" stroke="${ink}" stroke-width="1"/>`;
  b += `<path d="M40 110 Q 74 118 108 110 L 108 119 Q 74 127 40 119 Z" fill="#a0703f" ${o}/>`;
  b += `<path d="M36 128 L 56 100" stroke="${ink}" stroke-width="7.4" stroke-linecap="round"/><path d="M36 128 L 56 100" stroke="#b8834c" stroke-width="3.4" stroke-linecap="round"/>`;
  b += `<path d="M30 112 Q 26 100 38 98 L 46 108 Q 40 116 30 112 Z" fill="#9aa5b1" ${o}/><path d="M31 108 Q 30 102 37 101" stroke="#dfe6ec" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  // Left hand on the knee.
  b += limb('M50 86 Q 40 104 54 120', 9, '#7b4a2a') + `<circle cx="56" cy="121" r="6.4" fill="${skin}" ${o}/>`;
  // Right arm up, open hand waving (two frames).
  const arm = frame === 0 ? 'M98 86 Q 130 82 140 60' : 'M98 86 Q 134 88 150 70';
  const hx = frame === 0 ? 141 : 152;
  const hy = frame === 0 ? 52 : 62;
  b += limb(arm, 9, '#7b4a2a');
  b += `<g transform="rotate(${frame === 0 ? -8 : 18} ${hx} ${hy})"><path d="M${hx - 8} ${hy + 6} Q ${hx - 10} ${hy - 4} ${hx - 7} ${hy - 12} M${hx - 3} ${hy + 4} L ${hx - 3} ${hy - 15} M${hx + 2} ${hy + 4} L ${hx + 3} ${hy - 15} M${hx + 7} ${hy + 5} L ${hx + 9} ${hy - 11}" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="M${hx - 8} ${hy + 6} Q ${hx - 10} ${hy - 4} ${hx - 7} ${hy - 12} M${hx - 3} ${hy + 4} L ${hx - 3} ${hy - 15} M${hx + 2} ${hy + 4} L ${hx + 3} ${hy - 15} M${hx + 7} ${hy + 5} L ${hx + 9} ${hy - 11}" stroke="${skin}" stroke-width="3.6" stroke-linecap="round"/><ellipse cx="${hx}" cy="${hy + 7}" rx="9" ry="8" fill="${skin}" ${o}/></g>`;
  b += `<rect x="66" y="64" width="16" height="14" rx="6" fill="${skin}" ${o}/>`;
  // Head with messy spiky hair and a tan headband knotted at the side.
  b += `<circle cx="44" cy="46" r="6.4" fill="${skin}" ${o}/><circle cx="104" cy="46" r="6.4" fill="${skin}" ${o}/>`;
  b += `<ellipse cx="74" cy="42" rx="30" ry="28" fill="${skin}" ${o}/>`;
  b += `<path d="M42 40 Q 34 28 46 26 Q 44 12 58 16 Q 62 4 74 12 Q 84 2 92 14 Q 106 10 104 24 Q 114 28 106 40 Q 96 30 74 30 Q 54 30 42 40 Z" fill="#2a1d1a" ${o}/>`;
  b += `<path d="M44 34 Q 74 24 106 34 L 106 42 Q 74 32 44 42 Z" fill="#d9b27a" ${o}/>`;
  b += `<path d="M104 38 Q 114 34 118 40 Q 112 42 106 42 Z M104 42 Q 112 50 110 60 Q 104 52 102 46 Z" fill="#d9b27a" ${o}/>`;
  b += face(74, 50, 0.95);
  b += `<path d="M64 60 Q 74 72 84 60 Q 74 63 64 60 Z" fill="#c94a3e" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><path d="M68 64 Q 74 70 80 64 Q 74 66 68 64 Z" fill="#ff8a7a"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
}

/** Chị Hằng: long hair and a high bun with a golden flower pin, a cream gown with a lavender moon panel and ribbons, the jade rabbit in her arms. */
export function hangSvg() {
  const W = 180;
  const H = 240;
  let b = '';
  // Ribbons streaming on both sides.
  const rib = (d: string) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#cdbdf0" stroke-width="5.6" stroke-linecap="round"/>`;
  b += rib('M56 132 C 30 140, 22 168, 34 184 C 44 198, 26 214, 12 222');
  b += rib('M124 128 C 152 132, 164 160, 150 178 C 140 190, 160 206, 172 210');
  // Long hair behind.
  b += `<path d="M62 48 Q 44 92 42 150 Q 42 184 62 178 Q 58 140 66 104 L 114 104 Q 122 140 118 178 Q 138 184 138 150 Q 136 92 118 48 Q 90 30 62 48 Z" fill="#2a1d1f" ${o}/>`;
  // Gown flaring out, the lavender panel with a crescent and cloud.
  b += `<path d="M66 110 Q 90 102 114 110 Q 130 160 144 220 Q 90 234 36 220 Q 50 160 66 110 Z" fill="#fbf3dc" ${o}/>`;
  b += `<path d="M80 118 L 100 118 L 106 222 Q 90 226 74 222 Z" fill="#cdbdf0" ${o}/>`;
  b += `<path d="M94 150 a 7 7 0 1 0 0.1 12 a 5.6 5.6 0 1 1 -0.1 -12 Z" fill="#f2cf6b"/>`;
  b += `<path d="M82 196 q 4 -6 8 0 q 4 -6 8 0 q 4 -6 8 0" fill="none" stroke="#f2cf6b" stroke-width="1.8"/>`;
  b += `<path d="M48 204 Q 62 196 70 210 M132 204 Q 118 196 110 210" fill="none" stroke="#d9c79e" stroke-width="1.8"/>`;
  b += `<ellipse cx="80" cy="226" rx="8" ry="4" fill="#bfa9ec" ${o}/><ellipse cx="100" cy="226" rx="8" ry="4" fill="#bfa9ec" ${o}/>`;
  // Wide sleeves lined in lavender, arms cradling the rabbit.
  b += `<path d="M66 114 Q 44 130 46 164 Q 60 170 72 156 Q 70 136 76 124 Z" fill="#fbf3dc" ${o}/><path d="M48 156 Q 60 164 72 154" fill="none" stroke="#cdbdf0" stroke-width="3"/>`;
  b += `<path d="M114 114 Q 136 130 134 164 Q 120 170 108 156 Q 110 136 104 124 Z" fill="#fbf3dc" ${o}/><path d="M132 156 Q 120 164 108 154" fill="none" stroke="#cdbdf0" stroke-width="3"/>`;
  // The jade rabbit.
  b += `<g transform="translate(90 132)">`;
  b += `<g transform="rotate(-20 -8 -18)"><ellipse cx="-8" cy="-26" rx="5.5" ry="14" fill="#fff" ${o}/><ellipse cx="-8" cy="-25" rx="2.4" ry="9" fill="#ffc2cf"/></g>`;
  b += `<g transform="rotate(16 8 -18)"><ellipse cx="8" cy="-26" rx="5.5" ry="14" fill="#fff" ${o}/><ellipse cx="8" cy="-25" rx="2.4" ry="9" fill="#ffc2cf"/></g>`;
  b += `<ellipse cx="0" cy="10" rx="20" ry="14" fill="#fff" ${o}/><circle cx="0" cy="-6" r="15" fill="#fff" ${o}/>`;
  b += `<circle cx="-6" cy="-7" r="2.6" fill="#2a1a14"/><circle cx="6" cy="-7" r="2.6" fill="#2a1a14"/><circle cx="-5.2" cy="-8" r="0.9" fill="#fff"/><circle cx="6.8" cy="-8" r="0.9" fill="#fff"/>`;
  b += `<path d="M-2 -2 Q 0 1 2 -2" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="-10" cy="-1" rx="3" ry="2" fill="#ffb0b8"/><ellipse cx="10" cy="-1" rx="3" ry="2" fill="#ffb0b8"/>`;
  b += `</g>`;
  b += `<circle cx="74" cy="148" r="7" fill="${skin}" ${o}/><circle cx="106" cy="146" r="7" fill="${skin}" ${o}/>`;
  b += `<rect x="83" y="92" width="14" height="14" rx="5" fill="${skin}" ${o}/>`;
  b += `<path d="M78 106 L 90 120 L 102 106" fill="none" stroke="#cdbdf0" stroke-width="4" stroke-linejoin="round"/>`;
  // Head, centre-parted bangs, high bun with the golden flower and dangles, a ribbon from the bun.
  b += `<ellipse cx="90" cy="64" rx="30" ry="28" fill="${skin}" ${o}/>`;
  b += `<path d="M60 66 Q 56 36 90 34 Q 124 36 120 66 Q 112 48 96 46 Q 90 54 84 46 Q 68 48 60 66 Z" fill="#2a1d1f" ${o}/>`;
  b += `<ellipse cx="90" cy="24" rx="20" ry="15" fill="#2a1d1f" ${o}/><path d="M78 20 Q 90 12 102 20" fill="none" stroke="#4a3436" stroke-width="2"/>`;
  b += rib('M106 26 C 120 30, 128 44, 136 50');
  b += `<path d="M98 30 L 124 34" stroke="${ink}" stroke-width="4.6" stroke-linecap="round"/><path d="M98 30 L 124 34" stroke="#f2c14e" stroke-width="2.2" stroke-linecap="round"/>`;
  b += `<path d="M118 34 L 118 48 M124 35 L 124 46" stroke="#e0a92e" stroke-width="1.6"/><circle cx="118" cy="49" r="2" fill="#f2c14e" stroke="${ink}" stroke-width="1"/><circle cx="124" cy="47" r="2" fill="#f2c14e" stroke="${ink}" stroke-width="1"/>`;
  b += `<g transform="translate(90 12)"><path d="M0 -8 Q 5 -4 8 0 Q 5 4 0 8 Q -5 4 -8 0 Q -5 -4 0 -8 Z" fill="#f2c14e" ${o}/><circle r="3" fill="#fff8e1" stroke="${ink}" stroke-width="1"/></g>`;
  b += face(90, 70, 0.9, true);
  b += `<path d="M85 82 Q 90 86 95 82" fill="none" stroke="#c2413a" stroke-width="2.2" stroke-linecap="round"/>`;
  return { svg: svg(W, H, b), w: W, h: H };
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
