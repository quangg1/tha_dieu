// Generative bamboo-flute music for Thả Diều, built entirely with Web Audio.
// Scale: Northern Vietnamese pentatonic (hò – xự – xang – xê – cống ≈ C D F G A).

const SCALE = [0, 2, 5, 7, 9];
const BASE_HZ = 261.63; // C4
/** Pad chords for space, as scale degrees: open fifths on hò, xự, xang and cống. */
const PAD_CHORDS = [[-5, -2, 0, 3], [-4, -1, 1, 4], [-3, 0, 2, 5], [-6, -3, -1, 2]];

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
  /** Space: a slow shimmering pad of open fifths that takes over from the field wind once the kite leaves the air. */
  private pad?: { gain: GainNode; filter: BiquadFilterNode; oscs: OscillatorNode[] };
  private padChord = 0;
  private padTimer: number | null = null;
  private timer: number | null = null;
  private nextAt = 0;
  private degree = 5;
  private phraseLeft = 6;
  private level = 1;
  private _on = true;
  private playing = false;
  /** The recorded bamboo-flute track that plays under everything. */
  private track?: { el: HTMLAudioElement; gain: GainNode };

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

  /** How far into space the music is: 0 in the air, 1 between the galaxies. */
  private get space() {
    return Math.max(0, Math.min(1, (this.level - 3) / 3));
  }

  /** 1 near the ground … 3 at the edge of space, 4 among the planets, 5 among the stars, 6 between galaxies. */
  setLevel(level: number) {
    this.level = Math.max(1, Math.min(6, level));
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const sp = this.space;
    this.droneGain?.gain.setTargetAtTime(0, t, 1.5);
    this.track?.gain.gain.setTargetAtTime(this.playing ? this.trackLevel : 0, t, 2);
    if (this.wind) {
      this.wind.filter.frequency.setTargetAtTime(this.level >= 3 ? 280 : 650, t, 2);
      // No wind in space: the rush of air fades out as the kite leaves the atmosphere.
      this.wind.gain.gain.setTargetAtTime(0.035 * (1 - sp), t, 2.5);
    }
    if (this.pad) {
      this.pad.gain.gain.setTargetAtTime(0.055 * sp, t, 3);
      this.pad.filter.frequency.setTargetAtTime(500 + 900 * sp, t, 3);
    }
    this.wet.gain.setTargetAtTime(0.45 + 0.3 * sp, t, 2);
  }

  /** Open-fifth chords on the pentatonic, gliding from one to the next every few seconds. */
  private startPad() {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.7;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(filter.frequency);
    lfo.start();
    gain.connect(filter);
    filter.connect(this.dry);
    filter.connect(this.wet);
    const oscs: OscillatorNode[] = [];
    const chord = PAD_CHORDS[0];
    chord.forEach((deg, i) => {
      for (const det of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type = i === 0 ? 'sine' : 'triangle';
        o.frequency.value = degreeHz(deg);
        o.detune.value = det;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.5 : 0.28;
        o.connect(g).connect(gain);
        o.start();
        oscs.push(o);
      }
    });
    this.pad = { gain, filter, oscs };
    this.padTimer = window.setInterval(() => {
      if (!this.ctx || !this.pad || this.space <= 0) return;
      this.padChord = (this.padChord + 1) % PAD_CHORDS.length;
      const next = PAD_CHORDS[this.padChord];
      this.pad.oscs.forEach((o, k) => o.frequency.setTargetAtTime(degreeHz(next[Math.floor(k / 2)]), this.ctx!.currentTime, 1.8));
    }, 9000);
  }

  /** A high glassy chime, like a star ringing far away. */
  private sparkle(at: number, vel: number) {
    const ctx = this.ctx!;
    const hz = degreeHz(13 + Math.floor(Math.random() * 7));
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = hz;
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = hz * 3.01;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vel * 0.09, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6);
    const g2 = ctx.createGain();
    g2.gain.value = 0.25;
    o.connect(g);
    o2.connect(g2).connect(g);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pan) {
      pan.pan.value = Math.random() * 1.6 - 0.8;
      g.connect(pan);
      pan.connect(this.wet);
      pan.connect(this.dry);
    } else {
      g.connect(this.wet);
    }
    for (const n of [o, o2]) {
      n.start(at);
      n.stop(at + 2.8);
    }
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

  /** Background music: the recorded flute track, a breath of wind, and a pad that rises in space. */
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
    this.droneGain.gain.setTargetAtTime(0, ctx.currentTime, 2);
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
    if (!this.pad) this.startPad();
    this.startTrack();
    this.setLevel(this.level);
  }

  /** The background flute track, looping through the master gain so the sound button mutes it too. */
  private startTrack() {
    const ctx = this.ctx!;
    if (!this.track) {
      const el = new Audio('/audio/sao.mp3');
      el.loop = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(el).connect(gain).connect(this.master);
      this.track = { el, gain };
    }
    this.track.gain.gain.setTargetAtTime(this.trackLevel, ctx.currentTime, 1.2);
    void this.track.el.play().catch(() => {});
  }

  /** The track softens as the kite climbs into space, where the shimmering pad takes over. */
  private get trackLevel() {
    return 0.55 * (1 - this.space * 0.45);
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    if (this.timer) clearInterval(this.timer);
    const t = this.ctx.currentTime;
    this.droneGain?.gain.setTargetAtTime(0, t, 0.6);
    this.wind?.gain.gain.setTargetAtTime(0, t, 0.6);
    this.pad?.gain.gain.setTargetAtTime(0, t, 0.8);
    if (this.track) {
      this.track.gain.gain.setTargetAtTime(0, t, 0.6);
      const el = this.track.el;
      setTimeout(() => !this.playing && el.pause(), 2500);
    }
    const drones = this.drone;
    this.drone = [];
    setTimeout(() => drones.forEach((o) => o.stop()), 3000);
  }

  /** The flutes of a tier join the music: 1 flute for Thường up to 9 in harmony for Cực hiếm and Độc nhất. */
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

  /** A plucked note, like a đàn tranh string, rising one pentatonic step per rung of the rarity ladder. */
  step(i: number) {
    const ctx = this.ctx;
    if (!ctx || !this._on) return;
    const at = ctx.currentTime + 0.01;
    const hz = degreeHz(5 + [0, 1, 2, 3, 4, 5, 6][Math.max(0, Math.min(6, i))] * 1);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(hz * 1.01, at);
    o.frequency.exponentialRampToValueAtTime(hz, at + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.22, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
    o.connect(g);
    g.connect(this.dry);
    g.connect(this.wet);
    o.start(at);
    o.stop(at + 0.55);
    this.bell(hz * 2, at, 0.12);
  }

  /** Khôn lỏi: the climb collapses with a comic downward slide. */
  boing() {
    const ctx = this.ctx;
    if (!ctx || !this._on) return;
    const at = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(degreeHz(9), at);
    o.frequency.exponentialRampToValueAtTime(degreeHz(1), at + 0.45);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
    o.connect(g);
    g.connect(this.dry);
    o.start(at);
    o.stop(at + 0.6);
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
