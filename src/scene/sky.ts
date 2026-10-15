// The living sky of Thả Diều: a smooth sky that darkens into space, objects placed at their real altitude on a
// log scale, the village at the foot of the sky, the altitude ruler, wind streaks while climbing, celebration
// confetti, and a kite that sways, leaps and dips.
import { MILESTONES, formatAlt } from '../../shared/scoring.js';
import * as Art from './art';
import * as Land from './land';
import * as Sp from './space';
import * as V from './village';

type Sprite = Art.Sprite;

let ART: ReturnType<typeof makeArt> | null = null;
function makeArt() {
  const kids = V.kidsSvg();
  const plane = Sp.airlinerSvg();
  const rocket = Sp.rocketSvg();
  return {
    stork: [Art.sprite(Art.storkSvg(0)), Art.sprite(Art.storkSvg(1))],
    bamboo: [Art.sprite(V.bambooSvg(1)), Art.sprite(V.bambooSvg(4))],
    areca: [Art.sprite(V.arecaSvg(0)), Art.sprite(V.arecaSvg(-1))],
    banyan: Art.sprite(V.banyanSvg()),
    house: [Art.sprite(V.houseSvg(0)), Art.sprite(V.houseSvg(1))],
    kids: Art.sprite(kids),
    hand: kids.hand,
    plane: Art.sprite(plane),
    planeTail: plane.tail,
    balloon: Art.sprite(Sp.balloonSvg()),
    hotAir: [Art.sprite(Sp.hotAirSvg(0)), Art.sprite(Sp.hotAirSvg(1)), Art.sprite(Sp.hotAirSvg(2))],
    iss: Art.sprite(Sp.issSvg()),
    vinasat: Art.sprite(Sp.vinasatSvg()),
    rocket: Art.sprite(rocket),
    nozzle: rocket.nozzle,
    magpie: [Art.sprite(Sp.magpieSvg(0)), Art.sprite(Sp.magpieSvg(1))],
  };
}

const INK = '#1f1b16';
const PAPER = '#f4ead2';
const SON = '#c0392b';
const HOE = '#e2a72e';
const TRANG = '#f3dc8a';
const CHAM_DEEP = '#142640';

type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
const css = (c: Rgb) => `rgb(${c.map((v) => Math.round(v)).join(',')})`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Sky colours [top, middle, bottom] by log10(altitude). */
const SKY: [number, string, string, string][] = [
  [0, '#4f9bd0', '#8cc6e6', '#e3efe6'],
  [2, '#478fca', '#7dbde4', '#cfe7f1'],
  [3.2, '#3a7fbc', '#69ace0', '#b3dbf0'],
  [4.4, '#1f4f8a', '#3678b8', '#6aa9d8'],
  [5.2, '#0c1736', '#183766', '#2c5e9a'],
  [6.5, '#070b1e', '#0d1734', '#162a55'],
  [9, '#06081a', '#0a0f26', '#0e1734'],
  [16, '#080820', '#0b0b26', '#10102e'],
  [21, '#100b2a', '#170f38', '#0c0a26'],
];

function skyAt(L: number): [Rgb, Rgb, Rgb] {
  let i = 0;
  while (i < SKY.length - 2 && L > SKY[i + 1][0]) i++;
  const a = SKY[i];
  const b = SKY[Math.min(i + 1, SKY.length - 1)];
  const t = b[0] === a[0] ? 0 : clamp((L - a[0]) / (b[0] - a[0]));
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
  /** Where the village sits on the log scale; lower values leave more open sky under the kite at take-off. */
  ground?: number;
  /** Vertical band (fractions of the height) holding the page's text; on narrow screens the ruler keeps quiet there. */
  text?: [number, number];
  /** Pixels at the bottom covered by the page's controls. */
  bottom?: number;
}

export const LAYOUTS: Record<'home' | 'play' | 'result', SkyLayout> = {
  home: { kiteX: 0.64, kiteY: 0.34, decade: 0.95, kiteSize: 0.26, ruler: false, kiteMax: 170, column: 560, ground: -0.3 },
  play: { kiteX: 0.5, kiteY: 0.19, decade: 0.45, kiteSize: 0.2, ruler: true, top: 70, column: 680, kiteMax: 96, ground: -1.36, text: [0.33, 0.74], bottom: 92 },
  result: { kiteX: 0.32, kiteY: 0.2, decade: 0.3, kiteSize: 0.16, ruler: false, column: 520, kiteMax: 130 },
};

const LEAF = new Path2D('M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z');
const INNER = new Path2D('M60 60 C 82 76, 86 118, 60 170 C 34 118, 38 76, 60 60 Z');
const log = (alt: number) => Math.log10(Math.max(1, alt));
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
  max: number;
  kind: 'paper' | 'leaf' | 'spark' | 'feather';
}

