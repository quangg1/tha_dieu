// The living sky of Thả Diều: posterized woodblock bands, objects placed at their real altitude on a log scale,
// the kite-string altimeter, and a kite that sways, leaps and dips.
import { MILESTONES, formatAlt } from '../../shared/scoring.js';

const INK = '#1f1b16';
const PAPER = '#f4ead2';
const SON = '#c0392b';
const HOE = '#e2a72e';
const LA = '#3f6b2c';
const TRANG = '#f3dc8a';
const CHAM_DEEP = '#142640';

type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
const css = (c: Rgb) => `rgb(${c.map((v) => Math.round(v)).join(',')})`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb;

/** Sky band colours [top, middle, bottom] by log10(altitude). */
const BAND_STOPS: [number, string, string, string][] = [
  [0, '#6db6e0', '#a7d8ee', '#bfe4f3'],
  [3, '#3a7fbc', '#6db6e0', '#a7d8ee'],
  [4.5, '#1d4a80', '#3a7fbc', '#6db6e0'],
  [5.2, '#101c3d', '#1d4a80', '#3a7fbc'],
  [7.5, '#070a1a', '#101c3d', '#1d4a80'],
  [9, '#070a1a', '#0a0f26', '#101c3d'],
  [16, '#0a0920', '#0d0b26', '#0a0f26'],
  [21, '#120c2e', '#1b1240', '#0d0b26'],
];

function bandsAt(L: number): [Rgb, Rgb, Rgb] {
  let i = 0;
  while (i < BAND_STOPS.length - 2 && L > BAND_STOPS[i + 1][0]) i++;
  const a = BAND_STOPS[i];
  const b = BAND_STOPS[Math.min(i + 1, BAND_STOPS.length - 1)];
  const t = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (L - a[0]) / (b[0] - a[0])));
  return [1, 2, 3].map((k) => mix(hex(a[k] as string), hex(b[k] as string), t)) as [Rgb, Rgb, Rgb];
}

export interface SkyLayout {
  /** Kite position as a fraction of the viewport. */
  kiteX: number;
  kiteY: number;
  /** Pixels per tenfold of altitude, as a fraction of viewport height. */
  decade: number;
  /** Kite width as a fraction of the viewport's short side. */
  kiteSize: number;
  ruler: boolean;
}

export const LAYOUTS: Record<'home' | 'play' | 'result', SkyLayout> = {
  home: { kiteX: 0.66, kiteY: 0.2, decade: 0.95, kiteSize: 0.3, ruler: false },
  play: { kiteX: 0.4, kiteY: 0.36, decade: 0.3, kiteSize: 0.2, ruler: true },
  result: { kiteX: 0.32, kiteY: 0.2, decade: 0.3, kiteSize: 0.16, ruler: false },
};

const LEAF = new Path2D('M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z');
const INNER = new Path2D('M60 60 C 82 76, 86 118, 60 170 C 34 118, 38 76, 60 60 Z');
const log = (alt: number) => Math.log10(Math.max(1, alt));

