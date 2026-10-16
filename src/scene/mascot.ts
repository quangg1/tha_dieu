// The game's mascot, a chibi village kid, dressed for each theme pack: the nón lá and kite reel at home,
// sunglasses and a microphone on the music stage, a mask and flippers under the sea, a khăn đóng and lantern
// on the river, and a red áo dài with a sparkler on New Year's Eve.
export type Outfit = 'village' | 'music' | 'sea' | 'lantern' | 'tet';

const W = 120;
const H = 150;
const ink = '#3a2a22';
const skin = '#ffd9b8';
const hairC = '#3b2a25';
const o = `stroke="${ink}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;

/** A limb: an inked stroke with a coloured stroke on top. */
const limb = (d: string, w: number, fill = skin) =>
  `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + 4.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const hand = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="5.2" fill="${skin}" ${o}/>`;

const eyes = () => {
  let b = '';
  for (const x of [47, 69]) {
    b += `<ellipse cx="${x}" cy="56" rx="5.8" ry="7.2" fill="#2b1d18"/>`;
    b += `<circle cx="${x + 1.8}" cy="53.2" r="2.1" fill="#fff"/><circle cx="${x - 1.6}" cy="59" r="1" fill="#fff"/>`;
  }
  return b;
};

const blush = `<ellipse cx="39.5" cy="64" rx="5" ry="3.2" fill="#ff9e9e" opacity=".7"/><ellipse cx="76.5" cy="64" rx="5" ry="3.2" fill="#ff9e9e" opacity=".7"/>`;
const smile = `<path d="M53.5 64 Q 58 70.5 62.5 64 Z" fill="#a8372c" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/><path d="M55.6 66.4 Q 58 65 60.4 66.4 Q 58 68.6 55.6 66.4 Z" fill="#ff8a7a"/>`;
const grin = `<path d="M50 63 Q 58 72 67 62 Q 58 66 50 63 Z" fill="#fff" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
const bowl = `<path d="M29.5 50 C 28 30, 42 22, 58 22 C 74 22, 88 30, 86.5 50 C 84 44, 80 40, 76 39 Q 73 45 67 42 Q 63 47 57 42 Q 52 47 46 42 Q 41 45 38 40 C 34 42, 31 46, 29.5 50 Z" fill="${hairC}" ${o}/><path d="M42 29 Q 52 24 64 26" fill="none" stroke="#6a4c42" stroke-width="2.4" stroke-linecap="round"/>`;

/** Head with ears and face; `top` draws the hair or headwear, `face` the eyes and mouth. */
const head = (top: string, face: string, over = '') =>
  `<g transform="translate(0 5) rotate(-4 58 80)">` +
  `<circle cx="29.5" cy="56" r="5.5" fill="${skin}" ${o}/><circle cx="86.5" cy="56" r="5.5" fill="${skin}" ${o}/>` +
  `<ellipse cx="58" cy="52" rx="29" ry="27" fill="${skin}" ${o}/>` +
  top +
  face +
  over +
  `</g>`;

const neck = `<rect x="51" y="74" width="14" height="14" rx="5" fill="${skin}" ${o}/>`;
const shadow = `<ellipse cx="58" cy="145" rx="26" ry="3.6" fill="rgba(30,60,20,.25)"/>`;
const wave = limb('M44 92 Q 34 92 28 82', 7) + hand(27, 80);

function village() {
  let b = shadow;
  b += limb('M51 120 L 50 134', 8.5) + limb('M64 120 L 65 134', 8.5);
  b += `<ellipse cx="48.5" cy="138.5" rx="8.5" ry="4.6" fill="#e5533d" ${o}/><ellipse cx="66.5" cy="138.5" rx="8.5" ry="4.6" fill="#e5533d" ${o}/>`;
  b += `<path d="M42 110 L 73 110 L 75 124 Q 66 126 59 123 Q 51 126 40 124 Z" fill="#3c72c4" ${o}/>`;
  b += wave + neck;
  b += `<path d="M45 84 Q 58 80 71 84 Q 77 98 75 112 Q 58 116 40 112 Q 38 98 45 84 Z" fill="#ef5b45" ${o}/>`;
  b += `<path d="M50 84 Q 58 90 66 84" fill="none" stroke="#fff6ea" stroke-width="3" stroke-linecap="round"/>`;
  b += `<path d="M58 93 L 63.5 100 L 58 107.5 L 52.5 100 Z" fill="#ffd25a" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/><path d="M58 93 L 58 107.5 M52.5 100 L 63.5 100" stroke="${ink}" stroke-width="1"/>`;
  b += limb('M70 90 Q 88 84 103 56', 7);
  b += `<g transform="rotate(-20 107 48)"><rect x="98.5" y="43" width="17" height="10" rx="3.5" fill="#d9a85a" ${o}/><path d="M103 43 L 103 53 M111 43 L 111 53" stroke="${ink}" stroke-width="1.3"/></g>`;
  b += hand(104, 53);
  const hat =
    `<g transform="translate(0 6) rotate(-4 58 34)">` +
    `<path d="M12 36 L 58 2 L 104 36 Q 58 46 12 36 Z" fill="#f3d98f" ${o}/>` +
    `<path d="M58 1 L 36 39 M58 1 L 48 41 M58 1 L 60 42 M58 1 L 72 41 M58 1 L 84 39" stroke="#d6b260" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="M24 31 Q 58 39 92 31" fill="none" stroke="#d6b260" stroke-width="1.3"/><path d="M36 21 Q 58 27 80 21" fill="none" stroke="#d6b260" stroke-width="1.2"/>` +
    `<path d="M58 4 L 46 22" stroke="#fff6d8" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M12 36 Q 58 46 104 36" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/></g>`;
  b += head(bowl, eyes() + hat, blush + smile);
  return { b, hand: { x: 108 / W, y: 44 / H } };
}