interface Paints {
  key: string;
  hillsFar: Land.Paint;
  hillsNear: Land.Paint;
  hedge: Land.Paint;
  fields: Land.Fields;
  sea: { img: Land.Paint; top: number };
  clouds: Land.Paint[];
  galaxy: Land.Paint;
  venus: Land.Paint;
  saturn: Land.Paint;
  mars: Land.Paint;
  jupiter: Land.Paint;
  neptune: Land.Paint;
  moon: ReturnType<typeof Sp.paintMoon>;
  comet: Land.Paint;
}

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
  private tween: { from: number; to: number; t0: number; dur: number } | null = null;
  private camVel = 0;
  private alt = 0;
  private layout: SkyLayout = LAYOUTS.home;
  private kite = { y: 0, vy: 0, a: 0, va: 0, x: 0, sy: 0 };
  private flutes = 1;
  private nervous = false;
  private stars: { x: number; y: number; r: number; tw: number; c: string }[] = [];
  private clouds: { L: number; x: number; w: number; v: number }[] = [];
  private streaks: { x: number; y: number; len: number; a: number }[] = [];
  private meteors: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
  private parts: Particle[] = [];
  private rings: { r: number; v: number; life: number; color: string }[] = [];
  private rays = 0;
  private flash = 0;
  private hand = { x: 0, y: 0 };
  private paints: Paints | null = null;
  private reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private ro: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    ART ??= makeArt();
    const r = mulberry(5);
    for (let i = 0; i < 170; i++) {
      const warm = r();
      this.stars.push({ x: r(), y: r(), r: Math.pow(r(), 3) * 1.8 + 0.5, tw: r() * 6.28, c: warm < 0.15 ? '255,214,170' : warm < 0.3 ? '180,210,255' : '244,240,226' });
    }
    const rc = mulberry(7);
    const levels = [1.6, 1.85, 2.15, 2.4, 2.65, 3.6, 3.8, 4.0, 4.2];
    levels.forEach((L, i) => this.clouds.push({ L: L + rc() * 0.08, x: (i * 0.37 + rc() * 0.2) % 1, w: i >= 4 ? 0.16 + rc() * 0.08 : 0.24 + rc() * 0.14, v: 4 + rc() * 5 }));
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

  /** Moves the camera to an altitude: the world slides past while the kite stays near its spot. With a duration, the climb follows a set ease. */
  setAltitude(alt: number, animate = true, dur?: number) {
    this.alt = alt;
    this.targetL = log(alt);
    this.tween = null;
    if (!animate || this.reduce) {
      this.camL = this.targetL;
      return;
    }
    if (dur) this.tween = { from: this.camL, to: this.targetL, t0: this.t, dur };
  }

  setFlutes(n: number) {
    this.flutes = Math.max(1, Math.min(3, n));
  }

  setNervous(on: boolean) {
    this.nervous = on;
  }

  /** Where the kite is on screen, in CSS pixels. */
  kitePos() {
    return { x: this.kite.x, y: this.kite.sy };
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

  /** Confetti around the kite, growing with the rarity rank (0 Tà tà … 6 Cung Trăng); rank 1 is the Khôn lỏi puff. */
  celebrate(rank: number) {
    if (this.reduce) return;
    const { x, sy: y } = this.kite;
    const P = (n: number, colors: string[], kind: Particle['kind'], speed: number, size = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = speed * (0.35 + Math.random() * 0.65);
        const max = 1.4 + Math.random() * 1.2;
        this.parts.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - speed * 0.35,
          r: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 10,
          w: (kind === 'spark' ? 3 : kind === 'feather' ? 5 : 7) * size * (0.7 + Math.random() * 0.6),
          h: (kind === 'spark' ? 3 : kind === 'feather' ? 14 : kind === 'leaf' ? 12 : 4.5) * size * (0.7 + Math.random() * 0.6),
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          max,
          kind,
        });
      }
    };
    const dark = this.camL >= 4.3;
    if (rank <= 0) P(7, ['#7fae47', '#a2cb62', HOE], 'leaf', 160, 0.8);
    else if (rank === 1) P(10, ['#e08a3c', '#b0611f', PAPER], 'paper', 120, 0.9);
    else if (rank === 2) P(14, ['#47803a', '#7fae47', '#a2cb62'], 'leaf', 230);
    else if (rank === 3) {
      P(16, ['#ffffff', PAPER, '#dfe9f2'], 'feather', 240);
      P(8, [HOE, PAPER], 'paper', 220);
    } else if (rank === 4) {
      P(30, [SON, HOE, PAPER, '#26476f'], 'paper', 340);
      this.rings.push({ r: 20, v: 420, life: 0.7, color: dark ? TRANG : PAPER });
    } else if (rank === 5) {
      P(42, [SON, HOE, PAPER, '#26476f', '#7fae47'], 'paper', 420);
      P(16, ['#ffffff', TRANG], 'spark', 380);
      this.rings.push({ r: 20, v: 520, life: 0.8, color: TRANG });
    } else {
      P(56, [TRANG, HOE, '#fff3c4', SON], 'paper', 520, 1.15);
      P(34, ['#ffffff', TRANG, '#fff3c4'], 'spark', 480);
      this.rings.push({ r: 20, v: 560, life: 0.9, color: TRANG }, { r: 10, v: 360, life: 1.1, color: '#ffffff' });
      this.rays = 2.8;
      this.flash = 0.5;
    }
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.W = r.width;
    this.H = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
  }

  /** Paints the static layers once per viewport size. */
  private get P(): Paints {
    const { W, H, dpr } = this;
    const key = `${Math.round(W)}x${Math.round(H)}x${dpr}`;
    if (this.paints?.key === key) return this.paints;
    const U = this.U;
    const pd = Math.min(dpr, 1.5);
    this.paints = {
      key,
      hillsFar: Land.paintHills(W, Math.min(H * 0.16, 150), pd, 3, '#a9c9d6', '#c2dbe4', U * 1.4),
      hillsNear: Land.paintHills(W, Math.min(H * 0.1, 96), pd, 8, '#7fb07a', '#98c48c', U),
      hedge: Land.paintHedge(W, Math.max(40, U * 0.11), pd, U),
      fields: Land.paintFields(W, Math.round(H * 0.7), pd, U),
      sea: Land.paintCloudSea(W, Math.round(Math.max(150, H * 0.3 * 0.3 + 120 * Math.max(0.8, U / 390))), pd, U),
      clouds: [Land.paintCloud(U * 0.6, pd, 1), Land.paintCloud(U * 0.6, pd, 2), Land.paintCloud(U * 0.6, pd, 3)],
      galaxy: Sp.paintGalaxy(W, Math.round(H * 0.8), pd),
      venus: Sp.paintPlanet('venus', Math.round(U * 0.24), dpr),
      saturn: Sp.paintPlanet('saturn', Math.round(U * 0.36), dpr),
      mars: Sp.paintPlanet('mars', Math.round(U * 0.26), dpr),
      jupiter: Sp.paintPlanet('jupiter', Math.round(U * 0.5), dpr),
      neptune: Sp.paintPlanet('neptune', Math.round(U * 0.3), dpr),
      moon: Sp.paintMoon(Math.round(Math.min(U * 0.86, H * 0.48)), dpr),
      comet: Sp.paintComet(Math.round(U * 0.62), dpr),
    };
    return this.paints;
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
    this.last = now;
    this.t += dt;
    const prev = this.camL;
    if (this.tween) {
      const p = clamp((this.t - this.tween.t0) / this.tween.dur);
      this.camL = this.tween.from + (this.tween.to - this.tween.from) * easeInOut(p);
      if (p >= 1) this.tween = null;
    } else this.camL += (this.targetL - this.camL) * (1 - Math.exp(-dt * 2.4));
    this.camVel = dt > 0 ? (this.camL - prev) / dt : 0;
    // Kite spring.
    const k = this.kite;
    k.vy += (-60 * k.y - 9 * k.vy) * dt;
    k.y += k.vy * dt;
    k.va += (-40 * k.a - 6 * k.va) * dt;
    k.a += k.va * dt;
    this.step(dt);
    this.draw();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  /** Advances wind streaks and confetti. */
  private step(dt: number) {
    const { W, H } = this;
    const speed = this.camVel * H * this.layout.decade;
    if (speed > 260 && !this.reduce) {
      const n = Math.min(3, speed * dt * 0.025);
      for (let i = 0; i < n; i++) this.streaks.push({ x: Math.random() * W, y: -40 - Math.random() * 60, len: 30 + Math.random() * 70, a: 0.12 + Math.random() * 0.22 });
    }
    for (const s of this.streaks) {
      s.y += (Math.max(0, speed) * 1.6 + 220) * dt;
      s.a -= dt * 0.35;
    }
    this.streaks = this.streaks.filter((s) => s.y < H + 120 && s.a > 0);
    for (const p of this.parts) {
      p.life += dt;
      const drag = p.kind === 'feather' || p.kind === 'leaf' ? 2.6 : 1.6;
      p.vx *= Math.exp(-drag * dt);
      p.vy *= Math.exp(-drag * dt);
      p.vy += (p.kind === 'spark' ? 40 : p.kind === 'feather' ? 50 : 160) * dt;
      p.vx += Math.sin(p.life * 4 + p.r) * (p.kind === 'paper' ? 0 : 30) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.r += p.vr * dt;
    }
    this.parts = this.parts.filter((p) => p.life < p.max);
    // Shooting stars once the sky is dark.
    if (this.camL > 4.6 && !this.reduce && Math.random() < dt * 0.45) {
      const a = 0.5 + Math.random() * 0.5;
      this.meteors.push({ x: Math.random() * W, y: Math.random() * H * 0.6, vx: -Math.cos(a) * 520, vy: Math.sin(a) * 520, life: 0.9 });
    }
    for (const m of this.meteors) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.life -= dt;
    }
    this.meteors = this.meteors.filter((m) => m.life > 0);
    for (const r of this.rings) {
      r.r += r.v * dt;
      r.v *= Math.exp(-2 * dt);
      r.life -= dt;
    }
    this.rings = this.rings.filter((r) => r.life > 0);
    this.rays = Math.max(0, this.rays - dt);
    this.flash = Math.max(0, this.flash - dt);
  }

  /** The kite's resting height on screen: its spot in the layout, but never tucked under the page's top bar. */
  private get yk() {
    const L = this.layout;
    const size = Math.min(Math.min(this.W, this.H) * L.kiteSize, L.kiteMax ?? Infinity);
    return Math.max(this.H * L.kiteY, (L.top ?? 0) + size * 0.9 + 6);
  }

  private y(L: number) {
    return this.yk - (L - this.camL) * this.H * this.layout.decade;
  }

  private draw() {
    const { ctx, W, H } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const [top, mid, low] = skyAt(this.camL);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, css(top));
    g.addColorStop(0.55, css(mid));
    g.addColorStop(1, css(low));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    this.drawStars();
    this.drawSun();
    this.drawDeepSpace();
    this.drawOrbit();
    this.drawAir();
    this.drawGround();
    this.drawStreaks();
    if (this.layout.ruler) this.drawRuler();
    this.drawRays();
    this.drawKite();
    this.drawParts();
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,246,214,${this.flash * 0.7})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private visible(L: number, pad = 200) {
    const y = this.y(L);
    return y > -pad && y < this.H + pad;
  }

  /** Sprite scale unit: the width on phones, capped so desktop skies don't fill up with giant things. */
  private get U() {
    return Math.min(this.W, 540);
  }

  /** Horizontal spot for a fixed landmark: a fraction of the width on phones, or a spot in the margin beside the page column on wide screens. */
  private gx(fx: number) {
    const col = this.layout.column;
    const { W } = this;
    if (!col || W < col + 420) return W * fx;
    // Keep clear of the side panels that the play screen stands on the left and right edges.
    const inset = this.layout.ruler ? 270 : 40;
    const left = fx < 0.5;
    const lo = left ? inset : (W + col) / 2 + 20;
    const hi = left ? (W - col) / 2 - 20 : W - inset;
    const u = left ? fx * 2 : (fx - 0.5) * 2;
    return hi > lo ? lo + (hi - lo) * u : left ? (W - col) / 4 : W - (W - col) / 4;
  }

  /** Wide enough for fixed landmarks to sit in the margins beside the page column. */
  private get wide() {
    const col = this.layout.column;
    return !!col && this.W >= col + 420;
  }

  private get top() {
    return this.layout.top ?? 0;
  }

  private put(sp: Sprite, x: number, y: number, w: number, ax = 0.5, ay = 0.5, alpha = 1) {
    if (!sp.ready) return;
    const h = (w * sp.h) / sp.w;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(sp.img, x - w * ax, y - h * ay, w, h);
    this.ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------- stars and deep space */

  private drawStars() {
    const { ctx, W, H } = this;
    const a0 = clamp((this.camL - 4.3) / 1.4);
    if (a0 <= 0) return;
    const drift = (this.camL * 41) % H;
    for (const s of this.stars) {
      const a = a0 * (0.55 + 0.45 * Math.sin(this.t * 1.3 + s.tw));
      const x = s.x * W;
      const y = (s.y * H + drift) % H;
      ctx.fillStyle = `rgba(${s.c},${a})`;
      if (s.r > 1.5) {
        ctx.beginPath();
        ctx.arc(x, y, s.r * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${s.c},${a * 0.35})`;
        ctx.fillRect(x - s.r * 3, y - 0.5, s.r * 6, 1);
        ctx.fillRect(x - 0.5, y - s.r * 3, 1, s.r * 6);
      } else ctx.fillRect(x, y, s.r, s.r);
    }
  }

  private drawDeepSpace() {
    const { ctx, W, H } = this;
    const P = this.P;
    for (const m of this.meteors) {
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.14, m.y - m.vy * 0.14);
      g.addColorStop(0, `rgba(255,255,255,${Math.min(1, m.life * 1.5)})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 0.14, m.y - m.vy * 0.14);
      ctx.stroke();
    }
    // Cung Trăng: the glowing moon with chú Cuội waving and star lanterns drifting up around it.
    if (this.visible(8.585, H * 0.6)) {
      const m = P.moon;
      const size = m.img.width / this.dpr;
      const cx = this.layout.column ? W / 2 : W * 0.6;
      const cy = this.y(8.585);
      const halo = ctx.createRadialGradient(cx, cy, size * 0.45, cx, cy, size * 1.25);
      halo.addColorStop(0, 'rgba(255,230,160,.42)');
      halo.addColorStop(0.4, 'rgba(255,220,140,.14)');
      halo.addColorStop(1, 'rgba(255,220,140,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(cx - size * 1.3, cy - size * 1.3, size * 2.6, size * 2.6);
      ctx.drawImage(m.img, cx - size / 2, cy - size / 2, size, size);
      const ax = cx - size / 2 + m.arm.x * size;
      const ay = cy - size / 2 + m.arm.y * size;
      const wave = this.reduce ? 0 : Math.sin(this.t * 4) * 0.4;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(-1.05 + wave);
      ctx.strokeStyle = m.shadow;
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(3, size * 0.022);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.065, 0);
      ctx.stroke();
      ctx.restore();
      for (let i = 0; i < 5; i++) {
        const side = i % 2 ? 1 : -1;
        const lx = cx + side * size * (0.6 + (i % 3) * 0.14) + Math.sin(this.t * 0.7 + i) * 8;
        const ly = cy + size * 0.5 - ((this.t * (10 + i * 3) + i * 90) % (size * 1.4));
        this.lantern(lx, ly, Math.max(12, size * 0.055), i);
      }
    }
    const planets: [number, Land.Paint, number][] = [
      [10.62, P.venus, 0.3],
      [11.35, P.mars, 0.72],
      [11.89, P.jupiter, 0.28],
      [12.16, P.saturn, 0.74],
      [12.65, P.neptune, 0.3],
    ];
    for (const [L, img, fx] of planets) {
      if (!this.visible(L, 260)) continue;
      const w = img.width / this.dpr;
      ctx.drawImage(img, this.gx(fx) - w / 2, this.y(L) - w / 2, w, w);
    }
    // Oort cloud: drifting ice and comets.
    if (this.visible(15.98, 420)) {
      const y0 = this.y(15.98);
      const rnd = mulberry(3);
      for (let i = 0; i < 180; i++) {
        const x = rnd() * W;
        const y = y0 + (rnd() - 0.5) * 300;
        ctx.fillStyle = `rgba(190,226,246,${0.25 + rnd() * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.6 + rnd() * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      const cw = P.comet.width / this.dpr;
      for (let i = 0; i < 3; i++) {
        const x = ((this.t * (14 + i * 5) + i * 230) % (W + cw * 2)) - cw;
        ctx.drawImage(P.comet, x - cw, y0 - 110 + i * 85, cw * (1 - i * 0.18), (P.comet.height / this.dpr) * (1 - i * 0.18));
      }
    }
    // Sông Ngân: the Milky Way, with the magpie bridge between Ngưu Lang and Chức Nữ.
    if (this.visible(20.4, H * 0.6)) {
      const y0 = this.y(20.4);
      const gh = P.galaxy.height / this.blitDpr(P.galaxy);
      ctx.drawImage(P.galaxy, 0, y0 - gh * 0.55, W, gh);
      const span = Math.min(W * 0.7, 560);
      const x0 = W / 2 - span / 2;
      const A = ART!;
      const star = (x: number, y: number, name: string, col: string) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 26);
        g.addColorStop(0, `rgba(${col},.95)`);
        g.addColorStop(0.2, `rgba(${col},.5)`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - 26, y - 26, 52, 52);
        ctx.fillStyle = `rgba(${col},.8)`;
        ctx.fillRect(x - 18, y - 0.75, 36, 1.5);
        ctx.fillRect(x - 0.75, y - 18, 1.5, 36);
        ctx.font = "600 12px 'Be Vietnam Pro', system-ui, sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(244,234,210,.85)';
        ctx.fillText(name, x, y + 34);
      };
      const n = 11;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const x = x0 + span * 0.08 + u * span * 0.84;
        const y = y0 - Math.sin(u * Math.PI) * 54 + (u - 0.5) * -30;
        const frame = (Math.floor(this.t * 3 + i * 0.7) % 2) as 0 | 1;
        this.put(A.magpie[frame], x, y + Math.sin(this.t * 2 + i) * 2, Math.min(this.U * 0.13, 70));
      }
      star(x0, y0 + 24, 'Ngưu Lang', '255,236,200');
      star(x0 + span, y0 - 6, 'Chức Nữ', '200,225,255');
    }
  }

  private blitDpr(p: Land.Paint) {
    return p.width / this.W > 0 ? p.width / this.W : 1;
  }

  /** A đèn ông sao: the five-pointed star lantern of Trung thu, glowing as it drifts up. */
  private lantern(x: number, y: number, r: number, i: number) {
    const { ctx } = this;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
    g.addColorStop(0, 'rgba(255,200,120,.45)');
    g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(this.t * 1.2 + i) * 0.15);
    const starPath = (R: number) => {
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 5;
        const rr = k % 2 ? R * 0.45 : R;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
    };
    starPath(r);
    ctx.fillStyle = SON;
    ctx.fill();
    ctx.strokeStyle = 'rgba(31,27,22,.8)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    starPath(r * 0.5);
    ctx.fillStyle = '#ffd36b';
    ctx.fill();
    ctx.strokeStyle = HOE;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.4);
    ctx.lineTo(0, r * 1.5);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------------------------------------------------------------- orbit: Kármán line, ISS, Vinasat */

  private drawOrbit() {
    const { ctx, W, H } = this;
    const A = ART!;
    // The edge of space: a glowing limb of atmosphere with aurora curtains above it.
    if (this.visible(5, H * 0.4)) {
      const y = this.y(5);
      const R = W * 2.4;
      const cy = y + R;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 26; i++) {
        const x = (i / 25) * W;
        const hgt = H * (0.1 + 0.06 * Math.sin(this.t * 0.6 + i * 0.9)) * (0.6 + 0.4 * Math.sin(i * 1.7));
        const yb = cy - Math.sqrt(Math.max(0, R * R - (x - W / 2) ** 2)) - 6;
        const gg = ctx.createLinearGradient(0, yb - hgt, 0, yb);
        gg.addColorStop(0, 'rgba(90,255,180,0)');
        gg.addColorStop(0.7, `rgba(90,255,180,${0.1 + 0.06 * Math.sin(this.t + i)})`);
        gg.addColorStop(1, 'rgba(90,255,180,0)');
        ctx.fillStyle = gg;
        ctx.fillRect(x - W / 40, yb - hgt, W / 20, hgt);
      }
      for (const [w, a] of [[46, 0.08], [18, 0.18], [5, 0.5], [1.6, 0.95]] as const) {
        ctx.strokeStyle = `rgba(120,200,255,${a})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(W / 2, cy, R, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (this.visible(5.6)) {
      const w = Math.min(this.U * 0.52, 280);
      const x = ((this.t * 16) % (W + w)) - w / 2;
      this.put(A.iss, x, this.y(5.6), w);
    }
    // Smaller satellites on the way out to the geostationary ring.
    for (const [L, fx, k, rot] of [[6.35, 0.78, 0.3, -0.4], [6.95, 0.2, 0.26, 0.3]] as const) {
      if (!this.visible(L)) continue;
      ctx.save();
      ctx.translate((this.wide ? this.gx(fx) : W * fx) + Math.sin(this.t * 0.4 + L) * 8, this.y(L));
      ctx.rotate(rot + Math.sin(this.t * 0.3 + L) * 0.05);
      this.put(A.vinasat, 0, 0, Math.min(this.U * k, 150), 0.5, 0.5, 0.9);
      ctx.restore();
    }
    if (this.visible(7.55)) {
      const w = Math.min(this.U * 0.56, 300);
      this.put(A.vinasat, this.gx(0.25) + Math.sin(this.t * 0.3) * 10, this.y(7.55) + Math.sin(this.t * 0.5) * 4, w);
    }
    // A rocket on its way to the moon.
    if (this.visible(8.15, 260)) {
      const w = Math.min(this.U * 0.14, 76);
      const h = (w * A.rocket.h) / A.rocket.w;
      const x = this.wide ? this.gx(0.78) : W * 0.8;
      const y = this.y(8.15) + Math.sin(this.t * 0.8) * 6;
      const nx = x - w / 2 + A.nozzle.x * w;
      const ny = y - h / 2 + A.nozzle.y * h;
      const fl = h * (0.45 + 0.08 * Math.sin(this.t * 30));
      const g = ctx.createLinearGradient(0, ny, 0, ny + fl);
      g.addColorStop(0, 'rgba(255,240,180,.95)');
      g.addColorStop(0.4, 'rgba(255,170,60,.85)');
      g.addColorStop(1, 'rgba(255,90,40,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(nx - w * 0.2, ny);
      ctx.quadraticCurveTo(nx, ny + fl * 1.3, nx + w * 0.2, ny);
      ctx.closePath();
      ctx.fill();
      this.put(A.rocket, x, y, w);
    }
  }

  /* ---------------------------------------------------------------- the air: storks, clouds, hot-air balloons, airliner, weather balloon */

  private drawAir() {
    const { ctx, W, H } = this;
    const A = ART!;
    const P = this.P;
    // A weather balloon drifting in the stratosphere.
    if (this.visible(4.48, 260)) {
      const w = Math.min(this.U * 0.14, 80);
      this.put(A.balloon, (this.wide ? this.gx(0.8) : W * 0.8) + Math.sin(this.t * 0.4) * 10, this.y(4.48), w);
    }
    // An airliner crossing at 10 km with its contrails.
    if (this.visible(4, 200)) {
      const w = Math.min(this.U * 0.5, 260);
      const h = (w * A.plane.h) / A.plane.w;
      const x = ((this.t * 40) % (W + w * 2 + W * 0.4)) - w;
      const y = this.y(4);
      const tx = x - w / 2 + A.planeTail.x * w;
      const ty = y - h / 2 + A.planeTail.y * h;
      for (const dy of [-3, 3]) {
        const gg = ctx.createLinearGradient(tx, 0, tx - W * 0.7, 0);
        gg.addColorStop(0, 'rgba(255,255,255,.85)');
        gg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = gg;
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx + 6, ty + dy);
        ctx.lineTo(tx - W * 0.7, ty + dy * 2.2);
        ctx.stroke();
      }
      this.put(A.plane, x, y, w);
    }
    // The cloud deck at about 1.000 m: a ceiling from below, a white sea from above.
    if (this.visible(3, H)) {
      const S = P.sea;
      const pd = Math.min(this.dpr, 1.5);
      ctx.drawImage(S.img, 0, this.y(3.03) - S.top, W, S.img.height / pd);
    }
    // Hot-air balloons drifting above the cloud deck, at different heights and distances.
    if (this.visible(3.48, 260)) {
      const A2 = ART!;
      const base = Math.min(this.U * 0.24, 130);
      const spots: [number, number, number, number][] = this.wide
        ? [[0.8, 3.48, 1, 0], [0.18, 3.36, 0.7, 1], [0.92, 3.3, 0.5, 2]]
        : [[0.78, 3.48, 1, 0], [0.18, 3.36, 0.62, 1], [0.5, 3.22, 0.42, 2]];
      for (const [fx, L, k, i] of spots) {
        const x = (this.wide ? this.gx(fx) : W * fx) + Math.sin(this.t * 0.2 + i * 2) * 14;
        this.put(A2.hotAir[i], x, this.y(L) + Math.sin(this.t * 0.5 + i) * 5, base * k);
      }
    }
    // Drifting clouds.
    for (const [i, c] of this.clouds.entries()) {
      if (!this.visible(c.L, 260)) continue;
      const img = P.clouds[i % 3];
      const w = c.w * this.U * 1.5;
      const h = (w * img.height) / img.width;
      const x = ((c.x * (W + w) + this.t * c.v) % (W + w)) - w / 2;
      ctx.globalAlpha = c.L > 3.5 ? 0.92 : 1;
      ctx.drawImage(img, x - w / 2, this.y(c.L) - h * 0.7, w, h);
      ctx.globalAlpha = 1;
    }
    // Dragonflies darting over the fields a few metres up.
    if (this.visible(1.1, 200)) {
      for (let i = 0; i < 5; i++) {
        const ph = this.t * (0.35 + i * 0.07) + i * 1.9;
        const x = W * (0.12 + ((i * 0.23 + Math.sin(ph) * 0.12 + 1) % 1) * 0.76);
        const y = this.y(0.75 + (i % 3) * 0.28) + Math.sin(ph * 2.3) * 14;
        this.dragonfly(x, y, Math.min(this.U * 0.05, 26), Math.cos(ph) > 0 ? 1 : -1, i);
      }
    }
    // White storks.
    if (this.visible(2.08)) {
      const y0 = this.y(2.08);
      for (let i = 0; i < 5; i++) {
        const x = ((this.t * 22 + i * 61) % (W + 160)) - 80;
        const y = y0 + Math.sin(i * 2.1) * 18 + Math.sin(this.t * 0.8 + i) * 4;
        const frame = Math.floor(this.t * 3 + i) % 2;
        this.put(A.stork[frame], x, y, Math.min(this.U * (0.1 + (i % 2) * 0.03), 64));
      }
    }
  }

  /** A chuồn chuồn: slim body, four glassy wings that flicker. */
  private dragonfly(x: number, y: number, s: number, dir: number, i: number) {
    const { ctx } = this;
    const flap = this.reduce ? 0 : Math.sin(this.t * 40 + i) * 0.35;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.fillStyle = 'rgba(235,248,255,.75)';
    for (const ox of [0.12, -0.12]) {
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(s * ox, 0);
        ctx.rotate(side * (Math.PI / 2 - 0.35 + flap) + (ox < 0 ? side * 0.25 : 0));
        ctx.beginPath();
        ctx.ellipse(s * 0.36, 0, s * 0.38, s * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    const col = i % 2 ? '#e5533d' : '#3a8fd8';
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, s * 0.12);
    ctx.beginPath();
    ctx.moveTo(-s * 0.75, 0);
    ctx.lineTo(s * 0.35, 0);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(s * 0.44, 0, s * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ---------------------------------------------------------------- the sun */

  private drawSun() {
    const { ctx, W } = this;
    const a = clamp((4.6 - this.camL) / 1.2);
    if (a <= 0) return;
    const narrow = !!this.layout.column && !this.wide;
    const size = Math.min(this.U, this.H) * (narrow && this.layout.ruler ? 0.13 : this.wide ? 0.13 : 0.16);
    const x = this.wide ? this.gx(this.layout.ruler ? 0.62 : 0.84) : this.layout.kiteX < 0.3 ? W * 0.7 : narrow && this.layout.ruler ? size * 1.1 : W * 0.82;
    const y = this.top + size * 1.2 + this.camL * 5;
    const g = ctx.createRadialGradient(x, y, size * 0.4, x, y, size * 2.6);
    g.addColorStop(0, `rgba(255,240,190,${0.6 * a})`);
    g.addColorStop(0.4, `rgba(255,236,170,${0.18 * a})`);
    g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - size * 2.6, y - size * 2.6, size * 5.2, size * 5.2);
    const d = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size * 0.6);
    d.addColorStop(0, `rgba(255,252,232,${a})`);
    d.addColorStop(0.7, `rgba(255,224,130,${a})`);
    d.addColorStop(1, `rgba(255,206,100,${a})`);
    ctx.fillStyle = d;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------------------------------------------------------------- the village */

  private village: { key: number; items: { s: Sprite; x: number; w: number; z: number; flip: boolean }[] } | null = null;

  private villageItems() {
    const { W } = this;
    const U = this.U;
    if (this.village?.key === W) return this.village.items;
    const A = ART!;
    const items: { s: Sprite; x: number; w: number; z: number; flip: boolean }[] = [];
    const unit = U * 0.95;
    // Each stretch of the village is laid out a little differently so the hedge never repeats exactly.
    const plans: [Sprite, number, number, number][][] = [
      [[A.banyan, 0.06, 0.46, 0], [A.areca[0], 0.42, 0.09, 0], [A.areca[1], 0.49, 0.085, 0], [A.house[1], 0.6, 0.12, 1], [A.house[0], 0.72, 0.24, 1], [A.bamboo[0], 0.28, 0.38, 2], [A.bamboo[1], 0.92, 0.34, 2]],
      [[A.areca[1], 0.1, 0.085, 0], [A.house[0], 0.24, 0.22, 1], [A.bamboo[1], 0.46, 0.4, 2], [A.areca[0], 0.62, 0.09, 0], [A.house[1], 0.7, 0.11, 1], [A.bamboo[0], 0.86, 0.32, 2]],
      [[A.bamboo[0], 0.12, 0.34, 2], [A.house[1], 0.3, 0.12, 1], [A.banyan, 0.56, 0.42, 0], [A.house[0], 0.5, 0.22, 1], [A.areca[0], 0.78, 0.09, 0], [A.bamboo[1], 0.9, 0.36, 2]],
    ];
    const r = mulberry(13);
    for (let k = 0; k * unit < W + unit; k++) {
      const plan = W < 700 ? plans[0] : plans[k % plans.length];
      for (const [sp, fx, fw, z] of plan) {
        const jitter = W < 700 ? 0 : (r() - 0.5) * 0.06;
        items.push({ s: sp, x: (k + fx + jitter) * unit - (W < 700 ? 0 : unit * 0.3), w: U * fw * (W < 700 ? 1 : 0.88 + r() * 0.24), z, flip: W >= 700 && r() < 0.4 && sp !== A.house[1] });
      }
    }
    items.sort((a, b) => a.z - b.z);
    this.village = { key: W, items };
    return items;
  }

  private drawGround() {
    const { ctx, W, H, layout } = this;
    const A = ART!;
    const yg = this.y(layout.ground ?? -0.55);
    const yk = this.yk;
    const P = this.P;
    const pd = Math.min(this.dpr, 1.5);
    const bx = this.wide ? W / 2 - Math.min(300, W * 0.18) : W * (layout.kiteX > 0.55 ? 0.22 : 0.2);
    const bw = Math.min(this.U * 0.3, 160);
    const bh = (bw * A.kids.h) / A.kids.w;
    const dyke = yg + P.fields.dyke;
    this.hand = { x: bx - bw / 2 + A.hand.x * bw, y: dyke + 3 - bh + A.hand.y * bh };
    // Distant hills sink more slowly than the village as the kite climbs.
    const far = yk + (yg - yk) * 0.8;
    const near = yk + (yg - yk) * 0.92;
    if (far - P.hillsFar.height / pd > H) return;
    ctx.drawImage(P.hillsFar, 0, far - P.hillsFar.height / pd + 6, W, P.hillsFar.height / pd);
    ctx.fillStyle = '#a9c9d6';
    ctx.fillRect(0, far + 5, W, H);
    ctx.drawImage(P.hillsNear, 0, near - P.hillsNear.height / pd + 6, W, P.hillsNear.height / pd);
    ctx.fillStyle = '#7fb07a';
    ctx.fillRect(0, near + 5, W, H);
    if (yg - this.U * 0.6 > H) return;
    const hh = P.hedge.height / pd;
    ctx.drawImage(P.hedge, 0, yg - hh + 4, W, hh);
    for (const it of this.villageItems()) {
      if (it.x + it.w < -20 || it.x - it.w > W + 20) continue;
      if (it.flip) {
        ctx.save();
        ctx.translate(it.x, 0);
        ctx.scale(-1, 1);
        this.put(it.s, 0, yg + 4, it.w, 0.5, 1);
        ctx.restore();
      } else this.put(it.s, it.x, yg + 4, it.w, 0.5, 1);
    }
    const fh = P.fields.img.height / pd;
    ctx.drawImage(P.fields.img, 0, yg, W, fh);
    if (yg + fh < H) {
      ctx.fillStyle = '#5f9440';
      ctx.fillRect(0, yg + fh - 1, W, H - yg - fh + 2);
    }
    this.put(A.kids, bx, dyke + 3, bw, 0.5, 1);
  }

  private drawStreaks() {
    const { ctx } = this;
    if (!this.streaks.length) return;
    const dark = this.camL >= 4.3;
    ctx.lineCap = 'round';
    for (const s of this.streaks) {
      const g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.len);
      g.addColorStop(0, `rgba(255,255,255,0)`);
      g.addColorStop(1, `rgba(255,255,255,${s.a * (dark ? 0.7 : 1)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x, s.y + s.len);
      ctx.stroke();
    }
  }

  /* ---------------------------------------------------------------- the ruler */

  private drawRuler() {
    const { ctx, W, H } = this;
    const wide = this.wide;
    const dark = wide || this.camL >= 4.3;
    const r0 = this.top + (wide ? 24 : 14);
    const r1 = H - (this.layout.bottom ?? 0) - (wide ? 24 : 16);
    const yk = this.yk;
    // On wide screens the ruler stands in a glass column that mirrors the rarity ladder on the left.
    const pw = 236;
    const x = wide ? W - 24 - 70 : W - 14;
    if (wide) {
      ctx.fillStyle = 'rgba(13,26,48,.36)';
      ctx.strokeStyle = 'rgba(255,255,255,.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(W - 24 - pw, r0 - 10, pw, r1 - r0 + 20, 18);
      ctx.fill();
      ctx.stroke();
      ctx.font = "700 10px 'Be Vietnam Pro', system-ui, sans-serif";
      ctx.fillStyle = 'rgba(255,255,255,.72)';
      ctx.textAlign = 'left';
      ctx.fillText('ĐỘ CAO', W - 24 - pw + 16, r0 + 10);
    }
    const quiet = !wide && this.layout.text ? [H * this.layout.text[0], H * this.layout.text[1]] : null;
    const top = r0 + (wide ? 22 : 0);
    const fade = (y: number) => clamp(Math.min(y - top, r1 - y) / 40);
    const ink = dark ? '255,255,255' : '15,39,71';
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(${ink},.4)`;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, r1);
    ctx.stroke();
    // A tick at every tenfold of altitude.
    const Lmin = this.camL - (r1 - yk) / (H * this.layout.decade);
    const Lmax = this.camL + (yk - top) / (H * this.layout.decade);
    ctx.lineWidth = 1.5;
    ctx.textAlign = 'left';
    ctx.font = "600 11px 'Be Vietnam Pro', system-ui, sans-serif";
    for (let L = Math.ceil(Lmin * 2) / 2; L <= Lmax; L += 0.5) {
      const y = this.y(L);
      const whole = Math.abs(L % 1) < 0.01;
      ctx.globalAlpha = fade(y) * (whole ? 1 : 0.5);
      ctx.beginPath();
      ctx.moveTo(x - (whole ? 8 : 4), y);
      ctx.lineTo(x + (wide ? (whole ? 8 : 4) : 0), y);
      ctx.stroke();
      if (wide && whole && L >= 0) {
        ctx.globalAlpha = fade(y) * 0.6;
        ctx.fillStyle = `rgb(${ink})`;
        ctx.fillText(formatAlt(Math.pow(10, L)).replace(' năm ánh sáng', ' n.a.s'), x + 12, y + 4);
      }
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'right';
    const halo = !wide;
    for (const m of MILESTONES) {
      const L = m.alt <= 0 ? this.layout.ground ?? -0.55 : log(m.alt);
      const y = this.y(L);
      if (y < top || y > r1) continue;
      const a = fade(y);
      const passed = log(this.alt) >= L;
      ctx.globalAlpha = a;
      ctx.fillStyle = passed ? '#ffd66b' : '#ffffff';
      ctx.strokeStyle = dark ? 'rgba(255,255,255,.9)' : '#0f2747';
      ctx.lineWidth = 2;
      disc(ctx, x, y, 5);
      ctx.stroke();
      if (Math.abs(y - yk) < 26 || (quiet && y > quiet[0] - 8 && y < quiet[1])) continue;
      const name = m.name;
      const sub = m.alt ? formatAlt(m.alt) : '0 m';
      ctx.font = `700 ${wide ? 14 : 12}px 'Be Vietnam Pro', system-ui, sans-serif`;
      if (halo) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = dark ? 'rgba(6,10,30,.55)' : 'rgba(255,255,255,.75)';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = a * (passed ? 0.55 : 0.9);
        ctx.strokeText(name, x - 13, y + 1);
      }
      ctx.globalAlpha = a * (passed ? 0.6 : 1);
      ctx.fillStyle = `rgb(${ink})`;
      ctx.fillText(name, x - 13, y + 1);
      ctx.font = `600 ${wide ? 12 : 10.5}px 'Be Vietnam Pro', system-ui, sans-serif`;
      if (halo) {
        ctx.globalAlpha = a * 0.6;
        ctx.strokeText(sub, x - 13, y + (wide ? 16 : 14));
      }
      ctx.globalAlpha = a * 0.75;
      ctx.fillText(sub, x - 13, y + (wide ? 16 : 14));
    }
    ctx.globalAlpha = 1;
    // "Bạn" marker at the kite's height.
    const label = formatAlt(this.alt);
    const fs = wide ? 16 : 14;
    ctx.font = `800 ${fs}px 'Baloo 2', system-ui, sans-serif`;
    const tw = ctx.measureText(label).width;
    ctx.font = "800 10px 'Be Vietnam Pro', system-ui, sans-serif";
    const bw = ctx.measureText('BẠN').width;
    const w = tw + bw + 26;
    const h = wide ? 30 : 26;
    const bx = x - 14 - w;
    ctx.fillStyle = '#e5533d';
    ctx.shadowColor = 'rgba(0,0,0,.25)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.roundRect(bx, yk - h / 2, w, h, h / 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.moveTo(x - 14.5, yk - 6);
    ctx.lineTo(x - 6, yk);
    ctx.lineTo(x - 14.5, yk + 6);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd66b';
    ctx.fillText('BẠN', bx + 10, yk + 3.5);
    ctx.font = `800 ${fs}px 'Baloo 2', system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, bx + 16 + bw, yk + fs * 0.36);
    ctx.fillStyle = '#e5533d';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    disc(ctx, x, yk, 7);
    ctx.stroke();
  }

  /* ---------------------------------------------------------------- celebration */

  private drawRays() {
    if (this.rays <= 0) return;
    const { ctx } = this;
    const { x, sy: y } = this.kite;
    const a = clamp(this.rays / 0.8) * 0.28;
    const R = Math.min(Math.max(this.W, this.H), 1100);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.t * 0.4);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) {
      ctx.rotate((Math.PI * 2) / 14);
      const g = ctx.createLinearGradient(0, 0, R * 0.6, 0);
      g.addColorStop(0, `rgba(255,226,140,${a})`);
      g.addColorStop(1, 'rgba(255,226,140,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(R * 0.6, -R * 0.06);
      ctx.lineTo(R * 0.6, R * 0.06);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawParts() {
    const { ctx } = this;
    for (const r of this.rings) {
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = clamp(r.life) * 0.8;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.kite.x, this.kite.sy, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const p of this.parts) {
      const a = clamp((p.max - p.life) / 0.5);
      ctx.globalAlpha = a;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      if (p.kind === 'spark') {
        ctx.fillRect(-p.w * 2, -0.6, p.w * 4, 1.2);
        ctx.fillRect(-0.6, -p.w * 2, 1.2, p.w * 4);
      } else if (p.kind === 'leaf' || p.kind === 'feather') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Paper confetti flips as it falls.
        ctx.scale(1, Math.cos(p.life * 9 + p.r));
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------- the kite */

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
    const ky = this.yk + this.kite.y + (this.reduce ? 0 : Math.sin(this.t * 1.1) * 4);
    this.kite.x = kx;
    this.kite.sy = ky;
    const angle = sway + this.kite.a * 0.1;
    const dark = this.camL >= 4.3;
    // String: from the bridle point down to the kid's hand, sagging with the wind.
    const ax = kx + Math.sin(angle) * 20 * s;
    const ay = ky + 20 * s;
    const ex = this.hand.x || -W * 0.08;
    const ey = this.hand.y || H + 40;
    const sag = 40 + Math.sin(this.t * 0.9) * 12 + Math.max(0, this.kite.y) * 0.4;
    ctx.strokeStyle = dark ? 'rgba(244,234,210,.55)' : 'rgba(31,27,22,.55)';
    ctx.lineWidth = 1.3;
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
    // Tail ribbon with bows, streaming harder while the kite climbs.
    const climb = clamp(this.camVel * 0.8);
    ctx.strokeStyle = moon ? TRANG : SON;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const pts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      const px = 60 + Math.sin(this.t * (3 + climb * 4) + i * 0.7) * (5 + 14 * u) * (1 - climb * 0.5) - u * 10;
      const py = 214 + i * (10 + climb * 5);
      pts.push([px, py]);
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = moon ? TRANG : HOE;
    for (let i = 3; i < pts.length; i += 3) {
      const [px, py] = pts[i];
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 9, py - 4);
      ctx.lineTo(px - 9, py + 4);
      ctx.closePath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 9, py - 4);
      ctx.lineTo(px + 9, py + 4);
      ctx.closePath();
      ctx.fill();
    }
    // Flutes.
    const tubes = [[28, 0, 64, 9], [34, 10, 52, 8], [40, 19, 40, 7]].slice(0, this.flutes).reverse();
    ctx.fillStyle = '#c99b4a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2 / Math.max(0.6, s);
    for (const [x, y, w, h] of tubes) roundRect(ctx, x, y + (3 - this.flutes) * 9 + 4, w, h, h / 2);
    ctx.beginPath();
    ctx.moveTo(60, 26);
    ctx.lineTo(60, 30);
    ctx.stroke();
    // Soft drop shadow.
    ctx.save();
    ctx.translate(5, 6);
    ctx.fillStyle = 'rgba(20,30,60,.18)';
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
