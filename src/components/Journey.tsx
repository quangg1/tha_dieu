// Hành trình: the long trip every daily flight adds to. A card (home and result), the full road in a sheet, and the
// arrival moment when a flight passes a stop.
import { useEffect, useState } from 'react';
import { STATIONS, daysLeft, journeyAt, stopsBetween, type Station } from '../../shared/journey.js';
import { CloseIcon } from '../glyphs';
import { stats } from '../store';

const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN');

/** The player's own pace: average points of a daily flight so far. */
function pace(): number {
  const s = stats();
  return s.flights > 0 ? s.total / s.flights : 0;
}

/** Counts a number up from `from` to `to` once, for the bar and the total. */
function useCountUp(from: number, to: number, ms = 1400) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (from === to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(to);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const start = setTimeout(() => (raf = requestAnimationFrame(step)), 500);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); };
  }, [from, to, ms]);
  return v;
}

export function JourneyCard({ total, gained = 0, onOpen, compact }: { total: number; gained?: number; onOpen: () => void; compact?: boolean }) {
  const shownTotal = useCountUp(Math.max(0, total - gained), total);
  const j = journeyAt(shownTotal);
  const days = j.next ? daysLeft(j.next.at - total, pace()) : null;
  return (
    <button className={`journey-card${compact ? ' compact' : ''}`} onClick={onOpen} aria-label="Mở hành trình">
      <div className="jc-head">
        <span className="jc-k">{compact && j.next ? `Hành trình · còn ${fmt(j.next.at - total)} điểm` : 'Hành trình của bạn'}</span>
        <span className="jc-total">
          {fmt(shownTotal)} <small>điểm</small>
          {gained > 0 && <em className="jc-gain">+{fmt(gained)}</em>}
        </span>
      </div>
      <div className="jc-road">
        <span className="jc-stop here">
          <i aria-hidden="true">{j.here.icon}</i>
          <b>{j.here.name}</b>
        </span>
        <span className="jc-track" aria-hidden="true">
          <span className="jc-fill" style={{ width: `${Math.round(j.progress * 100)}%` }} />
          <span className="jc-kite" style={{ left: `${Math.round(j.progress * 100)}%` }}>🪁</span>
        </span>
        {j.next ? (
          <span className="jc-stop next">
            <i aria-hidden="true">{j.next.icon}</i>
            <b>{j.next.name}</b>
          </span>
        ) : (
          <span className="jc-stop next"><b>Cuối đường</b></span>
        )}
      </div>
      {!compact && (
        <span className="jc-foot">
          {j.next ? <>Còn <b>{fmt(j.next.at - total)}</b> điểm tới {j.next.name}{days ? `, khoảng ${days} ngày nữa` : ''}</> : 'Bạn đã tới Sông Ngân. Hết đường để bay!'}
          <span className="jc-more" aria-hidden="true">›</span>
        </span>
      )}
    </button>
  );
}

/** The moment a flight passes one or more stops: shown once on the result screen. */
export function JourneyArrival({ before, after }: { before: number; after: number }) {
  const passed = stopsBetween(before, after);
  if (!passed.length) return null;
  const last = passed[passed.length - 1];
  return (
    <section className={`arrival${last.major ? ' major' : ''}`} role="status">
      <div className="arrival-burst" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
      </div>
      <span className="arrival-k">{passed.length > 1 ? `Qua ${passed.length} trạm mới!` : 'Tới trạm mới!'}</span>
      <span className="arrival-icon" aria-hidden="true">{last.icon}</span>
      <b className="arrival-name">{last.name}</b>
      <span className="arrival-line">{last.line}</span>
    </section>
  );
}

function StopRow({ s, i, total, here }: { s: Station; i: number; total: number; here: number }) {
  const reached = total >= s.at;
  const isHere = i === here;
  const left = s.at - total;
  const days = !reached ? daysLeft(left, pace()) : null;
  return (
    <li className={`road-stop${reached ? ' done' : ''}${isHere ? ' here' : ''}${s.major ? ' major' : ''}`}>
      <span className="road-dot" aria-hidden="true">{s.icon}</span>
      <span className="road-body">
        <b>{s.name}</b>
        <span>{reached ? s.line : `${fmt(s.at)} điểm${days ? ` · khoảng ${days} ngày nữa` : ''}`}</span>
      </span>
      {isHere && <em className="road-here">Bạn ở đây 🪁</em>}
    </li>
  );
}

export function JourneySheet({ onClose }: { onClose: () => void }) {
  const total = stats().total;
  const j = journeyAt(total);
  useEffect(() => {
    document.querySelector('.road-stop.here')?.scrollIntoView({ block: 'center' });
  }, []);
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Hành trình" onClick={onClose}>
      <section className="sheet journey-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Hành trình</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng"><CloseIcon /></button>
        </div>
        <p className="sup-note">
          Điểm của mỗi <b>chuyến bay hôm nay</b> được cộng dồn thành một hành trình dài, từ lũy tre tới Sông Ngân.
          Mỗi ngày một chuyến, nên ai chơi đều và chơi giỏi sẽ đi xa nhất. Thả vô tận không tính vào đây. Hành trình
          không bao giờ bị lùi, nghỉ vài hôm vẫn giữ nguyên.
        </p>
        <div className="road-sum">
          <span><b>{fmt(total)}</b> điểm đã bay</span>
          <span><b>{j.index}</b>/{STATIONS.length - 1} trạm</span>
        </div>
        <ol className="road">
          {[...STATIONS].map((s, i) => ({ s, i })).reverse().map(({ s, i }) => (
            <StopRow key={s.name} s={s} i={i} total={total} here={j.index} />
          ))}
        </ol>
      </section>
    </div>
  );
}
