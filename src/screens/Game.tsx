import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  NIGHT_MAX_SECONDS,
  NIGHT_START_SECONDS,
  QUESTION_SECONDS,
  TIERS,
  altitudeFor,
  crossed,
  formatAlt,
  type Milestone,
} from '../../shared/scoring.js';
import { api, ApiError, type AnswerResult, type FinishResult, type PublicQuestion } from '../api';
import { flute } from '../audio/flute';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { playerId, prefs, recordFlight, saveToday, today, vnDay, type LocalRow } from '../store';
import { BackIcon, MilestoneBanner, Seal } from '../ui';

export interface Summary {
  mode: 'daily' | 'night';
  rows: LocalRow[];
  result: FinishResult;
}

type Phase = 'loading' | 'intro' | 'asking' | 'judging' | 'result' | 'error';

interface Outcome {
  kind: 'landed' | 'nothing' | 'late';
  input?: string;
  display?: string;
  tier?: number;
  points?: number;
  bonus?: number;
  share?: number | null;
  judged?: boolean;
  reason?: string;
  altitude: number;
}

const INTRO_SECONDS = 3;

export function musicLevel(alt: number) {
  const L = Math.log10(Math.max(1, alt));
  return L < 3 ? 1 : L < 5 ? 2 : L < 8.5 ? 3 : 4;
}

