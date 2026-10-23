import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  NIGHT_MAX_SECONDS,
  NIGHT_START_SECONDS,
  QUESTION_SECONDS,
  CUNG_TRANG,
  KHON_LOI,
  TIERS,
  altitudeFor,
  basePoints,
  flightPoints,
  gioMultiplier,
  usesGio,
  rankOf,
  crossed,
  formatAlt,
  lastMilestone,
  lapOf,
  CEILING_L,
  type Milestone,
} from '../../shared/scoring.js';
import { answerQuip, seedOf } from '../quips';
import { api, ApiError, type AnswerResult, type Crowd, type FinishResult, type PublicQuestion } from '../api';
import { buzz } from '../haptics';
import { track } from '../track';
import { flute } from '../audio/flute';
import { TIER_COLOR, TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { playerId, playerSince, prefs, recordFlight, saveToday, today, vnDay, type LocalRow } from '../store';
import { BackIcon } from '../ui';
import { KiteIcon } from '../glyphs';

export interface Summary {
  mode: 'daily' | 'night';
  rows: LocalRow[];
  result: FinishResult;
  /** Thả vô tận: when this run began on the server, so the result counts this run only, not earlier runs today. */
  runSince?: string;
}

type Phase = 'loading' | 'intro' | 'asking' | 'judging' | 'reveal' | 'result' | 'error';

interface Outcome {
  kind: 'landed' | 'nothing' | 'late';
  input?: string;
  display?: string;
  tier?: number;
  points?: number;
  bonus?: number;
  /** Nối gió: the multiplier the answer was scored with, and whether a wind was lost to it. */
  gio?: number;
  calm?: boolean;
  share?: number | null;
  judged?: boolean;
  reason?: string;
  altitude: number;
  milestone?: Milestone | null;
  crowd?: Crowd;
}

interface Reveal {
  text: string;
  tier: number;
  /** Highest ladder rung reached so far, -1 before the climb starts. */
  step: number;
  /** Khôn lỏi: the climb collapsed back to the bottom. */
  fell: boolean;
}

const INTRO_SECONDS = 3;
/** How long to wait before asking again for a new answer the referee is still reading (its verdict is cached by then). */
const CHECKING_RETRY_MS = 1200;
/** Rungs of the rarity ladder from the bottom: Thường, Khá hiếm, Hiếm, Rất hiếm, Cực hiếm, Độc nhất. */
const LADDER = [0, 1, 2, 3, 4, 5];
const LEVELS = ['', 'gió nhẹ', 'gió vừa', 'gió mạnh'];

export function musicLevel(alt: number) {
  const L = Math.log10(Math.max(1, alt));
  // Lap 2 and 3 start again from the meadow, so only the height within the lap counts.
  const inner = L % CEILING_L;
  return inner < 3 ? 1 : inner < 5 ? 2 : inner < 8.5 ? 3 : inner < 13 ? 4 : inner < 21 ? 5 : 6;
}

function WindDial({ left, total, shared }: { left: number; total: number; shared?: boolean }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, left / total));
  const low = left <= 5;
  return (
    <div className={`dial${low ? ' low' : ''}`} role="timer" aria-label={`Còn ${Math.max(0, Math.ceil(left))} giây gió`}>
      <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r={r} fill="none" stroke="#e6ebf1" strokeWidth="5" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={low ? '#e5533d' : '#3a8fd8'} strokeWidth="5" strokeDasharray={`${c * p} ${c}`} strokeLinecap="round" transform="rotate(-90 25 25)" />
      </svg>
      <span>{Math.max(0, Math.ceil(left))}</span>
      {shared && <em className="dial-k">gió chung</em>}
    </div>
  );
}

/** Animated number for the HUD. */
function useRoll(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      const v = start + (value - start) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return shown;
}

/** A wind multiplier the Vietnamese way: ×1,75. */
const fmtGio = (m: number) => m.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

