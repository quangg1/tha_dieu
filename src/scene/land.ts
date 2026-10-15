// Procedural landscape layers for the sky: rolling hills, the bamboo hedge, rice paddies and the dyke at
// the foot of the sky; soft clouds; the cloud deck the kite climbs through.
// Static layers are painted once into offscreen canvases and reused until the viewport changes size.

export type Paint = HTMLCanvasElement;

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number, dpr: number): [Paint, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return [c, ctx];
}

/* ---------------------------------------------------------------- hills */

/** Soft rolling hills along the horizon, with a lighter sunlit crest. Base sits at the bottom edge. */
export function paintHills(W: number, h: number, dpr: number, seed: number, fill: string, light: string, unit: number): Paint {
  const [c, ctx] = canvas(W, h, dpr);
  const r = rng(seed);
  const k1 = (Math.PI * 2) / (unit * (0.9 + r() * 0.4));
  const k2 = (Math.PI * 2) / (unit * (0.35 + r() * 0.2));
  const p1 = r() * 6;
  const p2 = r() * 6;
  const yAt = (x: number) => h * (0.42 + 0.3 * Math.sin(x * k1 + p1) + 0.12 * Math.sin(x * k2 + p2));
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, yAt(x));
  ctx.lineTo(W, h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = light;
  ctx.lineWidth = Math.max(2, unit / 160);
  ctx.beginPath();
  for (let x = 0; x <= W + 8; x += 8) (x ? ctx.lineTo(x, yAt(x) + 1) : ctx.moveTo(x, yAt(x) + 1));
  ctx.stroke();
  return c;
}

/* ---------------------------------------------------------------- bamboo hedge */

/** The "lũy tre" that rings a northern village: a continuous feathery green wall along the horizon. */
export function paintHedge(W: number, h: number, dpr: number, unit: number): Paint {
  const [c, ctx] = canvas(W, h, dpr);
  const r = rng(21);
  const s = unit / 390;
  const step = 11 * s;
  const tops: [number, number, number][] = [];
  for (let x = -20; x < W + 20; x += step * (0.7 + r() * 0.6)) {
    const big = Math.sin(x * 0.011) * 0.5 + Math.sin(x * 0.037 + 1) * 0.3;
    const rad = (11 + r() * 8) * s;
    tops.push([x, h - h * (0.42 + big * 0.2 + r() * 0.16), rad]);
  }
  ctx.fillStyle = '#244b20';
  for (const [x, y, rad] of tops) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillRect(0, h * 0.62, W, h);
  ctx.fillStyle = '#336a2b';
  for (const [x, y, rad] of tops) {
    ctx.beginPath();
    ctx.arc(x - rad * 0.2, y - rad * 0.25, rad * 0.72, 0, Math.PI * 2);
    ctx.fill();
  }
  // Drooping leaf sprays on the crest.
  ctx.strokeStyle = '#4f8a3a';
  ctx.lineCap = 'round';
  ctx.lineWidth = 2.2 * s;
  for (const [x, y, rad] of tops) {
    for (let k = 0; k < 3; k++) {
      const a = -2.4 + r() * 1.8;
      const sx = x + Math.cos(a) * rad * 0.7;
      const sy = y + Math.sin(a) * rad * 0.7;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(sx + Math.cos(a) * 6 * s, sy + Math.sin(a) * 6 * s, sx + Math.cos(a) * 8 * s, sy + 6 * s);
      ctx.stroke();
    }
  }
  return c;
}

/* ---------------------------------------------------------------- rice paddies and the dyke */

export interface Fields {
  img: Paint;
  /** Offset below the horizon of the dyke's top edge, where the buffalo stands. */
  dyke: number;
}