export class SkyScene {
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private raf = 0;
  private last = 0;
  private t = 0;
  private camL = 0;
  private targetL = 0;
  private alt = 0;
  private layout: SkyLayout = LAYOUTS.home;
  private kite = { y: 0, vy: 0, a: 0, va: 0 };
  private flutes = 1;
  private nervous = false;
  private stars: { x: number; y: number; r: number; tw: number }[] = [];
  private clouds: { L: number; x: number; w: number }[] = [];
  private reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private ro: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    for (let i = 0; i < 140; i++) this.stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.4, tw: Math.random() * 6.28 });
    const rnd = mulberry(7);
    for (let i = 0; i < 14; i++) this.clouds.push({ L: 2.5 + rnd() * 1.3 + (i > 10 ? 1.2 : 0), x: rnd(), w: 0.22 + rnd() * 0.3 });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
  }

  setLayout(l: SkyLayout) {
    this.layout = l;
  }

  /** Moves the camera to an altitude: the world slides past while the kite stays near its spot. */
  setAltitude(alt: number, animate = true) {
    this.alt = alt;
    this.targetL = log(alt);
    if (!animate || this.reduce) this.camL = this.targetL;
  }

  setFlutes(n: number) {
    this.flutes = Math.max(1, Math.min(3, n));
  }

  setNervous(on: boolean) {
    this.nervous = on;
  }

  /** The kite leaps: it starts lower, then springs up past its spot and settles. */
  boost(strength = 1) {
    if (this.reduce) return;
    this.kite.y += 90 * strength;
    this.kite.vy -= 260 * strength;
    this.kite.va -= 1.5;
  }

  /** The kite loses lift for a moment and wobbles. */
  dip(strength = 1) {
    if (this.reduce) return;
    this.kite.vy += 340 * strength;
    this.kite.va += (Math.random() < 0.5 ? -1 : 1) * 4 * strength;
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.W = r.width;
    this.H = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
    this.last = now;
    this.t += dt;
    this.camL += (this.targetL - this.camL) * (1 - Math.exp(-dt * 2.4));
    // Kite spring.
    const k = this.kite;
    k.vy += (-60 * k.y - 9 * k.vy) * dt;
    k.y += k.vy * dt;
    k.va += (-40 * k.a - 6 * k.va) * dt;
    k.a += k.va * dt;
    this.draw();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private y(L: number) {
    const { kiteY, decade } = this.layout;
    return this.H * kiteY - (L - this.camL) * this.H * decade;
  }

  private draw() {
    const { ctx, W, H } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const [top, mid, low] = bandsAt(this.camL);
    ctx.fillStyle = css(top);
    ctx.fillRect(0, 0, W, H * 0.3);
    ctx.fillStyle = css(mid);
    ctx.fillRect(0, H * 0.3 - 0.5, W, H * 0.34);
    ctx.fillStyle = css(low);
    ctx.fillRect(0, H * 0.64 - 0.5, W, H * 0.36 + 1);

    const starA = Math.max(0, Math.min(1, (this.camL - 4.3) / 1.3));
    if (starA > 0) {
      const drift = (this.camL * 37) % H;
      for (const s of this.stars) {
        const a = starA * (0.55 + 0.45 * Math.sin(this.t * 1.3 + s.tw));
        ctx.fillStyle = `rgba(244,234,210,${a})`;
        ctx.fillRect(s.x * W, (s.y * H + drift) % H, s.r, s.r);
      }
    }

    this.drawFar();
    this.drawNear();
    this.drawGround();
    if (this.layout.ruler) this.drawRuler();
    this.drawKite();
  }

  private visible(L: number, pad = 200) {
    const y = this.y(L);
    return y > -pad && y < this.H + pad;
  }

  private drawNear() {
    const { ctx, W } = this;
    // Storks.
    if (this.visible(2.08)) {
      const y0 = this.y(2.08);
      for (let i = 0; i < 5; i++) {
        const x = ((this.t * 18 + i * 37) % (W + 120)) - 60;
        const y = y0 + Math.sin(i * 2.1) * 16;
        const f = Math.sin(this.t * 6 + i) * 4;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 9, y - 3 + f);
        ctx.quadraticCurveTo(x - 4, y - 6, x, y);
        ctx.quadraticCurveTo(x + 4, y - 6, x + 9, y - 3 + f);
        ctx.stroke();
      }
    }
    // Fansipan.
    if (this.visible(3.5, 600)) {
      const peak = this.y(3.5);
      const base = this.y(2.3);
      ctx.fillStyle = LA;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W * 0.45, base);
      ctx.lineTo(W * 0.68, peak + (base - peak) * 0.45);
      ctx.lineTo(W * 0.78, peak);
      ctx.lineTo(W * 0.9, peak + (base - peak) * 0.35);
      ctx.lineTo(W * 1.1, base);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PAPER;
      ctx.beginPath();
      ctx.moveTo(W * 0.78, peak);
      ctx.lineTo(W * 0.74, peak + (base - peak) * 0.12);
      ctx.lineTo(W * 0.82, peak + (base - peak) * 0.12);
      ctx.closePath();
      ctx.fill();
    }
    // Clouds: paper cut-outs with ink edges.
    for (const c of this.clouds) {
      if (!this.visible(c.L)) continue;
      const y = this.y(c.L);
      const x = ((c.x * (W + 200) + this.t * 6) % (W + 200)) - 100;
      const w = c.w * W;
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, w, 22, 11);
      roundRect(ctx, x + w * 0.2, y - 14, w * 0.45, 22, 11);
    }
    // Plane.
    if (this.visible(4)) {
      const y = this.y(4);
      const x = ((this.t * 40) % (W + 160)) - 80;
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 46, y - 2);
      ctx.quadraticCurveTo(x + 58, y, x + 46, y + 2);
      ctx.lineTo(x, y + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 1);
      ctx.lineTo(x + 12, y - 12);
      ctx.lineTo(x + 18, y - 12);
      ctx.lineTo(x + 32, y - 1);
      ctx.moveTo(x + 22, y + 1);
      ctx.lineTo(x + 12, y + 12);
      ctx.lineTo(x + 18, y + 12);
      ctx.lineTo(x + 32, y + 1);
      ctx.fill();
      ctx.stroke();
    }
    // Edge of space.
    if (this.visible(5)) {
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(244,234,210,.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const y = this.y(5);
      ctx.moveTo(0, y + 30);
      ctx.quadraticCurveTo(W / 2, y - 30, W, y + 30);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawFar() {
    const { ctx, W } = this;
    // Space station and Vinasat drift across.
    for (const [L, speed, wide] of [[5.6, 30, 34], [7.55, 12, 26]] as const) {
      if (!this.visible(L)) continue;
      const y = this.y(L);
      const x = ((this.t * speed + L * 100) % (W + 100)) - 50;
      ctx.fillStyle = CHAM_DEEP;
      ctx.strokeStyle = PAPER;
      ctx.lineWidth = 1.5;
      ctx.fillRect(x - wide / 2, y - 4, wide * 0.32, 8);
      ctx.strokeRect(x - wide / 2, y - 4, wide * 0.32, 8);
      ctx.fillRect(x + wide / 2 - wide * 0.32, y - 4, wide * 0.32, 8);
      ctx.strokeRect(x + wide / 2 - wide * 0.32, y - 4, wide * 0.32, 8);
      ctx.fillStyle = PAPER;
      ctx.fillRect(x - 5, y - 5, 10, 10);
    }
    // Moon with the banyan tree and chú Cuội.
    if (this.visible(8.585, 400)) {
      const y = this.y(8.585);
      const r = Math.min(W, this.H) * 0.26;
      const cx = W * 0.7;
      ctx.fillStyle = INK;
      disc(ctx, cx + 5, y + 5, r);
      ctx.fillStyle = TRANG;
      disc(ctx, cx, y, r);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#e2c46a';
      disc(ctx, cx - r * 0.5, y - r * 0.45, r * 0.12);
      disc(ctx, cx + r * 0.55, y + r * 0.5, r * 0.09);
      disc(ctx, cx - r * 0.35, y + r * 0.55, r * 0.08);
      ctx.fillStyle = INK;
      ctx.fillRect(cx - r * 0.04, y - r * 0.05, r * 0.08, r * 0.62);
      ctx.fillStyle = LA;
      ctx.beginPath();
      ctx.ellipse(cx, y - r * 0.18, r * 0.5, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      disc(ctx, cx + r * 0.32, y + r * 0.38, r * 0.06);
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.22, y + r * 0.62);
      ctx.quadraticCurveTo(cx + r * 0.32, y + r * 0.36, cx + r * 0.42, y + r * 0.62);
      ctx.fill();
      const wave = Math.sin(this.t * 3) * 0.25;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.36, y + r * 0.45);
      ctx.lineTo(cx + r * 0.5, y + r * (0.3 + wave * 0.2));
      ctx.stroke();
    }
    // Planets.
    for (const [L, col, ring] of [[11.35, '#c4532f', false], [11.89, '#d9a066', true], [12.65, '#3a7fbc', false]] as const) {
      if (!this.visible(L, 120)) continue;
      const y = this.y(L);
      const x = W * (L === 11.89 ? 0.25 : 0.72);
      const r = L === 11.89 ? 34 : 20;
      ctx.fillStyle = col;
      disc(ctx, x, y, r);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (ring) {
        ctx.strokeStyle = PAPER;
        ctx.lineWidth = 3;
        for (const dy of [-8, 4, 14]) {
          ctx.beginPath();
          ctx.moveTo(x - r * 0.9, y + dy);
          ctx.lineTo(x + r * 0.9, y + dy);
          ctx.stroke();
        }
      }
    }
    // Oort cloud.
    if (this.visible(15.98, 300)) {
      const y0 = this.y(15.98);
      const rnd = mulberry(3);
      ctx.fillStyle = 'rgba(167,216,238,.7)';
      for (let i = 0; i < 160; i++) ctx.fillRect(rnd() * W, y0 + (rnd() - 0.5) * 220, 2, 2);
    }
    // Sông Ngân: a river of stars, crossed by a bridge of magpies.
    if (this.visible(20.4, 500)) {
      const y0 = this.y(20.4);
      const rnd = mulberry(11);
      for (let i = 0; i < 420; i++) {
        const u = rnd();
        const x = u * W;
        const y = y0 - (u - 0.5) * 260 + (rnd() - 0.5) * 90;
        ctx.fillStyle = `rgba(244,234,210,${0.3 + rnd() * 0.7})`;
        ctx.fillRect(x, y, 1.6, 1.6);
      }
      ctx.strokeStyle = TRANG;
      ctx.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        const x = W * 0.3 + i * W * 0.05;
        const y = y0 + Math.sin(i / 8 * Math.PI) * -26 + 10;
        ctx.beginPath();
        ctx.moveTo(x - 7, y - 2);
        ctx.quadraticCurveTo(x - 3, y - 6, x, y);
        ctx.quadraticCurveTo(x + 3, y - 6, x + 7, y - 2);
        ctx.stroke();
      }
    }
  }

  private drawGround() {
    const { ctx, W, H } = this;
    const yg = this.y(-0.55);
    if (yg > H + 10) return;
    // Bamboo grove on the left: leaning culms with leaf clumps, at most ~130px tall.
    const gh = Math.min(130, H * 0.16);
    const top = yg - gh;
    for (let i = 0; i < 9; i++) {
      const bx = W * 0.02 + i * W * 0.045;
      const lean = Math.sin(this.t * 1.1 + i * 0.7) * 4 + (i - 4) * 2;
      const h = gh * (0.7 + 0.3 * Math.abs(Math.sin(i * 2.3)));
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx, yg);
      ctx.quadraticCurveTo(bx + lean * 0.3, yg - h * 0.5, bx + lean, yg - h);
      ctx.stroke();
    }
    ctx.fillStyle = LA;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const cx = W * 0.05 + i * W * 0.07 + Math.sin(this.t * 1.1 + i) * 3;
      const cy = top + gh * 0.18 + Math.abs(Math.sin(i * 1.9)) * gh * 0.25;
      ctx.beginPath();
      ctx.ellipse(cx, cy, W * 0.06, gh * 0.16, Math.sin(i) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Communal house roof on the right.
    const ry = yg - Math.min(70, gh * 0.55);
    ctx.fillStyle = SON;
    ctx.beginPath();
    ctx.moveTo(W * 0.58, yg - (yg - ry) * 0.35);
    ctx.quadraticCurveTo(W * 0.62, ry, W * 0.68, ry);
    ctx.lineTo(W * 0.9, ry);
    ctx.quadraticCurveTo(W * 0.96, ry, W * 1.0, yg - (yg - ry) * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e9dcbc';
    ctx.fillRect(W * 0.62, yg - (yg - ry) * 0.35, W * 0.34, (yg - ry) * 0.35);
    ctx.strokeRect(W * 0.62, yg - (yg - ry) * 0.35, W * 0.34, (yg - ry) * 0.35);
    // Fields.
    ctx.fillStyle = LA;
    ctx.fillRect(0, yg, W, H - yg + 10);
    ctx.strokeStyle = 'rgba(244,234,210,.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const y = yg + i * 14;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y + i * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, yg);
    ctx.lineTo(W, yg);
    ctx.stroke();
  }

  private drawRuler() {
    const { ctx, W, H } = this;
    const x = W - 16;
    const light = (L: number) => L >= 4.3;
    ctx.strokeStyle = this.camL >= 4.3 ? 'rgba(244,234,210,.6)' : 'rgba(31,27,22,.5)';
    ctx.lineWidth = 2;
    const yk0 = this.H * this.layout.kiteY;
    const r0 = Math.max(120, yk0 - H * 0.2);
    const r1 = Math.min(H * 0.6, yk0 + H * 0.28);
    ctx.beginPath();
    ctx.moveTo(x, r0);
    ctx.lineTo(x, r1);
    ctx.stroke();
    ctx.textAlign = 'right';
    for (const m of MILESTONES) {
      const L = m.alt <= 0 ? -0.55 : log(m.alt);
      const y = this.y(L);
      if (y < r0 || y > r1 || Math.abs(y - yk0) < 26) continue;
      const passed = log(this.alt) >= L;
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = INK;
      disc(ctx, x, y, 5);
      ctx.stroke();
      ctx.globalAlpha = passed ? 0.6 : 1;
      ctx.fillStyle = light(L) ? PAPER : INK;
      ctx.font = "700 12px 'Be Vietnam Pro', system-ui, sans-serif";
      ctx.fillText(m.name, x - 12, y - 1);
      ctx.font = "500 11px 'Be Vietnam Pro', system-ui, sans-serif";
      ctx.fillText(m.alt ? formatAlt(m.alt) : '0 m', x - 12, y + 13);
      ctx.globalAlpha = 1;
    }
    // Current altitude marker at the kite's height.
    const yk = this.H * this.layout.kiteY;
    const label = formatAlt(this.alt);
    ctx.font = "800 13px 'Baloo 2', system-ui, sans-serif";
    const w = ctx.measureText(label).width + 14;
    ctx.fillStyle = SON;
    ctx.strokeStyle = INK;
    roundRect(ctx, x - 14 - w, yk - 11, w, 22, 4);
    ctx.fillStyle = PAPER;
    ctx.fillText(label, x - 21, yk + 5);
    ctx.fillStyle = SON;
    disc(ctx, x, yk, 7);
    ctx.stroke();
  }

  private drawKite() {
    const { ctx, W, H } = this;
    const L = this.layout;
    const size = Math.min(W, H) * L.kiteSize;
    const s = size / 120;
    const nerv = this.nervous ? Math.sin(this.t * 17) * 0.05 : 0;
    const sway = this.reduce ? 0 : Math.sin(this.t * 1.6) * 0.07 + Math.sin(this.t * 0.55) * 0.05 + nerv;
    const kx = W * L.kiteX + (this.reduce ? 0 : Math.sin(this.t * 0.8) * W * 0.02);
    const ky = H * L.kiteY + this.kite.y + (this.reduce ? 0 : Math.sin(this.t * 1.1) * 4);
    const angle = sway + this.kite.a * 0.1;
    // String: from the bridle point down past the bottom-left corner, sagging with the wind.
    const ax = kx + Math.sin(angle) * 20 * s;
    const ay = ky + 20 * s;
    const ex = -W * 0.08;
    const ey = H + 40;
    const sag = 40 + Math.sin(this.t * 0.9) * 12 + Math.max(0, this.kite.y) * 0.4;
    ctx.strokeStyle = this.camL >= 4.3 ? 'rgba(244,234,210,.85)' : INK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo((ax + ex) / 2 + sag, (ay + ey) / 2, ex, ey);
    ctx.stroke();

    const moon = this.camL >= 8.58;
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(angle);
    ctx.scale(s, s);
    ctx.translate(-60, -104);
    ctx.lineJoin = 'round';
    // Flutes.
    const tubes = [[28, 0, 64, 9], [34, 10, 52, 8], [40, 19, 40, 7]].slice(0, this.flutes).reverse();
    ctx.fillStyle = '#c99b4a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2 / Math.max(0.6, s);
    for (const [x, y, w, h] of tubes) {
      roundRect(ctx, x, y + (3 - this.flutes) * 9 + 4, w, h, h / 2);
    }
    ctx.beginPath();
    ctx.moveTo(60, 26);
    ctx.lineTo(60, 30);
    ctx.stroke();
    // Ink plate printed off-register under the kite.
    ctx.save();
    ctx.translate(4, 4);
    ctx.fillStyle = INK;
    ctx.fill(LEAF);
    ctx.restore();
    ctx.fillStyle = moon ? CHAM_DEEP : SON;
    ctx.fill(LEAF);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = moon ? PAPER : INK;
    ctx.stroke(LEAF);
    ctx.fillStyle = moon ? TRANG : HOE;
    ctx.fill(INNER);
    ctx.strokeStyle = moon ? PAPER : INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 30);
    ctx.lineTo(60, 214);
    ctx.moveTo(18, 100);
    ctx.quadraticCurveTo(60, 84, 102, 100);
    ctx.stroke();
    ctx.fillStyle = moon ? TRANG : SON;
    disc(ctx, 60, 104, 7);
    ctx.stroke();
    ctx.restore();
  }
}

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.stroke();
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
