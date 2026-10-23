// The living sky of Thả Diều: a smooth sky that darkens into space, objects placed at their real altitude on a
// log scale, the village at the foot of the sky, the altitude ruler, wind streaks while climbing, celebration
// confetti, and a kite that sways, leaps and dips.
import { CEILING_L, MILESTONES, formatAlt, lapOf } from '../../shared/scoring.js';
import * as Art from './art';
import * as Land from './land';
import * as Sp from './space';
import { kiteArt, sailSvg, type Tail } from '../kites';
import * as V from './village';

type Sprite = Art.Sprite;

let ART: ReturnType<typeof makeArt> | null = null;
function makeArt() {
  const plane = Sp.airlinerSvg();
  return {
    stork: [Art.sprite(Art.storkSvg(0)), Art.sprite(Art.storkSvg(1))],
    bamboo: [Art.sprite(V.bambooSvg(1)), Art.sprite(V.bambooSvg(4))],
    areca: [Art.sprite(V.arecaSvg(0)), Art.sprite(V.arecaSvg(-1))],
    banyan: Art.sprite(V.banyanSvg()),
    house: [Art.sprite(V.houseSvg(0)), Art.sprite(V.houseSvg(1))],
    // bé Bi, the mascot: a painted picture; hand = where the kite string leaves his raised fist.
    kids: Art.spriteUrl('/art/be-bi.png', 325, 420),
    hand: { x: 0.928, y: 0.276 },
    plane: Art.sprite(plane),
    planeTail: plane.tail,
    balloon: Art.sprite(Sp.balloonSvg()),
    hotAir: [Art.sprite(Sp.hotAirSvg(0)), Art.sprite(Sp.hotAirSvg(1)), Art.sprite(Sp.hotAirSvg(2))],
    iss: Art.sprite(Sp.issSvg()),
    vinasat: Art.sprite(Sp.vinasatSvg()),
    magpie: [Art.sprite(Sp.magpieSvg(0)), Art.sprite(Sp.magpieSvg(1))],
    cuoi: Art.spriteUrl('/art/cuoi.png', 283, 360),
    hang: Art.spriteUrl('/art/hang.png', 316, 520),
  };
}

const INK = '#1f1b16';
/** Modest phones (few cores or little memory) draw at a lower resolution and skip some effects. */
const LITE = (navigator.hardwareConcurrency ?? 8) <= 4 || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 3;
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
  [22.3, '#0a0d34', '#16185a', '#2a1660'],
  [23.7, '#1a0a3a', '#341258', '#4a1a5e'],
  [24.7, '#06162e', '#0e2c4e', '#1c2a5c'],
  [25.8, '#1c0a30', '#3a1240', '#5a1c42'],
  [26.7, '#3a1428', '#7a2c34', '#c0643a'],
];

/** Lap 2: the same climb at sunset. Lap 3: a festival dusk in violet. Space above stays the same. */
const SKY2: typeof SKY = [
  [0, '#e9875a', '#f5b47e', '#fde0b8'],
  [2, '#df7b5c', '#f0a577', '#f8cfa2'],
  [3.2, '#b9607a', '#e08f7c', '#f2b98f'],
  [4.4, '#4f3474', '#8c5288', '#cc7f86'],
  [5.2, '#1a1236', '#35215a', '#63386a'],
  ...SKY.slice(5),
];
const SKY3: typeof SKY = [
  [0, '#4351ad', '#8b84dc', '#e8b6e3'],
  [2, '#3c4aa3', '#7c78d4', '#d6a6e2'],
  [3.2, '#32408c', '#6a68c6', '#b998de'],
  [4.4, '#1d2265', '#3a3994', '#7766bd'],
  [5.2, '#0b0e30', '#1d1d58', '#3a3388'],
  ...SKY.slice(5),
];

function skyAt(L: number, lap = 1): [Rgb, Rgb, Rgb] {
  const T = lap >= 3 ? SKY3 : lap === 2 ? SKY2 : SKY;
  let i = 0;
  while (i < T.length - 2 && L > T[i + 1][0]) i++;
  const a = T[i];
  const b = T[Math.min(i + 1, T.length - 1)];
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
  /** Leave the kite out (a share card draws its own). */
  noKite?: boolean;
  /** Where the village sits on the log scale; lower values leave more open sky under the kite at take-off. */
  ground?: number;
  /** Vertical band (fractions of the height) holding the page's text; on narrow screens the ruler keeps quiet there. */
  text?: [number, number];
  /** Pixels at the bottom covered by the page's controls. */
  bottom?: number;
  /** On phones, the highest the dyke may sit (pixels from the top), so the flyer stands above the page's card. */
  stand?: number;
  /** On phones, where the flyer stands across the width (fraction). */
  flyerX?: number;
}

export const LAYOUTS: Record<'home' | 'play' | 'result', SkyLayout> = {
  home: { kiteX: 0.64, kiteY: 0.34, decade: 0.95, kiteSize: 0.26, ruler: false, kiteMax: 170, column: 560, ground: -0.3 },
  play: { kiteX: 0.5, kiteY: 0.19, decade: 0.45, kiteSize: 0.2, ruler: true, top: 70, column: 680, kiteMax: 96, ground: -1.36, text: [0.33, 0.74], bottom: 92 },
  result: { kiteX: 0.5, kiteY: 0.15, decade: 0.55, kiteSize: 0.19, ruler: false, column: 520, kiteMax: 150 },
};

