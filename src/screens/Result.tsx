import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { BAND_RULES, RANK_MIN_PLAYERS, CEILING_L, DAY_BANDS, GIO_POINTS, TIERS, TIERS_BY_RANK, basePoints, dayBand, flightPoints, formatAlt, gioMultiplier, lastMilestone, nextMilestone, usesGio } from '../../shared/scoring.js';
import { api, type FriendsBoard, type BoardRow, type FinishResult } from '../api';
import { flute } from '../audio/flute';
import { TIER_COLOR, TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { challengeLink, shareCard } from '../shareCard';
import { renderKiteCard } from '../kiteCard';
import { NightBoardList } from '../components/NightBoard';
import { bragLine, momentLine, nightVerdict, seedOf, tauntLine } from '../quips';
import { skinById } from '../skins';
import { rudeName } from '../../shared/names.js';
import { addToAlbum, krillFound, playerId, playerSince, prefs, saveToday, stats, today, vnDay } from '../store';
import { musicLevel, type Summary } from './Game';
import { track } from '../track';
import { DayBands, DayCurve, MyRecord, RarityStrings } from '../components/PlayerStats';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { FriendsList, FriendsSheet, shareInvite } from '../components/Friends';
import { CheckIcon, FlagIcon } from '../glyphs';
import { JourneyArrival, JourneyCard, JourneySheet } from '../components/Journey';
import { journeyAt } from '../../shared/journey.js';

export default function Result({ sky, summary, soundButton, onHome, onNight }: { sky: SkyScene; summary: Summary; soundButton: ReactNode; onHome: () => void; onNight: () => void }) {
  const { mode, rows } = summary;
  const pid = playerId();
  const [result, setResult] = useState<FinishResult>(summary.result);
  const [shown, setShown] = useState(0);
  const [scoreShown, setScoreShown] = useState(0);
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
    if (reduce) { setScoreShown(result.score); return setShown(result.altitude); }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1800);
      setShown(Math.pow(10, Math.log10(Math.max(1, result.altitude)) * (1 - Math.pow(1 - p, 3))));
      setScoreShown(result.score * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sky, result.altitude, result.score]);

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
    if (mode === 'daily' && result.reveal) addToAlbum(day, result.reveal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.reveal]);

  // The night board refetches after a name is saved, so the new name shows on it.
  const [nightTick, setNightTick] = useState(0);
  const loadBoard = () => {
    setNightTick((n) => n + 1);
    return api.board(mode, pid).then(setBoard).catch(() => setBoard(null));
  };
  // Friends' scores for today, now that this flight is done.
  const [friends, setFriends] = useState<FriendsBoard | null>(null);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [invited, setInvited] = useState('');
  useEffect(() => {
    if (mode !== 'daily') return;
    api.friends(pid, prefs.name || undefined).then(setFriends).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.score]);
  useEffect(() => {
    void loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d = new Date(Date.now() + 7 * 3600_000);
  const dayLabel = `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
  const seed = seedOf(day, mode, result.score);
  const krills = result.reveal?.filter((r) => r.tier === 5).length ?? 0;
  // The daily bands fit seven answers; Thả vô tận is judged by how far up the sky this run actually went.
  const night = mode === 'night' ? nightVerdict(result.altitude, CEILING_L, seed) : null;
  const dBand = dayBand({ altitude: result.altitude, score: result.score, rank: result.rank, players: result.players, day });
  const [dayTitle, ...rest] = DAY_BANDS[dBand].verdict.split('. ');
  const title = night ? night.title : dayTitle;
  const subtitle = night ? night.subtitle : rest.join('. ');
  const band = night ? night.band : dBand;
  const gio = mode === 'daily' && usesGio('daily', day);
  // Each answer's points as flown, so the result can show base × gió for every row.
  const flown = mode === 'daily' ? flightPoints(rows.map((r) => r.tier), day) : [];
  // Hành trình: today's flight is already added to the total; show it arriving.
  const st = stats();
  const gained = mode === 'daily' && !result.replay && st.lastDay === day ? result.score : 0;
  const [journeyOpen, setJourneyOpen] = useState(false);
  const brag = night ? night.brag : bragLine(band, { krills, beaten: result.beaten, players: result.players, seed });
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
    const height = `${result.score.toLocaleString('vi-VN')} điểm · diều bay ${formatAlt(result.altitude)}${result.players > 1 ? ` · cao hơn ${result.beaten}% người chơi` : ''}`;
    return [head, `${title}. ${subtitle}`, `“${brag}”`, height, grid].join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const shareImage = async () => {
    setBusy(true);
    try {
      const blob = await renderKiteCard({
        dayLabel: mode === 'daily' ? dayLabel : 'Thả vô tận',
        title: `${title}.`,
        subtitle,
        altitude: result.altitude,
        score: result.score,
        milestone: reached.alt ? reached.name : '',
        beaten: result.players > 1 ? result.beaten : null,
        grid: result.grid,
        points: mode === 'daily' ? rows.map((r) => r.points) : undefined,
        rare: moment ? { text: moment.r.display!, tier: moment.r.tier } : undefined,
        station: mode === 'daily' ? journeyAt(st.total).here.name : undefined,
        link,
        skin: prefs.skin,
        scene: sky.snapshot(1080, 1350, result.altitude, { kiteX: 0.74, kiteY: 0.2, decade: 0.5, kiteSize: 0.26, kiteMax: 300, ruler: false, ground: -1.36, noKite: true }),
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
    const msg = `🪁 ${tauntLine(night ? Math.min(band, 4) : band, result.altitude, seed)}`;
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
    if (rudeName(n)) {
      flash('Tên này không lên bảng được. Chọn một tên khác nhé.');
      return;
    }
    try {
      const r = await api.finish({ playerId: pid, day, mode, name: n, since: playerSince(), runSince: summary.runSince });
      if (r.nameRefused) {
        flash('Tên này không lên bảng được. Chọn một tên khác nhé.');
        return;
      }
      prefs.name = n;
      setSaved(true);
      if (mode === 'daily') api.friends(pid, n).then(setFriends).catch(() => {});
      void loadBoard();
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Chưa lưu được tên.');
    }
  };

  const meInBoard = board?.rows.some((r) => r.me);
  const revealBy = new Map((result.reveal ?? []).map((r) => [r.questionId, r]));

  return (
    <main className="stage result">
      <div className="home-top">
        <span />
        <span className="hud-sound">{soundButton}</span>
      </div>
      <div className={`result-hero${mode === 'daily' ? ` band-${band}` : ' band-3'}`}>
        <span className="result-kicker">{mode === 'daily' ? `Chuyến bay ${dayLabel}` : 'Thả vô tận'}</span>
        {mode === 'daily' && result.score > 0 && (
          <span className="band-pill"><i aria-hidden="true">{['🌾', '🎋', '☁️', '🌌', '✨', '🌕'][band]}</i>Bậc {band + 1}/6{gio && result.players >= RANK_MIN_PLAYERS ? ` · ${BAND_RULES[band]}` : ''}</span>
        )}
        <span className="result-title">{title}.</span>
        <span className="result-sub">{subtitle}</span>
        <span className="result-brag">“{brag}”</span>
        <div className="result-stats">
          <div className="stat-main">
            <b>{Math.round(scoreShown).toLocaleString('vi-VN')}</b>
            <span>điểm</span>
          </div>
          <div>
            <b>{result.players > 1 ? `#${result.rank}` : '—'}</b>
            <span>{result.players > 1 ? `trên ${result.players.toLocaleString('vi-VN')} người, hơn ${result.beaten}%` : 'bạn thả đầu tiên'}</span>
          </div>
          {mode === 'daily' && (
            <div>
              <b>{krills}/7</b>
              <span>đáp án độc nhất</span>
            </div>
          )}
        </div>
        <span className="result-note">
          {/* Height is the picture of the score: shown, but second. */}
          Diều lên {formatAlt(shown)}{reached.alt ? `, qua ${reached.name}` : ''}.{mode === 'night' ? (upcoming ? ` Mốc tiếp theo: ${upcoming.name}.` : ' Bạn đã vượt cả Sông Ngân.') : ''}
          {result.replay ? ' Lượt chơi lại trên thiết bị này không lên bảng diều.' : ''}
        </span>
      </div>

      <div className="result-body">
        {mode === 'daily' && (
          <>
            <JourneyArrival before={st.total - gained} after={st.total} />
            <JourneyCard total={st.total} gained={gained} onOpen={() => setJourneyOpen(true)} />
          </>
        )}
        {journeyOpen && <JourneySheet onClose={() => setJourneyOpen(false)} />}
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

        <section className="card">
          <div className="card-k">{mode === 'daily' ? 'Bảy cú gió của bạn' : 'Những cú gió của bạn'}</div>
          {mode === 'daily' && <RarityStrings rows={rows} />}
          {mode === 'daily' && (
            <details className="why">
              <summary>Vì sao bạn được {result.score.toLocaleString('vi-VN')} điểm?</summary>
              <p>Mỗi đáp án được chấm theo <b>số người trong làng cũng nghĩ ra nó</b>: càng ít người nói, bậc càng hiếm, điểm càng cao.</p>
              <div className="why-tiers">
                {TIERS_BY_RANK.filter((t) => t.index !== 6).map((t) => (
                  <span key={t.index}><TierIcon tier={t.index} size={22} /><b>{basePoints(t.index, 'daily', day)}</b></span>
                ))}
              </div>
              {gio ? (
                <p><b>Nối gió</b>: đáp án Hiếm trở lên làm gió mạnh thêm, mỗi bậc gió nhân điểm thêm 0,25 (tối đa ×4). Khá hiếm giữ gió; Thường, Khôn lỏi hay hết gió thì gió lặng, về ×1. Vì vậy cùng một bậc, câu trả lời sau một chuỗi hiếm được nhiều điểm hơn. Tổng điểm là cộng điểm cả bảy câu, như bảng dưới.</p>
              ) : (
                <p>Hai đáp án hiếm liên tiếp trở lên được cộng thêm điểm thưởng chuỗi. Tổng điểm là cộng điểm cả bảy câu.</p>
              )}
              {gio && (
                <>
                  <p><b>Bậc của ngày</b> xếp theo thứ hạng của bạn trong làng hôm nay, nên ngày câu khó hay dễ đều công bằng:</p>
                  <ul className="why-bands">
                    {[5, 4, 3, 2, 1].map((b) => (
                      <li key={b} className={b === band ? 'me' : ''}><b>{DAY_BANDS[b].verdict.split('.')[0]}</b><span>{BAND_RULES[b]}</span></li>
                    ))}
                  </ul>
                  {result.players < RANK_MIN_PLAYERS && <p className="why-note">Làng hôm nay còn dưới {RANK_MIN_PLAYERS} người, nên tạm xếp bậc theo điểm.</p>}
                </>
              )}
            </details>
          )}
          {mode === 'daily' && result.reveal?.some((r) => !r.krill) && (
            <p className="rv-meta rv-lock-note">Đáp án làng giấu mở lúc 0 giờ đêm nay, để không ai chuyền tay cho người chơi sau.</p>
          )}
          <div className="rows">
            {rows.map((r, i) => (
              <div className="row" key={r.questionId + r.points + r.display}>
                <TierIcon tier={r.tier >= 0 ? r.tier : null} size={40} />
                <span style={{ minWidth: 0 }}>
                  <b className="row-a">{r.display || (r.input ? `“${r.input}”` : 'Hết gió')}</b>
                  <span className="row-q">
                    {r.tier >= 0 && <em className="row-t" style={{ color: TIER_COLOR[r.tier] }}>{TIERS[r.tier].name}</em>} {r.prompt}
                  </span>
                  {(() => {
                    const rv = revealBy.get(r.questionId);
                    if (!rv) return null;
                    return (
                      <span className="row-rv">
                        {rv.top && <span>Cả làng hay nói: {rv.top}</span>}
                        {rv.krill && r.tier !== 5 && <span>Làng giấu: <b>{rv.krill}</b></span>}
                      </span>
                    );
                  })()}
                </span>
                <span className="pts-wrap">
                  <b className="pts">{r.points ? `+${r.points}` : '0'}</b>
                  {gio && r.tier >= 0 && flown[i] && gioMultiplier(flown[i].wind) > 1 && (
                    <small className="pts-why">{GIO_POINTS[r.tier]} × gió {gioMultiplier(flown[i].wind).toLocaleString('vi-VN')}</small>
                  )}
                </span>
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
                    {flagged.has(r.questionId) ? <CheckIcon size={14} /> : <FlagIcon size={14} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {mode === 'daily' && friends && friends.friends > 0 && (
          <section className="card">
            <div className="card-k card-k-row">
              <span>Bạn bè hôm nay</span>
              {friends.friends > 0 && <button className="toast-link" onClick={() => setFriendsOpen(true)}>Xem cả tuần</button>}
            </div>
            <FriendsList board={friends} tab="today" compact />
          </section>
        )}
        {friendsOpen && <FriendsSheet onClose={() => setFriendsOpen(false)} />}

        <section className="card">
          <div className="card-k card-k-row">
            <span>Bảng diều {mode === 'daily' ? 'hôm nay' : 'Thả vô tận'}</span>
            {board && mode === 'daily' && <small>{board.players.toLocaleString('vi-VN')} người chơi</small>}
          </div>
          {!saved && (
            <form className="name-row" onSubmit={(e) => { e.preventDefault(); void saveName(); }}>
              <label htmlFor="name" className="sr">Tên của bạn trên bảng diều</label>
              <input id="name" className="text-input" placeholder="Tên trên bảng diều" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
              <button className="pill-btn" type="submit" disabled={!name.trim()}>Lưu</button>
            </form>
          )}
          {mode === 'night' ? (
            <NightBoardList refresh={nightTick} />
          ) : (
          <div className="board">
            {board?.rows.map((r) => (
              <div key={r.rank} className={`board-row${r.me ? ' me' : ''}`}>
                <span className="board-rank">{r.rank}</span>
                <span>{r.me ? `${r.name} (bạn)` : r.name}</span>
                <span className="board-alt">{r.score.toLocaleString('vi-VN')} điểm<small>{formatAlt(r.altitude)}</small></span>
              </div>
            ))}
            {board && !meInBoard && !result.replay && (
              <div className="board-row me">
                <span className="board-rank">{result.rank}</span>
                <span>Bạn</span>
                <span className="board-alt">{result.score.toLocaleString('vi-VN')} điểm<small>{formatAlt(result.altitude)}</small></span>
              </div>
            )}
            {!board && <p className="row-q" style={{ margin: 0 }}>Chưa tải được bảng diều.</p>}
          </div>
          )}
          {mode === 'daily' && friends && friends.friends === 0 && (
            <button className="invite-btn" onClick={() => void shareInvite(friends.code).then((m) => { setInvited(m); if (m) setTimeout(() => setInvited(''), 3000); })}>
              {invited || 'Rủ bạn bè vào bảng riêng'}
            </button>
          )}
        </section>

        <details className="card more-card">
          <summary className="card-k">Xem thêm: so với cả làng, bậc của ngày, thành tích</summary>
          {result.players >= 5 && (
            <div className="more-part">
              <div className="card-k">So với cả làng</div>
              <DayCurve dist={result.dist} score={result.score} beaten={result.beaten} players={result.players} mode={mode} />
            </div>
          )}
          {mode === 'daily' && (
            <div className="more-part">
              <div className="card-k">Bậc của ngày</div>
              <DayBands altitude={result.altitude} band={gio ? band : undefined} />
            </div>
          )}
          <div className="more-part">
            <div className="card-k">Thành tích của bạn</div>
            <MyRecord s={stats()} krill={krillFound()} />
          </div>
        </details>

        <p className="beta-line">
          Bản chơi thử: chỗ nào khó hiểu?{' '}
          <button className="toast-link" onClick={() => { setFeedback(true); track('report', { kind: 'feedback_open' }); }}>Góp ý một câu</button>
        </p>

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
