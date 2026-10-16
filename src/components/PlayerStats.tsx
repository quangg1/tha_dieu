// Player statistics, Krillion style: where today's flight sits among everyone's, the rarity of each answer,
// the day's bands, and the player's own record over time.
import { DAY_BANDS, TIERS, TIERS_BY_RANK, bandFor, formatAlt } from '../../shared/scoring.js';
import { TIER_COLOR, TierIcon } from '../icons';
import type { LocalRow, Stats } from '../store';

/** A smoothed curve of the day's scores with the player's mark on it. */
export function DayCurve({ dist, score, beaten, players, mode }: { dist?: { w: number; counts: number[] }; score: number; beaten: number; players: number; mode: 'daily' | 'night' }) {
  const W = 400;
  const H = 170;
  const pad = 16;
  const counts = dist?.counts ?? [];
  const w = dist?.w ?? 20;
  const max = Math.max(mode === 'daily' ? 820 : 0, counts.length * w, score + w);
  const n = Math.ceil(max / w);
  // Few players give a jagged histogram: widen the smoothing until the day fills up.
  const sigma = players < 10 ? 3 : players < 50 ? 2 : 1.3;
  const dens: number[] = [];
  for (let i = 0; i < n; i++) {
    let v = 0;
    for (let j = 0; j < counts.length; j++) v += (counts[j] ?? 0) * Math.exp(-((i - j) ** 2) / (2 * sigma * sigma));
    dens.push(v);
  }
  const top = Math.max(1e-6, ...dens);
  const x = (pts: number) => pad + (Math.min(pts, max) / max) * (W - pad * 2);
  const y = (v: number) => H - 22 - (v / top) * (H - 50);
  const line = dens.map((v, i) => `${i ? 'L' : 'M'}${x(i * w + w / 2).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(max).toFixed(1)} ${H - 22} L${x(0).toFixed(1)} ${H - 22} Z`;
  const me = Math.floor(score / w);
  const myY = y(dens[Math.min(dens.length - 1, me)] ?? 0);
  const step = mode === 'daily' ? 100 : Math.max(100, Math.round(max / 6 / 100) * 100);
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step) ticks.push(t);
  return (
    <div className="pst-curve">
      <div className="pst-score">
        <b>{score}</b>
        <span>điểm · {formatAlt(Math.pow(10, score / (mode === 'daily' ? 65 : 30)))}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={players > 1 ? `Điểm của bạn cao hơn ${beaten}% người chơi hôm nay` : 'Bạn là người bay đầu tiên hôm nay'}>
        <defs>
          <linearGradient id="pst-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a8fd8" stopOpacity=".35" />
            <stop offset="1" stopColor="#3a8fd8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {players > 0 && (
          <>
            <path d={area} fill="url(#pst-fill)" />
            <path d={line} fill="none" stroke="#3a8fd8" strokeWidth="2.5" strokeLinejoin="round" />
          </>
        )}
        <line x1={pad} x2={W - pad} y1={H - 22} y2={H - 22} stroke="#c9d3e2" />
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={H - 6} textAnchor="middle" fontSize="13" fill="#7a8699">
            {t}
          </text>
        ))}
        <line x1={x(score)} x2={x(score)} y1={myY} y2={H - 22} stroke="#e5533d" strokeWidth="2" />
        <circle cx={x(score)} cy={myY} r="6" fill="#e5533d" stroke="#fff" strokeWidth="2" />
        <text x={x(score)} y={Math.max(14, myY - 12)} textAnchor="middle" fontSize="14" fontWeight="800" fill="#e5533d">
          BẠN
        </text>
      </svg>
      <p className="pst-line">
        {players > 1 ? (
          <>
            Cao hơn <b>{beaten}%</b> trong {players.toLocaleString('vi-VN')} người chơi {mode === 'daily' ? 'hôm nay' : 'chơi Thả vô tận hôm nay'}
          </>
        ) : (
          'Bạn là người bay đầu tiên. Đường cong sẽ hiện dần khi cả làng cùng chơi.'
        )}
        {players > 1 && players < 20 ? <span> · mới có ít người, đường cong còn thay đổi</span> : null}
      </p>
    </div>
  );
}