const log = (alt: number) => Math.log10(Math.max(1, alt));
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/** How long each of bé Bi's tap moves lasts (seconds): spinning jump, two hops, a little dance. */
const KID_MOVE_SECONDS = [1.1, 0.8, 1.2];

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
  andromeda: Land.Paint;
  cluster: Land.Paint;
  web: Land.Paint;
  firstLight: Land.Paint;
  nebulaA: Land.Paint;
  nebulaB: Land.Paint;
  cloudTones: Land.Paint[][];
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
  private stars: { x: number; y: number; r: number; tw: number; sp: number; c: string }[] = [];
  /** A star that flares for a moment: a bright four-pointed glint somewhere in the dark. */
  private glints: { x: number; y: number; life: number; size: number; c: string }[] = [];
  private clouds: { L: number; x: number; w: number; v: number }[] = [];
  private streaks: { x: number; y: number; len: number; a: number }[] = [];
  private meteors: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
  private parts: Particle[] = [];
  private rings: { r: number; v: number; life: number; color: string }[] = [];
  private rays = 0;
  private flash = 0;
  private hand = { x: 0, y: 0 };
  /** Where bé Bi stands on screen (CSS px), for the tap target the home screen lays over him. */
  private kidBox = { x: 0, y: 0, w: 0, h: 0 };
  /** A playful move bé Bi is in the middle of, after a tap: which one and when it started. */
  private kidMove: { kind: number; t0: number } | null = null;
  private kidMoves = 0;
  private paints: Paints | null = null;
  private reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private ro: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    ART ??= makeArt();
    const r = mulberry(5);
    for (let i = 0; i < (LITE ? 170 : 260); i++) {
      const warm = r();
      this.stars.push({ x: r(), y: r(), r: Math.pow(r(), 3) * 2.2 + 0.5, tw: r() * 6.28, sp: 0.6 + r() * 2.6, c: warm < 0.15 ? '255,214,170' : warm < 0.3 ? '180,210,255' : '244,240,226' });
    }
    const rc = mulberry(7);
    const levels = [1.6, 1.85, 2.15, 2.4, 2.65, 3.6, 3.8, 4.0, 4.2];
    levels.forEach((L, i) => this.clouds.push({ L: L + rc() * 0.08, x: (i * 0.37 + rc() * 0.2) % 1, w: i >= 4 ? 0.16 + rc() * 0.08 : 0.24 + rc() * 0.14, v: 4 + rc() * 5 }));
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.raf = requestAnimationFrame((t) => this.frame(t));
    // No drawing while the tab is in the background.
    document.addEventListener('visibilitychange', this.onVisible);
    // Nor while a sheet or menu covers the sky: redrawing under a blurred overlay makes scrolling it stutter.
    const check = () => {
      this.held = !!document.querySelector('.sheet-wrap, .drawer-wrap, .coach-wrap');
    };
    this.mo = new MutationObserver(check);
    this.mo.observe(document.body, { childList: true, subtree: true });
    check();
  }

  private held = false;
  /** Smoothed gap between animation frames (ms) and whether the sky has dropped to half rate on a slow device. */
  private prevRaf = 0;
  private dprCap = LITE ? 1.25 : 2;
  private gap = 16.7;
  private seen = 0;
  private slow = false;
  private skip = false;
  private heldDrawn = 0;
  private wakeUntil = 0;
  private wake() {
    this.wakeUntil = performance.now() + 1500;
  }
  private mo: MutationObserver;

  private onVisible = () => {
    cancelAnimationFrame(this.raf);
    if (!document.hidden) {
      this.last = 0;
      this.raf = requestAnimationFrame((t) => this.frame(t));
    }
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.mo.disconnect();
    document.removeEventListener('visibilitychange', this.onVisible);
  }

  private skin: { id: string; aura?: string; prize?: boolean } = { id: 'son' };
  /** The kite sails, drawn from their SVG art once and kept as images. */
  private kiteImgs = new Map<string, HTMLImageElement>();

  /**
   * Paints the scene at an altitude onto a fresh canvas of the given size, for the share picture: the same sky,
   * objects and kite the player saw at that height. The live view is left untouched.
   */
  snapshot(w: number, h: number, alt: number, layout: SkyLayout): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const keep = { ctx: this.ctx, W: this.W, H: this.H, dpr: this.dpr, t: this.t, layout: this.layout, camL: this.camL, alt: this.alt, paints: this.paints, village: this.village, kite: { ...this.kite }, parts: this.parts, rings: this.rings, rays: this.rays, flash: this.flash, streaks: this.streaks, meteors: this.meteors, hand: this.hand, lap: this.lap, warp: this.warp, tween: this.tween };
    try {
      this.ctx = c.getContext('2d')!;
      this.W = w;
      this.H = h;
      this.dpr = 1;
      this.layout = layout;
      const at = lapOf(alt);
      this.camL = log(at.inner);
      this.lap = at.lap;
      this.alt = alt;
      this.paints = null;
      this.village = null;
      this.kite = { y: 0, vy: 0, a: 0, va: 0, x: 0, sy: 0 };
      this.parts = [];
      this.rings = [];
      this.rays = 0;
      this.flash = 0;
      this.streaks = [];
      this.meteors = [];
      // A still picture: freeze the clock where the airliner is fully in frame (about a third across), so a card
      // made at the airliner's height always shows it, nose and contrails, instead of wherever it happened to be.
      this.t = (w * 0.34 + Math.min(this.U * 0.5, 260) / 2) / 40;
      this.draw();
    } finally {
      Object.assign(this, keep);
    }
    return c;
  }

  /** The player's kite: its shape, tails and glow come from the kite collection. */
  setSkin(s: { id?: string; aura?: string; prize?: boolean }) {
    this.wake();
    this.skin = { id: s.id ?? 'son', aura: s.aura, prize: s.prize };
    this.kiteImage(this.skin.id);
  }

  private kiteImage(id: string) {
    let img = this.kiteImgs.get(id);
    if (!img) {
      img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sailSvg(id));
      this.kiteImgs.set(id, img);
    }
    return img;
  }

  setLayout(l: SkyLayout) {
    this.wake();
    this.layout = l;
  }

  /** Moves the camera to an altitude: the world slides past while the kite stays near its spot. With a duration, the climb follows a set ease. */
  setAltitude(alt: number, animate = true, dur?: number) {
    this.wake();
    this.alt = alt;
    const { lap, inner } = lapOf(alt);
    this.targetL = log(inner);
    this.tween = null;
    this.warp = null;
    if (!animate || this.reduce || lap < this.lap) {
      this.lap = lap;
      this.camL = this.targetL;
      return;
    }
    if (lap > this.lap) {
      // Up to the edge of the universe, through the wormhole, and out above the meadow of the next lap.
      this.warp = { lap, to: this.targetL, dur: dur ? dur * 0.5 : 1.2 };
      this.tween = { from: this.camL, to: CEILING_L + 0.05, t0: this.t, dur: dur ? dur * 0.55 : 1.4 };
      return;
    }
    if (dur) this.tween = { from: this.camL, to: this.targetL, t0: this.t, dur };
  }

  /** The lap of the sky being shown: 1, then 2, 3… after each pass through the wormhole. */
  private lap = 1;
  private warp: { lap: number; to: number; dur: number } | null = null;
  private get innerL() {
    return log(lapOf(this.alt).inner);
  }

  setFlutes(n: number) {
    this.wake();
    this.flutes = Math.max(1, Math.min(3, n));
  }

  setNervous(on: boolean) {
    this.wake();
    this.nervous = on;
  }

  /** Where the kite is on screen, in CSS pixels. */
  kitePos() {
    return { x: this.kite.x, y: this.kite.sy };
  }

  /** Bé Bi's spot on screen, so a tap on him can be caught above the canvas. */
  kidRect() {
    return { ...this.kidBox };
  }

  /**
   * A tap on bé Bi: he does one of his moves in turn (a spinning jump, two happy hops, a little dance), the kite
   * tugs up on its string and a few sparkles pop. Returns the move's length in seconds.
   */
  poke() {
    if (this.kidMove && this.t - this.kidMove.t0 < KID_MOVE_SECONDS[this.kidMove.kind]) return 0;
    const kind = this.kidMoves++ % KID_MOVE_SECONDS.length;
    this.kidMove = { kind, t0: this.t };
    if (!this.reduce) {
      this.boost(0.6);
      const { x, y, w, h } = this.kidBox;
      for (let i = 0; i < 14; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const v = 120 + Math.random() * 140;
        this.parts.push({
          x: x + w / 2 + (Math.random() - 0.5) * w * 0.5,
          y: y + h * 0.25,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          r: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 10,
          w: 4 + Math.random() * 3,
          h: 4 + Math.random() * 3,
          color: ['#ffd66b', '#e5533d', '#ffffff', '#7fd0ff'][i % 4],
          life: 0,
          max: 0.9 + Math.random() * 0.5,
          kind: 'spark',
        });
      }
    }
    return KID_MOVE_SECONDS[kind];
  }

  /** The pose for bé Bi's current move: lift (px), turn (radians) and squash, all easing back to rest. */
  private kidPose(bw: number) {
    const m = this.kidMove;
    if (!m) return { dy: 0, rot: 0, sx: 1, sy: 1, dx: 0 };
    const d = KID_MOVE_SECONDS[m.kind];
    const u = (this.t - m.t0) / d;
    if (u >= 1) {
      this.kidMove = null;
      return { dy: 0, rot: 0, sx: 1, sy: 1, dx: 0 };
    }
    const k = this.reduce ? 0.35 : 1;
    const hop = (v: number) => Math.sin(Math.PI * clamp(v)); // 0 → 1 → 0
    if (m.kind === 0) {
      // Crouch, leap with a full turn, land with a squash.
      const crouch = u < 0.15 ? hop(u / 0.3) : 0;
      const air = u >= 0.15 && u < 0.8 ? (u - 0.15) / 0.65 : -1;
      const land = u >= 0.8 ? hop((u - 0.8) / 0.4) : 0;
      return {
        dy: air >= 0 ? hop(air) * bw * 0.9 * k : 0,
        rot: air >= 0 && !this.reduce ? air * Math.PI * 2 : 0,
        sx: 1 + (crouch + land) * 0.14 * k,
        sy: 1 - (crouch + land) * 0.14 * k,
        dx: 0,
      };
    }
    if (m.kind === 1) {
      // Two quick happy hops.
      const v = (u * 2) % 1;
      return { dy: hop(v) * bw * 0.35 * k, rot: 0, sx: 1 - hop(v) * 0.06 * k, sy: 1 + hop(v) * 0.08 * k, dx: 0 };
    }
    // A little dance: sway side to side, bobbing.
    const sw = Math.sin(u * Math.PI * 6) * (1 - u);
    return { dy: Math.abs(Math.sin(u * Math.PI * 6)) * bw * 0.12 * k, rot: sw * 0.22 * k, sx: 1, sy: 1, dx: sw * bw * 0.12 * k };
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

  /** Confetti around the kite, growing with the rarity rank (0 Thường … 6 Độc nhất); rank 1 is the Khôn lỏi puff. */
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
    this.dpr = Math.min(this.dprCap, window.devicePixelRatio || 1);
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
    const base = {
      key,
      hillsFar: Land.paintHills(W, Math.min(H * 0.16, 150), pd, 3, '#a9c9d6', '#c2dbe4', U * 1.4),
      hillsNear: Land.paintHills(W, Math.min(H * 0.1, 96), pd, 8, '#7fb07a', '#98c48c', U),
      hedge: Land.paintHedge(W, Math.max(40, U * 0.11), pd, U),
      fields: Land.paintFields(W, Math.round(H * 0.7), pd, U),
      sea: Land.paintCloudSea(W, Math.round(Math.max(150, H * 0.3 * 0.3 + 120 * Math.max(0.8, U / 390))), pd, U),
      clouds: [Land.paintCloud(U * 0.6, pd, 1), Land.paintCloud(U * 0.6, pd, 2), Land.paintCloud(U * 0.6, pd, 3)],
      cloudTones: ([1, 2] as const).map((tone) => [1, 2, 3].map((seed) => Land.paintCloud(U * 0.6, pd, seed, tone))),
    } as unknown as Paints;
    // The deep-space pictures (planets, nebulae, galaxies) only show high up: painting them is deferred until first
    // used, and warmed one by one while the browser is idle, so the home screen opens without that start-up work.
    const lazy = <K extends keyof Paints>(k: K, make: () => Paints[K]) =>
      Object.defineProperty(base, k, {
        configurable: true,
        enumerable: true,
        get() {
          const v = make();
          Object.defineProperty(base, k, { value: v, enumerable: true });
          return v;
        },
      });
    lazy('galaxy', () => Sp.paintGalaxy(W, Math.round(H * 0.8), pd));
    lazy('venus', () => Sp.paintPlanet('venus', Math.round(U * 0.24), dpr));
    lazy('saturn', () => Sp.paintPlanet('saturn', Math.round(U * 0.36), dpr));
    lazy('mars', () => Sp.paintPlanet('mars', Math.round(U * 0.26), dpr));
    lazy('jupiter', () => Sp.paintPlanet('jupiter', Math.round(U * 0.5), dpr));
    lazy('neptune', () => Sp.paintPlanet('neptune', Math.round(U * 0.3), dpr));
    lazy('moon', () => Sp.paintMoon(Math.round(Math.min(U * 0.86, H * 0.48)), dpr));
    lazy('comet', () => Sp.paintComet(Math.round(U * 0.62), dpr));
    lazy('andromeda', () => Sp.paintAndromeda(Math.round(Math.min(Math.max(W * 1.15, H * 0.75), 1100)), pd));
    lazy('nebulaA', () => Sp.paintNebulaField(W, Math.round(H * 1.2), pd, 11, ['120,90,255', '70,140,255', '255,90,180', '90,200,255']));
    lazy('nebulaB', () => Sp.paintNebulaField(W, Math.round(H * 1.2), pd, 29, ['255,120,80', '255,80,140', '160,90,255', '255,190,90']));
    lazy('cluster', () => Sp.paintCluster(W, Math.round(H * 0.7), pd));
    lazy('web', () => Sp.paintWeb(W, Math.round(H * 0.9), pd));
    lazy('firstLight', () => Sp.paintFirstLight(W, Math.round(H * 0.9), pd));
    this.paints = base;
    this.warmLater(key);
    return this.paints;
  }

  private warmTimer = 0;
  private warmLater(key: string) {
    window.clearTimeout(this.warmTimer);
    const names = ['galaxy', 'moon', 'venus', 'mars', 'jupiter', 'saturn', 'neptune', 'comet', 'andromeda', 'nebulaA', 'nebulaB', 'cluster', 'web', 'firstLight'] as const;
    let i = 0;
    const next = () => {
      if (this.paints?.key !== key || i >= names.length) return;
      void this.paints[names[i++]];
      this.warmTimer = window.setTimeout(next, 250);
    };
    this.warmTimer = window.setTimeout(next, 3000);
  }

  private frame(now: number) {
    // Measure how the device keeps up. If it cannot hold about 45 fps, draw every second frame (the motion keeps its
    // speed, it just steps at 30 fps, which is steadier than a stuttering 40) and lower the pixel density once.
    if (this.prevRaf) {
      const g = Math.min(100, now - this.prevRaf);
      this.gap += (g - this.gap) * 0.06;
      if (++this.seen > 90 && !this.slow && this.gap > 26 && !document.hidden) {
        this.slow = true;
        this.dprCap = Math.min(this.dprCap, 1.25);
        this.resize();
      }
    }
    this.prevRaf = now;
    if (this.slow) {
      this.skip = !this.skip;
      if (this.skip) {
        this.raf = requestAnimationFrame((t) => this.frame(t));
        return;
      }
    }
    // Under a sheet the sky slows to a few frames a second, unless something just changed (a new kite, a new height),
    // which then plays at full speed for a moment so the player sees it at once.
    if (this.held && now > this.wakeUntil && now - this.heldDrawn < 160) {
      this.raf = requestAnimationFrame((t) => this.frame(t));
      return;
    }
    if (this.held) this.heldDrawn = now;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
    this.last = now;
    this.t += dt;
    const prev = this.camL;
    if (this.tween) {
      const p = clamp((this.t - this.tween.t0) / this.tween.dur);
      this.camL = this.tween.from + (this.tween.to - this.tween.from) * easeInOut(p);
      if (p >= 1) {
        this.tween = null;
        if (this.warp) {
          const w = this.warp;
          this.warp = null;
          this.lap = w.lap;
          this.flash = 0.9;
          this.rings.push({ r: 10, v: 900, life: 1.2, color: '#c8b6ff' }, { r: 10, v: 600, life: 1.4, color: '#ffd66b' });
          this.camL = Math.min(w.to, -0.6);
          this.tween = { from: this.camL, to: w.to, t0: this.t, dur: w.dur + 0.6 };
        }
      }
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
    if (speed > 260 && !this.reduce && !LITE) {
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

  /** Where the village sits on the log scale, lifted on phones so the dyke shows above the page's card. */
  private get groundL() {
    const L = this.layout;
    const g = L.ground ?? -0.55;
    if (!L.stand || this.wide || !this.P) return g;
    const target = L.stand - this.P.fields.dyke - 6;
    return Math.max(g, g + (this.y(g) - target) / (this.H * L.decade));
  }

  private y(L: number) {
    return this.yk - (L - this.camL) * this.H * this.layout.decade;
  }

  private draw() {
    const { ctx, W, H } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const [top, mid, low] = skyAt(this.camL, this.lap);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, css(top));
    g.addColorStop(0.55, css(mid));
    g.addColorStop(1, css(low));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    this.drawStars();
    this.drawSun();
    this.drawDeepSpace();
    this.drawEarth();
    this.drawOrbit();
    this.drawAir();
    this.drawFarUniverse();
    this.drawGround();
    this.drawLapExtras();
    this.drawStreaks();
    if (this.layout.ruler) this.drawRuler();
    this.drawRays();
    if (!this.layout.noKite) this.drawKite();
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
    const inset = this.layout.ruler ? 90 : 40;
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
    const t = this.t;
    for (const s of this.stars) {
      // Each star breathes at its own pace; a sharpened sine makes them sparkle rather than pulse.
      const wave = 0.5 + 0.5 * Math.sin(t * s.sp + s.tw);
      const tw = Math.pow(wave, 2.2);
      const a = a0 * (0.25 + 0.75 * tw);
      const x = s.x * W;
      const y = (s.y * H + drift) % H;
      if (s.r > 1.4) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 4);
        g.addColorStop(0, `rgba(${s.c},${a * 0.55})`);
        g.addColorStop(1, `rgba(${s.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - s.r * 4, y - s.r * 4, s.r * 8, s.r * 8);
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        const len = s.r * (2 + tw * 5);
        ctx.fillStyle = `rgba(${s.c},${a * 0.5})`;
        ctx.fillRect(x - len, y - 0.5, len * 2, 1);
        ctx.fillRect(x - 0.5, y - len, 1, len * 2);
      } else {
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.fillRect(x, y, s.r, s.r);
      }
    }
    // Now and then a star flares into a four-pointed glint and fades.
    if (!this.reduce && Math.random() < (LITE ? 0.02 : 0.05) * a0) {
      this.glints.push({ x: Math.random() * W, y: Math.random() * H, life: 1, size: 5 + Math.random() * 9, c: Math.random() < 0.3 ? '255,226,180' : Math.random() < 0.5 ? '190,215,255' : '255,255,255' });
    }
    for (const g of this.glints) {
      g.life -= 0.016;
      const k = Math.sin(Math.max(0, g.life) * Math.PI);
      const size = g.size * (0.4 + k);
      const glow = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, size * 1.2);
      glow.addColorStop(0, `rgba(${g.c},${0.8 * k * a0})`);
      glow.addColorStop(1, `rgba(${g.c},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(g.x - size * 1.2, g.y - size * 1.2, size * 2.4, size * 2.4);
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.life * 0.6);
      ctx.fillStyle = `rgba(${g.c},${k * a0})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? size * 0.16 : size * 1.6;
        const ang = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    this.glints = this.glints.filter((g) => g.life > 0);
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
      const A = ART!;
      // Chú Cuội sitting under the banyan and waving, chị Hằng drifting past with the jade rabbit in her arms.
      const ground = cy + size * 0.36;
      // A small pale hill on the moon for the banyan and Cuội to sit on.
      const hill = ctx.createRadialGradient(cx, ground, 0, cx, ground, size * 0.36);
      hill.addColorStop(0, 'rgba(255,251,234,.95)');
      hill.addColorStop(0.6, 'rgba(250,236,190,.75)');
      hill.addColorStop(1, 'rgba(250,236,190,0)');
      ctx.fillStyle = hill;
      ctx.beginPath();
      ctx.ellipse(cx, ground + size * 0.01, size * 0.36, size * 0.075, 0, 0, Math.PI * 2);
      ctx.fill();
      this.put(A.banyan, cx - size * 0.06, ground + size * 0.015, size * 0.66, 0.5, 1);
      const sway = this.reduce ? 0 : Math.sin(this.t * 2.2) * 0.03;
      ctx.save();
      ctx.translate(cx + size * 0.07, ground + size * 0.03);
      ctx.rotate(sway);
      this.put(A.cuoi, 0, 0, size * 0.3, 0.5, 1);
      ctx.restore();
      const bob = this.reduce ? 0 : Math.sin(this.t * 0.9) * size * 0.025;
      const hx = this.layout.column ? cx - size * 0.44 : cx - size * 0.66;
      ctx.save();
      ctx.translate(hx, cy + bob);
      ctx.rotate(this.reduce ? 0 : Math.sin(this.t * 0.6) * 0.035);
      this.put(A.hang, 0, 0, size * 0.42);
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

  /** Beyond the Milky Way: Andromeda, the Virgo cluster, the cosmic web, and the first light with the wormhole at the top. */
  private drawFarUniverse() {
    const { ctx, W, H } = this;
    if (this.camL < 20.6) return;
    const P = this.P;
    const pd = Math.min(this.dpr, 1.5);
    // Nebula backdrop, tiled with a slower parallax so the clouds feel far behind the galaxies.
    const fade = clamp((this.camL - 20.6) / 1.2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const [paint, from, to, par] of [[P.nebulaA, 20.6, 24.2, 0.35], [P.nebulaB, 24.0, 27, 0.35]] as const) {
      const a = 0.85 * fade * clamp((this.camL - from) / 0.8) * clamp((to - this.camL) / 0.8);
      if (a <= 0) continue;
      const th = paint.height / pd;
      const off = ((((this.camL - from) * H * this.layout.decade * par) % th) + th) % th;
      ctx.globalAlpha = a;
      for (let y = off - th; y < H; y += th) ctx.drawImage(paint, 0, y, W, th);
    }
    ctx.globalAlpha = 1;
    // Twinkling foreground stars with cross spikes.
    for (let i = 0; i < (LITE ? 26 : 48); i++) {
      const x = W * ((i * 0.618 + 0.11) % 1);
      const base = ((i * 0.37) % 1) * H;
      const y = (base + (this.camL * H * this.layout.decade * 0.6)) % (H + 40) - 20;
      const tw = 0.5 + 0.5 * Math.sin(this.t * (1.3 + (i % 5) * 0.4) + i * 2.1);
      const s = (1 + (i % 4) * 0.7) * (0.6 + tw * 0.6);
      const col = i % 3 === 0 ? '255,220,180' : i % 3 === 1 ? '190,215,255' : '255,255,255';
      const g = ctx.createRadialGradient(x, y, 0, x, y, s * 5);
      g.addColorStop(0, `rgba(${col},${0.9 * fade})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - s * 5, y - s * 5, s * 10, s * 10);
      ctx.fillStyle = `rgba(${col},${0.5 * tw * fade})`;
      ctx.fillRect(x - s * 9, y - 0.5, s * 18, 1);
      ctx.fillRect(x - 0.5, y - s * 9, 1, s * 18);
    }
    ctx.restore();

    if (this.visible(22.37, H * 1.4)) {
      const w = P.andromeda.width / pd;
      const h = P.andromeda.height / pd;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(P.andromeda, (this.wide ? this.gx(0.4) : W * 0.5) - w / 2, this.y(22.37) + H * 0.32 - h / 2, w, h);
      ctx.restore();
    }
    if (this.visible(23.71, H * 1.1)) {
      const h = P.cluster.height / pd;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(P.cluster, 0, this.y(23.71) + H * 0.3 - h / 2, W, h);
      ctx.restore();
    }
    if (this.visible(24.67, H * 1.2)) {
      const h = P.web.height / pd;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.85 + 0.15 * Math.sin(this.t * 0.8);
      ctx.drawImage(P.web, 0, this.y(24.67) + H * 0.3 - h / 2, W, h);
      ctx.restore();
    }
    if (this.visible(26.1, H)) {
      const h = P.firstLight.height / pd;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp((this.camL - 25.2) / 0.6);
      ctx.drawImage(P.firstLight, 0, this.y(26.1) - h / 2, W, h);
      ctx.restore();
    }
    if (this.visible(CEILING_L, H * 0.8)) this.drawWormhole(W / 2, this.y(CEILING_L), Math.min(W * 0.4, H * 0.3));
  }

  /** The wormhole at the edge of everything: a black sphere ringed by a blazing, lensed disc of light. */
  private drawWormhole(cx: number, cy: number, R: number) {
    const ctx = this.ctx;
    const t = this.t;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';
    // Wide glow.
    const halo = ctx.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 2.6);
    halo.addColorStop(0, 'rgba(255,200,120,.55)');
    halo.addColorStop(0.35, 'rgba(255,120,80,.18)');
    halo.addColorStop(1, 'rgba(160,80,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, R * 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Back half of the disc, bent over the top of the hole by gravity.
    const ring = (rx: number, ry: number, lw: number, col: string, a0: number, a1: number) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, a0, a1);
      ctx.stroke();
    };
    for (const [k, col] of [[1.0, 'rgba(255,170,90,.35)'], [0.86, 'rgba(255,220,150,.55)'], [0.74, 'rgba(255,250,220,.8)']] as const) {
      ring(R * k * 0.62, R * k * 0.62, R * 0.08 * k, col, 0, Math.PI * 2);
    }
    // The disc itself, seen nearly edge-on.
    for (const [k, lw, col] of [[1.9, 0.1, 'rgba(255,120,60,.25)'], [1.6, 0.07, 'rgba(255,170,90,.45)'], [1.3, 0.05, 'rgba(255,220,160,.7)'], [1.05, 0.03, 'rgba(255,250,235,.95)']] as const) {
      ring(R * k, R * k * 0.16, R * lw, col, 0, Math.PI * 2);
    }
    // Sparks streaming around the disc.
    for (let i = 0; i < 90; i++) {
      const rr = R * (0.95 + ((i * 0.137) % 1) * 1.1);
      const a = t * (1.6 - rr / R * 0.5) + i * 2.4;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr * 0.16;
      ctx.fillStyle = i % 3 ? 'rgba(255,230,170,.8)' : 'rgba(255,150,90,.8)';
      ctx.fillRect(x, y, 2, 2);
    }
    // The black sphere, then the front half of the disc passing in front of it.
    ctx.globalCompositeOperation = 'source-over';
    const hole = ctx.createRadialGradient(0, 0, R * 0.4, 0, 0, R * 0.58);
    hole.addColorStop(0, 'rgba(0,0,0,1)');
    hole.addColorStop(0.85, 'rgba(0,0,0,1)');
    hole.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = hole;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ring(R * 0.5, R * 0.5, R * 0.02, 'rgba(255,240,210,.9)', 0, Math.PI * 2);
    for (const [k, lw, col] of [[1.6, 0.07, 'rgba(255,170,90,.5)'], [1.3, 0.05, 'rgba(255,220,160,.75)'], [1.05, 0.035, 'rgba(255,250,235,1)']] as const) {
      ring(R * k, R * k * 0.16, R * lw, col, 0, Math.PI);
    }
    ctx.restore();
  }

  /** Lap rewards in the low sky: sky lanterns from lap 2, fireflies and coloured lanterns from lap 3. */
  private drawLapExtras() {
    if (this.lap < 2) return;
    const { ctx, W } = this;
    if (this.visible(2, 900)) {
      const n = this.lap >= 3 ? 12 : 8;
      for (let i = 0; i < n; i++) {
        const L = 0.6 + ((i * 0.37 + this.t * 0.02 * (1 + (i % 3) * 0.3)) % 3.2);
        const x = W * ((i * 0.29 + 0.07) % 1) + Math.sin(this.t * 0.6 + i) * 10;
        const y = this.y(L);
        const s = 9 + (i % 3) * 4;
        const col = this.lap >= 3 ? ['255,120,170', '255,210,110', '140,220,255', '190,150,255'][i % 4] : '255,190,110';
        const g = ctx.createRadialGradient(x, y, 0, x, y, s * 3);
        g.addColorStop(0, `rgba(${col},.6)`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - s * 3, y - s * 3, s * 6, s * 6);
        ctx.fillStyle = `rgba(${col},.95)`;
        ctx.beginPath();
        ctx.moveTo(x - s * 0.55, y - s * 0.7);
        ctx.lineTo(x + s * 0.55, y - s * 0.7);
        ctx.lineTo(x + s * 0.42, y + s * 0.7);
        ctx.lineTo(x - s * 0.42, y + s * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,230,.9)';
        ctx.fillRect(x - s * 0.18, y + s * 0.35, s * 0.36, s * 0.3);
      }
    }
    if (this.lap >= 3 && this.visible(0.8, 500)) {
      for (let i = 0; i < 30; i++) {
        const x = W * ((i * 0.137) % 1) + Math.sin(this.t * 0.9 + i * 2) * 18;
        const y = this.y(-0.4 + ((i * 0.071) % 1.6)) + Math.cos(this.t * 1.1 + i) * 10;
        const a = 0.4 + 0.6 * Math.abs(Math.sin(this.t * 2 + i));
        ctx.fillStyle = `rgba(230,255,160,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
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

  /**
   * How much of the Earth seen from orbit shows: none in the air, all of it once the kite is past the edge of space
   * (about 160 km), fading away out by the Moon, where the Earth is a dot.
   */
  private earthA() {
    return clamp((this.camL - 5.0) / 0.25) * (1 - clamp((this.camL - 8.3) / 0.4));
  }

  /**
   * The Earth below, at its true apparent size: from height h its disc spans asin(R / (R + h)) on each side of straight
   * down. At 250 km that is a horizon barely curved; at 3.500 km a ball filling the bottom of the screen; from the
   * geostationary ring a small marble. The log-scale sky cannot show this by placing things, so the globe is drawn
   * from the camera's height instead.
   */
  private drawEarth() {
    const a = this.earthA();
    if (a <= 0) return;
    const { ctx, W, H } = this;
    const R = 6.371e6;
    const h = Math.pow(10, this.camL);
    const theta = Math.asin(R / (R + h));
    const r = 0.35 * Math.max(W, H) * Math.tan(theta);
    const cx = W / 2;
    const cy = Math.max(H * 0.8, H * 0.7 + r);
    ctx.save();
    ctx.globalAlpha = a;
    // Atmosphere: a soft blue halo fading out from the limb, and a bright hairline on it.
    const hr = r + Math.min(r * 0.08, 50) + 14;
    const halo = ctx.createRadialGradient(cx, cy, r * 0.98, cx, cy, hr);
    halo.addColorStop(0, 'rgba(130,205,255,.55)');
    halo.addColorStop(0.35, 'rgba(110,190,255,.18)');
    halo.addColorStop(1, 'rgba(110,190,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, hr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(190,235,255,.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const sea = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.45, r * 0.05, cx, cy, r);
    sea.addColorStop(0, '#6cc2ff');
    sea.addColorStop(0.55, '#2b76c9');
    sea.addColorStop(1, '#0c3168');
    ctx.fillStyle = sea;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    // Land and cloud bands drifting slowly with the Earth's turning.
    const spin = this.t * 0.012;
    const land: [number, number, number, number, number][] = [
      [0.1, -0.55, 0.32, 0.16, 0.4], [0.55, -0.2, 0.26, 0.22, -0.3], [1.3, -0.45, 0.4, 0.18, 0.2],
      [1.9, 0.15, 0.22, 0.3, 0.5], [2.6, -0.3, 0.3, 0.14, -0.2], [3.4, 0.05, 0.36, 0.2, 0.1],
      [4.3, -0.6, 0.28, 0.12, 0.3], [5.1, -0.1, 0.24, 0.26, -0.4],
    ];
    for (const [lon, lat, rw, rh, rot] of land) {
      const ang = lon + spin;
      const c = Math.sin(ang);
      if (Math.cos(ang) < -0.1) continue;
      const x = cx + c * r * 0.85;
      const y = cy + lat * r;
      const squash = Math.max(0.15, Math.cos(ang));
      // Each land mass is a few overlapping lobes, so it reads as a coastline rather than an egg.
      ctx.fillStyle = 'rgba(92,168,90,.9)';
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const kx = Math.cos(k * 2.4 + lon * 3) * rw * 0.55;
        const ky = Math.sin(k * 1.7 + lon * 5) * rh * 0.6;
        const kr = (0.45 + 0.25 * Math.sin(k * 3.1 + lon)) * Math.min(rw, rh) * 1.4;
        ctx.ellipse(x + kx * r * squash, y + ky * r, kr * r * squash, kr * r * 0.8, rot, 0, Math.PI * 2);
        ctx.closePath();
      }
      ctx.fill();
      ctx.fillStyle = 'rgba(205,184,120,.4)';
      ctx.beginPath();
      ctx.ellipse(x + rw * r * squash * 0.15, y - rh * r * 0.15, rw * r * squash * 0.35, rh * r * 0.3, rot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      const y = cy - r * 0.8 + i * r * 0.27;
      const off = ((spin * 1.6 + i * 0.37) % 1) * r * 2;
      ctx.lineWidth = Math.max(2, r * 0.035);
      ctx.beginPath();
      ctx.moveTo(cx - r + off - r * 0.5, y);
      ctx.quadraticCurveTo(cx - r + off, y - r * 0.05, cx - r + off + r * 0.45, y + r * 0.02);
      ctx.stroke();
    }
    // Night on the far side, and the rim of air seen edge-on.
    const night = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    night.addColorStop(0.45, 'rgba(4,10,30,0)');
    night.addColorStop(1, 'rgba(4,10,30,.75)');
    ctx.fillStyle = night;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
    rim.addColorStop(0, 'rgba(150,215,255,0)');
    rim.addColorStop(1, 'rgba(170,225,255,.55)');
    ctx.fillStyle = rim;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  }

  private drawOrbit() {
    const { ctx, W, H } = this;
    const A = ART!;
    // The edge of space: a glowing limb of atmosphere with aurora curtains above it, until the globe takes over.
    const limb = 1 - this.earthA();
    if (limb > 0 && this.visible(5, H * 0.4)) {
      const y = this.y(5);
      const R = W * 2.4;
      const cy = y + R;
      ctx.save();
      ctx.globalAlpha = limb;
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
    // Satellites give way as Cung Trăng comes into view, so the moon scene is only the moon and its folk.
    const quiet = 1 - clamp((this.camL - 7.75) / 0.35);
    if (quiet <= 0) return;
    ctx.globalAlpha = quiet;
    // Smaller satellites on the way out to the geostationary ring.
    for (const [L, fx, k, rot] of [[6.35, 0.78, 0.3, -0.4], [6.95, 0.2, 0.26, 0.3]] as const) {
      if (!this.visible(L)) continue;
      ctx.save();
      ctx.translate((this.wide ? this.gx(fx) : W * fx) + Math.sin(this.t * 0.4 + L) * 8, this.y(L));
      ctx.rotate(rot + Math.sin(this.t * 0.3 + L) * 0.05);
      this.put(A.vinasat, 0, 0, Math.min(this.U * k, 150), 0.5, 0.5, 0.9 * quiet);
      ctx.restore();
    }
    if (this.visible(7.55)) {
      const w = Math.min(this.U * 0.56, 300);
      this.put(A.vinasat, this.gx(0.25) + Math.sin(this.t * 0.3) * 10, this.y(7.55) + Math.sin(this.t * 0.5) * 4, w, 0.5, 0.5, quiet);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------- the air: storks, clouds, hot-air balloons, airliner, weather balloon */

  private drawAir() {
    const { ctx, W, H } = this;
    const A = ART!;
    const P = this.P;
    // From orbit the planes and balloons are far below, lost against the globe.
    if (this.earthA() > 0.5) return;
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
      const img = this.lap >= 2 ? P.cloudTones[this.lap >= 3 ? 1 : 0][i % 3] : P.clouds[i % 3];
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
    if (this.lap >= 3) {
      // Festival dusk: a pale crescent moon instead of the sun.
      ctx.fillStyle = `rgba(255,246,220,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.55, 0, Math.PI * 2);
      ctx.arc(x + size * 0.25, y - size * 0.12, size * 0.5, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
      return;
    }
    const big = this.lap === 2 ? 1.5 : 1;
    const d = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size * 0.6 * big);
    d.addColorStop(0, `rgba(255,252,232,${a})`);
    d.addColorStop(0.7, this.lap === 2 ? `rgba(255,170,90,${a})` : `rgba(255,224,130,${a})`);
    d.addColorStop(1, this.lap === 2 ? `rgba(240,110,70,${a})` : `rgba(255,206,100,${a})`);
    ctx.fillStyle = d;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6 * big, 0, Math.PI * 2);
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

  private groundLayer: HTMLCanvasElement | null = null;

  /** Later laps tint the land: warm sunset light on lap 2, violet festival dusk from lap 3. */
  private drawGround() {
    if (this.lap < 2) return this.drawGroundInner();
    const main = this.ctx;
    const c = (this.groundLayer ??= document.createElement('canvas'));
    if (c.width !== main.canvas.width || c.height !== main.canvas.height) {
      c.width = main.canvas.width;
      c.height = main.canvas.height;
    }
    const g = c.getContext('2d')!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, c.width, c.height);
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx = g;
    try {
      this.drawGroundInner();
      g.globalCompositeOperation = 'source-atop';
      g.fillStyle = this.lap >= 3 ? 'rgba(96,78,200,.32)' : 'rgba(255,128,70,.26)';
      g.fillRect(0, 0, this.W, this.H);
      g.globalCompositeOperation = 'source-over';
    } finally {
      this.ctx = main;
    }
    main.save();
    main.setTransform(1, 0, 0, 1, 0, 0);
    main.drawImage(c, 0, 0);
    main.restore();
  }

  private drawGroundInner() {
    const { ctx, W, H, layout } = this;
    const A = ART!;
    const yg = this.y(this.groundL);
    const yk = this.yk;
    const P = this.P;
    const pd = Math.min(this.dpr, 1.5);
    const bw = Math.min(this.U * 0.24, 120);
    // On wide screens the flyer stands in the left margin, clear of the page column (the play screen keeps it nearer the middle, away from its side panels).
    const col = layout.column ?? 0;
    const bx = !this.wide
      ? W * (layout.flyerX ?? (layout.kiteX > 0.55 ? 0.22 : 0.2))
      : Math.max(bw / 2 + 24, (W - col) / 2 - 36 - bw / 2);
    const bh = (bw * A.kids.h) / A.kids.w;
    const dyke = yg + P.fields.dyke;
    const pose = this.kidPose(bw);
    this.hand = { x: bx - bw / 2 + A.hand.x * bw + pose.dx, y: dyke + 3 - bh + A.hand.y * bh - pose.dy };
    this.kidBox = { x: bx - bw / 2, y: dyke + 3 - bh, w: bw, h: bh };
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
    ctx.fillStyle = 'rgba(30,60,20,.25)';
    ctx.beginPath();
    // The shadow shrinks while he is in the air.
    const lift = clamp(pose.dy / (bw * 0.9));
    ctx.ellipse(bx + pose.dx, dyke + 3, bw * 0.34 * (1 - lift * 0.45), bw * 0.05 * (1 - lift * 0.45), 0, 0, Math.PI * 2);
    ctx.fill();
    if (!this.kidMove) this.put(A.kids, bx, dyke + 3, bw, 0.5, 1);
    else {
      // Turn about his middle, squash about his feet.
      ctx.save();
      ctx.translate(bx + pose.dx, dyke + 3 - pose.dy);
      ctx.scale(pose.sx, pose.sy);
      ctx.translate(0, -bh / 2);
      ctx.rotate(pose.rot);
      this.put(A.kids, 0, bh / 2, bw, 0.5, 1);
      ctx.restore();
    }

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
    const dark = this.camL >= 4.3 || this.lap >= 3;
    const r0 = this.top + (wide ? 24 : 14);
    const r1 = H - (this.layout.bottom ?? 0) - (wide ? 24 : 16);
    const yk = this.yk;
    // On wide screens the ruler stands in a glass column that mirrors the rarity ladder on the left.
    // A slim line at the right edge, without a panel, so the sky stays open.
    const x = wide ? W - 40 : W - 14;
    const quiet = !wide && this.layout.text ? [H * this.layout.text[0], H * this.layout.text[1]] : null;
    const top = r0;
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
    const halo = true;
    for (const m of MILESTONES) {
      const L = m.alt <= 0 ? this.groundL : log(m.alt);
      const y = this.y(L);
      if (y < top || y > r1) continue;
      const a = fade(y);
      const passed = this.innerL >= L;
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
    ctx.font = `900 ${fs}px 'Grandstander', system-ui, sans-serif`;
    const tw = ctx.measureText(label).width;
    ctx.font = "800 10px 'Be Vietnam Pro', system-ui, sans-serif";
    const bw = ctx.measureText('Bạn').width;
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
    ctx.fillText('Bạn', bx + 10, yk + 3.5);
    ctx.font = `900 ${fs}px 'Grandstander', system-ui, sans-serif`;
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

    const art = kiteArt(this.skin.id);
    const climb = clamp(this.camVel * 0.8);
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(sway * (art.sway - 1) + angle);
    ctx.scale(s, s);
    ctx.translate(-60, -104);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Tails first, behind the sail.
    let lapPts: [number, number][] = [];
    art.tails.forEach((t, k) => {
      const pts = this.drawTail(t, k, climb);
      if (k === 0) lapPts = pts;
    });
    // One gold star on the tail for every lap of the sky completed.
    for (let k = 0; k < Math.min(5, this.lap - 1) && lapPts.length; k++) {
      const [px, py] = lapPts[Math.min(lapPts.length - 1, 2 + k * 2)];
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(this.t * 1.5 + k);
      ctx.fillStyle = '#ffd66b';
      ctx.beginPath();
      for (let j = 0; j < 10; j++) {
        const a = -Math.PI / 2 + (j * Math.PI) / 5;
        const rr = j % 2 ? 4 : 9;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // Bamboo flutes on top of the frame.
    const top = art.top - 30;
    const tubes = [[28, 0, 64, 9], [34, 10, 52, 8], [40, 19, 40, 7]].slice(0, this.flutes).reverse();
    ctx.fillStyle = '#c99b4a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2 / Math.max(0.6, s);
    for (const [x, y, w, h] of tubes) roundRect(ctx, x, top + y + (3 - this.flutes) * 9 + 4, w, h, h / 2);
    ctx.beginPath();
    ctx.moveTo(60, top + 26);
    ctx.lineTo(60, top + 30);
    ctx.stroke();
    // A soft light behind the kite so it reads against the dark of space.
    if (dark || this.skin.aura) {
      const pulse = 0.75 + 0.25 * Math.sin(this.t * 2.2);
      const col = this.skin.aura ?? '255,246,220';
      const al = this.skin.aura ? 0.55 * pulse : 0.16;
      const g = ctx.createRadialGradient(60, 110, 10, 60, 110, 150);
      g.addColorStop(0, `rgba(${col},${al})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-90, -40, 300, 310);
    }
    // The sail, beating like wings on bird and butterfly kites.
    const img = this.kiteImage(this.skin.id);
    if (img.complete && img.naturalWidth) {
      ctx.save();
      if (art.flap && !this.reduce) {
        const beat = 1 - art.flap * (0.5 + 0.5 * Math.sin(this.t * (5 + climb * 4)));
        ctx.translate(60, 0);
        ctx.scale(beat, 1);
        ctx.translate(-60, 0);
      }
      ctx.shadowColor = 'rgba(20,30,60,.22)';
      ctx.shadowOffsetX = 5 * s * this.dpr;
      ctx.shadowOffsetY = 6 * s * this.dpr;
      ctx.drawImage(img, 0, 0, 120, 220);
      ctx.restore();
    }
    // Prize kites shimmer.
    if (this.skin.prize && !this.reduce) {
      for (let i = 0; i < 7; i++) {
        const a = this.t * 0.7 + i * 0.9;
        const x = 60 + Math.cos(a * 1.3 + i) * (40 + (i % 3) * 14);
        const y = 104 + Math.sin(a + i * 2) * (60 + (i % 2) * 20);
        const tw = Math.pow(0.5 + 0.5 * Math.sin(this.t * 4 + i * 1.7), 3);
        ctx.fillStyle = `rgba(255,250,225,${tw})`;
        ctx.beginPath();
        for (let j = 0; j < 8; j++) {
          const r = j % 2 ? 1.2 : 5 * tw + 1;
          const ang = (j * Math.PI) / 4;
          ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /** One tail of the kite, streaming in the wind; returns its points so stars can ride on it. */
  private drawTail(t: Tail, k: number, climb: number): [number, number][] {
    const ctx = this.ctx;
    const [x0, y0] = t.at;
    const time = this.reduce ? 0 : this.t;
    if (t.kind === 'dragon') {
      // The dragon's body: a chain of discs that ripples down from the head.
      const n = 10;
      const segs: [number, number, number][] = [];
      for (let i = 1; i <= n; i++) {
        const u = i / n;
        const x = x0 + Math.sin(time * 2.4 - i * 0.62) * (4 + i * 2.4) - u * 6;
        const y = y0 - 4 + i * (t.length / n) * (0.9 + climb * 0.25);
        segs.push([x, y, 15 - u * 8]);
      }
      for (let i = segs.length - 1; i >= 0; i--) {
        const [x, y, r] = segs[i];
        if (i === segs.length - 1) {
          ctx.fillStyle = '#e5533d';
          ctx.beginPath();
          ctx.moveTo(x - r, y);
          ctx.quadraticCurveTo(x - r * 2.2, y + r * 3, x + Math.sin(time * 3) * 6, y + r * 4);
          ctx.quadraticCurveTo(x + r * 2.2, y + r * 3, x + r, y);
          ctx.fill();
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.strokeStyle = t.color2!;
        ctx.lineWidth = 2.6;
        const legs = Math.sin(time * 5 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(x - r * 1.4, y);
        ctx.lineTo(x - r * 1.4 - 7, y + 6 + legs);
        ctx.moveTo(x + r * 1.4, y);
        ctx.lineTo(x + r * 1.4 + 7, y + 6 - legs);
        ctx.stroke();
        ctx.fillStyle = i % 2 ? t.color2! : t.color;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.5, r * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.beginPath();
        ctx.ellipse(x - r * 0.4, y - r * 0.25, r * 0.6, r * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      return segs.map(([x, y]) => [x, y]);
    }
    const n = t.kind === 'tassel' ? 4 : 10;
    const phase = k * 1.9;
    const speed = t.kind === 'feather' ? 2.2 : 3;
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const px = x0 + Math.sin(time * (speed + climb * 4) + i * 0.7 + phase) * (4 + 14 * u) * (1 - climb * 0.5) - u * 10;
      const py = y0 + u * t.length * (1 + climb * 0.4);
      pts.push([px, py]);
    }
    if (t.kind === 'tassel') {
      for (let j = -2; j <= 2; j++) {
        ctx.strokeStyle = j % 2 ? t.color2 ?? t.color : t.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        const [ex, ey] = pts[n];
        ctx.quadraticCurveTo(x0 + j * 3, y0 + t.length * 0.5, ex + j * 5, ey);
        ctx.stroke();
      }
      ctx.fillStyle = t.color2 ?? t.color;
      disc(ctx, x0, y0 + 2, 4);
      return pts;
    }
    ctx.strokeStyle = t.color;
    ctx.lineWidth = t.kind === 'feather' ? 5 : t.kind === 'streamer' ? 3.2 : 2.4;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    if (t.kind === 'ribbon') {
      ctx.fillStyle = t.color2 ?? t.color;
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
    } else if (t.kind === 'feather') {
      // A peacock eye at the tip of each long feather.
      const [ex, ey] = pts[n];
      ctx.fillStyle = t.color2 ?? '#ffd36b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(ex, ey, 6, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2fbf8f';
      disc(ctx, ex, ey, 3);
    }
    return pts;
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
