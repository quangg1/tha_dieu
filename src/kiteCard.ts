// The result as a kite: the player's own kite high in the sky at their height, and the day's seven answers tied
// along its tail as bows, each bow the colour of its rarity. Missed prompts are empty bows. 1080×1350, for Zalo,
// Facebook and stories; one look and it reads as Bilion.
import { TIERS, formatAlt } from '../shared/scoring.js';
import { TIER_COLOR } from './icons';
import { kiteArt, sailSvg } from './kites';

const W = 1080;
const H = 1350;
const INK = '#1f1b16';
const DISPLAY = "'Grandstander', system-ui, sans-serif";
const BODY = "'Be Vietnam Pro', system-ui, sans-serif";

export interface KiteCardData {
  dayLabel: string;
  title: string;
  subtitle: string;
  altitude: number;
  score: number;
  milestone: string;
  beaten: number | null;
  grid: string;
  /** Points each answer earned, in order (daily flights), shown in the bows' knots. */
  points?: number[];
  link: string;
  skin: string;
  /** The flight's rarest answer, if any was rare. */
  rare?: { text: string; tier: number };
  /** Where the player's long trip has reached. */
  station?: string;
  /** The sky at the player's height, painted without a kite at the card's size. */
  scene?: HTMLCanvasElement;
}

type Pt = { x: number; y: number };

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

/** A point and its direction on a cubic Bézier. */
function bez(p: Pt[], t: number): { p: Pt; a: number } {
  const u = 1 - t;
  const x = u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x;
  const y = u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y;
  const dx = 3 * u * u * (p[1].x - p[0].x) + 6 * u * t * (p[2].x - p[1].x) + 3 * t * t * (p[3].x - p[2].x);
  const dy = 3 * u * u * (p[1].y - p[0].y) + 6 * u * t * (p[2].y - p[1].y) + 3 * t * t * (p[3].y - p[2].y);
  return { p: { x, y }, a: Math.atan2(dy, dx) };
}

/** The tail as two joined Béziers; s runs 0 → 1 along the whole of it. */
function tailAt(segs: Pt[][], s: number) {
  const k = Math.min(segs.length - 1, Math.floor(s * segs.length));
  return bez(segs[k], s * segs.length - k);
}

