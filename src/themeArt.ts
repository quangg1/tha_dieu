// Preview art for the theme packs: a scene for each pack with bé Bi (the painted mascot) in that pack's outfit,
// and his kite. Each preview is one SVG with light CSS animation (off for reduced motion).

/** bé Bi dressed for each pack: picture size and where his raised fist is (fractions of the picture). */
const OUTFIT = {
  tet: { src: '/art/be-bi-tet.png', w: 260, h: 420, fist: [0.9, 0.29] },
  hoadang: { src: '/art/be-bi-hoadang.png', w: 301, h: 420, fist: [0.93, 0.25] },
  lanbien: { src: '/art/be-bi-lanbien.png', w: 274, h: 420, fist: [0.92, 0.3] },
  amnhac: { src: '/art/be-bi-amnhac.png', w: 274, h: 420, fist: [0.91, 0.31] },
} as const;

const INK = '#3a2a22';

/** Places bé Bi in his outfit, `h` tall; `fist` = his raised fist in scene units, for the kite string. */
function bi(theme: keyof typeof OUTFIT, x: number, y: number, h: number, back = '') {
  const o = OUTFIT[theme];
  const w = (h * o.w) / o.h;
  const fist = { x: x + o.fist[0] * w, y: y + o.fist[1] * h };
  const svg = `${back}<ellipse cx="${x + w / 2}" cy="${y + h - 3}" rx="${w * 0.36}" ry="5" fill="#000" opacity=".22"/>` +
    `<image href="${o.src}" x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}"/>`;
  return { svg, fist };
}

/** A diamond kite with ribbon tails, string to the fist. */
function kite(fx: number, fy: number, kx: number, ky: number, c: [string, string, string, string], cls: string, extra = '') {
  return (
    `<path d="M${fx} ${fy} Q ${(fx + kx) / 2 + 10} ${(fy + ky) / 2 + 14} ${kx} ${ky + 18}" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".75"/>` +
    `<g class="${cls}" style="transform-origin:${kx}px ${ky + 18}px">` +
    `<path d="M${kx} ${ky + 18} q -6 14 4 22 q 8 8 2 20" fill="none" stroke="${c[0]}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M${kx} ${ky + 18} q 4 12 14 18 q 8 6 6 18" fill="none" stroke="${c[2]}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M${kx} ${ky - 22} L ${kx + 18} ${ky} L ${kx} ${ky + 18} L ${kx - 18} ${ky} Z" fill="${c[1]}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M${kx} ${ky - 22} L ${kx + 18} ${ky} L ${kx} ${ky} Z" fill="${c[3]}"/><path d="M${kx} ${ky + 18} L ${kx - 18} ${ky} L ${kx} ${ky} Z" fill="${c[2]}"/>` +
    `<path d="M${kx} ${ky - 22} L ${kx} ${ky + 18} M${kx - 18} ${ky} L ${kx + 18} ${ky}" stroke="${INK}" stroke-width="1.4"/>` +
    `<path d="M${kx} ${ky - 22} L ${kx + 18} ${ky} L ${kx} ${ky + 18} L ${kx - 18} ${ky} Z" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>${extra}</g>`
  );
}

const css = (id: string, rules: string) =>
  `<style>${rules} @media (prefers-reduced-motion: reduce){.${id} *{animation:none!important}}</style>`;

const wrap = (id: string, body: string) =>
  `<svg class="${id}" aria-hidden="true" width="100%" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice">${body}</svg>`;

