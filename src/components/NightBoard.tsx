// Thả vô tận's board: each player's best run today, over the last seven days, or ever.
import { useEffect, useState } from 'react';
import { formatAlt } from '../../shared/scoring.js';
import { api, type NightBoard as Board, type NightBoardRow } from '../api';
import { CloseIcon } from '../glyphs';
import { playerId } from '../store';

type Period = Board['period'];
const PERIODS: [Period, string][] = [
  ['day', 'Hôm nay'],
  ['week', '7 ngày'],
  ['all', 'Mọi lúc'],
];

function shortDay(day: string) {
  const [, m, d] = day.split('-').map(Number);
  return `${d}/${m}`;
}

/** The board with its three periods; `refresh` changes after a run so the new best shows at once. */
export function NightBoardList({ initial = 'day', refresh = 0, compact = false }: { initial?: Period; refresh?: number; compact?: boolean }) {
  const [period, setPeriod] = useState<Period>(initial);
  const [board, setBoard] = useState<Board | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let off = false;
    setFailed(false);
    api
      .nightBoard(period, playerId())
      .then((b) => !off && setBoard(b))
      .catch(() => !off && setFailed(true));
    return () => {
      off = true;
    };
  }, [period, refresh]);
  const rows = board && board.period === period ? board.rows.slice(0, compact ? 10 : 20) : null;
  const row = (r: NightBoardRow) => (
    <div key={`${r.rank}-${r.name}`} className={`board-row${r.me ? ' me' : ''}`}>
      <span className="board-rank">{r.rank}</span>
      <span className="nb-name">
        {r.me ? (r.name === 'Người thả diều' ? 'Bạn' : `${r.name} (bạn)`) : r.name}
        {period !== 'day' && <small>{shortDay(r.day)}</small>}
      </span>
      <span className="board-alt">
        {r.score.toLocaleString('vi-VN')} điểm<small>{formatAlt(r.altitude)}</small>
      </span>
    </div>
  );
  return (
    <div className="nb">
      <div className="fb-kinds" role="tablist" aria-label="Khoảng thời gian">
        {PERIODS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={period === k} className={`fb-kind${period === k ? ' on' : ''}`} onClick={() => setPeriod(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className="board">
        {rows?.map(row)}
        {board && board.period === period && board.me && (
          <>
            <div className="nb-gap" aria-hidden="true">⋯</div>
            {row(board.me)}
          </>
        )}
        {rows && rows.length === 0 && <p className="row-q nb-empty">Chưa ai thả vô tận {period === 'day' ? 'hôm nay' : 'trong 7 ngày qua'}. Bạn bay đầu tiên nhé!</p>}
        {!rows && !failed && <p className="row-q nb-empty">Đang tải bảng…</p>}
        {failed && <p className="row-q nb-empty">Chưa tải được bảng.</p>}
      </div>
      {board && board.period === period && board.players > 0 && <p className="acct-note nb-count">{board.players.toLocaleString('vi-VN')} người đã thả vô tận {period === 'day' ? 'hôm nay' : period === 'week' ? 'trong 7 ngày' : 'từ trước tới nay'}. Mỗi người tính lượt bay cao nhất.</p>}
    </div>
  );
}

export function NightBoardSheet({ onClose, onPlay }: { onClose: () => void; onPlay?: () => void }) {
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Bảng Thả vô tận" onClick={onClose}>
      <section className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Bảng Thả vô tận</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng">
            <CloseIcon />
          </button>
        </div>
        <p className="sup-note" style={{ margin: 0 }}>Câu hỏi nối tiếp tới khi hết gió. Ai bay xa nhất, qua cả rìa vũ trụ sang vòng 2, vòng 3?</p>
        <NightBoardList />
        {onPlay && (
          <button className="next-btn" onClick={onPlay}>
            Thả vô tận
          </button>
        )}
      </section>
    </div>
  );
}
