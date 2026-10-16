import { useEffect, useState, type ReactNode } from 'react';
import { MILESTONES, TIERS, TIERS_BY_RANK, formatAlt } from '../../shared/scoring.js';
import { flute } from '../audio/flute';
import { TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { readChallenge } from '../shareCard';
import { SKINS, needLabel, skinById, unlocked } from '../skins';
import { album, krillFound, msToNextDay, prefs, stats, today, vnDay } from '../store';
import type { Summary } from './Game';

/** A friend's result from a challenge link, read once and kept for this visit. */
const CHALLENGE = typeof location !== 'undefined' ? readChallenge(location.search) : null;
if (CHALLENGE && typeof history !== 'undefined') history.replaceState(null, '', location.pathname);

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
  const [bag, setBag] = useState(false);
  const [skin, setSkin] = useState(prefs.skin);
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

      {CHALLENGE && (
        <div className="challenge">
          <span className="challenge-k">Lời thách đấu</span>
          <p>
            <b>{CHALLENGE.n}</b> đã thả diều tới <b>{formatAlt(CHALLENGE.a)}</b>
            {CHALLENGE.t ? ` (${CHALLENGE.t})` : ''}
            {CHALLENGE.d === vnDay() ? ' hôm nay. Bạn bay được cao hơn không?' : ` ngày ${CHALLENGE.d.slice(8, 10)}/${CHALLENGE.d.slice(5, 7)}. Thử sức với chuyến bay hôm nay nhé!`}
          </p>
        </div>
      )}

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
        <button className="bag-btn" onClick={() => setBag(true)} aria-haspopup="dialog">
          <span>Bộ sưu tập</span>
          <b>
            {SKINS.filter((x) => unlocked(x, { best: Math.max(st.best, st.nightBest), krill: krillFound(), streak: st.streak })).length}/{SKINS.length} diều · {krillFound()} đáp án độc nhất
          </b>
        </button>
      </section>

      {bag && (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Bộ sưu tập" onClick={() => setBag(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Bộ sưu tập</h2>
              <button className="sheet-x" onClick={() => setBag(false)} aria-label="Đóng">
                ✕
              </button>
            </div>
            <div className="card-k" style={{ margin: '12px 0 8px' }}>Cánh diều</div>
            <div className="skins">
              {SKINS.map((k) => {
                const open = unlocked(k, { best: Math.max(st.best, st.nightBest), krill: krillFound(), streak: st.streak });
                return (
                  <button
                    key={k.id}
                    className={`skin${skin === k.id ? ' on' : ''}${open ? '' : ' locked'}${k.prize ? ' prize' : ''}`}
                    disabled={!open}
                    onClick={() => {
                      prefs.skin = k.id;
                      setSkin(k.id);
                      sky.setSkin(skinById(k.id));
                    }}
                  >
                    <svg width="44" height="60" viewBox="0 0 120 220" aria-hidden="true">
                      {k.gradient && (
                        <defs>
                          <linearGradient id={`g-${k.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor={k.gradient[0]} />
                            <stop offset="1" stopColor={k.gradient[1]} />
                          </linearGradient>
                        </defs>
                      )}
                      <path d="M60 30 C 100 52, 106 120, 60 214 C 14 120, 20 52, 60 30 Z" fill={open ? (k.gradient ? `url(#g-${k.id})` : k.body) : '#c9d0da'} stroke="#1f1b16" strokeWidth="5" />
                      <path d="M60 60 C 82 76, 86 118, 60 170 C 34 118, 38 76, 60 60 Z" fill={open ? k.inner : '#e6eaf0'} />
                    </svg>
                    <b>{k.name}</b>
                    <span>{open ? (skin === k.id ? 'Đang dùng' : 'Chọn') : needLabel(k)}</span>
                  </button>
                );
              })}
            </div>
            <div className="card-k" style={{ margin: '16px 0 8px' }}>Tầng trời đã chạm</div>
            <div className="layers">
              {MILESTONES.filter((m) => m.alt > 0).map((m) => (
                <span key={m.name} className={Math.max(st.best, st.nightBest) >= m.alt ? 'on' : ''}>
                  {m.name}
                </span>
              ))}
            </div>
            <div className="card-k" style={{ margin: '16px 0 8px' }}>Đáp án độc nhất · {krillFound()} đã tìm ra</div>
            <div className="album">
              {Object.values(album()).length === 0 && <p className="row-q">Chơi xong một chuyến bay để mở các đáp án độc nhất.</p>}
              {Object.values(album())
                .sort((a, b) => (a.day < b.day ? 1 : -1))
                .slice(0, 60)
                .map((e) => (
                  <div key={e.day + e.prompt} className={`album-row${e.found ? ' found' : ''}`}>
                    <span>{e.prompt}</span>
                    <b>{e.krill}</b>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

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
              <li><b>Thả đêm</b>: 45 giây gió chung, đáp án hiếm nạp thêm gió, diều lên nhanh hơn. Vượt qua rìa vũ trụ, diều chui qua lỗ giun sang <b>vòng 2</b> (trời hoàng hôn) rồi <b>vòng 3</b> (đêm hội), mở khóa diều phượng hoàng và diều rồng ngọc.</li>
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