function WindDial({ left, total }: { left: number; total: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, left / total));
  const low = left <= 5;
  return (
    <div className={`dial${low ? ' low' : ''}`} role="timer" aria-label={`Còn ${Math.max(0, Math.ceil(left))} giây gió`}>
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--diep-300)" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={low ? 'var(--son)' : 'var(--cham)'} strokeWidth="5" strokeDasharray={`${c * p} ${c}`} strokeLinecap="round" transform="rotate(-90 28 28)" />
      </svg>
      <span>{Math.max(0, Math.ceil(left))}</span>
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
  const [banner, setBanner] = useState<{ m: Milestone; key: number } | null>(null);
  const [quitArmed, setQuitArmed] = useState(false);
  const [notice, setNotice] = useState('');
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

  /* ------------------------------------------------ outcomes */
  const showNothing = (question: PublicQuestion, kind: 'nothing' | 'late', inputText?: string, reason?: string) => {
    if (kind === 'late') flute.fall();
    else flute.wrong();
    sky.dip(kind === 'late' ? 1.4 : 1);
    pushRow({ questionId: question.id, prompt: question.prompt, display: null, tier: -1, points: 0, input: inputText });
    setOutcome({ kind, input: inputText, reason, altitude: altitudeFor(scoreRef.current) });
    setPhase('result');
    if (mode === 'night') autoNext.current = window.setTimeout(() => next(), 2400);
  };

  /* ------------------------------------------------ opening questions */
  /** Shows the prompt, counts down, then starts the server clock. */
  const open = useCallback(
    async (question: PublicQuestion, d: string): Promise<'open' | 'answered' | 'expired' | 'error'> => {
      setOutcome(null);
      setSuggest(null);
      setInput('');
      setNotice('');
      setQ(question);
      setPhase('intro');
      for (let s = INTRO_SECONDS; s > 0; s--) {
        setIntro(s);
        await new Promise((r) => setTimeout(r, 800));
      }
      try {
        const t = await api.start({ playerId: pid, day: d, mode, questionId: question.id });
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

  const timeUp = async () => {
    if (!q) return;
    if (mode === 'night') {
      flute.fall();
      sky.dip(1.6);
      void finish();
      return;
    }
    setPhase('judging');
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
    let r: AnswerResult;
    try {
      r = await api.answer({ playerId: pid, day, mode, questionId: q.id, input: text });
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : 'Không gửi được đáp án. Thử lại.');
      setPhase('asking');
      return;
    }
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
    if (r.status === 'late') return showNothing(q, 'late', text);
    if (r.status === 'nothing') return showNothing(q, 'nothing', text, r.reason);

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
    }
    pushRow({ questionId: q.id, prompt: q.prompt, display: r.display!, tier, points: r.points! });
    setOutcome({ kind: 'landed', input: text, display: r.display, tier, points: r.points, bonus: r.bonus, share: r.share, judged: r.judged, altitude: after });
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

  return (
    <main className={`stage play${dark ? ' night' : ''}`}>
      <header className="playbar">
        <div className="playbar-in">
          <button className="icon-btn" onClick={quit} aria-label={quitArmed ? 'Bấm lần nữa để rời chuyến bay' : 'Rời chuyến bay'}>
            <BackIcon />
          </button>
          <div className="stat">
            <span className="k">Độ cao</span>
            <span className="v">{formatAlt(altitude)}</span>
          </div>
          <div className="hud-mid">
            {mode === 'daily' ? (
              <div className="pips" aria-label={`Câu ${Math.min(idx + 1, count)} trên ${count}`}>
                {Array.from({ length: count }, (_, i) => {
                  const r = rows.find((x) => x.questionId === list[i]?.id);
                  const tier = r?.tier;
                  const bg = tier === undefined ? undefined : tier < 0 ? 'var(--than-70)' : `var(--tier-${TIERS[tier].css})`;
                  return <span key={i} className={`pip${tier === undefined ? ' todo' : ''}${i === idx && !r ? ' now' : ''}`} style={bg ? { background: bg } : undefined} />;
                })}
              </div>
            ) : (
              <div className="pips-text">Thả đêm · {rows.length} câu</div>
            )}
            {mode === 'daily' && <span className="hud-step">Câu {Math.min(idx + 1, count)}/{count}</span>}
          </div>
          <div className="stat right">
            <span className="k">Điểm</span>
            <span className="v son">{score}</span>
          </div>
          {soundButton}
        </div>
        {quitArmed && <span className="knot-tag quit-tag">Bấm lần nữa để rời</span>}
      </header>

      {banner && <MilestoneBanner key={banner.key} m={banner.m} alt={formatAlt(banner.m.alt)} dark={Math.log10(Math.max(1, banner.m.alt)) >= 4.3} />}

      <div className="play-mid">
        {phase === 'error' && (
          <section className="gd-paper gd-slip prompt-card">
            <p className="gd-msg gd-msg--bad" style={{ margin: 0 }}>{error}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="gd-btn" onClick={() => location.reload()}>Thử lại</button>
              <button className="gd-btn gd-btn--paper" onClick={onExit}>Về bãi cỏ</button>
            </div>
          </section>
        )}

        {(phase === 'intro' || phase === 'asking' || phase === 'judging') && q && (
          <section className="gd-paper gd-slip prompt-card" key={q.id}>
            <span className="gd-slip__cat">{q.category}</span>
            <span className="gd-label">
              {mode === 'daily' ? `Câu ${idx + 1} trên ${count}` : 'Thả đêm'}
              {q.level ? ` · ${['', 'gió nhẹ', 'gió vừa', 'gió mạnh'][q.level]}` : ''}
            </span>
            <h2 className="gd-slip__q">{q.prompt}</h2>
            {q.note && <div className="gd-slip__note">{q.note}</div>}
            <div className="prompt-sub">
              {q.pool ? <>sổ làng có <b>{q.pool.toLocaleString('vi-VN')}</b> đáp án · </> : null}
              đáp án càng hiếm, diều càng cao
            </div>
          </section>
        )}

        {phase === 'result' && outcome && q && (
          <section className="outcome" aria-live="polite">
            {outcome.kind === 'landed' ? (
              <>
                <Seal tier={outcome.tier!} strike className="outcome-seal" extra={`+${outcome.points}`} />
                <h2 className={`gd-print outcome-title${dark ? ' gd-print--night' : ''}`}>{TIERS[outcome.tier!].name}</h2>
                <p className="outcome-answer">“{outcome.display}”</p>
                <p className="outcome-pts">
                  +{outcome.points} điểm{outcome.bonus ? ` (gồm +${outcome.bonus} chuỗi hiếm)` : ''} · diều lên {formatAlt(outcome.altitude)}
                </p>
                <p className="outcome-line">{TIERS[outcome.tier!].line}</p>
                {outcome.share != null && <p className="outcome-share">{outcome.share.toLocaleString('vi-VN')}% người chơi hôm nay cũng nghĩ ra câu này.</p>}
                {outcome.judged && <p className="outcome-share">Đáp án mới, vừa được trọng tài công nhận.</p>}
              </>
            ) : (
              <>
                <span className="gd-seal outcome-seal" style={{ color: 'var(--than-70)' }}>{outcome.kind === 'late' ? 'Hết gió' : 'Không lên'}</span>
                <h2 className={`gd-print outcome-title${dark ? ' gd-print--night' : ''}`}>Diều không lên</h2>
                {outcome.input ? <p className="outcome-answer">“{outcome.input}”</p> : <p className="outcome-answer">—</p>}
                <p className="outcome-pts">+0 điểm</p>
                <p className="outcome-line">
                  {outcome.kind === 'late' ? 'Gió lặng mất rồi, chưa kịp thả câu nào.' : outcome.reason || 'Không có trong sổ của làng. Đã gửi để trưởng làng xem lại.'}
                </p>
              </>
            )}
          </section>
        )}
      </div>

      <div className="play-dock">
        {(phase === 'intro' || phase === 'loading') && (
          <div className="intro-pill" aria-live="polite">
            {phase === 'loading' ? 'Đang đón gió…' : <>gió đang lên · đồng hồ chạy sau <b>{intro}</b></>}
          </div>
        )}
        {(phase === 'asking' || phase === 'judging') && (
          <>
            {suggest && (
              <div className="suggest" role="status">
                “{suggest.from}” → <b>“{suggest.to}”</b>
                <span>bấm Thả lần nữa để chốt, hoặc sửa lại</span>
              </div>
            )}
            {notice && <div className="suggest bad" role="status">{notice}</div>}
            <form className="answer-bar" onSubmit={submit}>
              <WindDial left={left} total={mode === 'night' ? total : QUESTION_SECONDS} />
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
                }}
                placeholder="gõ một đáp án…"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={60}
                disabled={phase === 'judging'}
                enterKeyHint="send"
              />
              <button className="gd-btn" type="submit" disabled={phase === 'judging' || !input.trim()}>
                {phase === 'judging' ? '…' : 'Thả'}
              </button>
            </form>
          </>
        )}
        {phase === 'result' && (
          <button className="gd-btn next-btn" onClick={next} autoFocus>
            {lastDaily ? 'Xem diều bay tới đâu' : 'Bay tiếp ▲'}
          </button>
        )}
      </div>
    </main>
  );
}