/** The rarity ladder: six rungs from Thường to Độc nhất, lit one by one as an answer climbs. */
function Ladder({ step, tier, fell, side, done, pts }: { step: number; tier: number | null; fell: boolean; side?: boolean; done?: boolean; pts: (t: number) => number }) {
  const khon = tier === KHON_LOI;
  return (
    <div className={`ladder${side ? ' ladder--side' : ''}${fell ? ' ladder--fell' : ''}`} aria-hidden="true">
      {side && <span className="ladder-k">Độ hiếm</span>}
      <ol>
        {[...LADDER].reverse().map((t) => {
          const i = LADDER.indexOf(t);
          const lit = i <= step;
          const here = i === step && step >= 0;
          const final = done && here && !khon;
          return (
            <li key={t} className={`rung${lit ? ' lit' : ''}${here ? ' here' : ''}${final ? ' final' : ''}`} style={{ '--c': TIER_COLOR[t] } as CSSProperties}>
              <TierIcon tier={t} size={side ? 30 : 28} />
              <span className="rung-name">{TIERS[t].name}</span>
              <span className="rung-pts">{pts(t)}</span>
            </li>
          );
        })}
      </ol>
      {fell && (
        <div className="ladder-khon" style={{ '--c': TIER_COLOR[KHON_LOI] } as CSSProperties}>
          <TierIcon tier={KHON_LOI} size={28} />
          <span>Khôn lỏi, {pts(KHON_LOI)} điểm</span>
        </div>
      )}
    </div>
  );
}

/** What the rest of the village answered: real shares once enough people have played, the book's guess before that. */
function CrowdPanel({ crowd, mine }: { crowd: Crowd; mine: string }) {
  if (crowd.estimated) {
    // Not enough players yet: the book's guess of the common answers, as one compact line.
    return (
      <div className="crowd">
        <span className="crowd-k">Sổ làng đoán cả làng hay nói</span>
        <span className="crowd-guess">{crowd.top.map((t) => t.display).join(', ')}</span>
      </div>
    );
  }
  const max = Math.max(1, ...crowd.top.map((t) => t.pct ?? 0));
  const top = crowd.top.slice(0, 3);
  const inTop = top.some((t) => t.mine);
  const row = (label: string, pct: number, isMine: boolean) => (
    <div key={label} className={`crowd-row${isMine ? ' mine' : ''}`}>
      <span className="crowd-name">{label}</span>
      <span className="crowd-bar"><i style={{ width: `${Math.max(4, (pct / max) * 100)}%` }} /></span>
      <span className="crowd-pct">{pct.toLocaleString('vi-VN')}%</span>
    </div>
  );
  return (
    <div className="crowd">
      <span className="crowd-k">{crowd.total.toLocaleString('vi-VN')} người đã trả lời câu này</span>
      {top.map((t) => row(t.display, t.pct ?? 0, t.mine))}
      {!inTop && row(`${mine} (bạn)`, crowd.mine ?? 0, true)}
    </div>
  );
}

