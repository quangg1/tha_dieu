// Shared sprite loading, plus the white storks that cross the low sky.

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

/** A white stork in flight, flat and soft: two wing frames for a slow flap. */
export function storkSvg(frame: 0 | 1) {
  const wing =
    frame === 0
      ? `<path d="M30 22 C 24 6, 44 0, 60 4 C 50 8, 42 14, 37 24 Z" fill="#ffffff"/><path d="M50 3.4 C 54 3, 58 3.4, 60 4 C 56 6, 53 8, 50 10 Z" fill="#2b2f3a"/><path d="M33 22 C 36 16, 42 12, 48 10" stroke="#d5dde6" stroke-width="2" fill="none"/>`
      : `<path d="M30 24 C 24 40, 44 48, 60 44 C 50 38, 42 32, 37 24 Z" fill="#ffffff"/><path d="M50 44.6 C 54 45, 58 44.6, 60 44 C 56 42, 53 40, 50 38 Z" fill="#2b2f3a"/><path d="M33 26 C 36 32, 42 36, 48 38" stroke="#d5dde6" stroke-width="2" fill="none"/>`;
  const body = `
    <path d="M14 26 C 20 18, 40 18, 48 24 C 40 30, 22 32, 14 26 Z" fill="#ffffff"/>
    <path d="M16 27 C 24 30, 38 29, 46 25" stroke="#d5dde6" stroke-width="2" fill="none"/>
    <path d="M47 24 C 56 22, 60 16, 66 18 C 70 19, 70 23, 66 24" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M66 18.5 L 82 20.5 L 66 22.5 Z" fill="#f0a63a"/>
    <path d="M15 26 L 0 28 M15 27 L 1 31" stroke="#f0a63a" stroke-width="1.8" stroke-linecap="round"/>
    ${wing}`;
  return { svg: svg(84, 50, body), w: 84, h: 50 };
}

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
