import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { TIERS, bandFor, formatAlt, lastMilestone, nextMilestone } from '../../shared/scoring.js';
import { api, type BoardRow } from '../api';
import { flute } from '../audio/flute';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { playerId, prefs, vnDay } from '../store';
import { TIER_COLOR, TierIcon } from '../icons';
import { musicLevel, type Summary } from './Game';

export default function Result({ sky, summary, soundButton, onHome, onNight }: { sky: SkyScene; summary: Summary; soundButton: ReactNode; onHome: () => void; onNight: () => void }) {
  const { result, mode, rows } = summary;
  const pid = playerId();
  const [shown, setShown] = useState(0);
  const [name, setName] = useState(prefs.name);
  const [saved, setSaved] = useState(!!prefs.name);
  const [board, setBoard] = useState<{ players: number; rows: BoardRow[] } | null>(null);
  const [toast, setToast] = useState('');
  const reached = lastMilestone(result.altitude);
  const upcoming = nextMilestone(result.altitude);

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

  const loadBoard = () => api.board(mode, pid).then(setBoard).catch(() => setBoard(null));
  useEffect(() => {
    void loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d = new Date(Date.now() + 7 * 3600_000);
  const verdict = bandFor(result.score).verdict;
  const share = useMemo(() => {
    const grid = result.grid.split('').map((c) => (c === 'x' ? '⬛' : TIERS[Number(c)]?.emoji ?? '⬛')).join('');
    const title = mode === 'daily' ? `🪁 Thả Diều ${d.getUTCDate()}/${d.getUTCMonth() + 1}` : '🪁 Thả Diều · Thả đêm';
    const height = `Diều bay ${formatAlt(result.altitude)}${result.players > 1 ? ` · cao hơn ${result.beaten}% người chơi` : ''}`;
    return [title, verdict, height, grid, location.origin].join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const copy = async () => {
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text: share });
        return;
      }
      await navigator.clipboard.writeText(share);
      setToast('Đã sao chép kết quả');
    } catch {
      setToast('Chưa sao chép được. Hãy chọn đoạn chữ ở trên và sao chép.');
    }
    setTimeout(() => setToast(''), 2200);
  };

  const saveName = async () => {
    const n = name.trim().slice(0, 24);
    if (!n) return;
    prefs.name = n;
    try {
      await api.finish({ playerId: pid, day: vnDay(), mode, name: n });
      setSaved(true);
      void loadBoard();
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Chưa lưu được tên.');
      setTimeout(() => setToast(''), 2200);
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
        <span className="result-kicker">
          {mode === 'daily' ? `Chuyến bay ${d.getUTCDate()}/${d.getUTCMonth() + 1}` : 'Thả đêm'}
          {reached.alt ? ` · qua ${reached.name}` : ''}
        </span>
        <span className="result-alt">{formatAlt(shown)}</span>
        <span className="result-verdict">
          <b>{verdict.split('. ')[0]}.</b> {verdict.split('. ').slice(1).join('. ')}
        </span>
        <span className="result-note">
          {result.players > 1
            ? `Hạng ${result.rank} trên ${result.players.toLocaleString('vi-VN')} người ${mode === 'daily' ? 'thả hôm nay' : 'thả đêm hôm nay'}${result.beaten >= 50 ? `, cao hơn ${result.beaten}% số diều` : ''}. `
            : 'Bạn là người đầu tiên thả hôm nay. '}
          {upcoming ? `Mốc tiếp theo: ${upcoming.name}.` : 'Bạn đã vượt cả Sông Ngân.'}
        </span>
      </div>

      <div className="result-body">
        <section className="card">
          <div className="card-k">{mode === 'daily' ? 'Bảy cú gió của bạn' : 'Những cú gió của bạn'}</div>
          <div className="rows">
            {rows.map((r) => (
              <div className="row" key={r.questionId + r.points + r.display}>
                <TierIcon tier={r.tier >= 0 ? r.tier : null} size={40} />
                <span style={{ minWidth: 0 }}>
                  <b className="row-a">{r.display ?? (r.input ? `“${r.input}”` : 'Hết gió')}</b>
                  <span className="row-q">{r.tier >= 0 ? `${TIERS[r.tier].name} · ` : ''}{r.prompt}</span>
                </span>
                <b className="pts">{r.points ? `+${r.points}` : '0'}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="card card--dark">
          <div className="card-k">Khoe với bạn bè</div>
          <div className="share-row" aria-hidden="true">
            {result.grid.split('').slice(0, 14).map((c, i) => (
              <span key={i} className="share-sq" style={c === 'x' ? undefined : { background: TIER_COLOR[Number(c)] }} />
            ))}
          </div>
          <p className="share-text">{share}</p>
          <button className="next-btn" onClick={copy}>Sao chép kết quả</button>
        </section>

        <section className="card">
          <div className="card-k">
            Bảng diều {mode === 'daily' ? 'hôm nay' : 'thả đêm'} {board ? `· ${board.players.toLocaleString('vi-VN')} người` : ''}
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
            {board && !meInBoard && (
              <div className="board-row me">
                <span className="board-rank">{result.rank}</span>
                <span>Bạn</span>
                <span className="board-alt">{formatAlt(result.altitude)}</span>
              </div>
            )}
            {!board && <p className="row-q" style={{ margin: 0 }}>Chưa tải được bảng diều.</p>}
          </div>
        </section>

        <div className="home-row">
          <button className="pill-btn ghost" onClick={onHome}>Về bãi cỏ</button>
          <button className="pill-btn" onClick={onNight}>{mode === 'night' ? 'Thả đêm lại' : 'Thả đêm'}</button>
        </div>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