export default function Game({ sky, mode, soundButton, onExit, onDone }: { sky: SkyScene; mode: 'daily' | 'night'; soundButton: ReactNode; onExit: () => void; onDone: (s: Summary) => void }) {
  const pid = useRef(playerId()).current;
  const [day, setDay] = useState(vnDay());
  const [list, setList] = useState<PublicQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState<PublicQuestion | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');
  const total = mode === 'night' ? NIGHT_MAX_SECONDS : QUESTION_SECONDS;
  const [left, setLeft] = useState(mode === 'night' ? NIGHT_START_SECONDS : QUESTION_SECONDS);
  const leftRef = useRef(left);
  const [intro, setIntro] = useState(INTRO_SECONDS);
  const [input, setInput] = useState('');
  const [suggest, setSuggest] = useState<{ from: string; to: string } | null>(null);
  const [rows, setRows] = useState<LocalRow[]>([]);
  const rowsRef = useRef<LocalRow[]>([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // The big moment for Cực hiếm and Độc nhất: a full-screen burst over the result, gone after a beat or a tap.
  const [burst, setBurst] = useState<{ tier: number; text: string; points: number } | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [quitArmed, setQuitArmed] = useState(false);
  const [pulling, setPulling] = useState(false);
  /** A new answer the referee is still reading: bé Bi is turning the pages, not scolding the player. */
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState('');
  /** The notice is a note from the village rather than a refusal, so it is not painted in the colour of a mistake. */
  const [noticeSoft, setNoticeSoft] = useState(false);
  /** The answer the village just turned away, so the player can say the referee got it wrong. */
  const [rejected, setRejected] = useState<{ questionId: string; input: string; sent: boolean } | null>(null);
  const seen = useRef<string[]>([]);
  const bestTier = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoNext = useRef<number | null>(null);
  const finishing = useRef(false);
  const timers = useRef<number[]>([]);
  const skipReveal = useRef<(() => void) | null>(null);
  const [coach, setCoach] = useState(false);
  const coachDone = useRef<(() => void) | null>(null);
  const [shake, setShake] = useState(0);

  const altitude = altitudeFor(score, mode, day);
  // Nối gió: the wind this flight carries now, from every turn so far in the order flown.
  const gio = usesGio(mode, day);
  const pts = (t: number) => basePoints(t, mode, day);
  const wind = gio ? flightPoints(rows.map((r) => r.tier), day).at(-1)?.wind ?? 0 : 0;
  const shownScore = useRoll(score);
  const shownAlt = useRoll(altitude);
  const lap = lapOf(shownAlt).lap;
  const dark = lap >= 3 || Math.log10(Math.max(1, lapOf(altitudeFor(shownScore, mode, day)).inner)) >= 4.3;
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hudRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // The scene keeps the kite and the ruler below the HUD, whatever height it wraps to.
    const el = hudRef.current;
    const fit = () => {
      // Short landscape phones: the kite flies on the left so the prompt keeps the middle of the screen.
      const land = window.innerHeight < 560 && window.innerWidth > window.innerHeight * 1.4 && window.innerWidth < 1100;
      sky.setLayout({ ...LAYOUTS.play, top: el ? Math.round(el.getBoundingClientRect().bottom) : LAYOUTS.play.top, ...(land ? { kiteX: 0.12, kiteY: 0.5, kiteSize: 0.3, text: [0, 1] as [number, number] } : {}) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (el) ro.observe(el);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [sky]);

  useEffect(() => {
    sky.setAltitude(0, false);
    sky.setFlutes(1);
    flute.setLevel(1);
    return () => {
      sky.setNervous(false);
      timers.current.forEach(clearTimeout);
    };
  }, [sky]);

  const pushRow = (r: LocalRow) => {
    rowsRef.current = [...rowsRef.current, r];
    setRows(rowsRef.current);
    if (mode === 'daily') saveToday({ day, rows: rowsRef.current });
  };

  useEffect(() => {
    track('start', { mode });
  }, [mode]);

  /* ------------------------------------------------ finishing */
  const runSince = useRef<string | null>(null);
  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    setPhase('loading');
    try {
      const result = await api.finish({ playerId: pid, day, mode, name: prefs.name || undefined, since: playerSince(), runSince: runSince.current ?? undefined });
      recordFlight(day, mode, result.altitude, result.score, result.grid);
      track('finish', { mode, score: result.score, alt: result.altitude, lap: lapOf(result.altitude).lap, replay: !!result.replay });
      if (mode === 'daily') saveToday({ day, rows: rowsRef.current, result });
      onDone({ mode, rows: rowsRef.current, result, runSince: runSince.current ?? undefined });
    } catch (e) {
      finishing.current = false;
      setError(e instanceof Error ? e.message : 'Không lưu được chuyến bay.');
      setPhase('error');
    }
  }, [pid, day, mode, onDone]);

  /* ------------------------------------------------ outcomes */
  const showNothing = (question: PublicQuestion, kind: 'nothing' | 'late', inputText?: string, reason?: string) => {
    if (kind === 'late') flute.fall();
    else flute.wrong();
    sky.dip(kind === 'late' ? 1.4 : 1);
    pushRow({ questionId: question.id, prompt: question.prompt, display: null, tier: -1, points: 0, input: inputText });
    setOutcome({ kind, input: inputText, reason, altitude: altitudeFor(scoreRef.current, mode, day) });
    setPhase('result');
    if (mode === 'night') autoNext.current = window.setTimeout(() => next(), 2400);
  };

  /** Climbs the rarity ladder rung by rung while the camera rises; resolves when the climb settles. */
  const climb = (text: string, tier: number, after: number) =>
    new Promise<void>((resolve) => {
      const khon = tier === KHON_LOI;
      const target = khon ? 3 : LADDER.indexOf(tier);
      const k = mode === 'night' ? 0.6 : 1;
      setReveal({ text, tier, step: -1, fell: false });
      setPhase('reveal');
      if (reduce) {
        setReveal({ text, tier, step: khon ? 0 : target, fell: khon });
        sky.setAltitude(after);
        resolve();
        return;
      }
      let t = 420 * k;
      const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
      for (let i = 0; i <= target; i++) {
        at(t, () => {
          setReveal((r) => (r ? { ...r, step: i } : r));
          flute.step(i);
        });
        t += (120 + i * 75) * k;
      }
      if (khon) {
        t += 260 * k;
        at(t, () => {
          setReveal((r) => (r ? { ...r, step: 0, fell: true } : r));
          flute.boing();
          sky.dip(0.9);
        });
        t += 520 * k;
      } else t += 260 * k;
      sky.setAltitude(after, true, t / 1000 + 0.5);
      const done = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        skipReveal.current = null;
        setReveal((r) => (r ? { ...r, step: khon ? 0 : target, fell: khon } : r));
        resolve();
      };
      skipReveal.current = done;
      at(t, done);
    });

  /* ------------------------------------------------ opening questions */
  /** Shows the prompt, counts down, then starts the server clock. */
  const open = useCallback(
    async (question: PublicQuestion, d: string): Promise<'open' | 'answered' | 'expired' | 'error'> => {
      setOutcome(null);
      setReveal(null);
      setSuggest(null);
      setInput('');
      setNotice('');
      setQ(question);
      setPhase('intro');
      // The very first flight on this device opens with three short tips; the clock waits for them.
      if (!prefs.coached) {
        setCoach(true);
        await new Promise<void>((res) => (coachDone.current = res));
        prefs.coached = true;
        setCoach(false);
      }
      for (let s = INTRO_SECONDS; s > 0; s--) {
        setIntro(s);
        await new Promise((r) => setTimeout(r, 800));
      }
      try {
        const t = await api.start({ playerId: pid, day: d, mode, questionId: question.id });
        runSince.current ??= new Date(Date.parse(t.now) - 2000).toISOString();
        if (mode === 'daily') {
          if (t.answered) return 'answered';
          const elapsed = Math.max(0, (Date.parse(t.now) - Date.parse(t.startedAt)) / 1000);
          const remain = Math.min(QUESTION_SECONDS, QUESTION_SECONDS - elapsed);
          leftRef.current = remain;
          setLeft(remain);
          if (remain <= 0) return 'expired';
        }
        setPhase('asking');
        setTimeout(() => inputRef.current?.focus(), 30);
        return 'open';
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Không mở được câu hỏi.');
        setPhase('error');
        return 'error';
      }
    },
    [pid, mode],
  );

  const openDaily = async (questions: PublicQuestion[], from: number, d: string) => {
    for (let i = from; i < questions.length; i++) {
      setIdx(i);
      const r = await open(questions[i], d);
      if (r === 'open' || r === 'error') return;
      if (r === 'answered') {
        if (!rowsRef.current.some((x) => x.questionId === questions[i].id)) pushRow({ questionId: questions[i].id, prompt: questions[i].prompt, display: null, tier: -1, points: 0 });
        continue;
      }
      if (r === 'expired') {
        await api.miss({ playerId: pid, day: d, mode, questionId: questions[i].id }).catch(() => {});
        showNothing(questions[i], 'late');
        return;
      }
    }
    void finish();
  };

  const openNight = async () => {
    try {
      setPhase('loading');
      const { day: d, question } = await api.night(seen.current);
      setDay(d);
      seen.current.push(question.id);
      await open(question, d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không lấy được câu hỏi.');
      setPhase('error');
    }
  };

  // Start the flight.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode === 'night') {
        leftRef.current = NIGHT_START_SECONDS;
        setLeft(NIGHT_START_SECONDS);
        await openNight();
        return;
      }
      try {
        const { day: d, questions } = await api.daily();
        if (cancelled) return;
        setDay(d);
        setList(questions);
        const rec = today();
        const prev = rec && rec.day === d ? rec.rows.filter((r) => questions.some((x) => x.id === r.questionId)) : [];
        rowsRef.current = prev;
        setRows(prev);
        const s = prev.reduce((a, r) => a + r.points, 0);
        scoreRef.current = s;
        setScore(s);
        sky.setAltitude(altitudeFor(s, mode, d), false);
        const done = new Set(prev.map((r) => r.questionId));
        const from = questions.findIndex((x) => !done.has(x.id));
        await openDaily(questions, from < 0 ? questions.length : from, d);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Không tải được chuyến bay hôm nay.');
        setPhase('error');
      }
    })();
    return () => {
      cancelled = true;
      if (autoNext.current) clearTimeout(autoNext.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------ the wind clock */
  useEffect(() => {
    if (phase !== 'asking') {
      sky.setNervous(false);
      return;
    }
    let lastWhole = Math.ceil(leftRef.current);
    const tick = setInterval(() => {
      leftRef.current -= 0.1;
      const v = leftRef.current;
      setLeft(v);
      sky.setNervous(v <= 5);
      const whole = Math.ceil(v);
      if (whole < lastWhole) {
        lastWhole = whole;
        if (v <= 5 && v > 0) flute.knock();
      }
      if (v <= 0) {
        clearInterval(tick);
        void timeUp();
      }
    }, 100);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, q]);

  const timeUp = async () => {
    if (!q) return;
    if (mode === 'night') {
      flute.fall();
      sky.dip(1.6);
      void finish();
      return;
    }
    setPhase('judging');
    track('miss', { q: q.id, mode });
    await api.miss({ playerId: pid, day, mode, questionId: q.id }).catch(() => {});
    showNothing(q, 'late');
  };

  /* ------------------------------------------------ answering */
  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (phase !== 'asking' || !q) return;
    const text = input.trim();
    if (!text) return;
    setPhase('judging');
    setNoticeSoft(false);
    // A wait longer than a blink (a new answer the referee is reading) becomes part of the throw:
    // bé Bi tugs the line and the wind picks up, so the climb that follows feels like one motion.
    const pull = window.setTimeout(() => {
      setPulling(true);
      sky.boost(0.35);
    }, 280);
    let r: AnswerResult;
    for (let tries = 0; ; tries++) {
      try {
        r = await api.answer({ playerId: pid, day, mode, questionId: q.id, input: text });
      } catch (err) {
        clearTimeout(pull);
        setPulling(false);
        setChecking(false);
        setNotice(err instanceof ApiError ? err.message : 'Không gửi được đáp án. Thử lại.');
        setPhase('asking');
        return;
      }
      // The referee is still reading this new answer: the kite keeps tugging and the app asks once more by itself,
      // because "press Thả again" is the app admitting it did not finish its own job.
      if (r.status !== 'checking' || tries >= 1) break;
      setPulling(true);
      setChecking(true);
      await new Promise((res) => setTimeout(res, CHECKING_RETRY_MS));
    }
    clearTimeout(pull);
    setPulling(false);
    setChecking(false);
    if (r.status === 'empty') return setPhase('asking');
    if (r.status === 'vague') {
      setNotice(r.reason ?? 'Chung chung quá. Hãy kể tên một thứ cụ thể hơn.');
      setPhase('asking');
      setTimeout(() => inputRef.current?.select(), 30);
      return;
    }
    if (r.status === 'confirm') {
      setSuggest({ from: text, to: r.suggestion! });
      setInput(r.suggestion!);
      setPhase('asking');
      setTimeout(() => inputRef.current?.focus(), 30);
      return;
    }
    if (r.status === 'checking') {
      // Still being read after the second ask: it waits for the night shift like any new word, and nothing is
      // thrown back at the player — the answer may well be right, so the report link stays within reach.
      setNotice(r.reason ?? 'Bé Bi đang lật sổ tra đáp án này. Cứ thả đáp án khác nhé, làng sẽ báo bạn nếu đúng.');
      setNoticeSoft(true);
      setRejected({ questionId: q.id, input: text, sent: false });
      track('checking', { q: q.id, mode });
      setPhase('asking');
      setTimeout(() => inputRef.current?.select(), 30);
      return;
    }
    if (r.status === 'retry' || r.status === 'nothing') {
      // Not an answer the village knows: no penalty, just another try while the wind lasts.
      setNotice(r.reason ?? 'Làng chưa biết đáp án này. Thử một đáp án khác nhé.');
      setRejected({ questionId: q.id, input: text, sent: false });
      track('retry', { q: q.id, mode });
      setShake((k) => k + 1);
      buzz(60);
      flute.wrong();
      setPhase('asking');
      setTimeout(() => inputRef.current?.select(), 30);
      return;
    }
    if (r.status === 'late') {
      buzz([40, 60, 40]);
      return showNothing(q, 'late', text);
    }

    const tier = r.tier!;
    const before = altitudeFor(scoreRef.current, mode, day);
    const after = altitudeFor(scoreRef.current + r.points!, mode, day);
    const rank = rankOf(tier);
    const m = crossed(before, after);
    if (lapOf(after).lap > lapOf(before).lap) track('lap', { lap: lapOf(after).lap, mode });
    if (mode === 'night') {
      leftRef.current = Math.min(NIGHT_MAX_SECONDS, leftRef.current + TIERS[tier].wind);
      setLeft(leftRef.current);
    }
    pushRow({ questionId: q.id, prompt: q.prompt, display: r.display!, tier, points: r.points! });
    await climb(r.display!, tier, after);
    scoreRef.current += r.points!;
    setScore(scoreRef.current);
    bestTier.current = Math.max(bestTier.current, rank);
    sky.setFlutes(bestTier.current >= 3 ? 3 : bestTier.current >= 2 ? 2 : 1);
    sky.boost(0.8 + rank * 0.12);
    sky.celebrate(rank);
    buzz(rank >= 5 ? [30, 40, 30, 40, 120] : rank >= 3 ? [30, 50, 60] : rank === 1 ? [80, 40, 20] : 25);
    flute.strike(TIERS[tier].flutes, tier === CUNG_TRANG);
    flute.setLevel(musicLevel(after));
    if (rank >= 5 && !reduce) {
      setBurst({ tier, text: r.display!, points: r.points! });
      timers.current.push(window.setTimeout(() => setBurst(null), 2300));
    }
    setOutcome({ kind: 'landed', input: text, display: r.display, tier, points: r.points, bonus: r.bonus, gio: r.gio, calm: gio && wind > 0 && (r.gio ?? 1) <= 1, share: r.share, judged: r.judged, altitude: after, milestone: m, crowd: r.crowd });
    setPhase('result');
    if (mode === 'night') autoNext.current = window.setTimeout(() => next(), 2600);
  };

  const next = () => {
    if (autoNext.current) {
      clearTimeout(autoNext.current);
      autoNext.current = null;
    }
    if (mode === 'night') {
      if (leftRef.current <= 0) return void finish();
      void openNight();
      return;
    }
    void openDaily(list, idx + 1, day);
  };

  const quit = () => {
    if (!quitArmed) {
      setQuitArmed(true);
      setTimeout(() => setQuitArmed(false), 3000);
      return;
    }
    if (mode === 'night' && rowsRef.current.length) return void finish();
    onExit();
  };

  /* ------------------------------------------------ view */
  const count = list.length || 7;
  const lastDaily = mode === 'daily' && idx + 1 >= count;
  const asking = phase === 'intro' || phase === 'asking' || phase === 'judging';
  const sideTier = phase === 'reveal' ? reveal?.tier ?? null : phase === 'result' && outcome?.kind === 'landed' ? outcome.tier! : null;
  const sideStep = phase === 'reveal' ? reveal?.step ?? -1 : phase === 'result' && outcome?.kind === 'landed' ? (outcome.tier === KHON_LOI ? 0 : LADDER.indexOf(outcome.tier!)) : -1;
  const sideFell = (phase === 'reveal' && !!reveal?.fell) || (phase === 'result' && outcome?.tier === KHON_LOI);

  return (
    <main className={`stage play${dark ? ' night' : ''}${gio && wind > 0 ? ` windy w${Math.min(4, Math.ceil(wind / 3))}` : ''}`} onClick={() => phase === 'reveal' && skipReveal.current?.()}>
      {gio && wind > 0 && (
        <div className="wind-streaks" aria-hidden="true">
          {Array.from({ length: Math.min(10, 2 + wind) }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
        </div>
      )}
      {burst && (
        <div className="rare-burst" style={{ '--c': TIER_COLOR[burst.tier] } as CSSProperties} onClick={(e) => { e.stopPropagation(); setBurst(null); }} role="status">
          <div className="rb-rays" aria-hidden="true" />
          <div className="rb-sparks" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
          </div>
          <TierIcon tier={burst.tier} size={120} className="rb-icon" />
          <b className="rb-title">{TIERS[burst.tier].name}!</b>
          <span className="rb-answer">“{burst.text}”</span>
          <span className="rb-pts">+{burst.points} điểm</span>
        </div>
      )}
      <header className="hud" ref={hudRef}>
        <button className="hud-btn" onClick={quit} aria-label={quitArmed ? 'Bấm lần nữa để rời chuyến bay' : 'Rời chuyến bay'}>
          <BackIcon />
        </button>
        <div className="hud-panel">
          <span className="k score-k">
            {gio && (
              <span className={`gio-tag${wind > 0 ? ' on' : ''}`} key={wind} title="Nối gió: trả lời hiếm liên tiếp, gió càng mạnh, điểm càng nhân lên">
                gió ×{fmtGio(gioMultiplier(wind))}
              </span>
            )}
            Điểm
          </span>
          <span className="v gold">{Math.round(shownScore)}</span>
        </div>
        {mode === 'daily' ? (
          /* Seven dots on their own thin line, no chip and no "2/7" beside them: the dots already say which
             question this is and how many are left, and a bare strip costs a tenth of the sky a panel costs. */
          <div className="pips" aria-label={`Câu ${Math.min(idx + 1, count)} trên ${count}`}>
            {Array.from({ length: count }, (_, i) => {
              const r = rows.find((x) => x.questionId === list[i]?.id);
              const tier = r?.tier;
              const bg = tier === undefined ? undefined : tier < 0 ? '#6b7280' : TIER_COLOR[tier];
              return <span key={i} className={`pip${tier === undefined ? ' todo' : ''}${i === idx && !r ? ' now' : ''}`} style={bg ? { background: bg } : undefined} />;
            })}
          </div>
        ) : (
          <div className="hud-panel mid">
            <span className="v small">{rows.length}</span>
            <span className="k">Thả vô tận</span>
          </div>
        )}
        {/* No height panel: the ruler already draws "Bạn <height>" right beside the kite, which is the better
            picture of it. A second copy in the corner only costs sky. A lap is the one thing the ruler cannot
            show, so it shows up here alone and only once there is one. */}
        {lap > 1 && (
          <div className="hud-panel right" title={`Diều đang ở: vòng ${lap}, ${lastMilestone(shownAlt).name}`}>
            <span className="v dim">Vòng {lap}</span>
          </div>
        )}
        <span className="hud-sound">{soundButton}</span>
        {quitArmed && <span className="quit-tag">Bấm lần nữa để rời</span>}
      </header>


      <section className="play-center" aria-live="polite">
        {phase === 'error' && (
          <div className="block">
            <p className="out-line">{error}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="pill-btn" onClick={() => location.reload()}>Thử lại</button>
              <button className="pill-btn ghost" onClick={onExit}>Về bãi cỏ</button>
            </div>
          </div>
        )}

        {asking && q && (
          <div className="block prompt-block" key={q.id}>
            <div className="cue">
              <span className="cue-cat">{q.category}</span>
              {q.level ? <span className="cue-meta">{LEVELS[q.level]}</span> : null}
            </div>
            <h2 className="prompt">{q.prompt}</h2>
            {q.note && <p className="prompt-note">{q.note}</p>}
            {(mode === 'daily' ? idx === 0 : rows.length === 0) && <p className="prompt-sub">Càng ít người nghĩ tới, diều càng bay cao</p>}
          </div>
        )}

        {phase === 'reveal' && reveal && (
          <div className="block reveal-block">
            <p className="reveal-answer">“{reveal.text}”</p>
            <Ladder step={reveal.step} tier={reveal.tier} fell={reveal.fell} pts={pts} />
            <span className="reveal-skip">chạm để xem ngay</span>
          </div>
        )}

        {phase === 'result' && outcome && (
          <div className={`block out-block${outcome.kind === 'landed' ? '' : ' miss'}`} style={{ '--c': outcome.kind === 'landed' ? TIER_COLOR[outcome.tier!] : '#6b7280' } as CSSProperties}>
            <span className={`out-halo${outcome.kind === 'landed' && rankOf(outcome.tier!) >= 3 ? ' on' : ''}`} aria-hidden="true">
              <TierIcon tier={outcome.kind === 'landed' ? outcome.tier! : null} size={76} className="out-icon" />
            </span>
            {outcome.kind === 'landed' ? (
              <>
                <h2 className="out-title">{TIERS[outcome.tier!].name}</h2>
                <p className="out-answer">“{outcome.display}”</p>
                <p className="out-pts">
                  <span className="pts-badge">+{outcome.points} điểm</span>
                  <span>diều lên {formatAlt(outcome.altitude)}</span>
                </p>
                <p className="out-line">{answerQuip(outcome.tier!, seedOf(outcome.display ?? '', outcome.altitude))}</p>
                <div className="chips">
                  {mode === 'night' && <span className="chip">+{TIERS[outcome.tier!].wind} giây gió</span>}
                  {outcome.gio && outcome.gio > 1 ? (
                    <span className="chip gio-chip">{pts(outcome.tier!)} × gió {fmtGio(outcome.gio)}</span>
                  ) : outcome.bonus ? (
                    <span className="chip">gồm +{outcome.bonus} chuỗi hiếm</span>
                  ) : null}
                  {outcome.calm && <span className="chip">gió lặng, về ×1</span>}
                  {outcome.share != null && !outcome.crowd && <span className="chip">{outcome.share.toLocaleString('vi-VN')}% người chơi cũng nghĩ ra</span>}
                  {outcome.judged && <span className="chip">đáp án mới, trọng tài vừa công nhận</span>}
                  {outcome.milestone && <span className="chip mile">Vượt mốc {outcome.milestone.name}</span>}
                </div>
                {outcome.crowd && outcome.crowd.top.length > 0 && <CrowdPanel crowd={outcome.crowd} mine={outcome.display ?? ''} />}
              </>
            ) : (
              <>
                <h2 className="out-title">{outcome.kind === 'late' ? 'Hết gió' : 'Không lên'}</h2>
                <p className="out-answer">{outcome.input ? `“${outcome.input}”` : '—'}</p>
                <p className="out-pts">
                  <span className="pts-badge">+0 điểm</span>
                </p>
                <p className="out-line">{outcome.kind === 'late' ? 'Gió lặng mất rồi, chưa kịp thả câu nào.' : outcome.reason || 'Không có trong sổ của làng. Đã gửi để trưởng làng xem lại.'}</p>
              </>
            )}
          </div>
        )}
      </section>

      {coach && (
        <div className="coach-wrap" role="dialog" aria-modal="true" aria-label="Cách thả diều">
          <section className="coach">
            <span className="coach-k">Chuyến bay đầu tiên</span>
            <h2>Thả diều thế nào?</h2>
            <ol>
              <li><b>Gõ một đáp án đúng</b> cho câu hỏi. Gõ không dấu cũng được.</li>
              <li><b>Càng ít người nghĩ ra, đáp án càng hiếm</b> (từ Thường tới Độc nhất) và <b>diều càng được đẩy cao</b>. Điểm cộng dồn qua 7 câu quyết định diều bay tới tầng trời nào.</li>
              <li>Đáp án chưa có trong sổ của làng? <b>Cứ thử đáp án khác</b>, không bị trừ gì. Chỉ hết gió mới mất lượt. Điểm hiện ra là điểm chốt luôn.</li>
            </ol>
            <div className="coach-tiers" aria-hidden="true">
              {LADDER.map((t) => (
                <span key={t}>
                  <TierIcon tier={t} size={30} />
                  <small>{pts(t)}</small>
                </span>
              ))}
            </div>
            <button className="next-btn" onClick={() => coachDone.current?.()} autoFocus>
              Hiểu rồi, thả diều!
            </button>
          </section>
        </div>
      )}

      <div className="play-dock">
        {(phase === 'intro' || phase === 'loading') && (
          <div className="intro-pill" aria-live="polite">
            {phase === 'loading' ? 'Đang đón gió…' : <>Đọc câu hỏi đi, ô gõ đáp án mở sau <b>{intro}</b></>}
          </div>
        )}
        {(phase === 'asking' || phase === 'judging') && (
          <>
            {phase === 'judging' && pulling && (
              <div className="toast-pill pull" role="status">
                {checking ? 'Bé Bi đang lật sổ tra' : 'Bé Bi đang kéo dây'}
                <span className="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
              </div>
            )}
            {suggest && (
              <div className="toast-pill" role="status">
                “{suggest.from}” → <b>“{suggest.to}”</b>
                <span>ý bạn là vậy? Bấm Thả lần nữa để chốt, hoặc sửa lại</span>
              </div>
            )}
            {notice && (
              <div className={`toast-pill${noticeSoft ? '' : ' bad'}`} role="status">
                {notice}
                {rejected && (
                  <button
                    type="button"
                    className="toast-link"
                    disabled={rejected.sent}
                    onClick={() => {
                      setRejected({ ...rejected, sent: true });
                      track('report', { kind: 'rejected', q: rejected.questionId });
                      api.report({ questionId: rejected.questionId, input: rejected.input, kind: 'rejected' }).catch(() => {});
                    }}
                  >
                    {rejected.sent ? 'Đã gửi trưởng làng xem, cảm ơn bạn!' : `“${rejected.input}” là đáp án đúng? Báo trưởng làng`}
                  </button>
                )}
              </div>
            )}
            <form className={`answer-bar${shake ? ' shake' : ''}`} key={shake} onSubmit={submit}>
              <WindDial left={left} total={mode === 'night' ? total : QUESTION_SECONDS} shared={mode === 'night'} />
              <label htmlFor="answer" className="sr">Đáp án của bạn</label>
              <input
                id="answer"
                ref={inputRef}
                className="answer-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (suggest && e.target.value !== suggest.to) setSuggest(null);
                  if (notice) setNotice('');
                  if (rejected) setRejected(null);
                }}
                placeholder={window.innerWidth < 480 ? 'Gõ đáp án…' : 'Gõ đáp án, không dấu cũng được…'}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={60}
                disabled={phase === 'judging'}
                enterKeyHint="send"
              />
              <button className="send-btn" type="submit" disabled={phase === 'judging' || !input.trim()}>
                {phase === 'judging' ? '…' : 'Thả'}
              </button>
            </form>
          </>
        )}
        {phase === 'result' && (
          <button className="next-btn" onClick={next} autoFocus>
            {lastDaily ? 'Xem diều bay tới đâu' : 'Bay tiếp'} <KiteIcon />
          </button>
        )}
      </div>
    </main>
  );
}