/** Paddies in perspective from the horizon to the viewer, with a grassy dyke and its earth path across the middle. */
export function paintFields(W: number, h: number, dpr: number, unit: number): Fields {
  const [c, ctx] = canvas(W, h, dpr);
  const r = rng(9);
  const s = unit / 390;
  const greens = ['#93c35b', '#86b94f', '#a2cb62', '#7cb048', '#b7c95a', '#d6b94f', '#8fbf55'];
  const dyke = Math.min(h * 0.2, 44 * Math.max(0.8, s));
  // Far paddies: rows that widen towards the viewer, cells that widen with them.
  const far = dyke + 8;
  const rows = 9;
  let y0 = 0;
  for (let i = 0; i < rows; i++) {
    const y1 = far * Math.pow((i + 1) / rows, 1.55);
    const cell = (30 + i * 16) * s;
    let x = -r() * cell;
    while (x < W) {
      const w = cell * (0.7 + r() * 0.9);
      const water = r() < 0.12;
      ctx.fillStyle = water ? '#b9dcea' : greens[Math.floor(r() * greens.length)];
      // Slanted dividers give the paddies a gentle perspective towards the middle of the view.
      const lean = (x + w / 2 - W / 2) * 0.12 * ((y1 - y0) / far);
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x + w, y0);
      ctx.lineTo(x + w + lean, y1);
      ctx.lineTo(x + lean, y1);
      ctx.closePath();
      ctx.fill();
      if (water) {
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.fillRect(x + w * 0.2, y0 + (y1 - y0) * 0.45, w * 0.35, Math.max(1, (y1 - y0) * 0.12));
      }
      x += w;
    }
    ctx.strokeStyle = 'rgba(239,230,196,.85)';
    ctx.lineWidth = Math.max(1, (0.8 + i * 0.25) * s);
    ctx.beginPath();
    ctx.moveTo(0, y1);
    ctx.lineTo(W, y1);
    ctx.stroke();
    y0 = y1;
  }
  // The dyke: grass slope, a pale earth path, tufts along the crest.
  const dh = Math.max(26, 30 * s);
  ctx.fillStyle = '#5f9139';
  ctx.beginPath();
  ctx.moveTo(0, dyke + 4);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, dyke + Math.sin(x * 0.01) * 3);
  ctx.lineTo(W, dyke + dh);
  ctx.lineTo(0, dyke + dh);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#dcc590';
  ctx.beginPath();
  ctx.moveTo(0, dyke + 7);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, dyke + 6 + Math.sin(x * 0.01) * 3);
  for (let x = W; x >= 0; x -= 20) ctx.lineTo(x, dyke + 6 + dh * 0.32 + Math.sin(x * 0.01) * 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4b7c30';
  ctx.fillRect(0, dyke + dh * 0.72, W, dh * 0.4);
  ctx.strokeStyle = '#4a7a2c';
  ctx.lineWidth = 1.6 * s;
  for (let x = 0; x < W; x += 9 * s) {
    const yy = dyke + Math.sin(x * 0.01) * 3 + 1;
    ctx.beginPath();
    ctx.moveTo(x, yy + 2);
    ctx.lineTo(x + (r() - 0.5) * 4, yy - 3 - r() * 4 * s);
    ctx.stroke();
  }
  // Near paddies below the dyke, larger and darker.
  let y = dyke + dh;
  let i = 0;
  while (y < h) {
    const rowH = (34 + i * 26) * s;
    const cell = (110 + i * 60) * s;
    let x = -r() * cell;
    while (x < W) {
      const w = cell * (0.7 + r() * 0.8);
      ctx.fillStyle = ['#6c9f45', '#77aa4c', '#5f9440', '#83b354'][Math.floor(r() * 4)];
      ctx.fillRect(x, y, w, rowH);
      ctx.fillStyle = 'rgba(239,230,196,.6)';
      ctx.fillRect(x, y, Math.max(1.5, 2 * s), rowH);
      x += w;
    }
    ctx.fillStyle = 'rgba(239,230,196,.7)';
    ctx.fillRect(0, y, W, Math.max(1.5, 2 * s));
    // Rows of rice seedlings.
    ctx.fillStyle = 'rgba(40,80,30,.25)';
    for (let k = 0; k < W; k += 7 * s * (1 + i * 0.5)) ctx.fillRect(k, y + rowH * 0.5, 1.4 * s, rowH * 0.18);
    y += rowH;
    i++;
  }
  return { img: c, dyke };
}

/* ---------------------------------------------------------------- clouds */

