// Generative bamboo-flute music for Thả Diều, built entirely with Web Audio.
// Scale: Northern Vietnamese pentatonic (hò – xự – xang – xê – cống ≈ C D F G A).

const SCALE = [0, 2, 5, 7, 9];
const BASE_HZ = 261.63; // C4

function degreeHz(deg: number): number {
  const oct = Math.floor(deg / 5);
  const step = ((deg % 5) + 5) % 5;
  return BASE_HZ * Math.pow(2, oct + SCALE[step] / 12);
}

class FluteEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private dry!: GainNode;
  private wet!: GainNode;
  private noise!: AudioBuffer;
  private wind?: { gain: GainNode; filter: BiquadFilterNode };
  private drone: OscillatorNode[] = [];
  private droneGain?: GainNode;
  private timer: number | null = null;
  private nextAt = 0;
  private degree = 5;
  private phraseLeft = 6;
  private level = 1;
  private _on = true;
  private playing = false;

  get on() {
    return this._on;
  }

  /** Must be called from a click or key press: browsers only allow sound after the player interacts. */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.build();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  private build() {
    const ctx = this.ctx!;
    this.master = ctx.createGain();
    this.master.gain.value = this._on ? 0.9 : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);
    this.dry = ctx.createGain();
    this.dry.gain.value = 0.8;
    this.dry.connect(this.master);
    // A soft synthetic hall, like flutes heard across a rice field.
    const verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.8;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb.buffer = ir;
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.45;
    this.wet.connect(verb).connect(this.master);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = this.noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  setOn(on: boolean) {
    this._on = on;
    if (this.ctx) this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.15);
  }

  /** 1 near the ground … 4 in deep space: more voices join as the kite climbs. */
  setLevel(level: number) {
    this.level = Math.max(1, Math.min(4, level));
    if (this.droneGain && this.ctx) this.droneGain.gain.setTargetAtTime(0.018 + 0.008 * this.level, this.ctx.currentTime, 1.5);
    if (this.wind && this.ctx) this.wind.filter.frequency.setTargetAtTime(this.level >= 3 ? 280 : 650, this.ctx.currentTime, 2);
  }

  /** One breathy bamboo-flute note with a slide into pitch and late vibrato. */
  note(hz: number, at: number, dur: number, vel = 0.5, wetMix = 0.5) {
    const ctx = this.ctx;
    if (!ctx) return;
    const out = ctx.createGain();
    out.gain.value = 0;
    const att = 0.07;
    out.gain.setValueAtTime(0, at);
    out.gain.linearRampToValueAtTime(vel * 0.22, at + att);
    out.gain.setTargetAtTime(vel * 0.16, at + att, 0.3);
    out.gain.setTargetAtTime(0, at + dur, 0.18);
    const send = ctx.createGain();
    send.gain.value = wetMix;
    out.connect(this.dry);
    out.connect(send).connect(this.wet);

    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    o1.frequency.setValueAtTime(hz * 0.975, at);
    o1.frequency.exponentialRampToValueAtTime(hz, at + 0.09);
    o2.frequency.setValueAtTime(hz * 2 * 0.975, at);
    o2.frequency.exponentialRampToValueAtTime(hz * 2, at + 0.09);
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.2;
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, at);
    vibDepth.gain.linearRampToValueAtTime(hz * 0.006, at + Math.min(0.5, dur * 0.6));
    vib.connect(vibDepth);
    vibDepth.connect(o1.frequency);
    o1.connect(out);
    o2.connect(g2).connect(out);

    const breath = ctx.createBufferSource();
    breath.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = hz * 1.5;
    bp.Q.value = 1.4;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(vel * 0.09, at);
    bg.gain.setTargetAtTime(vel * 0.02, at + 0.08, 0.1);
    bg.gain.setTargetAtTime(0, at + dur, 0.12);
    breath.connect(bp).connect(bg).connect(out);

    const end = at + dur + 0.9;
    for (const n of [o1, o2, vib]) {
      n.start(at);
      n.stop(end);
    }
    breath.start(at, Math.random());
    breath.stop(end);
  }

  private bell(hz: number, at: number, vel = 0.4) {
    const ctx = this.ctx!;
    for (const [mult, amp, decay] of [[1, 1, 2.4], [2.76, 0.5, 1.4], [5.4, 0.25, 0.8]] as const) {
      const o = ctx.createOscillator();
      o.frequency.value = hz * mult;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vel * 0.12 * amp, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      o.connect(g);
      g.connect(this.dry);
      g.connect(this.wet);
      o.start(at);
      o.stop(at + decay + 0.1);
    }
  }

  /** The wooden "mõ" knock used as the last-seconds tick. */
  knock() {
    const ctx = this.ctx;
    if (!ctx || !this._on) return;
    const at = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(820, at);
    o.frequency.exponentialRampToValueAtTime(520, at + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
    o.connect(g).connect(this.dry);
    o.start(at);
    o.stop(at + 0.15);
  }

  /** Background music: wind, a low drone and a wandering pentatonic flute line. */
  start() {
    const ctx = this.ctx;
    if (!ctx || this.playing) return;
    this.playing = true;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.025;
    lfo.connect(lfoG).connect(gain.gain);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    lfo.start();
    this.wind = { gain, filter };

    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0;
    this.droneGain.gain.setTargetAtTime(0.026, ctx.currentTime, 2);
    this.droneGain.connect(this.dry);
    this.droneGain.connect(this.wet);
    for (const hz of [BASE_HZ / 2, (BASE_HZ / 2) * 1.5]) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = hz;
      o.connect(this.droneGain);
      o.start();
      this.drone.push(o);
    }
    this.nextAt = ctx.currentTime + 0.6;
    this.timer = window.setInterval(() => this.schedule(), 120);
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    if (this.timer) clearInterval(this.timer);
    const t = this.ctx.currentTime;
    this.droneGain?.gain.setTargetAtTime(0, t, 0.6);
    this.wind?.gain.gain.setTargetAtTime(0, t, 0.6);
    const drones = this.drone;
    this.drone = [];
    setTimeout(() => drones.forEach((o) => o.stop()), 3000);
  }

  private schedule() {
    const ctx = this.ctx!;
    const beat = 60 / 66;
    while (this.nextAt < ctx.currentTime + 0.4) {
      if (this.phraseLeft <= 0) {
        this.nextAt += beat * (2 + Math.floor(Math.random() * 3));
        this.phraseLeft = 5 + Math.floor(Math.random() * 5);
        continue;
      }
      const step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
      this.degree = Math.max(3, Math.min(11, this.degree + step));
      const len = [0.5, 0.5, 1, 1, 1, 1.5, 2][Math.floor(Math.random() * 7)] * beat;
      this.note(degreeHz(this.degree), this.nextAt, len * 0.95, 0.32);
      if (this.level >= 3 && Math.random() < 0.5) this.note(degreeHz(this.degree + 2), this.nextAt + 0.02, len * 0.9, 0.16);
      if (this.level >= 4 && Math.random() < 0.18) this.bell(degreeHz(this.degree + 5), this.nextAt + len * 0.5, 0.25);
      this.nextAt += len;
      this.phraseLeft--;
    }
  }

  /** The flutes of a tier join the music: 1 flute for Tà tà up to 9 in harmony for Tít mây xanh and Cung Trăng. */
  strike(flutes: number, moon = false) {
    const ctx = this.ctx;
    if (!ctx) return;
    const at = ctx.currentTime + 0.03;
    const chord = [0, 2, 4, 5, 7, 9, 10, 12, 14].slice(0, flutes);
    chord.forEach((d, i) => this.note(degreeHz(5 + d), at + i * 0.055, 1.6 - i * 0.05, 0.55 - i * 0.03, 0.6));
    if (moon) [0, 0.35, 0.7].forEach((dt, i) => this.bell(degreeHz(15 + i * 2), at + 0.4 + dt, 0.45));
    this.degree = 5 + chord[chord.length - 1];
    this.nextAt = Math.max(this.nextAt, at + 1.2);
  }

  /** A wrong answer: a short low slide. */
  wrong() {
    const ctx = this.ctx;
    if (!ctx) return;
    const at = ctx.currentTime;
    this.note(degreeHz(2), at, 0.25, 0.4, 0.2);
    this.note(degreeHz(1), at + 0.16, 0.3, 0.35, 0.2);
  }

  /** Out of wind: a falling three-note phrase. */
  fall() {
    const ctx = this.ctx;
    if (!ctx) return;
    const at = ctx.currentTime;
    [7, 5, 3].forEach((d, i) => this.note(degreeHz(d), at + i * 0.28, 0.5, 0.35));
  }

  /** Lift-off motif for the start of a flight. */
  rise() {
    const ctx = this.ctx;
    if (!ctx) return;
    const at = ctx.currentTime + 0.05;
    [3, 5, 6, 8].forEach((d, i) => this.note(degreeHz(d), at + i * 0.18, 0.5, 0.4));
  }
}

export const flute = new FluteEngine();
