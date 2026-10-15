// The living sky of Thả Diều: posterized woodblock bands, objects placed at their real altitude on a log scale,
// the kite-string altimeter, and a kite that sways, leaps and dips.
import { MILESTONES, formatAlt } from '../../shared/scoring.js';
import * as Art from './art';

let ART: ReturnType<typeof makeArt> | null = null;
function makeArt() {
  return {
    sun: Art.sprite(Art.sunSvg()),
    clouds: [Art.sprite(Art.cloudSvg(0)), Art.sprite(Art.cloudSvg(1))],
    stork: [Art.sprite(Art.storkSvg(0)), Art.sprite(Art.storkSvg(1))],
    dinh: Art.sprite(Art.dinhSvg()),
    bamboo: Art.sprite(Art.bambooSvg()),
    fansipan: Art.sprite(Art.fansipanSvg()),
    plane: Art.sprite(Art.planeSvg()),
    station: Art.sprite(Art.stationSvg()),
    vinasat: Art.sprite(Art.vinasatSvg()),
    moon: Art.sprite(Art.moonSvg()),
    moonArm: Art.moonSvg().arm,
    mars: Art.sprite(Art.planetSvg('mars')),
    jupiter: Art.sprite(Art.planetSvg('jupiter')),
    neptune: Art.sprite(Art.planetSvg('neptune')),
    magpie: Art.sprite(Art.magpieSvg()),
    comet: Art.sprite(Art.cometSvg()),
  };
}

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
  /** Pixels at the top covered by the page's own bar; the scene keeps its fixed pieces below it. */
  top?: number;
  /** Width of the page's central column on wide screens; fixed landmarks are moved into the margins beside it. */
  column?: number;
  /** Upper bound on the kite width in pixels. */
  kiteMax?: number;
  /** Where the field sits on the log scale; lower values leave more open sky under the kite at take-off. */
  ground?: number;
}