function music() {
  let b = shadow;
  // Dark jeans and white high-top sneakers with a purple stripe.
  b += limb('M51 116 L 50 133', 9, '#2b3f73') + limb('M64 116 L 65 133', 9, '#2b3f73');
  b += `<path d="M40 133 Q 40 128 47 128 L 54 128 Q 57 132 57 137 L 57 141 L 40 141 Z" fill="#fff" ${o}/><path d="M59 133 Q 59 128 66 128 L 72 128 Q 76 132 76 137 L 76 141 L 59 141 Z" fill="#fff" ${o}/>`;
  b += `<path d="M42 137 L 55 137 M61 137 L 74 137" stroke="#8b4fd8" stroke-width="2.4"/>`;
  b += `<path d="M42 108 L 74 108 L 75 120 L 41 120 Z" fill="#2b3f73" ${o}/>`;
  // Rock-on hand: arm out, fingers up.
  b += limb('M44 92 Q 32 92 27 80', 7, '#1f1a24') + hand(26, 77);
  b += `<path d="M23.5 73 L 23 67 M28.5 73 L 29.5 67" stroke="${ink}" stroke-width="5.6" stroke-linecap="round"/><path d="M23.5 73 L 23 67 M28.5 73 L 29.5 67" stroke="${skin}" stroke-width="2.6" stroke-linecap="round"/>`;
  b += neck;
  // White tee with a music note under an open black jacket.
  b += `<path d="M45 84 Q 58 80 71 84 Q 77 98 75 112 Q 58 116 40 112 Q 38 98 45 84 Z" fill="#1f1a24" ${o}/>`;
  b += `<path d="M51 84 Q 58 87 65 84 L 64 112 Q 58 113 52 112 Z" fill="#fff" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
  b += `<path d="M56 105 L 56 94 L 62 92.5 L 62 103" fill="none" stroke="#8b4fd8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="54.6" cy="105" r="2.1" fill="#8b4fd8"/><circle cx="60.6" cy="103" r="2.1" fill="#8b4fd8"/>`;
  b += `<path d="M47 90 L 51 96 M70 90 L 66 96" stroke="#5b5266" stroke-width="1.4" stroke-linecap="round"/>`;
  // Headphones resting round the neck.
  b += `<path d="M44 80 Q 58 92 72 80" fill="none" stroke="${ink}" stroke-width="6.4" stroke-linecap="round"/><path d="M44 80 Q 58 92 72 80" fill="none" stroke="#8b4fd8" stroke-width="3" stroke-linecap="round"/>`;
  b += `<rect x="38.5" y="76" width="9" height="11" rx="4" fill="#8b4fd8" ${o}/><rect x="68.5" y="76" width="9" height="11" rx="4" fill="#8b4fd8" ${o}/>`;
  // Arm up with the microphone.
  b += limb('M70 90 Q 88 84 103 56', 7, '#1f1a24');
  b += `<g transform="rotate(18 104 46)"><rect x="101" y="40" width="7" height="18" rx="3" fill="#2b2530" ${o}/><circle cx="104.5" cy="37" r="7" fill="#c9ccd6" ${o}/><path d="M99 35 L 110 35 M98.5 39 L 110.5 39" stroke="#8a8e9a" stroke-width="1.2"/></g>`;
  b += hand(104, 53);
  // A tall swept quiff with purple tips.
  const quiff =
    `<path d="M29.5 50 C 27 34, 34 22, 46 18 C 52 8, 70 4, 82 12 C 74 12, 72 15, 74 18 C 84 22, 89 34, 86.5 50 C 84 42, 79 38, 72 37 C 64 40, 52 40, 44 38 C 37 40, 32 44, 29.5 50 Z" fill="${hairC}" ${o}/>` +
    `<path d="M68 7 C 74 6, 79 8, 82 12 C 76 12, 73 14, 74 18 C 70 14, 69 10, 68 7 Z" fill="#8b4fd8"/>` +
    `<path d="M46 22 Q 56 14 68 15" fill="none" stroke="#6a4c42" stroke-width="2.4" stroke-linecap="round"/>`;
  // Round black sunglasses with a shine.
  const shades =
    `<path d="M51.5 54 L 64.5 54" stroke="${ink}" stroke-width="2.4"/>` +
    `<rect x="36" y="47" width="17" height="13" rx="6" fill="#1b1622" ${o}/><rect x="63" y="47" width="17" height="13" rx="6" fill="#1b1622" ${o}/>` +
    `<path d="M39 50 L 44 50 M66 50 L 71 50" stroke="#b9a4ff" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M36 51 L 31 50 M80 51 L 85 50" stroke="${ink}" stroke-width="2"/>`;
  b += head(quiff, shades, blush.replace(/cy="64"/g, 'cy="65"') + grin);
  return { b, hand: { x: 104 / W, y: 30 / H } };
}