/** Points evenly spaced by length along the tail, from s0 to s1. */
function evenly(segs: Pt[][], n: number, s0: number, s1: number) {
  const N = 400;
  const pts: Pt[] = [];
  for (let i = 0; i <= N; i++) pts.push(tailAt(segs, s0 + ((s1 - s0) * i) / N).p);
  const acc = [0];
  for (let i = 1; i <= N; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = acc[N];
  const out: number[] = [];
  for (let j = 0; j < n; j++) {
    const target = (total * j) / (n - 1);
    let i = 0;
    while (i < N && acc[i] < target) i++;
    out.push(s0 + ((s1 - s0) * i) / N);
  }
  return out;
}

function lighten(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v + (255 - v) * f);
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

function darken(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v * (1 - f));
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

/** One bow tied across the tail: two rounded wings, a knot in the middle with the points. */
function bow(ctx: CanvasRenderingContext2D, at: Pt, angle: number, size: number, tier: number | null, n: number, pts?: number) {
  const miss = tier == null;
  const col = miss ? '#ffffff' : TIER_COLOR[tier];
  const gold = tier === 5;
  ctx.save();
  ctx.translate(at.x, at.y);
  // Bows hang level-ish whatever the tail does, with a little of its swing.
  ctx.rotate(angle - Math.PI / 2 + (n % 2 ? 0.12 : -0.12));
  const w = size;
  const h = size * 0.62;
  const wing = (dir: 1 | -1) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.bezierCurveTo(dir * w * 0.22, -h * 0.9, dir * w * 0.62, -h * 0.72, dir * w * 0.56, -h * 0.08);
    p.quadraticCurveTo(dir * w * 0.6, h * 0.04, dir * w * 0.54, h * 0.18);
    p.bezierCurveTo(dir * w * 0.6, h * 0.78, dir * w * 0.2, h * 0.86, 0, 0);
    p.closePath();
    return p;
  };
  if (gold) {
    ctx.shadowColor = 'rgba(255,214,107,.95)';
    ctx.shadowBlur = 46;
  } else {
    ctx.shadowColor = 'rgba(8,16,40,.35)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
  }
  for (const dir of [-1, 1] as const) {
    const p = wing(dir);
    if (miss) {
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      ctx.fill(p);
      ctx.shadowColor = 'transparent';
      ctx.setLineDash([10, 9]);
      ctx.strokeStyle = 'rgba(255,255,255,.85)';
      ctx.lineWidth = 4;
      ctx.stroke(p);
      ctx.setLineDash([]);
    } else {
      const g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, lighten(col, 0.35));
      g.addColorStop(0.55, col);
      g.addColorStop(1, darken(col, 0.18));
      ctx.fillStyle = g;
      ctx.fill(p);
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4.5;
      ctx.lineJoin = 'round';
      ctx.stroke(p);
      // A fold line and a sheen, so the paper reads as a bow.
      ctx.strokeStyle = 'rgba(31,27,22,.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dir * w * 0.1, -h * 0.05);
      ctx.quadraticCurveTo(dir * w * 0.3, -h * 0.1, dir * w * 0.46, -h * 0.02);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(dir * w * 0.18, -h * 0.5);
      ctx.quadraticCurveTo(dir * w * 0.34, -h * 0.62, dir * w * 0.46, -h * 0.4);
      ctx.stroke();
    }
    if (gold) ctx.shadowColor = 'rgba(255,214,107,.95)';
  }
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  // The knot, upright so its number reads.
  ctx.rotate(-(angle - Math.PI / 2 + (n % 2 ? 0.12 : -0.12)));
  const r = size * 0.22;
  ctx.fillStyle = miss ? 'rgba(255,255,255,.3)' : '#fffdf6';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = miss ? 'rgba(255,255,255,.85)' : INK;
  ctx.stroke();
  ctx.fillStyle = miss ? '#ffffff' : darken(col, tier === 0 ? 0.45 : 0.25);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = miss ? '–' : String(pts ?? TIERS[tier].points);
  ctx.font = `900 ${Math.round(r * (label.length > 3 ? 0.66 : label.length > 2 ? 0.82 : 1.02))}px ${DISPLAY}`;
  ctx.fillText(label, 0, 2);
  ctx.restore();
  if (gold) sparkles(ctx, at, size);
}

function sparkles(ctx: CanvasRenderingContext2D, at: Pt, size: number) {
  ctx.save();
  ctx.fillStyle = '#fff6c8';
  const star = (x: number, y: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const rr = i % 2 ? r * 0.28 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  };
  star(at.x - size * 0.7, at.y - size * 0.42, 16);
  star(at.x + size * 0.74, at.y - size * 0.3, 12);
  star(at.x + size * 0.58, at.y + size * 0.5, 9);
  ctx.restore();
}

/** Wraps a line to a width, shrinking the font down to a floor before it wraps. */
function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, family: string, max: number, size: number, floor: number) {
  let s = size;
  for (; s > floor; s -= 4) {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= max) return { size: s, lines: [text] };
  }
  ctx.font = `${weight} ${floor}px ${family}`;
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return { size: floor, lines: lines.slice(0, 2) };
}