export const LAYOUTS: Record<'home' | 'play' | 'result', SkyLayout> = {
  home: { kiteX: 0.62, kiteY: 0.36, decade: 0.95, kiteSize: 0.3, ruler: false, kiteMax: 190, column: 460 },
  play: { kiteX: 0.5, kiteY: 0.2, decade: 0.3, kiteSize: 0.2, ruler: true, top: 64, column: 700, kiteMax: 110, ground: -1.9 },
  result: { kiteX: 0.32, kiteY: 0.2, decade: 0.3, kiteSize: 0.16, ruler: false, column: 520, kiteMax: 130 },
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
    ART ??= makeArt();
    for (let i = 0; i < 140; i++) this.stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.4, tw: Math.random() * 6.28 });
    const rnd = mulberry(7);
    for (let i = 0; i < 6; i++) this.clouds.push({ L: 2.4 + (i / 5) * 2 + rnd() * 0.12, x: (i * 0.37 + rnd() * 0.2) % 1, w: 0.17 + rnd() * 0.15 });
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
    // Posterized like a woodblock print, but in many shallow steps so no single hard edge cuts across the page.
    const [top, mid, low] = bandsAt(this.camL);
    const steps = 9;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      ctx.fillStyle = css(t < 0.5 ? mix(top, mid, t * 2) : mix(mid, low, (t - 0.5) * 2));
      ctx.fillRect(0, Math.floor((i * H) / steps), W, Math.ceil(H / steps) + 1);
    }

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

  /** Draws a sprite with its width set in pixels, centred on (x, y) unless an anchor says otherwise. */
  /** Sprite scale unit: the width on phones, capped so desktop skies don't fill up with giant clouds. */
  private get U() {
    return Math.min(this.W, 540);
  }

  /** Horizontal spot for a fixed landmark: a fraction of the width on phones, or a spot in the margin beside the page column on wide screens. */
  private gx(fx: number) {
    const col = this.layout.column;
    const { W } = this;
    if (!col || W < col + 420) return W * fx;
    const left = (W - col) / 2;
    const right = W - 64;
    return fx < 0.5 ? left * (0.15 + fx * 1.5) : (W + col) / 2 + (right - (W + col) / 2) * ((fx - 0.5) * 2);
  }

  /** Wide enough for fixed landmarks to sit in the margins beside the page column. */
  private get wide() {
    const col = this.layout.column;
    return !!col && this.W >= col + 420;
  }

  private get sunSize() {
    return Math.min(this.U, this.H) * (this.layout.column ? (this.wide ? 0.22 : 0.3) : 0.28);
  }

  private get top() {
    return this.layout.top ?? 0;
  }

  private put(sp: Art.Sprite, x: number, y: number, w: number, ax = 0.5, ay = 0.5, alpha = 1) {
    if (!sp.ready) return;
    const h = (w * sp.h) / sp.w;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(sp.img, x - w * ax, y - h * ay, w, h);
    this.ctx.globalAlpha = 1;
  }

  private drawNear() {
    const { W } = this;
    const A = ART!;
    // The Đông Sơn sun hangs in the daytime sky and fades as the kite reaches the edge of space.
    const sunA = Math.max(0, Math.min(1, (4.6 - this.camL) / 1.2));
    if (sunA > 0) {
      const size = this.sunSize;
      this.ctx.save();
      // On phones the sun peeks in from the top-left corner, clear of the altimeter on the right.
      const narrow = this.layout.ruler && !!this.layout.column && !this.wide;
      const sx = this.wide ? this.gx(0.8) : narrow ? size * 0.26 : W * 0.82;
      const sy = narrow ? this.top + size * 0.24 + this.camL * 4 : this.top + size * 0.62 + this.H * 0.02 + this.camL * 6;
      this.ctx.translate(sx, sy);
      this.ctx.rotate(this.reduce ? 0 : this.t * 0.02);
      this.put(A.sun, 0, 0, size, 0.5, 0.5, sunA);
      this.ctx.restore();
    }
    // Fansipan with its rice terraces, peak at 3.143 m.
    // Fansipan rises above a sea of clouds, so the peak sits at its real height without a mountain floating in the sky.
    if (this.visible(3.5, 500)) {
      const peakY = this.y(3.497);
      const w = Math.min(this.U * 0.6, 330);
      const h = (w * A.fansipan.h) / A.fansipan.w;
      const px = this.wide ? this.gx(0.22) : W * 0.3;
      this.put(A.fansipan, px, peakY, w, 300 / 466, 14 / 306);
      const left = px - w * (300 / 466);
      const baseY = peakY + h * 0.82;
      for (let i = 0; i < 4; i++) {
        const cx = left - w * 0.08 + (w * 1.16 * i) / 3;
        const cw = w * (0.44 + (i % 2) * 0.08);
        this.put(A.clouds[i % 2], cx + Math.sin(this.t * 0.4 + i) * 3, baseY + (i % 2) * h * 0.1, cw);
      }
    }
    // White storks.
    if (this.visible(2.08)) {
      const y0 = this.y(2.08);
      for (let i = 0; i < 5; i++) {
        const x = ((this.t * 22 + i * 61) % (W + 160)) - 80;
        const y = y0 + Math.sin(i * 2.1) * 18 + Math.sin(this.t * 0.8 + i) * 4;
        const frame = Math.floor(this.t * 3 + i) % 2;
        this.put(A.stork[frame], x, y, this.U * (0.11 + (i % 2) * 0.03));
      }
    }
    // Scrolling clouds.
    for (const [i, c] of this.clouds.entries()) {
      if (!this.visible(c.L)) continue;
      const y = this.y(c.L);
      const w = c.w * this.U * 1.3;
      const x = ((c.x * (W + w) + this.t * (5 + (i % 3) * 2)) % (W + w)) - w / 2;
      this.put(A.clouds[i % 2], x, y, w);
    }
    // An airliner crossing at 10 km.
    if (this.visible(4)) {
      const w = this.U * 0.46;
      const x = ((this.t * 38) % (W + w * 2)) - w;
      this.put(A.plane, x, this.y(4), w);
    }
    // Edge of space.
    if (this.visible(5)) {
      const ctx = this.ctx;
      ctx.setLineDash([8, 7]);
      ctx.strokeStyle = 'rgba(244,234,210,.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const y = this.y(5);
      ctx.moveTo(-10, y + 40);
      ctx.quadraticCurveTo(W / 2, y - 40, W + 10, y + 40);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawFar() {
    const { W, H } = this;
    const A = ART!;
    if (this.visible(5.6)) {
      const w = this.U * 0.4;
      const x = ((this.t * 16) % (W + w)) - w / 2;
      this.put(A.station, x, this.y(5.6), w);
    }
    if (this.visible(7.55)) {
      const w = this.U * 0.42;
      this.put(A.vinasat, this.gx(0.25) + Math.sin(this.t * 0.3) * 10, this.y(7.55), w);
    }
    // Cung Trăng: the banyan, the jade rabbit, and chú Cuội waving.
    if (this.visible(8.585, 500)) {
      const size = Math.min(this.U * 0.92, H * 0.55);
      const cx = this.layout.column ? W / 2 : W * 0.6;
      const cy = this.y(8.585);
      this.put(A.moon, cx, cy, size);
      if (A.moon.ready) {
        const ctx = this.ctx;
        const ax = cx - size / 2 + A.moonArm.x * size;
        const ay = cy - size / 2 + A.moonArm.y * size;
        const wave = this.reduce ? 0 : Math.sin(this.t * 4) * 0.35;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(-0.9 + wave);
        ctx.strokeStyle = INK;
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(4, size * 0.022);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.055, 0);
        ctx.stroke();
        ctx.strokeStyle = CHAM_DEEP;
        ctx.lineWidth = Math.max(2, size * 0.012);
        ctx.stroke();
        ctx.restore();
      }
    }
    const planets: [number, Art.Sprite, number, number][] = [
      [11.35, A.mars, 0.72, 0.3],
      [11.89, A.jupiter, 0.3, 0.44],
      [12.65, A.neptune, 0.7, 0.26],
    ];
    for (const [L, sp, fx, fw] of planets) if (this.visible(L, 220)) this.put(sp, this.gx(fx), this.y(L), this.U * fw);
    // Oort cloud: drifting comets and ice.
    if (this.visible(15.98, 400)) {
      const y0 = this.y(15.98);
      const rnd = mulberry(3);
      this.ctx.fillStyle = 'rgba(167,216,238,.75)';
      for (let i = 0; i < 160; i++) this.ctx.fillRect(rnd() * W, y0 + (rnd() - 0.5) * 260, 2, 2);
      for (let i = 0; i < 3; i++) {
        const x = ((this.t * (10 + i * 4) + i * 140) % (W + 200)) - 100;
        this.put(A.comet, x, y0 - 80 + i * 70, this.U * 0.32);
      }
    }
    // Sông Ngân: a river of stars crossed by the magpie bridge of Ô Thước.
    if (this.visible(20.4, 500)) {
      const y0 = this.y(20.4);
      const rnd = mulberry(11);
      for (let i = 0; i < 520; i++) {
        const u = rnd();
        const x = u * W;
        const y = y0 - (u - 0.5) * 300 + (rnd() - 0.5) * 110;
        this.ctx.fillStyle = `rgba(244,234,210,${0.3 + rnd() * 0.7})`;
        this.ctx.fillRect(x, y, 1.8, 1.8);
      }
      for (let i = 0; i < 9; i++) {
        const u = i / 8;
        const x = W * (0.18 + u * 0.64);
        const y = y0 - Math.sin(u * Math.PI) * 46 + (u - 0.5) * -40;
        this.put(A.magpie, x, y + Math.sin(this.t * 2 + i) * 2, this.U * 0.11);
      }
    }
  }

  private drawGround() {
    const { ctx, W, H } = this;
    const A = ART!;
    const yg = this.y(this.layout.ground ?? -0.55);
    if (yg > H + 10) return;
    // Bamboo grove on the left and the village đình on the right, standing on the field line.
    this.put(A.bamboo, this.gx(0.24), yg + 4, Math.min(W * 0.5, 280), 0.5, 1);
    this.put(A.dinh, this.gx(0.76), yg + 2, Math.min(W * 0.5, 300), 0.5, 1);
    ctx.fillStyle = LA;
    ctx.fillRect(0, yg, W, H - yg + 10);
    ctx.strokeStyle = 'rgba(244,234,210,.22)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 7; i++) {
      const y = yg + i * 14;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y + i * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
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
    const sunVisible = this.camL < 4.2;
    const sunBottom = this.top + this.sunSize * 1.15 + H * 0.02 + 12;
    const r0 = Math.max(sunVisible && !this.layout.column ? sunBottom : this.top + 24, yk0 - H * 0.2);
    const r1 = Math.min(H * 0.6, yk0 + H * 0.28);
    ctx.beginPath();
    ctx.moveTo(x, r0);
    ctx.lineTo(x, r1);
    ctx.stroke();
    ctx.textAlign = 'right';
    for (const m of MILESTONES) {
      const L = m.alt <= 0 ? this.layout.ground ?? -0.55 : log(m.alt);
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
    const size = Math.min(Math.min(W, H) * L.kiteSize, L.kiteMax ?? Infinity);
    const s = size / 120;
    const nerv = this.nervous ? Math.sin(this.t * 17) * 0.05 : 0;
    const sway = this.reduce ? 0 : Math.sin(this.t * 1.6) * 0.07 + Math.sin(this.t * 0.55) * 0.05 + nerv;
    // On wide screens a kite placed beside the page flies in the margin instead of over the text.
    const col = L.column ?? 0;
    const side = this.wide && L.kiteX !== 0.5 ? (L.kiteX > 0.5 ? (W + col) / 2 + Math.min(170, (W - col) * 0.2) : (W - col) / 2 - Math.min(170, (W - col) * 0.2)) : W * L.kiteX;
    const kx = side + (this.reduce ? 0 : Math.sin(this.t * 0.8) * this.U * 0.03);
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