/* ---------------------------------------------------------------- Tết */
function tet() {
  const id = 'th-tet';
  const blossom = (x: number, y: number, r: number) => {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      p += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.85).toFixed(1)}" fill="#ffd23f" stroke="#e8a317" stroke-width=".6"/>`;
    }
    return p + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="#e5533d"/>`;
  };
  let b = css(
    id,
    `.${id} .tw{animation:tt-tw 2.4s ease-in-out infinite}.${id} .tw2{animation:tt-tw 2.4s 1.2s ease-in-out infinite}
     .${id} .sw{animation:tt-sw 3.2s ease-in-out infinite}.${id} .kt{animation:tt-kt 3s ease-in-out infinite}
     .${id} .pt{animation:tt-pt 6s linear infinite}.${id} .pt2{animation:tt-pt 7s 2.5s linear infinite}
     @keyframes tt-tw{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:1;transform:scale(1.05)}}
     @keyframes tt-sw{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
     @keyframes tt-kt{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(5deg) translateY(-4px)}}
     @keyframes tt-pt{0%{transform:translate(0,-10px) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(-40px,230px) rotate(320deg);opacity:0}}`,
  );
  b += `<defs><linearGradient id="tt-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c1410"/><stop offset=".6" stop-color="#c8361f"/><stop offset="1" stop-color="#f08a3c"/></linearGradient>
        <radialGradient id="tt-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>`;
  b += `<rect width="360" height="220" fill="url(#tt-bg)"/>`;
  // Fireworks.
  const burst = (x: number, y: number, r: number, c: string, cls: string) => {
    let s = `<g class="${cls}" style="transform-origin:${x}px ${y}px">`;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      s += `<path d="M${(x + Math.cos(a) * r * 0.35).toFixed(1)} ${(y + Math.sin(a) * r * 0.35).toFixed(1)} L ${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    return s + `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff6d0"/></g>`;
  };
  b += burst(206, 40, 24, '#ffd36b', 'tw') + burst(258, 70, 16, '#ff9ec0', 'tw2') + burst(176, 82, 12, '#fff2b3', 'tw2');
  // Hanging red lanterns.
  for (const [x, l, d] of [[300, 26, 0], [328, 44, 0.8], [276, 14, 1.6]] as const) {
    b += `<g class="sw" style="transform-origin:${x}px 0px;animation-delay:${d}s"><path d="M${x} 0 L ${x} ${l}" stroke="#4a1a10" stroke-width="1.4"/>`;
    b += `<circle cx="${x}" cy="${l + 16}" r="20" fill="url(#tt-glow)"/><ellipse cx="${x}" cy="${l + 16}" rx="13" ry="15" fill="#e5332a" stroke="${INK}" stroke-width="1.6"/>`;
    b += `<path d="M${x - 8} ${l + 16} Q ${x} ${l + 10} ${x + 8} ${l + 16} M${x - 8} ${l + 22} Q ${x} ${l + 16} ${x + 8} ${l + 22}" stroke="#ffd36b" stroke-width="1.2" fill="none"/>`;
    b += `<rect x="${x - 6}" y="${l - 1}" width="12" height="4" rx="1.5" fill="#ffcf3a"/><rect x="${x - 6}" y="${l + 29}" width="12" height="4" rx="1.5" fill="#ffcf3a"/><path d="M${x} ${l + 33} L ${x} ${l + 44}" stroke="#ffcf3a" stroke-width="2"/></g>`;
  }
  // Hoa mai branch across the top left.
  b += `<path d="M-6 18 Q 40 30 74 26 Q 110 22 140 34 M30 26 Q 40 52 34 70 M78 25 Q 92 42 96 58 M112 26 Q 120 12 134 8" stroke="#5a2a16" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  for (const [x, y, r] of [[14, 22, 4.2], [42, 30, 4.6], [36, 58, 4], [62, 24, 4.4], [92, 44, 4.2], [118, 22, 4], [138, 10, 3.6], [100, 30, 3.4], [26, 44, 3.6], [150, 38, 4]] as const) b += blossom(x, y, r);
  // Falling petals.
  for (const [x, c] of [[120, 'pt'], [190, 'pt2'], [60, 'pt2'], [240, 'pt']] as const) b += `<circle class="${c}" cx="${x}" cy="0" r="2.6" fill="#ffd23f"/>`;
  // Ground: a mat with bánh chưng and a câu đối scroll.
  b += `<path d="M0 196 Q 180 184 360 196 L 360 220 L 0 220 Z" fill="#8a2a14" opacity=".55"/>`;
  b += `<g transform="translate(250 160)"><rect width="40" height="36" rx="3" fill="#3f7d3a" stroke="${INK}" stroke-width="2"/><rect x="2" y="2" width="36" height="32" rx="2" fill="none" stroke="#5e9e4c" stroke-width="1.4"/><path d="M13 0 V36 M27 0 V36 M0 12 H40 M0 24 H40" stroke="#e8d7a8" stroke-width="2"/></g>`;
  b += `<g transform="translate(300 150)"><rect width="22" height="48" rx="2" fill="#d42a1f" stroke="${INK}" stroke-width="1.6"/><path d="M6 10 h10 M6 20 h10 M6 30 h10 M6 40 h10" stroke="#ffd36b" stroke-width="3" stroke-linecap="round"/></g>`;
  // bé Bi in a red áo dài and khăn đóng, a lì xì in hand.
  const B = bi('tet', 30, 40, 160);
  b += kite(B.fist.x, B.fist.y, 200, 118, ['#ffd23f', '#e5332a', '#ffcf3a', '#c62a1e'], 'kt', `<circle cx="200" cy="118" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="1.2"/>`);
  b += B.svg;
  return wrap(id, b);
}

/* ---------------------------------------------------------------- Hoa Đăng */
function hoadang() {
  const id = 'th-hd';
  let b = css(
    id,
    `.${id} .bob{animation:hd-bob 3.6s ease-in-out infinite}.${id} .fl{animation:hd-fl 1.4s ease-in-out infinite}
     .${id} .kt{animation:hd-kt 3.4s ease-in-out infinite}.${id} .st{animation:hd-st 3s ease-in-out infinite}
     @keyframes hd-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
     @keyframes hd-fl{0%,100%{opacity:.7}50%{opacity:1}}
     @keyframes hd-kt{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg) translateY(-3px)}}
     @keyframes hd-st{0%,100%{opacity:.3}50%{opacity:1}}`,
  );
  b += `<defs><linearGradient id="hd-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120c2e"/><stop offset=".55" stop-color="#3a1f5c"/><stop offset="1" stop-color="#6a3a6e"/></linearGradient>
        <radialGradient id="hd-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".95"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
        <radialGradient id="hd-moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8"/><stop offset=".7" stop-color="#ffe7a3"/><stop offset="1" stop-color="#ffe7a3" stop-opacity="0"/></radialGradient></defs>`;
  b += `<rect width="360" height="220" fill="url(#hd-bg)"/>`;
  for (const [x, y, d] of [[40, 20, 0], [120, 14, 1], [220, 30, 0.5], [160, 50, 1.6], [330, 70, 0.8], [90, 60, 2]] as const) b += `<circle class="st" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`;
  b += `<circle cx="300" cy="44" r="40" fill="url(#hd-moon)"/><circle cx="300" cy="44" r="22" fill="#fff4cf"/>`;
  // Chùa Cầu (the Japanese Bridge) in silhouette.
  b += `<g fill="#1d1233"><path d="M170 140 Q 240 104 330 140 L 330 148 Q 240 114 170 148 Z"/><path d="M214 112 L 286 112 L 296 122 L 204 122 Z"/><path d="M226 98 L 274 98 L 284 108 L 216 108 Z"/><rect x="232" y="108" width="36" height="4"/><path d="M200 140 V 160 M228 124 V 154 M272 124 V 154 M300 140 V 160" stroke="#1d1233" stroke-width="4"/></g>`;
  // A string of hanging lanterns.
  b += `<path d="M150 0 Q 250 40 360 8" stroke="#2a1a33" stroke-width="1.4" fill="none"/>`;
  const lc = ['#e5332a', '#ffb02e', '#e94f9a', '#3fb6a8', '#ffd23f'];
  [[176, 12], [206, 22], [236, 28], [266, 27], [296, 22], [326, 14]].forEach(([x, y], i) => {
    b += `<g class="bob" style="animation-delay:${i * 0.3}s"><circle cx="${x}" cy="${y + 10}" r="12" fill="url(#hd-glow)" opacity=".7"/><ellipse cx="${x}" cy="${y + 10}" rx="6" ry="8" fill="${lc[i % 5]}" stroke="#2a1a33" stroke-width="1"/><path d="M${x} ${y + 18} v4" stroke="#ffd36b" stroke-width="1.4"/></g>`;
  });
  // River with reflections and floating lotus lanterns.
  b += `<rect x="0" y="160" width="360" height="60" fill="#1a1440"/>`;
  b += `<path d="M0 168 Q 90 160 180 168 T 360 168" stroke="#3e2f7a" stroke-width="2" fill="none"/><path d="M30 188 h40 M120 196 h50 M230 186 h60 M300 204 h40" stroke="#ffcf6b" stroke-width="2" opacity=".35" stroke-linecap="round"/>`;
  const lotus = (x: number, y: number, k: number, d: number) =>
    `<g class="bob" style="animation-delay:${d}s"><ellipse cx="${x}" cy="${y + 4 * k}" rx="${20 * k}" ry="${6 * k}" fill="#ffcf6b" opacity=".18"/>` +
    `<circle class="fl" cx="${x}" cy="${y - 6 * k}" r="${16 * k}" fill="url(#hd-glow)"/>` +
    `<path d="M${x - 14 * k} ${y} Q ${x - 16 * k} ${y - 12 * k} ${x - 6 * k} ${y - 10 * k} Q ${x} ${y - 20 * k} ${x + 6 * k} ${y - 10 * k} Q ${x + 16 * k} ${y - 12 * k} ${x + 14 * k} ${y} Z" fill="#ff8fb0" stroke="#2a1a33" stroke-width="${1.4 * k}"/>` +
    `<path d="M${x - 6 * k} ${y - 2 * k} Q ${x} ${y - 14 * k} ${x + 6 * k} ${y - 2 * k}" fill="#ffc2d6" stroke="#2a1a33" stroke-width="${k}"/>` +
    `<path class="fl" d="M${x} ${y - 16 * k} q ${3 * k} ${4 * k} 0 ${7 * k} q ${-3 * k} ${-3 * k} 0 ${-7 * k} Z" fill="#ffe08a"/></g>`;
  b += lotus(196, 192, 0.9, 0) + lotus(250, 182, 0.7, 0.8) + lotus(300, 198, 1, 1.4) + lotus(338, 178, 0.6, 2.1) + lotus(160, 206, 0.6, 1.1);
  // bé Bi in áo bà ba with a lotus lantern.
  const B = bi('hoadang', 18, 42, 158);
  b += kite(B.fist.x, B.fist.y, 196, 104, ['#ffd23f', '#ffb02e', '#e94f9a', '#ffd23f'], 'kt');
  b += B.svg;
  return wrap(id, b);
}

/* ---------------------------------------------------------------- Lặn Biển */
function lanbien() {
  const id = 'th-lb';
  let b = css(
    id,
    `.${id} .bb{animation:lb-bb 4s linear infinite}.${id} .ray{animation:lb-ray 5s ease-in-out infinite}
     .${id} .fish{animation:lb-fish 9s linear infinite}.${id} .fish2{animation:lb-fish2 12s linear infinite}
     .${id} .sea{animation:lb-sea 3s ease-in-out infinite;transform-origin:bottom}.${id} .jl{animation:lb-jl 4s ease-in-out infinite}
     @keyframes lb-bb{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-150px);opacity:0}}
     @keyframes lb-ray{0%,100%{opacity:.12}50%{opacity:.3}}
     @keyframes lb-fish{0%{transform:translateX(0)}100%{transform:translateX(-420px)}}
     @keyframes lb-fish2{0%{transform:translateX(0)}100%{transform:translateX(440px)}}
     @keyframes lb-sea{0%,100%{transform:skewX(-6deg)}50%{transform:skewX(6deg)}}
     @keyframes lb-jl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`,
  );
  b += `<defs><linearGradient id="lb-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b8fc4"/><stop offset=".5" stop-color="#0b4f86"/><stop offset="1" stop-color="#062646"/></linearGradient>
        <radialGradient id="lb-jg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d8a8ff" stop-opacity=".8"/><stop offset="1" stop-color="#d8a8ff" stop-opacity="0"/></radialGradient></defs>`;
  b += `<rect width="360" height="220" fill="url(#lb-bg)"/>`;
  for (const [x, w, d] of [[180, 40, 0], [250, 30, 1.5], [320, 46, 0.8], [120, 26, 2.2]] as const) b += `<path class="ray" style="animation-delay:${d}s" d="M${x} 0 L ${x + w} 0 L ${x + w * 2.4} 220 L ${x + w * 0.6} 220 Z" fill="#bfeaff"/>`;
  // Jellyfish.
  b += `<g class="jl"><circle cx="300" cy="64" r="26" fill="url(#lb-jg)"/><path d="M286 66 Q 300 40 314 66 Z" fill="#e3c4ff" stroke="#6b3fa0" stroke-width="1.4"/><path d="M290 66 q 2 10 -2 18 M297 66 q 2 12 -1 22 M304 66 q -2 12 1 20 M310 66 q -1 10 2 16" stroke="#e3c4ff" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  // Fish.
  const fish = (x: number, y: number, c: string, k: number, dir: 1 | -1) =>
    `<g transform="translate(${x} ${y}) scale(${dir * k} ${k})"><path d="M0 0 Q 14 -10 26 0 Q 14 10 0 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.4"/><path d="M0 0 L -9 -7 L -9 7 Z" fill="${c}" stroke="${INK}" stroke-width="1.4"/><path d="M10 -6 V 6" stroke="#fff" stroke-width="2.4"/><circle cx="20" cy="-2" r="1.6" fill="${INK}"/></g>`;
  b += `<g class="fish">${fish(380, 92, '#ff8a2a', 0.9, -1)}${fish(410, 104, '#ffd23f', 0.6, -1)}</g>`;
  b += `<g class="fish2">${fish(-60, 140, '#ff5fa2', 0.7, 1)}${fish(-90, 150, '#ff8a2a', 0.5, 1)}</g>`;
  // Coral, seaweed, sand.
  b += `<path d="M0 200 Q 90 188 180 198 T 360 196 L 360 220 L 0 220 Z" fill="#e8cf95"/>`;
  b += `<g class="sea"><path d="M176 202 Q 168 180 178 166 Q 186 150 178 134" stroke="#2fae6a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M190 202 Q 196 182 188 168" stroke="#3cc27a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  b += `<g fill="#ff6f7d" stroke="${INK}" stroke-width="1.6"><path d="M236 204 q -4 -22 6 -30 q 4 -10 10 -2 q 8 -6 8 6 q 8 8 2 26 Z"/></g>`;
  b += `<g fill="#ffa24c" stroke="${INK}" stroke-width="1.6"><circle cx="300" cy="196" r="12"/><circle cx="318" cy="200" r="9"/><circle cx="286" cy="202" r="8"/></g>`;
  b += `<g stroke="#ff8fb0" stroke-width="5" stroke-linecap="round" fill="none"><path d="M336 204 V 178 M336 190 L 346 180 M336 186 L 326 176"/></g>`;
  // Bubbles.
  for (const [x, y, r, d] of [[110, 120, 4, 0], [122, 140, 3, 1.2], [104, 156, 5, 2.4], [200, 180, 3, 0.6], [260, 170, 4, 1.8], [150, 190, 3, 3]] as const) b += `<circle class="bb" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#dff6ff" stroke-width="1.4"/>`;
  // bé Bi in a wetsuit, mask and flippers.
  const B = bi('lanbien', 30, 40, 160);
  // His kite is a fish-kite here.
  b += kite(B.fist.x, B.fist.y, 192, 106, ['#7fdcff', '#ff8a2a', '#ffd23f', '#ffb37a'], 'jl', `<circle cx="196" cy="100" r="2.6" fill="${INK}"/>`);
  b += B.svg;
  return wrap(id, b);
}