/** Each prompt as a kite string: the higher it reaches, the rarer the answer. */
export function RarityStrings({ rows }: { rows: LocalRow[] }) {
  const top = 6;
  return (
    <div className="pst-strings">
      <div className="pst-axis" aria-hidden="true">
        <span>Độc nhất</span>
        <span>Hiếm</span>
        <span>Thường</span>
      </div>
      <div className="pst-cols">
        {rows.slice(0, 7).map((r, i) => {
          const rank = r.tier >= 0 ? TIERS[r.tier].rank : -1;
          const h = rank < 0 ? 0 : 14 + (rank / top) * 86;
          return (
            <div key={r.questionId} className="pst-col" title={`${r.prompt}: ${r.display ?? 'hết gió'}`}>
              <div className="pst-sky">
                {rank >= 0 ? (
                  <>
                    <span className="pst-str" style={{ height: `${h}%`, background: TIER_COLOR[r.tier] }} />
                    <span className="pst-ico" style={{ bottom: `calc(${h}% - 2px)` }}>
                      <TierIcon tier={r.tier} size={30} />
                    </span>
                  </>
                ) : (
                  <span className="pst-ico pst-miss">
                    <TierIcon tier={null} size={26} />
                  </span>
                )}
              </div>
              <b>{i + 1}</b>
              <span className="sr">
                Câu {i + 1}: {r.tier >= 0 ? TIERS[r.tier].name : 'hết gió'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The day's titles by score, with the player's own highlighted. */
export function DayBands({ score }: { score: number }) {
  const mine = bandFor(score);
  return (
    <div className="pst-bands">
      {DAY_BANDS.map((b, i) => {
        const next = DAY_BANDS[i + 1];
        const [name, line] = [b.verdict.split('. ')[0], b.verdict.split('. ').slice(1).join('. ')];
        return (
          <div key={b.min} className={`pst-band${b === mine ? ' on' : ''}`}>
            <TierIcon tier={b.tier} size={26} />
            <span className="pst-range">{next ? `${b.min}–${next.min - 1}` : `${b.min}+`}</span>
            <span className="pst-bname">
              <b>{name}</b> {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** The player's record over every day they have flown. */
export function MyRecord({ s, krill }: { s: Stats; krill: number }) {
  const answered = s.tiers.reduce((a, b) => a + b, 0);
  const all = answered + s.misses;
  const rare = s.tiers[3] + s.tiers[4] + s.tiers[5];
  const tiles: [string, string][] = [
    [String(s.flights), 'chuyến bay'],
    [String(s.streak), 'chuỗi ngày hiện tại'],
    [String(s.bestStreak), 'chuỗi dài nhất'],
    [s.bestScore ? String(s.bestScore) : '—', 'điểm cao nhất'],
    [s.flights ? String(Math.round(s.total / s.flights)) : '—', 'điểm trung bình'],
    [String(krill), 'đáp án độc nhất'],
  ];
  const peak = Math.max(1, ...s.tiers, s.misses);
  return (
    <div className="pst-me">
      <div className="pst-tiles">
        {tiles.map(([v, l]) => (
          <div key={l}>
            <b>{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      {all > 0 && (
        <>
          <p className="pst-line">
            {Math.round((rare / all) * 100)}% đáp án của bạn từ Rất hiếm trở lên · cao nhất {formatAlt(s.best)}
          </p>
          <div className="pst-bars">
            {TIERS_BY_RANK.map((t) => (
              <div key={t.index} className="pst-bar">
                <TierIcon tier={t.index} size={22} />
                <span className="pst-bname">{t.name}</span>
                <span className="pst-track">
                  <span style={{ width: `${(s.tiers[t.index] / peak) * 100}%`, background: TIER_COLOR[t.index] }} />
                </span>
                <b>{s.tiers[t.index]}</b>
              </div>
            ))}
            <div className="pst-bar">
              <TierIcon tier={null} size={22} />
              <span className="pst-bname">Hết gió</span>
              <span className="pst-track">
                <span style={{ width: `${(s.misses / peak) * 100}%`, background: '#9aa3b2' }} />
              </span>
              <b>{s.misses}</b>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
