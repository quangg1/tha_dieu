import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  NIGHT_MAX_SECONDS,
  NIGHT_START_SECONDS,
  QUESTION_SECONDS,
  TIERS,
  altitudeFor,
  crossed,
  formatAlt,
  nextMilestone,
  type Milestone,
} from '../../shared/scoring.js';
import { api, ApiError, type AnswerResult, type Crowd, type FinishResult, type PublicQuestion } from '../api';
import { flute } from '../audio/flute';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { playerId, prefs, recordFlight, saveToday, today, vnDay, type LocalRow } from '../store';
import { BackIcon, CrowdBars, MilestoneBanner, Seal, Wind } from '../ui';

export interface Summary {
  mode: 'daily' | 'night';
  rows: LocalRow[];
  result: FinishResult;
}

type Phase = 'loading' | 'asking' | 'judging' | 'reveal' | 'error';

interface Reveal {
  tier: number;
  display: string | null;
  points: number;
  bonus: number;
  crowd: Crowd | null;
  krill?: string;
  deep: string[];
  judged?: boolean;
}

export function musicLevel(alt: number) {
  const L = Math.log10(Math.max(1, alt));
  return L < 3 ? 1 : L < 5 ? 2 : L < 8.5 ? 3 : 4;
}

export default function Game({ sky, mode, soundButton, onExit, onDone }: { sky: SkyScene; mode: 'daily' | 'night'; soundButton: ReactNode; onExit: () => void; onDone: (s: Summary) => void }) {
  const pid = useRef(playerId()).current;
  const [day, setDay] = useState(vnDay());
  const [list, setList] = useState<PublicQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState<PublicQuestion | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');
  const [left, setLeft] = useState(mode === 'night' ? NIGHT_START_SECONDS : QUESTION_SECONDS);
  const leftRef = useRef(left);
  const [windTotal, setWindTotal] = useState(left);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<{ text: string; kind: '' | 'bad' | 'hint' }>({ text: '', kind: '' });
  const [shake, setShake] = useState(0);
  const [rows, setRows] = useState<LocalRow[]>([]);
  const rowsRef = useRef<LocalRow[]>([]);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [tools, setTools] = useState({ wind: 1, ba: 1 });
  const [banner, setBanner] = useState<{ m: Milestone; key: number } | null>(null);
  const [quitArmed, setQuitArmed] = useState(false);
  const seen = useRef<string[]>([]);
  const bestTier = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoNext = useRef<number | null>(null);
  const finishing = useRef(false);

  const altitude = altitudeFor(score);
  const dark = Math.log10(Math.max(1, altitude)) >= 4.3;

  useEffect(() => {
    sky.setLayout(LAYOUTS.play);
    sky.setAltitude(0, false);
    sky.setFlutes(1);
    flute.setLevel(1);
    return () => sky.setNervous(false);
  }, [sky]);

  const pushRow = (r: LocalRow) => {
    rowsRef.current = [...rowsRef.current, r];
    setRows(rowsRef.current);
    if (mode === 'daily') saveToday({ day, rows: rowsRef.current });
  };

  /* ------------------------------------------------ finishing */
  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    setPhase('loading');
    try {
      const result = await api.finish({ playerId: pid, day, mode, name: prefs.name || undefined });
      recordFlight(day, mode, result.altitude);
      if (mode === 'daily') saveToday({ day, rows: rowsRef.current, result });
      onDone({ mode, rows: rowsRef.current, result });
    } catch (e) {
      finishing.current = false;
      setError(e instanceof Error ? e.message : 'Không lưu được chuyến bay.');
      setPhase('error');
    }
  }, [pid, day, mode, onDone]);

  /* ------------------------------------------------ opening questions */
  const open = useCallback(
    async (question: PublicQuestion, d: string) => {
      setPhase('loading');
      setReveal(null);
      setInput('');
      setMsg({ text: '', kind: '' });
      try {
        const t = await api.start({ playerId: pid, day: d, mode, questionId: question.id });
        setQ(question);
        if (mode === 'daily') {
          if (t.answered) return 'answered' as const;
          const elapsed = (Date.parse(t.now) - Date.parse(t.startedAt)) / 1000;
          const remain = Math.min(QUESTION_SECONDS, QUESTION_SECONDS - elapsed);
          leftRef.current = remain;
          setLeft(remain);
          setWindTotal(QUESTION_SECONDS);
          if (remain <= 0) return 'expired' as const;
        }
        setPhase('asking');
        setTimeout(() => inputRef.current?.focus(), 50);
        return 'open' as const;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Không mở được câu hỏi.');
        setPhase('error');
        return 'error' as const;
      }
    },
    [pid, mode],
  );

  const openDaily = useCallback(
    async (questions: PublicQuestion[], from: number, d: string) => {
      for (let i = from; i < questions.length; i++) {
        setIdx(i);
        const r = await open(questions[i], d);
        if (r === 'open') return;
        if (r === 'error') return;
        if (r === 'answered') {
          if (!rowsRef.current.some((x) => x.questionId === questions[i].id)) pushRow({ questionId: questions[i].id, prompt: questions[i].prompt, display: null, tier: -1, points: 0 });
          continue;
        }
        if (r === 'expired') {
          await doMiss(questions[i], d);
          return;
        }
      }
      void finish();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, finish],
  );

  const openNight = useCallback(async () => {
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
  }, [open]);

  // Start the flight.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode === 'night') {
        leftRef.current = NIGHT_START_SECONDS;
        setLeft(NIGHT_START_SECONDS);
        setWindTotal(NIGHT_START_SECONDS);
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
        sky.setAltitude(altitudeFor(s), false);
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

  const doMiss = async (question: PublicQuestion, d: string) => {
    flute.fall();
    sky.dip(1.4);
    setPhase('loading');
    let krill: string | undefined;
    let crowd: Crowd | null = null;
    try {
      const r = await api.miss({ playerId: pid, day: d, mode, questionId: question.id });
      krill = r.krill;
      crowd = r.crowd;
    } catch {
      /* the server marks late answers anyway */
    }
    pushRow({ questionId: question.id, prompt: question.prompt, display: null, tier: -1, points: 0 });
    setReveal({ tier: -1, display: null, points: 0, bonus: 0, crowd, krill, deep: [] });
    setPhase('reveal');
  };

  const timeUp = async () => {
    if (!q) return;
    if (mode === 'night') {
      flute.fall();
      sky.dip(1.6);
      void finish();
      return;
    }
    await doMiss(q, day);
  };

  /* ------------------------------------------------ answering */
  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (phase !== 'asking' || !q) return;
    const text = input.trim();
    if (!text) return;
    setPhase('judging');
    let r: AnswerResult;
    try {
      r = await api.answer({ playerId: pid, day, mode, questionId: q.id, input: text });
    } catch (err) {
      setMsg({ text: err instanceof ApiError ? err.message : 'Không gửi được đáp án.', kind: 'bad' });
      setPhase('asking');
      return;
    }
    if (r.late) {
      await doMiss(q, day);
      return;
    }
    if (!r.ok) {
      leftRef.current -= 2;
      setLeft(leftRef.current);
      setMsg({ text: `“${text}”: ${r.reason ?? 'không có trong sổ của làng.'} Mất 2 giây gió.`, kind: 'bad' });
      setShake((s) => s + 1);
      flute.wrong();
      sky.dip(0.6);
      setPhase('asking');
      setTimeout(() => inputRef.current?.select(), 30);
      return;
    }
    const tier = r.tier!;
    const before = altitudeFor(scoreRef.current);
    scoreRef.current += r.points!;
    setScore(scoreRef.current);
    const after = altitudeFor(scoreRef.current);
    bestTier.current = Math.max(bestTier.current, tier);
    sky.setFlutes(bestTier.current >= 2 ? 3 : bestTier.current + 1);
    sky.setAltitude(after);
    sky.boost(0.8 + tier * 0.15);
    flute.strike(TIERS[tier].flutes, tier === 5);
    flute.setLevel(musicLevel(after));
    const m = crossed(before, after);
    if (m) setBanner({ m, key: Date.now() });
    if (mode === 'night') {
      leftRef.current = Math.min(NIGHT_MAX_SECONDS, leftRef.current + TIERS[tier].wind);
      setLeft(leftRef.current);
      setWindTotal(NIGHT_MAX_SECONDS);
    }
    pushRow({ questionId: q.id, prompt: q.prompt, display: r.display!, tier, points: r.points! });
    setReveal({ tier, display: r.display!, points: r.points!, bonus: r.bonus ?? 0, crowd: r.crowd ?? null, krill: r.krill, deep: r.deep ?? [], judged: r.judged });
    setPhase('reveal');
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

  const skipNight = () => {
    if (phase !== 'asking') return;
    leftRef.current -= 5;
    setLeft(leftRef.current);
    if (leftRef.current <= 0) return void finish();
    void openNight();
  };

  const callWind = () => {
    if (!tools.wind || phase !== 'asking') return;
    setTools((t) => ({ ...t, wind: 0 }));
    leftRef.current += 10;
    setLeft(leftRef.current);
    setWindTotal((t) => Math.max(t, leftRef.current));
    sky.boost(0.4);
    flute.strike(2);
    setMsg({ text: 'Gió nồm thổi thêm 10 giây.', kind: 'hint' });
    inputRef.current?.focus();
  };

  const askGrandma = async () => {
    if (!tools.ba || phase !== 'asking' || !q) return;
    setTools((t) => ({ ...t, ba: 0 }));
    try {
      const { pattern } = await api.hint(q.id);
      setMsg({ text: pattern ? `Bà nhắc khẽ: ${pattern}` : 'Bà cũng chịu câu này.', kind: 'hint' });
    } catch {
      setMsg({ text: 'Bà đang bận, chưa trả lời được.', kind: 'hint' });
    }
    inputRef.current?.focus();
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
  const total = list.length || 7;
  const next1 = nextMilestone(altitude);

  return (
    <main className={`stage${dark ? ' night' : ''}`}>
      <div className="topbar">
        <button className="icon-btn" onClick={quit} aria-label={quitArmed ? 'Bấm lần nữa để rời chuyến bay' : 'Rời chuyến bay'}>
          <BackIcon />
        </button>
        {quitArmed && <span className="knot-tag">Bấm lần nữa để rời</span>}
        {soundButton}
      </div>

      <div className="hud" style={{ marginTop: 8 }}>
        <div>
          <span className="gd-label" style={{ color: dark ? 'var(--troi-1)' : 'var(--cham-deep)' }}>Độ cao</span>
          <div className={`gd-print hud-alt${dark ? ' gd-print--night' : ''}`}>{formatAlt(altitude)}</div>
          {next1 && <div className="hud-sub">tiếp theo: {next1.name}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="gd-label" style={{ color: dark ? 'var(--troi-1)' : 'var(--cham-deep)' }}>
            {mode === 'daily' ? `Câu ${Math.min(idx + 1, total)}/${total}` : `${rows.length} câu`}
          </span>
          {mode === 'daily' && (
            <div className="pips" aria-hidden="true">
              {Array.from({ length: total }, (_, i) => {
                const r = rows.find((x) => x.questionId === list[i]?.id);
                const tier = r?.tier;
                const bg = tier === undefined ? undefined : tier < 0 ? 'transparent' : `var(--tier-${TIERS[tier].css})`;
                return <span key={i} className={`pip${tier === undefined ? ' todo' : ''}${i === idx && !r ? ' now' : ''}`} style={bg ? { background: bg } : undefined} />;
              })}
            </div>
          )}
        </div>
      </div>

      {banner && <MilestoneBanner key={banner.key} m={banner.m} alt={formatAlt(banner.m.alt)} dark={Math.log10(Math.max(1, banner.m.alt)) >= 4.3} />}

      <div className="dock">
        {phase === 'error' && (
          <section className="gd-paper gd-slip">
            <p className="gd-msg gd-msg--bad" style={{ margin: 0 }}>{error}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="gd-btn" onClick={() => location.reload()}>Thử lại</button>
              <button className="gd-btn gd-btn--paper" onClick={onExit}>Về bãi cỏ</button>
            </div>
          </section>
        )}

        {phase === 'loading' && (
          <section className="gd-paper gd-slip" aria-busy="true">
            <div className="judging"><span className="dot-pulse" />Đang đón gió…</div>
          </section>
        )}

        {(phase === 'asking' || phase === 'judging') && q && (
          <section key={`${q.id}-${shake}`} className={`gd-paper gd-slip slip${shake ? ' shake' : ''}`}>
            <span className="gd-slip__cat">{q.category}</span>
            <Wind left={left} total={windTotal} />
            <h2 className="gd-slip__q">{q.prompt}</h2>
            {q.note && <div className="gd-slip__note">{q.note}</div>}
            <form className="gd-answer" onSubmit={submit}>
              <label htmlFor="answer" className="sr">Đáp án của bạn</label>
              <input
                id="answer"
                ref={inputRef}
                className="gd-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Gõ đáp án hiếm nhất…"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={60}
                disabled={phase === 'judging'}
                enterKeyHint="send"
              />
              <button className="gd-btn" type="submit" disabled={phase === 'judging' || !input.trim()} style={{ padding: '0 18px' }}>
                Thả
              </button>
            </form>
            {phase === 'judging' ? (
              <div className="judging" role="status"><span className="dot-pulse" />Đang tra sổ của làng…</div>
            ) : (
              <p className={`gd-msg${msg.kind ? ` gd-msg--${msg.kind}` : ''}`} style={{ margin: 0 }} role="status">{msg.text}</p>
            )}
            <div className="tools">
              <button className="gd-chip" onClick={callWind} disabled={!tools.wind || phase !== 'asking'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h16a3 3 0 1 1-3 3" /><path d="M3 16h7" /></svg>
                Gọi gió <span className="gd-chip__count">{tools.wind}</span>
              </button>
              <button className="gd-chip" onClick={askGrandma} disabled={!tools.ba || phase !== 'asking'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" /><path d="M12 17h.01" /></svg>
                Hỏi bà <span className="gd-chip__count">{tools.ba}</span>
              </button>
              {mode === 'night' && (
                <button className="gd-chip" onClick={skipNight} disabled={phase !== 'asking'}>Bỏ qua · −5 giây</button>
              )}
            </div>
          </section>
        )}

        {phase === 'reveal' && reveal && q && (
          <section className="gd-paper reveal" aria-live="polite">
            {reveal.tier >= 0 ? (
              <Seal tier={reveal.tier} strike className="reveal-seal" extra={reveal.bonus ? `+${reveal.points - reveal.bonus} · +${reveal.bonus} chuỗi` : `+${reveal.points}`} />
            ) : (
              <span className="gd-seal reveal-seal" style={{ color: 'var(--than-70)' }}>Hết gió</span>
            )}
            <div className="reveal-head">
              <span className="gd-label">{reveal.tier >= 0 ? `Đáp án của bạn · ${TIERS[reveal.tier].meaning}` : q.prompt}</span>
              <span className="reveal-answer">{reveal.display ?? 'Diều chao xuống'}</span>
              {reveal.judged && <span className="deep">Trọng tài Claude đã công nhận đáp án mới này.</span>}
            </div>
            {reveal.crowd && reveal.crowd.total > 0 && <CrowdBars crowd={reveal.crowd} mine={reveal.display} />}
            {reveal.krill && (
              <div className="moon-row">
                <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="12" fill="#f3dc8a" stroke="#1f1b16" strokeWidth="2" /><path d="M14 22 L14 15" stroke="#1f1b16" strokeWidth="2" /><path d="M8 16 C 8 10, 20 10, 20 16 Z" fill="#3f6b2c" stroke="#1f1b16" strokeWidth="1.5" /></svg>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="k">{reveal.tier === 5 ? 'Bạn đã tìm ra đáp án Cung Trăng' : 'Đáp án Cung Trăng của câu này'}</span>
                  <b>{reveal.krill}</b>
                </div>
              </div>
            )}
            {reveal.deep.length > 0 && <div className="deep">Vài đáp án hiếm khác: {reveal.deep.join(', ')}</div>}
            <button className="gd-btn" onClick={next} autoFocus>
              {mode === 'daily' && idx + 1 >= total ? 'Xem diều bay tới đâu' : 'Bay tiếp'}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
