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
        ctx.fillRect(x + w * 0.55, y0 + (y1 - y0) * 0.7, w * 0.25, Math.max(1, (y1 - y0) * 0.08));
      } else {
        // Rice seedlings in short rows, and a darker lip along the bottom edge of each plot.
        ctx.strokeStyle = 'rgba(45,100,40,.38)';
        ctx.lineWidth = Math.max(0.8, (0.7 + i * 0.12) * s);
        const step = Math.max(3, (3.2 + i * 0.9) * s);
        for (let rowY = y0 + (y1 - y0) * 0.35; rowY < y1 - 1; rowY += Math.max(3, (y1 - y0) * 0.32)) {
          for (let kx = x + step / 2; kx < x + w; kx += step) {
            ctx.beginPath();
            ctx.moveTo(kx + lean * 0.5, rowY);
            ctx.lineTo(kx + lean * 0.5 + (r() - 0.5) * 1.2, rowY - Math.max(2, (y1 - y0) * 0.3));
            ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(40,90,40,.10)';
        ctx.fillRect(x, y1 - Math.max(1, (y1 - y0) * 0.16), w, Math.max(1, (y1 - y0) * 0.16));
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
  // The meadow below the dyke: soft light and shade, then grass blades in three tones that grow with nearness,
  // clover and wildflowers, and a few stones, so the ground reads as a place and not as coloured blocks.
  const top = dyke + dh - 2;
  const span = Math.max(1, h - top);
  const gg = ctx.createLinearGradient(0, top, 0, h);
  gg.addColorStop(0, '#79ae4e');
  gg.addColorStop(0.3, '#69a143');
  gg.addColorStop(1, '#4b8032');
  ctx.fillStyle = gg;
  ctx.fillRect(0, top, W, span + 2);
  // Broad patches of sun and shade, flattened by perspective.
  for (let k = 0; k < 34; k++) {
    const t = Math.pow(r(), 1.3);
    const py = top + t * span;
    const rx = (70 + t * 260) * s * (0.6 + r() * 0.8);
    ctx.fillStyle = r() < 0.5 ? 'rgba(190,225,110,.16)' : 'rgba(30,80,40,.14)';
    ctx.beginPath();
    ctx.ellipse(r() * W, py, rx, rx * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // A worn track of paler, shorter grass where people walk, bending slowly across the foreground.
  ctx.fillStyle = 'rgba(214,200,140,.20)';
  ctx.beginPath();
  ctx.moveTo(W * 0.3, top);
  ctx.bezierCurveTo(W * 0.34, top + span * 0.3, W * 0.2, top + span * 0.6, W * 0.26, h);
  ctx.lineTo(W * 0.4, h);
  ctx.bezierCurveTo(W * 0.34, top + span * 0.6, W * 0.42, top + span * 0.3, W * 0.36, top);
  ctx.closePath();
  ctx.fill();
  // Grass blades: many, thin, in fans, bigger towards the bottom edge.
  const tones = ['#3f7a2c', '#4f8a35', '#5e9a3e', '#76ad48', '#9bcb62', '#b6d96e'];
  const blades = Math.round((W * span) / (560 * s * s));
  for (let k = 0; k < blades; k++) {
    const t = Math.pow(r(), 0.85);
    const by = top + 4 + t * (span - 4);
    const bx = r() * W;
    const len = (4 + t * 20) * s * (0.6 + r() * 0.8);
    ctx.lineWidth = Math.max(0.8, (0.9 + t * 1.8) * s);
    ctx.lineCap = 'round';
    for (let f = -1; f <= 1; f++) {
      ctx.strokeStyle = tones[Math.min(tones.length - 1, Math.floor(r() * (2 + t * 4)))];
      const lean = f * (0.3 + r() * 0.35) + (r() - 0.5) * 0.2;
      ctx.beginPath();
      ctx.moveTo(bx + f * 1.6 * s, by);
      ctx.quadraticCurveTo(bx + lean * len * 0.4, by - len * 0.6, bx + lean * len, by - len);
      ctx.stroke();
    }
  }
  // Clover leaves and clumps.
  for (let k = 0; k < Math.round(70 * (W / 700)); k++) {
    const t = Math.pow(r(), 0.9);
    const cx = r() * W;
    const cy = top + 8 + t * (span - 8);
    const rr = (2 + t * 5) * s;
    ctx.fillStyle = r() < 0.5 ? '#8bc15a' : '#a5d070';
    for (let q = 0; q < 3; q++) {
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(q * 2.1) * rr * 0.7, cy + Math.sin(q * 2.1) * rr * 0.4, rr * 0.7, rr * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Wildflowers on short stems: daisies, buttercups and small pink ones.
  for (let k = 0; k < Math.round(95 * (W / 700)); k++) {
    const t = Math.pow(r(), 0.8);
    const fx = r() * W;
    const fy = top + 10 + t * (span - 10);
    const fr = (1.8 + t * 5.2) * s;
    ctx.strokeStyle = '#3f7a2c';
    ctx.lineWidth = Math.max(0.8, fr * 0.3);
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + (r() - 0.5) * fr, fy - fr * 2.4);
    ctx.stroke();
    const hy = fy - fr * 2.4;
    const kind = r();
    if (kind < 0.45) {
      ctx.fillStyle = '#ffffff';
      for (let q = 0; q < 6; q++) {
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(q * 1.047) * fr * 0.9, hy + Math.sin(q * 1.047) * fr * 0.9, fr * 0.7, fr * 0.36, q * 1.047, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f2b630';
      ctx.beginPath();
      ctx.arc(fx, hy, fr * 0.55, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind < 0.8) {
      ctx.fillStyle = '#f6c533';
      ctx.beginPath();
      ctx.arc(fx, hy, fr * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe58a';
      ctx.beginPath();
      ctx.arc(fx - fr * 0.25, hy - fr * 0.25, fr * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#f08fb0';
      for (let q = 0; q < 5; q++) {
        ctx.beginPath();
        ctx.arc(fx + Math.cos(q * 1.257) * fr * 0.7, hy + Math.sin(q * 1.257) * fr * 0.7, fr * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath();
      ctx.arc(fx, hy, fr * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // A few stones.
  for (let k = 0; k < Math.round(14 * (W / 700)); k++) {
    const t = Math.pow(r(), 0.8);
    const sx = r() * W;
    const sy = top + 14 + t * (span - 14);
    const sr = (3 + t * 8) * s;
    ctx.fillStyle = 'rgba(40,60,30,.25)';
    ctx.beginPath();
    ctx.ellipse(sx + sr * 0.15, sy + sr * 0.3, sr * 1.1, sr * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = r() < 0.5 ? '#b9b7a8' : '#a6a595';
    ctx.beginPath();
    ctx.ellipse(sx, sy, sr, sr * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.beginPath();
    ctx.ellipse(sx - sr * 0.25, sy - sr * 0.2, sr * 0.45, sr * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Light falling off towards the bottom, so the eye stays on the dyke and the village.
  const vg = ctx.createLinearGradient(0, top + span * 0.55, 0, h);
  vg.addColorStop(0, 'rgba(20,50,25,0)');
  vg.addColorStop(1, 'rgba(20,50,25,.22)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, top, W, span + 2);
  return { img: c, dyke };
}

/* ---------------------------------------------------------------- clouds */

/** A soft, flat-bottomed cumulus: white on top, a cool shadow underneath, no outline. */
/** tone: 0 day, 1 sunset (lap 2), 2 festival dusk (lap 3). */
export function paintCloud(w: number, dpr: number, seed: number, tone: 0 | 1 | 2 = 0): Paint {
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
  ctx.fillStyle = ['#ffffff', '#ffe9d2', '#f6e8ff'][tone];
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  const g = ctx.createLinearGradient(0, base - h * 0.42, 0, base);
  const sh = ['196,220,236', '240,160,140', '170,150,230'][tone];
  const sh2 = ['170,200,224', '214,120,120', '130,110,210'][tone];
  g.addColorStop(0, `rgba(${sh},0)`);
  g.addColorStop(0.55, `rgba(${sh},.75)`);
  g.addColorStop(1, `rgba(${sh2},1)`);
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