function sea() {
  let b = shadow;
  // Wetsuit legs and yellow flippers.
  b += limb('M51 116 L 50 132', 9, '#1d3f6e') + limb('M64 116 L 65 132', 9, '#1d3f6e');
  b += `<path d="M44 131 L 56 131 L 58 144 Q 50 147 36 144 Z" fill="#f5c242" ${o}/><path d="M59 131 L 71 131 L 80 144 Q 66 147 58 144 Z" fill="#f5c242" ${o}/>`;
  b += `<path d="M42 108 L 74 108 L 75 120 L 41 120 Z" fill="#1d3f6e" ${o}/>`;
  b += limb('M44 92 Q 34 92 28 82', 7, '#1d3f6e') + hand(27, 80);
  b += neck;
  // Wetsuit with a yellow stripe.
  b += `<path d="M45 84 Q 58 80 71 84 Q 77 98 75 112 Q 58 116 40 112 Q 38 98 45 84 Z" fill="#1d3f6e" ${o}/>`;
  b += `<path d="M42 96 Q 58 101 75 96" fill="none" stroke="#f5c242" stroke-width="3.4" stroke-linecap="round"/>`;
  b += `<path d="M58 84 L 58 94" stroke="#7fdcff" stroke-width="1.6" stroke-linecap="round"/>`;
  // Arm up with a glowing torch.
  b += limb('M70 90 Q 88 84 103 56', 7, '#1d3f6e');
  b += `<circle cx="106" cy="38" r="12" fill="#fff6b0" opacity=".45"/>`;
  b += `<g transform="rotate(20 105 46)"><rect x="101" y="40" width="8" height="16" rx="2.5" fill="#f5c242" ${o}/><rect x="99.5" y="35" width="11" height="7" rx="2" fill="#fff6d0" ${o}/></g>`;
  b += hand(104, 53);
  // Wet hair under a diving mask, with the snorkel up the side.
  const top = bowl;
  const mask =
    `<path d="M29 50 L 87 50" stroke="#2b2530" stroke-width="5"/>` +
    `<rect x="35" y="42" width="46" height="19" rx="9" fill="#bfefff" fill-opacity=".55" stroke="#f5c242" stroke-width="4"/>` +
    `<rect x="35" y="42" width="46" height="19" rx="9" fill="none" ${o}/>` +
    `<path d="M40 46 L 47 46" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
  const snorkel =
    `<path d="M86 62 L 92 60 L 94 30" fill="none" stroke="${ink}" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M86 62 L 92 60 L 94 30" fill="none" stroke="#e5533d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += head(top, eyes() + mask, blush + smile + snorkel);
  return { b, hand: { x: 106 / W, y: 30 / H } };
}

