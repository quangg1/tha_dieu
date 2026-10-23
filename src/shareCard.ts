// A 1080×1350 result card for Facebook, Zalo and stories: the sky at the player's height, their kite,
// the day's title, the altitude, the seven rarity tiles and the link.
import { TIERS, formatAlt } from '../shared/scoring.js';
import { TIER_COLOR } from './icons';

const W = 1080;
const H = 1350;

export interface CardData {
  dayLabel: string;
  title: string;
  subtitle: string;
  /** A cheeky line in a speech bubble above the title. */
  quote?: string;
  altitude: number;
  milestone: string;
  beaten: number | null;
  grid: string;
  link: string;
  kite: { body: string; inner: string; tail: string };
  /** The scene at the player's altitude, painted by the sky at the card's size. */
  scene?: HTMLCanvasElement;
}

function kite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, c: CardData['kite']) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  ctx.scale(s, s);
  ctx.translate(-60, -104);
  const leaf = new Path2D('M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z');
  const inner = new Path2D('M60 60 C 82 76, 86 118, 60 170 C 34 118, 38 76, 60 60 Z');
  ctx.strokeStyle = c.tail;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 10; i++) {
    const px = 60 + Math.sin(i * 0.8) * (4 + i * 1.6);
    const py = 214 + i * 12;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = '#c99b4a';
  ctx.strokeStyle = '#1f1b16';
  ctx.lineWidth = 2;
  for (const [tx, ty, tw, th] of [[28, 0, 64, 9], [34, 10, 52, 8], [40, 19, 40, 7]]) {
    ctx.beginPath();
    ctx.roundRect(tx, ty + 4, tw, th, th / 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.save();
  ctx.translate(6, 7);
  ctx.fill(leaf);
  ctx.restore();
  ctx.fillStyle = c.body;
  ctx.fill(leaf);
  ctx.lineWidth = 3;
  ctx.stroke(leaf);
  ctx.fillStyle = c.inner;
  ctx.fill(inner);
  ctx.beginPath();
  ctx.moveTo(60, 30);
  ctx.lineTo(60, 214);
  ctx.moveTo(18, 100);
  ctx.quadraticCurveTo(60, 84, 102, 100);
  ctx.stroke();
  ctx.restore();
}

export async function renderCard(d: CardData): Promise<Blob | null> {
  try {
    await document.fonts?.ready;
  } catch {
    /* fonts not ready: system fallback */
  }
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const L = Math.log10(Math.max(1, d.altitude));
  const night = L >= 4.3;
  if (d.scene) {
    ctx.drawImage(d.scene, 0, 0, W, H);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, night ? '#070b1e' : '#3a7fbc');
    g.addColorStop(1, night ? '#2c5e9a' : '#d9eef3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    kite(ctx, 800, 360, 1.7, d.kite);
  }
  // A soft shade under the text so it reads over any layer of the sky.
  const shade = ctx.createLinearGradient(0, H * 0.36, 0, H);
  shade.addColorStop(0, 'rgba(6,12,32,0)');
  shade.addColorStop(0.25, 'rgba(6,12,32,.55)');
  shade.addColorStop(1, 'rgba(6,12,32,.82)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, H * 0.36, W, H * 0.64);

  const ink = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e5533d';
  ctx.font = "700 30px 'Be Vietnam Pro', system-ui, sans-serif";
  const tag = `Bilion · thả diều mỗi ngày · ${d.dayLabel}`;
  ctx.beginPath();
  ctx.roundRect(72, 86, ctx.measureText(tag).width + 48, 58, 29);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(tag, 96, 126);

  if (d.quote) quoteBubble(ctx, d.quote);

  ctx.fillStyle = ink;
  ctx.font = "900 130px 'Grandstander', system-ui, sans-serif";
  ctx.shadowColor = '#e5533d';
  ctx.shadowOffsetY = 8;
  ctx.fillText(d.title, 72, 640);
  ctx.shadowColor = 'transparent';
  ctx.font = "600 44px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillStyle = 'rgba(255,255,255,.88)';
  ctx.fillText(d.subtitle, 76, 712);

  ctx.font = "900 96px 'Grandstander', system-ui, sans-serif";
  ctx.fillStyle = '#ffd66b';
  ctx.fillText(formatAlt(d.altitude), 72, 860);
  ctx.font = "600 38px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.fillText([d.milestone ? `qua ${d.milestone}` : '', d.beaten != null ? `cao hơn ${d.beaten}% người chơi` : ''].filter(Boolean).join(' · '), 76, 920);

  const cells = d.grid.split('').slice(0, 7);
  const size = 112;
  const gap = 18;
  cells.forEach((ch, i) => {
    const x = 72 + i * (size + gap);
    const y = 990;
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.beginPath();
    ctx.roundRect(x, y + 6, size, size, 26);
    ctx.fill();
    ctx.fillStyle = ch === 'x' ? 'rgba(255,255,255,.25)' : TIER_COLOR[Number(ch)];
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 26);
    ctx.fill();
    if (ch !== 'x') {
      ctx.fillStyle = '#fff';
      ctx.font = "900 34px 'Grandstander', system-ui, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(String(TIERS[Number(ch)].points), x + size / 2, y + size / 2 + 12);
      ctx.textAlign = 'left';
    }
  });

  ctx.fillStyle = 'rgba(255,255,255,.14)';
  ctx.beginPath();
  ctx.roundRect(72, 1176, W - 144, 104, 52);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.font = "700 36px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillText('Đáp án càng hiếm, diều càng cao. Bạn bay tới đâu?', 110, 1222);
  ctx.font = "600 30px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillStyle = '#e5533d';
  ctx.fillText(d.link.replace(/^https?:\/\//, '').split(/[/?]/)[0], 110, 1262);
  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}

/** A white speech bubble with the quote, wrapped to two lines, sitting above the title. */
function quoteBubble(ctx: CanvasRenderingContext2D, text: string) {
  ctx.save();
  ctx.font = "700 40px 'Be Vietnam Pro', system-ui, sans-serif";
  const max = 560;
  const lines: string[] = [];
  let line = '';
  for (const word of `“${text}”`.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 3);
  const w = Math.max(...shown.map((l) => ctx.measureText(l).width)) + 64;
  const h = shown.length * 54 + 40;
  const x = 72;
  const y = 470 - h;
  ctx.shadowColor = 'rgba(0,0,0,.25)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#fffdf6';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 28);
  ctx.moveTo(x + 60, y + h - 12);
  ctx.lineTo(x + 52, y + h + 34);
  ctx.lineTo(x + 104, y + h - 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#2a2018';
  ctx.textBaseline = 'alphabetic';
  shown.forEach((l, i) => ctx.fillText(l, x + 32, y + 62 + i * 54));
  ctx.restore();
}

/** True when the device has a native share sheet that can carry the image file itself (phones, some tablets). */
export function canShareImage(blob?: Blob): boolean {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (!nav.share || !nav.canShare) return false;
  const file = new File([blob ?? new Blob()], 'tha-dieu.png', { type: 'image/png' });
  return nav.canShare({ files: [file] });
}

/** True when the browser can put an image on the clipboard (Chrome/Edge on Windows, macOS). */
export function canCopyImage(): boolean {
  return typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write;
}

/** Opens the native share sheet with the image. Returns 'cancelled' if the user backs out. */
export async function shareImageFile(blob: Blob, text: string, url: string): Promise<'shared' | 'cancelled'> {
  const file = new File([blob], 'tha-dieu.png', { type: 'image/png' });
  try {
    await navigator.share({ files: [file], text: `${text}\n${url}` });
    return 'shared';
  } catch {
    return 'cancelled';
  }
}

/** Copies the image to the clipboard so it can be pasted straight into Facebook, Zalo or Messenger. */
export async function copyImage(blob: Blob): Promise<'copied' | 'failed'> {
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return 'copied';
  } catch {
    return 'failed';
  }
}

/** Saves the image as a file. The last resort when a device can neither share nor copy it. */
export function downloadImage(blob: Blob): 'downloaded' {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tha-dieu.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}

/** Shares through the phone's share sheet, else copies the image, else downloads it — for one-tap sharing. */
export async function shareCard(blob: Blob, text: string, url: string): Promise<'shared' | 'copied' | 'downloaded' | 'cancelled'> {
  if (canShareImage(blob)) return shareImageFile(blob, text, url);
  if (canCopyImage()) {
    const r = await copyImage(blob);
    if (r === 'copied') return 'copied';
  }
  return downloadImage(blob);
}

/** Opens a share intent for a social network in a new tab, carrying the result link (and text where the network allows). */
export function openSocialShare(network: 'facebook' | 'x' | 'telegram', text: string, url: string): void {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const href =
    network === 'facebook' ? `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`
    : network === 'x' ? `https://twitter.com/intent/tweet?text=${t}&url=${u}`
    : `https://t.me/share/url?url=${u}&text=${t}`;
  window.open(href, '_blank', 'noopener,noreferrer,width=640,height=640');
}

/** A link that opens the game with a friend's result as a challenge. */
export function challengeLink(origin: string, c: { n: string; a: number; d: string; t: string }) {
  const json = JSON.stringify(c);
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${origin}/?c=${b64}`;
}

export function readChallenge(search: string): { n: string; a: number; d: string; t: string } | null {
  const v = new URLSearchParams(search).get('c');
  if (!v) return null;
  try {
    const bin = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
    const j = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0))));
    if (typeof j.a !== 'number' || typeof j.d !== 'string') return null;
    return { n: String(j.n ?? 'Một người bạn').slice(0, 24), a: j.a, d: j.d.slice(0, 10), t: String(j.t ?? '').slice(0, 40) };
  } catch {
    return null;
  }
}
