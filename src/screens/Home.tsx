import { useEffect, useState, type ReactNode } from 'react';
import { TIERS, TIERS_BY_RANK, formatAlt } from '../../shared/scoring.js';
import { flute } from '../audio/flute';
import { TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { msToNextDay, stats, today, vnDay } from '../store';
import type { Summary } from './Game';

const WEEKDAY = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

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
    <main className="stage home">
      <div className="home-top">
        <div className="home-stats">
          {st.best > 0 && <span className="stat-chip">Cao nhất <b>{formatAlt(st.best)}</b></span>}
          {st.streak > 0 && <span className="stat-chip">Chuỗi <b>{st.streak} ngày</b></span>}
          {st.nightBest > 0 && <span className="stat-chip">Thả đêm <b>{formatAlt(st.nightBest)}</b></span>}
        </div>
        <span className="hud-sound">{soundButton}</span>
      </div>

      <div className="home-hero">
        <span className="home-kicker">Đố chữ mỗi ngày</span>
        <h1 className="home-title">Thả Diều</h1>
        <p className="home-tag">Đáp án càng hiếm, diều càng bay cao.</p>
      </div>

      <div className="home-spacer" />

      <section className="home-card">
        <div className="home-card-head">
          <div>
            <span className="k">Chuyến bay hôm nay</span>
            <b>
              {WEEKDAY[d.getUTCDay()]}, {d.getUTCDate()}/{d.getUTCMonth() + 1}
            </b>
          </div>
          <div className="home-ladder" aria-hidden="true">
            {TIERS_BY_RANK.filter((t) => t.index !== 6).map((t) => (
              <TierIcon key={t.index} tier={t.index} size={22} />
            ))}
          </div>
        </div>
        {done ? (
          <>
            <p className="home-line">
              Diều đã bay <b>{formatAlt(done.result!.altitude)}</b>. Chuyến mới sau <span className="countdown">{countdown}</span>
            </p>
            <button className="next-btn" onClick={() => onReview({ mode: 'daily', rows: done.rows, result: done.result! })}>
              Xem kết quả
            </button>
          </>
        ) : (
          <>
            <p className="home-line">7 câu hỏi · mỗi câu 25 giây gió · mỗi câu một đáp án</p>
            <button className="next-btn" onClick={() => go('daily')}>
              Thả diều <span aria-hidden="true">▲</span>
            </button>
          </>
        )}
        <div className="home-row">
          <button className="pill-btn ghost" onClick={() => go('night')}>
            Thả đêm
          </button>
          <button className="pill-btn ghost" onClick={() => setHowto(true)} aria-haspopup="dialog">
            Cách chơi
          </button>
        </div>
      </section>

      {howto && (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Cách chơi" onClick={() => setHowto(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Cách chơi</h2>
              <button className="sheet-x" onClick={() => setHowto(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <ol className="rules">
              <li>Mỗi câu chỉ được <b>thả một đáp án</b>. Không có đúng sai, chỉ có đáp án hợp lệ và đáp án hiếm.</li>
              <li>Đáp án <b>càng ít người nghĩ tới</b> càng nhiều điểm, diều càng bay cao. Độ hiếm tính từ câu trả lời của mọi người chơi.</li>
              <li>Gõ thiếu dấu hay nhầm chính tả? Diều hỏi lại để bạn chốt. Câu chung chung như “chim” sẽ được nhắc kể cụ thể hơn.</li>
              <li>Sổ làng có hơn 18.000 đáp án cho hơn 260 câu hỏi. Cứ 65 điểm, diều bay cao gấp mười lần.</li>
              <li><b>Thả đêm</b>: 45 giây gió chung, đáp án hiếm nạp thêm gió. Bay tới khi tắt gió.</li>
            </ol>
            <div className="tier-list">
              {TIERS_BY_RANK.map((t) => (
                <div key={t.index} className="tier-item">
                  <TierIcon tier={t.index} size={36} />
                  <div>
                    <b>{t.name}</b>
                    <span>{TIERS[t.index].line}</span>
                  </div>
                  <em>{t.points}</em>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