function lantern() {
  let b = shadow;
  b += limb('M52 122 L 51 134', 8, '#f4efe2') + limb('M64 122 L 65 134', 8, '#f4efe2');
  b += `<ellipse cx="49.5" cy="138.5" rx="8" ry="4.4" fill="#2b2530" ${o}/><ellipse cx="66.5" cy="138.5" rx="8" ry="4.4" fill="#2b2530" ${o}/>`;
  b += limb('M44 92 Q 34 92 28 82', 7, '#24407a') + hand(27, 80);
  b += neck;
  // A navy áo dài with gold round motifs, down to the knees.
  b += `<path d="M45 84 Q 58 80 71 84 Q 78 100 79 126 Q 58 130 37 126 Q 38 100 45 84 Z" fill="#24407a" ${o}/>`;
  b += `<path d="M58 84 Q 62 88 66 86" fill="none" stroke="#f2c14e" stroke-width="2" stroke-linecap="round"/>`;
  b += `<circle cx="51" cy="100" r="3.4" fill="none" stroke="#f2c14e" stroke-width="1.6"/><circle cx="66" cy="108" r="3.4" fill="none" stroke="#f2c14e" stroke-width="1.6"/><circle cx="52" cy="118" r="3.4" fill="none" stroke="#f2c14e" stroke-width="1.6"/>`;
  // Arm up with a lotus lantern glowing.
  b += limb('M70 90 Q 88 84 103 56', 7, '#24407a');
  b += `<circle cx="104" cy="38" r="15" fill="#ffc35a" opacity=".35"/>`;
  b += `<path d="M94 44 Q 104 50 114 44 Q 112 38 104 36 Q 96 38 94 44 Z" fill="#ec6f9e" ${o}/>`;
  b += `<path d="M98 40 Q 104 26 110 40 Q 104 37 98 40 Z" fill="#ffb3cf" ${o}/><path d="M104 36 L 104 28" stroke="${ink}" stroke-width="1.4"/><ellipse cx="104" cy="27" rx="2" ry="3" fill="#ffd36b"/>`;
  b += hand(104, 53);
  // A khăn đóng, the folded turban.
  const khan =
    `<path d="M28 44 Q 30 22 58 20 Q 86 22 88 44 Q 58 36 28 44 Z" fill="#24407a" ${o}/>` +
    `<path d="M31 37 Q 58 29 85 37 M33 30 Q 58 23 83 30" fill="none" stroke="#3d5fa3" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M28 44 Q 58 36 88 44" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`;
  b += head(bowl, eyes() + khan, blush + smile);
  return { b, hand: { x: 104 / W, y: 26 / H } };
}

function tet() {
  let b = shadow;
  b += limb('M52 122 L 51 134', 8, '#fff6ea') + limb('M64 122 L 65 134', 8, '#fff6ea');
  b += `<ellipse cx="49.5" cy="138.5" rx="8" ry="4.4" fill="#2b2530" ${o}/><ellipse cx="66.5" cy="138.5" rx="8" ry="4.4" fill="#2b2530" ${o}/>`;
  // Other hand holds a red envelope.
  b += limb('M44 92 Q 34 92 28 82', 7, '#d62d2d');
  b += `<rect x="16" y="68" width="14" height="18" rx="2" fill="#e5332d" ${o}/><circle cx="23" cy="77" r="3" fill="#f5c242"/>`;
  b += hand(27, 82);
  b += neck;
  // A red áo dài with gold flowers.
  b += `<path d="M45 84 Q 58 80 71 84 Q 78 100 79 126 Q 58 130 37 126 Q 38 100 45 84 Z" fill="#d62d2d" ${o}/>`;
  b += `<path d="M58 84 Q 62 88 66 86" fill="none" stroke="#f5c242" stroke-width="2" stroke-linecap="round"/>`;
  for (const [x, y] of [[51, 100], [66, 110], [53, 119]]) b += `<circle cx="${x}" cy="${y}" r="2" fill="#f5c242"/><path d="M${x - 4.5} ${y} L ${x + 4.5} ${y} M${x} ${y - 4.5} L ${x} ${y + 4.5}" stroke="#f5c242" stroke-width="1.2" stroke-linecap="round"/>`;
  // Arm up with a sparkler.
  b += limb('M70 90 Q 88 84 103 56', 7, '#d62d2d');
  b += `<path d="M104 52 L 108 24" stroke="#8a8e9a" stroke-width="2" stroke-linecap="round"/>`;
  b += `<g stroke="#ffd36b" stroke-width="1.8" stroke-linecap="round"><path d="M108 24 L 108 13 M108 24 L 117 18 M108 24 L 119 26 M108 24 L 115 32 M108 24 L 99 18 M108 24 L 97 26 M108 24 L 101 31"/></g><circle cx="108" cy="24" r="3" fill="#fff6d0"/>`;
  b += hand(104, 53);
  b += head(bowl, eyes(), blush + smile);
  return { b, hand: { x: 108 / W, y: 24 / H } };
}

const BUILD: Record<Outfit, () => { b: string; hand: { x: number; y: number } }> = { village, music, sea, lantern, tet };

/** The mascot in an outfit, as an SVG string, with the hand that holds the string or prop (fractions of the size). */
export function mascotSvg(outfit: Outfit = 'village') {
  const { b, hand: h } = BUILD[outfit]();
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${b}</svg>`, body: b, w: W, h: H, hand: h };
}
