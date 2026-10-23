// Danh hiệu: the long game every daily flight adds to. A card (home and result), the whole ladder in a sheet, and the
// moment a flight earns a new title. Not a place in the sky: the sky only ever tells today's flight.
import { useEffect, useState } from 'react';
import { TITLES, daysLeft, titleAt, titlesBetween, type Title } from '../../shared/titles.js';
import { CloseIcon } from '../glyphs';
import { krillFound, stats } from '../store';
import { SKINS, progress, unlocked } from '../skins';

const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN');

/** The player's own pace: average points of a daily flight so far. */
function pace(): number {
  const s = stats();
  return s.flights > 0 ? s.total / s.flights : 0;
}

/** The locked kite the player is closest to, for "Diều sắp mở". */
function nextKite() {
  const st = stats();
  const me = { best: Math.max(st.best, st.nightBest), krill: krillFound(), streak: st.streak };
  return SKINS.filter((s) => !unlocked(s, me))
    .map((s) => ({ s, p: progress(s, me)! }))
    .filter((x) => x.p)
    .sort((a, b) => b.p.f - a.p.f)[0] ?? null;
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

export function TitleCard({ total, gained = 0, onOpen, compact }: { total: number; gained?: number; onOpen: () => void; compact?: boolean }) {
  const shownTotal = useCountUp(Math.max(0, total - gained), total);
  const j = titleAt(shownTotal);
  const days = j.next ? daysLeft(j.next.at - total, pace()) : null;
  const kite = compact ? null : nextKite();
  return (
    <button className={`journey-card title-card${compact ? ' compact' : ''}`} onClick={onOpen} aria-label="Mở bảng danh hiệu">
      <div className="jc-head">
        <span className="jc-k">Danh hiệu của bạn</span>
        <span className="jc-total">
          {fmt(shownTotal)} <small>điểm</small>
          {gained > 0 && <em className="jc-gain">+{fmt(gained)}</em>}
        </span>
      </div>
      <div className="tc-name">
        <span className="tc-step" aria-label={`Bậc ${j.index + 1}`}>{j.index + 1}</span>
        <b>{j.here.name}</b>
      </div>
      <span className="jc-track tc-track" aria-hidden="true">
        <span className="jc-fill" style={{ width: `${Math.round(j.progress * 100)}%` }} />
      </span>
      <span className="jc-foot">
        <span>
          {j.next ? <>Còn <b>{fmt(Math.max(0, j.next.at - total))}</b> điểm lên <b>{j.next.name}</b>{days && !compact ? `, khoảng ${days} ngày nữa` : ''}</> : 'Bạn đã có danh hiệu cao nhất.'}
          {kite && <span className="tc-kite">Diều sắp mở: {kite.s.name} · {kite.p.text}</span>}
        </span>
        <span className="jc-more" aria-hidden="true">›</span>
      </span>
    </button>
  );
}

/** The moment a flight earns one or more titles: shown once on the result screen. */
export function TitleArrival({ before, after }: { before: number; after: number }) {
  const earned = titlesBetween(before, after);
  if (!earned.length) return null;
  const last = earned[earned.length - 1];
  return (
    <section className={`arrival${last.major ? ' major' : ''}`} role="status">
      <div className="arrival-burst" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
      </div>
      <span className="arrival-k">Danh hiệu mới</span>
      <span className="arrival-icon" aria-hidden="true">🪁</span>
      <b className="arrival-name">{last.name}</b>
      <span className="arrival-line">{last.line}</span>
    </section>
  );
}

function TitleRow({ s, i, total, here }: { s: Title; i: number; total: number; here: number }) {
  const reached = total >= s.at;
  const isHere = i === here;
  const days = !reached ? daysLeft(s.at - total, pace()) : null;
  return (
    <li className={`road-stop${reached ? ' done' : ''}${isHere ? ' here' : ''}${s.major ? ' major' : ''}`}>
      <span className="road-dot tc-dot" aria-hidden="true">{i + 1}</span>
      <span className="road-body">
        <b>{s.name}</b>
        <span>{reached ? s.line : `${fmt(s.at)} điểm${days ? `, khoảng ${days} ngày nữa` : ''}`}</span>
      </span>
      {isHere && <em className="road-here">Bạn đang ở đây</em>}
    </li>
  );
}

export function TitlesSheet({ onClose }: { onClose: () => void }) {
  const total = stats().total;
  const j = titleAt(total);
  useEffect(() => {
    document.querySelector('.road-stop.here')?.scrollIntoView({ block: 'center' });
  }, []);
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Danh hiệu" onClick={onClose}>
      <section className="sheet journey-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Danh hiệu</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng"><CloseIcon /></button>
        </div>
        <p className="sup-note">
          Mỗi sáng diều lại cất cánh từ bãi cỏ, cả làng cùng một vạch xuất phát. Còn điểm của mọi <b>chuyến bay hôm nay</b>
          {' '}bạn đã thả thì được cộng dồn thành danh hiệu. Mỗi ngày một chuyến, nên ai chơi đều và chơi giỏi sẽ lên bậc cao
          nhất. Thả vô tận không tính vào đây. Danh hiệu không bao giờ bị tụt, nghỉ vài hôm vẫn giữ nguyên.
        </p>
        <div className="road-sum">
          <span><b>{fmt(total)}</b> điểm cộng dồn</span>
          <span><b>{j.index + 1}</b>/{TITLES.length} bậc</span>
        </div>
        <ol className="road">
          {[...TITLES].map((s, i) => ({ s, i })).reverse().map(({ s, i }) => (
            <TitleRow key={s.name} s={s} i={i} total={total} here={j.index} />
          ))}
        </ol>
      </section>
    </div>
  );
}
