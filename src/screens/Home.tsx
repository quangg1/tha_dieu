import { useEffect, useState, type ReactNode } from 'react';
import { TIERS, formatAlt } from '../../shared/scoring.js';
import { flute } from '../audio/flute';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { msToNextDay, stats, today, vnDay } from '../store';
import { Seal } from '../ui';
import type { Summary } from './Game';

function useCountdown() {
  const [ms, setMs] = useState(msToNextDay());
  useEffect(() => {
    const t = setInterval(() => setMs(msToNextDay()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(ms / 1000);
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function Home({ sky, soundButton, onPlay, onReview }: { sky: SkyScene; soundButton: ReactNode; onPlay: (m: 'daily' | 'night') => void; onReview: (s: Summary) => void }) {
  const [howto, setHowto] = useState(false);
  const st = stats();
  const rec = today();
  const done = rec && rec.day === vnDay() && rec.result ? rec : null;
  const countdown = useCountdown();
  const d = new Date(Date.now() + 7 * 3600_000);

  useEffect(() => {
    sky.setLayout(LAYOUTS.home);
    sky.setAltitude(0, false);
    sky.setFlutes(2);
    sky.setNervous(false);
    flute.setLevel(1);
  }, [sky]);

  const go = (m: 'daily' | 'night') => {
    flute.unlock();
    flute.start();
    flute.rise();
    onPlay(m);
  };

  return (
    <main className="stage">
      <div className="topbar">
        <span />
        {soundButton}
      </div>
      <h1 className="gd-print home-title">
        Thả
        <br />
        Diều
      </h1>
      <p className="home-tag">Đáp án càng hiếm, diều càng bay cao.</p>
      <div className="home-spacer" />
      <div className="home-knots">
        {st.best > 0 && <span className="knot-tag">cao nhất {formatAlt(st.best)}</span>}
        {st.streak > 0 && <span className="knot-tag">chuỗi {st.streak} ngày</span>}
        {st.nightBest > 0 && <span className="knot-tag">thả đêm {formatAlt(st.nightBest)}</span>}
      </div>
      <section className="gd-paper home-card">
        <span className="date-seal" aria-label={`Ngày ${d.getUTCDate()} tháng ${d.getUTCMonth() + 1}`}>
          {d.getUTCDate()}
          <br />
          tháng {d.getUTCMonth() + 1}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 56 }}>
          <span className="gd-label">Chuyến bay hôm nay</span>
          {done ? (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, lineHeight: 1.2 }}>Diều đã bay {formatAlt(done.result!.altitude)}</span>
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, lineHeight: 1.2 }}>7 câu hỏi · mỗi câu 25 giây gió</span>
          )}
          {done && (
            <span style={{ fontSize: 14, color: 'var(--than-70)' }}>
              Chuyến mới sau <span className="countdown">{countdown}</span>
            </span>
          )}
        </div>
        <div className="home-actions">
          {done ? (
            <button className="gd-btn" onClick={() => onReview({ mode: 'daily', rows: done.rows, result: done.result! })}>
              Xem kết quả
            </button>
          ) : (
            <button className="gd-btn" onClick={() => go('daily')}>
              Thả diều
            </button>
          )}
          <button className="gd-btn gd-btn--paper" style={{ padding: '0 14px', fontSize: 16 }} onClick={() => go('night')}>
            Thả đêm
          </button>
        </div>
        <button className="gd-chip" style={{ alignSelf: 'flex-start' }} onClick={() => setHowto((v) => !v)} aria-expanded={howto}>
          {howto ? 'Thu gọn cách chơi' : 'Cách chơi'}
        </button>
      </section>
      {howto && (
        <section className="gd-paper howto">
          <ol>
            <li>Mỗi câu chốt <b>một đáp án đúng</b> trước khi hết gió. Gõ sai không mất lượt, chỉ mất 2 giây gió.</li>
            <li>Đáp án <b>càng ít người nghĩ tới</b> càng nhiều điểm. Độ hiếm tính từ câu trả lời của mọi người chơi.</li>
            <li>Mỗi câu giấu một <b>đáp án Cung Trăng</b> đáng 100 điểm.</li>
            <li>Cứ 65 điểm, diều bay cao gấp mười lần. Bầu trời không có trần.</li>
            <li>Đáp án lạ chưa có trong sổ sẽ được <b>trọng tài Claude</b> xem xét.</li>
            <li><b>Thả đêm</b>: 45 giây gió chung, đáp án hiếm nạp thêm gió. Bay tới khi tắt gió.</li>
          </ol>
          <div className="seal-row">
            {TIERS.map((t) => (
              <Seal key={t.index} tier={t.index} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