/** A soft, flat-bottomed cumulus: white on top, a cool shadow underneath, no outline. */
export function paintCloud(w: number, dpr: number, seed: number, warm = false): Paint {
  const h = w * 0.5;
  const [c, ctx] = canvas(w, h, dpr);
  const r = rng(seed);
  const base = h * 0.82;
  const shape = new Path2D();
  const n = 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const cx = w * (0.2 + u * 0.6) + (r() - 0.5) * w * 0.05;
    const rad = w * (0.1 + Math.sin(u * Math.PI) * (0.12 + r() * 0.06));
    shape.moveTo(cx + rad, base - rad * 0.55);
    shape.arc(cx, base - rad * 0.55, rad, 0, Math.PI * 2);
  }
  shape.roundRect(w * 0.08, base - h * 0.22, w * 0.84, h * 0.22, h * 0.11);
  ctx.fillStyle = warm ? '#fff8ec' : '#ffffff';
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  const g = ctx.createLinearGradient(0, base - h * 0.42, 0, base);
  g.addColorStop(0, 'rgba(196,220,236,0)');
  g.addColorStop(0.55, 'rgba(196,220,236,.75)');
  g.addColorStop(1, 'rgba(170,200,224,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, base - h * 0.42, w, h * 0.42);
  ctx.restore();
  return c;
}

/* ---------------------------------------------------------------- the sea of clouds */

/**
 * The cloud deck the kite climbs through at about 1.000 m: a billowing bright top, a solid body, and a soft grey
 * underside that fades into the sky. Seen from below it is a ceiling; from above, a white sea hiding the land.
 * `top` is the y of the cloud tops inside the painting.
 */
export function paintCloudSea(W: number, h: number, dpr: number, unit: number): { img: Paint; top: number } {
  const [c, ctx] = canvas(W, h, dpr);
  const r = rng(52);
  const s = Math.max(0.8, unit / 390);
  const top = 46 * s;
  const base = h - 40 * s;
  // Back row of billows, a touch greyer, then the front row.
  const row = (y: number, rmin: number, rmax: number, step: number, fill: string, shade: string) => {
    const path = new Path2D();
    for (let x = -30; x < W + 60; x += step * (0.7 + r() * 0.6)) {
      const rad = (rmin + r() * (rmax - rmin)) * s;
      const cy = y + rad * 0.35 + Math.sin(x * 0.013) * 8 * s;
      path.moveTo(x + rad, cy);
      path.arc(x, cy, rad, 0, Math.PI * 2);
    }
    path.rect(-10, y + 10 * s, W + 20, base - y);
    ctx.fillStyle = fill;
    ctx.fill(path);
    ctx.save();
    ctx.clip(path);
    const g = ctx.createLinearGradient(0, y - 30 * s, 0, base);
    g.addColorStop(0, 'rgba(200,222,238,0)');
    g.addColorStop(0.35, 'rgba(200,222,238,0)');
    g.addColorStop(1, shade);
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 40 * s, W, base - y + 40 * s);
    ctx.restore();
  };
  row(top - 12 * s, 26, 40, 54 * s, '#eef5fa', 'rgba(184,208,226,.9)');
  row(top + 8 * s, 18, 30, 40 * s, '#ffffff', 'rgba(196,216,232,.95)');
  // Soft underside: lumpy, grey-blue, fading out below.
  const under = new Path2D();
  for (let x = -20; x < W + 40; x += 38 * s) {
    const rad = (16 + r() * 14) * s;
    under.moveTo(x + rad, base - 6 * s);
    under.arc(x, base - 6 * s, rad, 0, Math.PI * 2);
  }
  const ug = ctx.createLinearGradient(0, base - 30 * s, 0, h);
  ug.addColorStop(0, 'rgba(196,216,232,1)');
  ug.addColorStop(1, 'rgba(196,216,232,0)');
  ctx.fillStyle = ug;
  ctx.fill(under);
  // A few light streaks across the top for texture.
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  for (let x = 0; x < W; x += 90 * s) ctx.fillRect(x + r() * 40 * s, top + 26 * s + r() * 18 * s, (30 + r() * 40) * s, 2.5 * s);
  return { img: c, top };
}