export async function renderKiteCard(d: KiteCardData): Promise<Blob | null> {
  try {
    await document.fonts?.ready;
  } catch {
    /* system fonts then */
  }
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const night = Math.log10(Math.max(1, d.altitude)) >= 4.3;

  // Sky.
  if (d.scene) ctx.drawImage(d.scene, 0, 0, W, H);
  else {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, night ? '#070b1e' : '#3a7fbc');
    g.addColorStop(1, night ? '#2c5e9a' : '#bfe6f7');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  // A shade rising from the bottom, so the words below read on any sky (sunny, cloud sea, stars); a lighter one at
  // the top for the tag.
  const fb = ctx.createLinearGradient(0, H - 560, 0, H);
  fb.addColorStop(0, 'rgba(6,14,36,0)');
  fb.addColorStop(0.45, 'rgba(6,14,36,.55)');
  fb.addColorStop(1, 'rgba(6,14,36,.86)');
  ctx.fillStyle = fb;
  ctx.fillRect(0, H - 560, W, 560);
  const ft = ctx.createLinearGradient(0, 0, 0, 200);
  ft.addColorStop(0, 'rgba(6,14,36,.32)');
  ft.addColorStop(1, 'rgba(6,14,36,0)');
  ctx.fillStyle = ft;
  ctx.fillRect(0, 0, W, 200);

  // The kite in the middle of the sky, the hero of the card, and where its tail starts.
  const kx = W / 2;
  const ky = 232;
  const kw = 210;
  const kh = (kw * 220) / 120;
  const tilt = -0.12;
  const art = kiteArt(d.skin);
  const tip0 = art.tails[0]?.at ?? [60, 214];
  const tx = (tip0[0] / 120 - 0.5) * kw;
  const ty = (tip0[1] / 220 - 0.5) * kh;
  const tip = { x: kx + tx * Math.cos(tilt) - ty * Math.sin(tilt), y: ky + tx * Math.sin(tilt) + ty * Math.cos(tilt) };

  // The tail: a loose S swinging under the kite, down to just above the words.
  const segs: Pt[][] = [
    [tip, { x: tip.x + 40, y: tip.y + 70 }, { x: 820, y: 470 }, { x: 710, y: 545 }],
    [{ x: 710, y: 545 }, { x: 590, y: 625 }, { x: 270, y: 565 }, { x: 290, y: 650 }],
    [{ x: 290, y: 650 }, { x: 310, y: 735 }, { x: 640, y: 690 }, { x: 770, y: 760 }],
  ];
  const tailPath = () => {
    ctx.beginPath();
    ctx.moveTo(segs[0][0].x, segs[0][0].y);
    for (const sg of segs) ctx.bezierCurveTo(sg[1].x, sg[1].y, sg[2].x, sg[2].y, sg[3].x, sg[3].y);
  };
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  tailPath();
  ctx.strokeStyle = 'rgba(31,27,22,.8)';
  ctx.lineWidth = 10;
  ctx.stroke();
  tailPath();
  ctx.strokeStyle = '#fff1cf';
  ctx.lineWidth = 5;
  ctx.stroke();

  // A soft halo behind the kite, then the kite on top of the tail's start.
  const halo = ctx.createRadialGradient(kx, ky, 20, kx, ky, 300);
  halo.addColorStop(0, night ? 'rgba(190,170,255,.42)' : 'rgba(255,248,220,.5)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(kx - 340, ky - 340, 680, 680);
  const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sailSvg(d.skin)));
  if (img) {
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(tilt);
    ctx.shadowColor = 'rgba(8,16,40,.35)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;
    ctx.drawImage(img, -kw / 2, -kh / 2, kw, kh);
    ctx.restore();
  }

  // Seven bows along the tail, biggest near the kite.
  const cells = d.grid.split('').slice(0, 7);
  while (cells.length < 7) cells.push('x');
  const at = evenly(segs, 7, 0.08, 0.99);
  cells.forEach((ch, i) => {
    const { p, a } = tailAt(segs, at[i]);
    const tier = ch === 'x' ? null : Number(ch);
    bow(ctx, p, a, 112 - i * 4, Number.isNaN(tier as number) ? null : tier, i, d.points?.[i]);
  });

  // The tag, top left.
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  const tag = `Bilion · ${d.dayLabel}`;
  ctx.font = `700 30px ${BODY}`;
  ctx.fillStyle = '#e5533d';
  ctx.beginPath();
  ctx.roundRect(64, 64, ctx.measureText(tag).width + 48, 58, 29);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(tag, 88, 104);

  // The words, bottom left, straight on the shaded sky: verdict, points, then the details in one line.
  const X = 72;
  const MAXW = W - 144;
  const t = fitText(ctx, d.title, 900, DISPLAY, MAXW, 112, 76);
  const sub = fitText(ctx, d.subtitle, 600, BODY, MAXW, 36, 30);
  const meta = [`Diều ${formatAlt(d.altitude)}`, d.milestone ? `qua ${d.milestone}` : '', d.beaten != null ? `cao hơn ${d.beaten}% làng` : ''].filter(Boolean).join(' · ');
  const chips: { text: string; color?: string }[] = [];
  if (d.rare) chips.push({ text: `“${d.rare.text}” · ${TIERS[d.rare.tier]?.name ?? ''}`, color: TIER_COLOR[d.rare.tier] });
  if (d.station) chips.push({ text: `Hành trình: ${d.station}` });

  // Lay out bottom-up from the footer so nothing ever overlaps it.
  const footTop = H - 140;
  let y = footTop - 44;
  const chipY = chips.length ? y : 0;
  if (chips.length) y -= 70;
  const metaY = y;
  y -= 62;
  const scoreY = y;
  y -= 96 + 18;
  const subY = y - (sub.lines.length - 1) * (sub.size + 10);
  y = subY - sub.size - 22;
  const titleY = y - (t.lines.length - 1) * t.size * 0.98;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#e5533d';
  ctx.shadowOffsetY = 7;
  ctx.font = `900 ${t.size}px ${DISPLAY}`;
  t.lines.forEach((l, i) => ctx.fillText(l, X, titleY + i * t.size * 0.98));
  ctx.shadowColor = 'rgba(4,10,30,.6)';
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.font = `600 ${sub.size}px ${BODY}`;
  sub.lines.forEach((l, i) => ctx.fillText(l, X + 2, subY + i * (sub.size + 10)));

  // Points lead (they decide the boards); the height and milestone follow on the line below.
  ctx.font = `900 104px ${DISPLAY}`;
  ctx.fillStyle = '#ffd66b';
  const scoreText = d.score.toLocaleString('vi-VN');
  ctx.fillText(scoreText, X, scoreY);
  const sw = ctx.measureText(scoreText).width;
  ctx.font = `800 42px ${DISPLAY}`;
  ctx.fillText('điểm', X + sw + 18, scoreY);
  const mf = fitText(ctx, meta, 600, BODY, MAXW, 32, 24);
  ctx.font = `600 ${mf.size}px ${BODY}`;
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillText(mf.lines[0], X + 2, metaY);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Chips: the rarest answer and the long trip, side by side when they fit, the trip dropped when they do not.
  let cx = X;
  for (const ch of chips) {
    const pad = ch.color ? 56 : 24;
    const room = X + MAXW - cx;
    const f = fitText(ctx, ch.text, 700, BODY, Math.min(room, MAXW) - pad - 24, 28, 22);
    ctx.font = `700 ${f.size}px ${BODY}`;
    const w = ctx.measureText(f.lines[0]).width + pad + 24;
    if (w > room + 1) break;
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.beginPath();
    ctx.roundRect(cx, chipY - 40, w, 54, 27);
    ctx.fill();
    if (ch.color) {
      ctx.fillStyle = ch.color;
      ctx.beginPath();
      ctx.arc(cx + 30, chipY - 13, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = ch.color ? '#ffffff' : 'rgba(255,233,170,.95)';
    ctx.fillText(f.lines[0], cx + pad, chipY - 3);
    cx += w + 14;
  }

  // Footer: the invitation on the left, the address in a red pill on the right; the invitation shrinks to fit.
  const host = d.link.replace(/^https?:\/\//, '').split(/[/?]/)[0];
  ctx.font = `800 30px ${BODY}`;
  const hw = ctx.measureText(host).width + 48;
  const fy = H - 112;
  ctx.fillStyle = 'rgba(255,253,246,.97)';
  ctx.beginPath();
  ctx.roundRect(56, fy, W - 112, 76, 38);
  ctx.fill();
  ctx.fillStyle = '#e5533d';
  ctx.beginPath();
  ctx.roundRect(W - 56 - 10 - hw, fy + 10, hw, 56, 28);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(host, W - 56 - 10 - hw + 24, fy + 49);
  const inviteRoom = W - 112 - hw - 10 - 40 - 24;
  const inv = fitText(ctx, 'Đáp án càng hiếm, diều càng cao.', 700, BODY, inviteRoom, 30, 20);
  ctx.font = `700 ${inv.size}px ${BODY}`;
  ctx.fillStyle = '#0f2747';
  ctx.fillText(inv.lines.length > 1 ? 'Đáp án hiếm, diều cao.' : inv.lines[0], 92, fy + 49);

  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}
