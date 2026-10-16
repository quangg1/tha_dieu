import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { DAY_BANDS, TIERS, bandFor, formatAlt, lastMilestone, nextMilestone } from '../../shared/scoring.js';
import { api, type BoardRow, type FinishResult } from '../api';
import { flute } from '../audio/flute';
import { TIER_COLOR, TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { challengeLink, renderCard, shareCard } from '../shareCard';
import { bragLine, momentLine, seedOf, tauntLine } from '../quips';
import { skinById } from '../skins';
import { addToAlbum, krillFound, playerId, playerSince, prefs, saveToday, stats, today, vnDay } from '../store';
import { musicLevel, type Summary } from './Game';
import { track } from '../track';
import { DayBands, DayCurve, MyRecord, RarityStrings } from '../components/PlayerStats';
import { FeedbackSheet } from '../components/FeedbackSheet';

export default function Result({ sky, summary, soundButton, onHome, onNight }: { sky: SkyScene; summary: Summary; soundButton: ReactNode; onHome: () => void; onNight: () => void }) {
  const { mode, rows } = summary;
  const pid = playerId();
  const [result, setResult] = useState<FinishResult>(summary.result);
  const [shown, setShown] = useState(0);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState(false);
  const [name, setName] = useState(prefs.name);
  const [saved, setSaved] = useState(!!prefs.name);
  const [board, setBoard] = useState<{ players: number; settled?: boolean; rows: BoardRow[] } | null>(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const reached = lastMilestone(result.altitude);
  const upcoming = nextMilestone(result.altitude);
  const day = vnDay();

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(''), 2400);
  };

  useEffect(() => {
    sky.setLayout(LAYOUTS.result);
    sky.setAltitude(result.altitude);
    sky.setNervous(false);
    flute.setLevel(musicLevel(result.altitude));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return setShown(result.altitude);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1800);
      setShown(Math.pow(10, Math.log10(Math.max(1, result.altitude)) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sky, result.altitude]);

  // Scores settle as the village plays: refresh today's figures when the page opens.
  useEffect(() => {
    if (mode !== 'daily') return;
    const rec = today();
    if (!rec || rec.day !== day) return;
    api
      .finish({ playerId: pid, day, mode, since: playerSince() })
      .then((r) => {
        setResult(r);
        saveToday({ day, rows: rec.rows, result: r });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === 'daily' && result.reveal) addToAlbum(day, result.reveal.map((r) => ({ questionId: r.questionId, prompt: r.prompt, krill: r.krill, found: r.tier === 5 })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.reveal]);

  const loadBoard = () => api.board(mode, pid).then(setBoard).catch(() => setBoard(null));
  useEffect(() => {
    void loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d = new Date(Date.now() + 7 * 3600_000);
  const dayLabel = `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
  const verdict = bandFor(result.score).verdict;
  const [title, ...rest] = verdict.split('. ');
  const subtitle = rest.join('. ');
  const krills = result.reveal?.filter((r) => r.tier === 5).length ?? 0;
  const band = DAY_BANDS.indexOf(bandFor(result.score));
  const seed = seedOf(day, mode, result.score);
  const brag = bragLine(band, { krills, beaten: result.beaten, players: result.players, seed });
  // The flight's rarest answer, if it is rare enough to be worth a screenshot.
  const moment = rows
    .map((r, i) => ({ r, i, rank: r.tier >= 0 ? TIERS[r.tier].rank : -1 }))
    .filter((x) => x.rank >= TIERS[3].rank && x.r.display)
    .sort((a, b) => b.rank - a.rank)[0];
  const link = useMemo(
    () => challengeLink(location.origin, { n: prefs.name || 'Một người bạn', a: result.altitude, d: day, t: title }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result.altitude, saved],
  );
  const text = useMemo(() => {
    const grid = result.grid.split('').map((c) => (c === 'x' ? '⬛' : TIERS[Number(c)]?.emoji ?? '⬛')).join('');
    const head = mode === 'daily' ? `🪁 Bilion · Thả Diều ${dayLabel}` : '🪁 Bilion · Thả vô tận';
    const height = `Diều bay ${formatAlt(result.altitude)}${result.players > 1 ? ` · cao hơn ${result.beaten}% người chơi` : ''}`;
    return [head, verdict, `“${brag}”`, height, grid].join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const shareImage = async () => {
    setBusy(true);
    try {
      const blob = await renderCard({
        dayLabel: mode === 'daily' ? dayLabel : 'Thả vô tận',
        title: `${title}.`,
        subtitle,
        quote: brag,
        altitude: result.altitude,
        milestone: reached.alt ? reached.name : '',
        beaten: result.players > 1 ? result.beaten : null,
        grid: result.grid,
        link,
        kite: skinById(prefs.skin),
        scene: sky.snapshot(1080, 1350, result.altitude, { kiteX: 0.72, kiteY: 0.24, decade: 0.3, kiteSize: 0.26, kiteMax: 300, ruler: false, ground: -1.36 }),
      });
      if (!blob) throw new Error();
      const how = await shareCard(blob, text, link);
      track('share', { how, mode, alt: result.altitude });
      if (how === 'downloaded') flash('Đã lưu ảnh. Đăng lên Facebook hay gửi Zalo nhé!');
    } catch {
      flash('Chưa tạo được ảnh. Thử “Chép kết quả” bên dưới.');
    }
    setBusy(false);
  };

  const shareLink = async () => {
    const msg = `🪁 ${tauntLine(band, result.altitude, seed)}`;
    try {
      track('challenge', { mode });
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text: msg, url: link });
        return;
      }
      await navigator.clipboard.writeText(`${msg}\n${link}`);
      flash('Đã chép link thách đấu');
    } catch {
      /* cancelled */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${link}`);
      flash('Đã sao chép kết quả');
    } catch {
      flash('Chưa sao chép được. Hãy chọn đoạn chữ và sao chép.');
    }
  };

  const saveName = async () => {
    const n = name.trim().slice(0, 24);
    if (!n) return;
    prefs.name = n;
    try {
      await api.finish({ playerId: pid, day, mode, name: n, since: playerSince() });
      setSaved(true);
      void loadBoard();
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Chưa lưu được tên.');
    }
  };

  const meInBoard = board?.rows.some((r) => r.me);

  return (
    <main className="stage result">
      <div className="home-top">
        <span />
        <span className="hud-sound">{soundButton}</span>
      </div>
      <div className="result-hero">
        <span className="result-kicker">{mode === 'daily' ? `Chuyến bay ${dayLabel}` : 'Thả vô tận'}</span>
        <span className="result-title">{title}.</span>
        <span className="result-sub">{subtitle}</span>
        <span className="result-brag">“{brag}”</span>
        <div className="result-stats">
          <div>
            <b>{formatAlt(shown)}</b>
            <span>{reached.alt ? `qua ${reached.name}` : 'độ cao'}</span>
          </div>
          <div>
            <b>{result.players > 1 ? `${result.beaten}%` : '—'}</b>
            <span>{result.players > 1 ? `cao hơn người chơi · hạng ${result.rank}/${result.players.toLocaleString('vi-VN')}` : 'bạn thả đầu tiên'}</span>
          </div>
          {mode === 'daily' && (
            <div>
              <b>{krills}/7</b>
              <span>đáp án độc nhất</span>
            </div>
          )}
        </div>
        <span className="result-note">
          {rows.some((r) => r.pending) ? `${rows.filter((r) => r.pending).length} đáp án mới đang chờ làng xác nhận, điểm chốt lúc 0 giờ. ` : ''}
          {result.replay
            ? 'Lượt chơi lại trên thiết bị này không lên bảng diều. '
            : mode === 'daily' && !result.settled
              ? 'Điểm tạm tính theo những người đã chơi; ai cũng được tính lại cùng một cách và bảng chốt lúc 0 giờ. '
              : ''}
          {upcoming ? `Mốc tiếp theo: ${upcoming.name}.` : 'Bạn đã vượt cả Sông Ngân.'}
        </span>
      </div>

      <div className="result-body">
        <section className="card card--dark share-card">
          <div className="card-k">Khoe với bạn bè</div>
          <div className="share-row" aria-hidden="true">
            {result.grid.split('').slice(0, 14).map((c, i) => (
              <span key={i} className="share-sq" style={c === 'x' ? undefined : { background: TIER_COLOR[Number(c)] }} />
            ))}
          </div>
          <button className="next-btn" onClick={shareImage} disabled={busy}>
            {busy ? 'Đang vẽ ảnh…' : 'Chia sẻ ảnh kết quả'}
          </button>
          <div className="home-row">
            <button className="pill-btn ghost" onClick={shareLink}>Gửi thách đấu</button>
            <button className="pill-btn ghost" onClick={copy}>Chép kết quả</button>
          </div>
        </section>

        {moment && (
          <section className="card moment-card" style={{ '--c': TIER_COLOR[moment.r.tier] } as CSSProperties}>
            <div className="card-k">Đáp án đắt giá nhất</div>
            <span className="moment-q">Câu {moment.i + 1}: {moment.r.prompt}</span>
            <div className="moment-a">
              <TierIcon tier={moment.r.tier} size={30} />
              <b>“{moment.r.display}”</b>
              <span>{TIERS[moment.r.tier].name}</span>
            </div>
            <p className="moment-line">{momentLine(moment.r.tier, seed)}</p>
          </section>
        )}

        <section className="card beta-card">
          <div>
            <b>Đây là bản chơi thử</b>
            <span>Bạn thấy thế nào? Một câu góp ý giúp game hay hơn rất nhiều.</span>
          </div>
          <button className="pill-btn" onClick={() => { setFeedback(true); track('report', { kind: 'feedback_open' }); }}>Góp ý</button>
        </section>

        <section className="card">
          <div className="card-k">So với cả làng</div>
          <DayCurve dist={result.dist} score={result.score} beaten={result.beaten} players={result.players} mode={mode} />
        </section>

        {mode === 'daily' && result.reveal && (
          <section className="card reveal-card">
            <div className="card-k">Đáp án độc nhất hôm nay</div>
            {result.reveal.map((r) => (
              <div key={r.questionId} className="rv">
                <span className="rv-q">{r.prompt}</span>
                <div className="rv-a">
                  <TierIcon tier={5} size={22} />
                  <b>{r.krill}</b>
                  {r.tier === 5 && <span className="rv-found">bạn tìm ra!</span>}
                </div>
                <span className="rv-meta">
                  {r.top ? `Cả làng hay nói: ${r.top}` : ''}
                  {r.mine && r.tier !== 5 ? ` · Bạn: ${r.mine}` : ''}
                </span>
              </div>
            ))}
          </section>
        )}

        <section className="card">
          <div className="card-k">{mode === 'daily' ? 'Bảy cú gió của bạn' : 'Những cú gió của bạn'}</div>
          {mode === 'daily' && <RarityStrings rows={rows} />}
          <div className="rows">
            {rows.map((r) => (
              <div className="row" key={r.questionId + r.points + r.display}>
                <TierIcon tier={r.tier >= 0 ? r.tier : null} size={40} />
                <span style={{ minWidth: 0 }}>
                  <b className="row-a">{r.display ?? (r.input ? `“${r.input}”` : 'Hết gió')}</b>
                  <span className="row-q">{r.tier >= 0 ? `${TIERS[r.tier].name} · ` : ''}{r.prompt}</span>
                </span>
                <b className="pts">{r.points ? `+${r.points}` : '0'}</b>
                {r.display && r.tier >= 0 && (
                  <button
                    className={`flag-btn${flagged.has(r.questionId) ? ' on' : ''}`}
                    disabled={flagged.has(r.questionId)}
                    title="Đáp án này không nên được tính? Báo trưởng làng"
                    aria-label={flagged.has(r.questionId) ? 'Đã báo' : `Báo chấm sai: ${r.display}`}
                    onClick={() => {
                      setFlagged((f) => new Set(f).add(r.questionId));
                      track('report', { kind: 'accepted', q: r.questionId });
                      api.report({ questionId: r.questionId, input: r.display!, kind: 'accepted' }).catch(() => {});
                      flash('Đã báo trưởng làng xem lại đáp án này. Cảm ơn bạn!');
                    }}
                  >
                    {flagged.has(r.questionId) ? '✓' : '⚑'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-k">
            Bảng diều {mode === 'daily' ? 'hôm nay' : 'Thả vô tận'} {board ? `· ${board.players.toLocaleString('vi-VN')} người` : ''}
            {board && !board.settled && mode === 'daily' ? ' · tạm tính' : ''}
          </div>
          {!saved && (
            <form className="name-row" onSubmit={(e) => { e.preventDefault(); void saveName(); }}>
              <label htmlFor="name" className="sr">Tên của bạn trên bảng diều</label>
              <input id="name" className="text-input" placeholder="Tên trên bảng diều" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
              <button className="pill-btn" type="submit" disabled={!name.trim()}>Lưu</button>
            </form>
          )}
          <div className="board">
            {board?.rows.map((r) => (
              <div key={r.rank} className={`board-row${r.me ? ' me' : ''}`}>
                <span className="board-rank">{r.rank}</span>
                <span>{r.me ? `${r.name} (bạn)` : r.name}</span>
                <span className="board-alt">{formatAlt(r.altitude)}</span>
              </div>
            ))}
            {board && !meInBoard && !result.replay && (
              <div className="board-row me">
                <span className="board-rank">{result.rank}</span>
                <span>Bạn</span>
                <span className="board-alt">{formatAlt(result.altitude)}</span>
              </div>
            )}
            {!board && <p className="row-q" style={{ margin: 0 }}>Chưa tải được bảng diều.</p>}
          </div>
        </section>

        {mode === 'daily' && (
          <section className="card">
            <div className="card-k">Bậc của ngày</div>
            <DayBands score={result.score} />
          </section>
        )}

        <section className="card">
          <div className="card-k">Thành tích của bạn</div>
          <MyRecord s={stats()} krill={krillFound()} />
        </section>

        <div className="home-row">
          <button className="pill-btn ghost" onClick={onHome}>Về bãi cỏ</button>
          <button className="pill-btn" onClick={onNight}>{mode === 'night' ? 'Thả vô tận lại' : 'Thả vô tận'}</button>
        </div>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
      {feedback && <FeedbackSheet onClose={() => setFeedback(false)} intro="Cảm ơn bạn đã chơi thử! Chỗ nào khó hiểu, câu hỏi nào dở, đáp án nào bị chấm sai, cứ nói thẳng nhé." />}
    </main>
  );
}