/* ---------------------------------------------------------------- Âm Nhạc */
function amnhac() {
  const id = 'th-an';
  let b = css(
    id,
    `.${id} .beam{animation:an-beam 4s ease-in-out infinite}.${id} .beam2{animation:an-beam2 4.6s ease-in-out infinite}
     .${id} .note{animation:an-note 4s ease-in infinite}.${id} .eq{animation:an-eq .8s ease-in-out infinite alternate;transform-origin:bottom;transform-box:fill-box}
     .${id} .hand{animation:an-hand 1s ease-in-out infinite alternate}.${id} .kt{animation:an-kt 2s ease-in-out infinite}
     @keyframes an-beam{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
     @keyframes an-beam2{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-10deg)}}
     @keyframes an-note{0%{transform:translateY(10px);opacity:0}20%{opacity:1}100%{transform:translateY(-90px);opacity:0}}
     @keyframes an-eq{0%{transform:scaleY(.3)}100%{transform:scaleY(1)}}
     @keyframes an-hand{0%{transform:translateY(0)}100%{transform:translateY(-6px)}}
     @keyframes an-kt{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}`,
  );
  b += `<defs><linearGradient id="an-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14062e"/><stop offset=".7" stop-color="#3b1470"/><stop offset="1" stop-color="#6a1e8c"/></linearGradient>
        <linearGradient id="an-bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="an-bm2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7ad9" stop-opacity=".6"/><stop offset="1" stop-color="#ff7ad9" stop-opacity="0"/></linearGradient></defs>`;
  b += `<rect width="360" height="220" fill="url(#an-bg)"/>`;
  b += `<g class="beam" style="transform-origin:220px 0px"><path d="M212 0 L 228 0 L 270 200 L 170 200 Z" fill="url(#an-bm)"/></g>`;
  b += `<g class="beam2" style="transform-origin:320px 0px"><path d="M314 0 L 326 0 L 360 200 L 280 200 Z" fill="url(#an-bm2)"/></g>`;
  b += `<g class="beam2" style="transform-origin:110px 0px"><path d="M104 0 L 116 0 L 150 200 L 70 200 Z" fill="url(#an-bm2)" opacity=".7"/></g>`;
  // Equalizer wall.
  const eqc = ['#7af0ff', '#c9a8ff', '#ff7ad9', '#ffd36b'];
  for (let i = 0; i < 14; i++) b += `<rect class="eq" style="animation-delay:${(i % 5) * 0.13}s" x="${190 + i * 11}" y="${84 - (i % 4) * 8}" width="7" height="${48 + (i % 4) * 8}" rx="2" fill="${eqc[i % 4]}" opacity=".85"/>`;
  // Stage and speakers.
  b += `<rect x="0" y="150" width="360" height="12" fill="#2a1046"/><path d="M0 162 H 360" stroke="#ff7ad9" stroke-width="2"/>`;
  b += `<g fill="#1a0a2e" stroke="#7a4fc0" stroke-width="2"><rect x="300" y="100" width="40" height="50" rx="4"/><circle cx="320" cy="114" r="7"/><circle cx="320" cy="136" r="10"/></g>`;
  // Crowd with hands up.
  let crowd = '';
  for (let i = 0; i < 16; i++) {
    const x = 6 + i * 23;
    const y = 192 + (i % 3) * 4;
    crowd += `<circle cx="${x}" cy="${y}" r="10" fill="#0c0420"/><rect x="${x - 12}" y="${y + 6}" width="24" height="30" rx="10" fill="#0c0420"/>`;
    if (i % 3 !== 1) crowd += `<path class="hand" style="animation-delay:${(i % 4) * 0.2}s" d="M${x + 7} ${y + 4} L ${x + 14} ${y - 20}" stroke="#0c0420" stroke-width="6" stroke-linecap="round"/>`;
  }
  // Notes floating up.
  const note = (x: number, y: number, c: string, d: number) =>
    `<g class="note" style="animation-delay:${d}s"><path d="M${x} ${y} V ${y - 18} L ${x + 12} ${y - 22} V ${y - 4}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linejoin="round"/><ellipse cx="${x - 3}" cy="${y}" rx="4.6" ry="3.6" fill="${c}"/><ellipse cx="${x + 9}" cy="${y - 4}" rx="4.6" ry="3.6" fill="${c}"/></g>`;
  b += note(170, 140, '#ffd36b', 0) + note(250, 150, '#7af0ff', 1.3) + note(140, 120, '#ff7ad9', 2.4) + note(300, 90, '#c9a8ff', 3);
  // bé Bi in a bomber jacket and star shades, mic in hand.
  const B = bi('amnhac', 34, 6, 152);
  b += kite(B.fist.x, B.fist.y, 196, 112, ['#7af0ff', '#8b4fd8', '#ff7ad9', '#c9a8ff'], 'kt', `<path d="M194 116 V 104 L 202 102 V 112" stroke="#fff" stroke-width="2" fill="none"/>`);
  b += B.svg + crowd;
  return wrap(id, b);
}

export const THEME_ART: Record<string, string> = {
  tet: tet(),
  hoadang: hoadang(),
  lanbien: lanbien(),
  amnhac: amnhac(),
};
