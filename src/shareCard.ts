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
  altitude: number;
  milestone: string;
  beaten: number | null;
  grid: string;
  link: string;
  kite: { body: string; inner: string; tail: string };
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
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (night) {
    g.addColorStop(0, '#070b1e');
    g.addColorStop(0.6, '#13285a');
    g.addColorStop(1, '#2c5e9a');
  } else {
    g.addColorStop(0, '#3a7fbc');
    g.addColorStop(0.6, '#7dbde4');
    g.addColorStop(1, '#d9eef3');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  if (night) {
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = `rgba(255,250,235,${0.3 + rnd() * 0.7})`;
      const r = rnd() * 2.4 + 0.6;
      ctx.beginPath();
      ctx.arc(rnd() * W, rnd() * H * 0.8, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (L >= 8.4) {
      const mg = ctx.createRadialGradient(830, 260, 60, 830, 260, 300);
      mg.addColorStop(0, 'rgba(255,240,190,.95)');
      mg.addColorStop(0.35, 'rgba(255,226,150,.9)');
      mg.addColorStop(0.36, 'rgba(255,220,140,.25)');
      mg.addColorStop(1, 'rgba(255,220,140,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(500, 0, 580, 600);
    }
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    for (const [x, y, s] of [[160, 300, 1], [880, 520, 1.3], [300, 760, 0.8]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, 120 * s, 46 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 70 * s, y + 10 * s, 70 * s, 34 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 80 * s, y + 8 * s, 80 * s, 36 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // String from the bottom corner up to the kite.
  ctx.strokeStyle = night ? 'rgba(255,255,255,.5)' : 'rgba(15,39,71,.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W + 20, H - 380);
  ctx.quadraticCurveTo(980, 700, 812, 478);
  ctx.stroke();
  kite(ctx, 800, 360, 1.7, d.kite);

  const ink = night ? '#ffffff' : '#0f2747';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e5533d';
  ctx.beginPath();
  ctx.roundRect(72, 86, 300, 58, 29);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = "700 30px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillText(`Thả Diều · ${d.dayLabel}`, 96, 126);

  ctx.fillStyle = ink;
  ctx.font = "800 130px 'Baloo 2', system-ui, sans-serif";
  ctx.shadowColor = '#e5533d';
  ctx.shadowOffsetY = 8;
  ctx.fillText(d.title, 72, 640);
  ctx.shadowColor = 'transparent';
  ctx.font = "600 44px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillStyle = night ? 'rgba(255,255,255,.85)' : 'rgba(15,39,71,.82)';
  ctx.fillText(d.subtitle, 76, 712);

  ctx.font = "800 96px 'Baloo 2', system-ui, sans-serif";
  ctx.fillStyle = '#ffd66b';
  if (!night) ctx.fillStyle = '#0f2747';
  ctx.fillText(formatAlt(d.altitude), 72, 860);
  ctx.font = "600 38px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillStyle = night ? 'rgba(255,255,255,.8)' : 'rgba(15,39,71,.8)';
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
      ctx.font = "800 34px 'Baloo 2', system-ui, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(String(TIERS[Number(ch)].points), x + size / 2, y + size / 2 + 12);
      ctx.textAlign = 'left';
    }
  });

  ctx.fillStyle = night ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.75)';
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

/** Shares through the phone's share sheet (Zalo, Messenger, Facebook…), or downloads the picture where that is not possible. */
export async function shareCard(blob: Blob, text: string, url: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], 'tha-dieu.png', { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text: `${text}\n${url}` });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tha-dieu.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
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
