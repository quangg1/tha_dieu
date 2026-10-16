import { useEffect, useState, type ReactNode } from 'react';
import { DAY_BANDS, MILESTONES, TIERS, TIERS_BY_RANK, bandFor, formatAlt } from '../../shared/scoring.js';
import { flute } from '../audio/flute';
import { api, type Support } from '../api';
import { TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { challengeLink, readChallenge } from '../shareCard';
import { bankName, vietQr } from '../../shared/banks.js';
import { THEME_ART } from '../themeArt';
import { challengeBanner, seedOf, tauntLine } from '../quips';
import { SKINS, needLabel, skinById, unlocked } from '../skins';
import { previewSvg } from '../kites';
import { FeedbackSheet } from '../components/FeedbackSheet';

/** Pictures of every kite for the collection, built once. */
const KITE_PICS: Record<string, string> = Object.fromEntries(SKINS.map((k) => [k.id, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(previewSvg(k.id))]));
import { track } from '../track';
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

/** Theme packs shown as a locked preview until they launch. */
const THEMES = [
  { id: 'hoadang', name: 'Hoa Đăng', bg: '#1b1530', color: '#ffcf6b', desc: 'Thả đèn trên sông Hoài đêm rằm. Đáp án càng hiếm, đèn trôi càng xa: qua Chùa Cầu, ra Cửa Đại, tới biển Đông.', measure: 'Thước đo: mét sông trôi' },
  { id: 'lanbien', name: 'Lặn Biển', bg: '#071a2c', color: '#7fdcff', desc: 'Lặn từ rạn san hô Nha Trang xuống vùng biển tối nơi cá tự phát sáng, rồi tới đáy vực sâu 11 km.', measure: 'Thước đo: mét độ sâu' },
  { id: 'amnhac', name: 'Âm Nhạc', bg: '#1e1036', color: '#c9a8ff', desc: 'Mỗi đáp án là một nốt nhạc. Càng hiếm, nốt bay càng cao và khán phòng càng đông, từ sân khấu làng tới đại nhạc hội.', measure: 'Thước đo: khán giả cổ vũ' },
];

export default function Home({ sky, soundButton, onPlay, onReview }: { sky: SkyScene; soundButton: ReactNode; onPlay: (m: 'daily' | 'night') => void; onReview: (s: Summary) => void }) {
  const [howto, setHowto] = useState(false);
  const [bag, setBag] = useState(false);
  const [menu, setMenu] = useState(false);
  const [themes, setThemes] = useState(false);
  const [skin, setSkin] = useState(prefs.skin);
  const [invited, setInvited] = useState('');
  const [sheet, setSheet] = useState<'feedback' | 'support' | null>(null);
  const [support, setSupport] = useState<Support | null>(null);

  useEffect(() => {
    api.support().then(setSupport).catch(() => {});
  }, []);
  const canSupport = !!support && !!(support.momo || support.qr || support.card || support.account);
  const [copied, setCopied] = useState(false);
  const [payTab, setPayTab] = useState<'bank' | 'qr'>('bank');


  const st = stats();
  const rec = today();
  const done = rec && rec.day === vnDay() && rec.result ? rec : null;
  const countdown = useCountdown();
  const d = new Date(Date.now() + 7 * 3600_000);

  useEffect(() => {
    // Phones: the flyer stands just above the card and the kite sits clear of the title.
    const fit = () => {
      const card = document.querySelector('.home-card');
      const narrow = window.innerWidth < 600;
      sky.setLayout(narrow && card ? { ...LAYOUTS.home, kiteX: 0.84, kiteY: 0.39, kiteSize: 0.18, flyerX: 0.6, stand: Math.round(card.getBoundingClientRect().top) } : LAYOUTS.home);
    };
    fit();
    window.addEventListener('resize', fit);
    sky.setAltitude(0, false);
    sky.setFlutes(2);
    sky.setNervous(false);
    flute.setLevel(1);
    return () => window.removeEventListener('resize', fit);
  }, [sky]);

  useEffect(() => {
    track('open', { challenge: !!CHALLENGE, returning: stats().best > 0 });
    if (CHALLENGE) track('challenge_open', { a: CHALLENGE.a });
  }, []);

  /** Challenges friends with today's height, once today's flight is done. */
  const invite = async () => {
    const r = done?.result;
    if (!r) return;
    const title = bandFor(r.score).verdict.split('. ')[0];
    const url = challengeLink(location.origin, { n: prefs.name || 'Một người bạn', a: r.altitude, d: done!.day, t: title });
    const text = `🪁 ${tauntLine(DAY_BANDS.indexOf(bandFor(r.score)), r.altitude, seedOf(done!.day, r.score))}`;
    track('challenge', { from: 'home' });
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setInvited('Đã chép lời mời, dán vào Zalo hay Messenger nhé!');
    } catch {
      setInvited('');
      return;
    }
    setTimeout(() => setInvited(''), 3000);
  };

  const go = (m: 'daily' | 'night') => {
    flute.unlock();
    flute.start();
    flute.rise();
    onPlay(m);
  };

  return (
    <main className="stage home">
      <div className="home-top">
        <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Mở menu" aria-haspopup="dialog">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <div className="home-stats">
          {st.best > 0 && <span className="stat-chip">Cao nhất <b>{formatAlt(st.best)}</b></span>}
          {st.streak > 0 && <span className="stat-chip">Chuỗi <b>{st.streak} ngày</b></span>}
          {st.nightBest > 0 && <span className="stat-chip">Thả vô tận <b>{formatAlt(st.nightBest)}</b></span>}
        </div>
        <span className="hud-sound">{soundButton}</span>
      </div>

      {CHALLENGE && (
        <div className="challenge">
          <span className="challenge-k">Lời thách đấu</span>
          <p>
            <b>{CHALLENGE.n}</b> đã thả diều tới <b>{formatAlt(CHALLENGE.a)}</b>
            {CHALLENGE.t ? ` (${CHALLENGE.t})` : ''}
            {CHALLENGE.d === vnDay() ? ` hôm nay và ${challengeBanner(seedOf(CHALLENGE.n, CHALLENGE.a))}` : ` ngày ${CHALLENGE.d.slice(8, 10)}/${CHALLENGE.d.slice(5, 7)}. Thử sức với chuyến bay hôm nay nhé!`}
          </p>
        </div>
      )}

      <div className="home-hero">
        <span className="home-kicker">Đố chữ mỗi ngày</span>
        <span className="beta-tag">Bản chơi thử</span>
        <h1 className="home-title" aria-label="Bilion">
          <span className="logo-bi" aria-hidden="true">
            B<span className="logo-i">ı<svg className="logo-hat" viewBox="0 0 40 18" aria-hidden="true"><path d="M2 15 L20 2 L38 15 Q20 19 2 15 Z" fill="#f3d98f" stroke="#3a2a22" strokeWidth="2.4" strokeLinejoin="round" /><path d="M20 2 L13 16 M20 2 L27 16" stroke="#d6b260" strokeWidth="1.4" /></svg></span>
          </span>
          <span aria-hidden="true">lion</span>
        </h1>
        <p className="home-sub">cùng bé <b>Bi</b> · gói <b>Thả Diều</b></p>
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
            Thả vô tận
          </button>
          <button className="pill-btn ghost" onClick={() => { setHowto(true); track('howto'); }} aria-haspopup="dialog">
            Cách chơi
          </button>
        </div>
        {done && (
          <button className="invite-btn" onClick={invite}>
            <span aria-hidden="true">✉</span> {invited || 'Thách bạn bè bay cao hơn'}
          </button>
        )}
        <button className="bag-btn" onClick={() => { setBag(true); track('bag'); }} aria-haspopup="dialog">
          <span>Bộ sưu tập</span>
          <b>
            {SKINS.filter((x) => unlocked(x, { best: Math.max(st.best, st.nightBest), krill: krillFound(), streak: st.streak })).length}/{SKINS.length} diều · {krillFound()} đáp án độc nhất
          </b>
        </button>
        <div className="home-foot">
          <button className="link-btn" onClick={() => setSheet('feedback')} aria-haspopup="dialog">Góp ý</button>
          {canSupport && (
            <>
              <span aria-hidden="true">·</span>
              <button className="link-btn" onClick={() => { setSheet('support'); track('support'); }} aria-haspopup="dialog">Ủng hộ tác giả</button>
            </>
          )}
        </div>
      </section>

      {menu && (
        <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="Menu" onClick={() => setMenu(false)}>
          <nav className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <b><span className="logo-bi-s">Bi</span>lion</b>
              <button className="sheet-x" onClick={() => setMenu(false)} aria-label="Đóng menu">✕</button>
            </div>
            {(
              [
                ['Thả vô tận', 'Câu hỏi nối tiếp, chơi tới khi hết gió', () => go('night')],
                ['Gói chủ đề', 'Hoa Đăng, Lặn Biển, Âm Nhạc', () => { setThemes(true); track('themes'); }, 'Sắp có'],
                ['Bộ sưu tập', 'Diều đã mở khóa và đáp án độc nhất', () => { setBag(true); track('bag'); }],
                ['Cách chơi', 'Luật chơi và cách tính điểm', () => { setHowto(true); track('howto'); }],
                ['Góp ý', 'Báo lỗi, đề xuất câu hỏi', () => setSheet('feedback')],
                ...(canSupport ? [['Ủng hộ tác giả', 'Chuyển khoản hoặc MoMo', () => { setSheet('support'); track('support'); }]] : []),
              ] as [string, string, () => void, string?][]
            ).map(([label, sub, act, tag]) => (
              <button key={label} className="drawer-item" onClick={() => { setMenu(false); act(); }}>
                <span>
                  <b>{label}</b>
                  <small>{sub}</small>
                </span>
                {tag ? <em className="drawer-tag">{tag}</em> : <span className="drawer-arrow" aria-hidden="true">›</span>}
              </button>
            ))}
          </nav>
        </div>
      )}

      {themes && (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Gói chủ đề" onClick={() => setThemes(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Gói chủ đề</h2>
              <button className="sheet-x" onClick={() => setThemes(false)} aria-label="Đóng">✕</button>
            </div>
            <p className="sup-note">Cùng một câu đố, những bầu trời mới. Luật chơi giữ nguyên, mỗi gói đổi khung cảnh, nhạc nền và thước đo của chuyến đi.</p>
            <div className="themes">
              {THEMES.map((t) => (
                <div key={t.id} className="theme-card" style={{ background: t.bg }}>
                  <div className="theme-art" dangerouslySetInnerHTML={{ __html: THEME_ART[t.id] }} />
                  <span className="theme-lock">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                    Sắp ra mắt
                  </span>
                  <div className="theme-body">
                    <b style={{ color: t.color }}>{t.name}</b>
                    <p>{t.desc}</p>
                    <small>{t.measure}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

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
                    <span className="skin-art" aria-hidden="true">
                      <img src={KITE_PICS[k.id]} alt="" />
                      {!open && <i className="skin-lock">🔒</i>}
                    </span>
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

      {sheet === 'feedback' && <FeedbackSheet onClose={() => setSheet(null)} />}

      {sheet === 'support' && support && (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Ủng hộ tác giả" onClick={() => setSheet(null)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Ủng hộ tác giả</h2>
              <button className="sheet-x" onClick={() => setSheet(null)} aria-label="Đóng">✕</button>
            </div>
            <p className="sup-note">{support.note || 'Bilion miễn phí và không quảng cáo. Nếu bạn thích trò này, một chút ủng hộ giúp làng có thêm câu hỏi và bầu trời mới.'}</p>
            <div className="sup-opts">
              {support.account && support.bank && support.qr && (
                <div className="sup-tabs" role="tablist" aria-label="Cách ủng hộ">
                  <button role="tab" aria-selected={payTab === 'bank'} className={payTab === 'bank' ? 'on' : ''} onClick={() => setPayTab('bank')}>Ngân hàng</button>
                  <button role="tab" aria-selected={payTab === 'qr'} className={payTab === 'qr' ? 'on' : ''} onClick={() => setPayTab('qr')}>MoMo / ví</button>
                </div>
              )}
              {support.account && support.bank && (payTab === 'bank' || !support.qr) && (
                <div className="sup-bank">
                  <img className="sup-qr" src={vietQr(support.bank, support.account, support.holder)} alt={`Mã VietQR chuyển khoản ${bankName(support.bank)}`} />
                  <span className="sup-bname">{bankName(support.bank)}</span>
                  <b className="sup-acc">{support.account}</b>
                  {support.holder && <span className="sup-holder">{support.holder}</span>}
                  <button
                    className="pill-btn ghost sup-copy"
                    onClick={() => {
                      navigator.clipboard?.writeText(support.account).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
                      track('support', { via: 'bank' });
                    }}
                  >
                    {copied ? 'Đã chép số tài khoản' : 'Chép số tài khoản'}
                  </button>
                </div>
              )}
              {support.qr && (payTab === 'qr' || !(support.account && support.bank)) && <img className="sup-qr sup-qr-own" src={support.qr} alt="Mã QR để ủng hộ qua ví điện tử" />}
              {support.momo && (
                <a className="next-btn sup-momo" href={support.momo} target="_blank" rel="noopener noreferrer" onClick={() => track('support', { via: 'momo' })}>
                  Ủng hộ qua MoMo
                </a>
              )}
              {support.card && (
                <a className="pill-btn sup-card" href={support.card} target="_blank" rel="noopener noreferrer" onClick={() => track('support', { via: 'card' })}>
                  Ủng hộ bằng thẻ
                </a>
              )}
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
              <li>Mỗi câu hỏi, bạn chỉ được <b>thả một đáp án</b>. Không có đúng sai, chỉ có đáp án hợp lệ và đáp án hiếm.</li>
              <li>Đáp án <b>càng ít người nghĩ tới</b> càng nhiều điểm. Độ hiếm tính theo câu trả lời của mọi người chơi trong ngày, và chốt lúc nửa đêm.</li>
              <li>Gõ thiếu dấu hay nhầm chính tả? Diều hỏi lại để bạn chốt. Câu chung chung như “chim” sẽ được nhắc kể cụ thể hơn. Làng chưa biết đáp án của bạn thì bạn được trả lời lại khi gió còn.</li>
              <li>Mỗi câu có <b>một đáp án làng giấu</b>, tìm ra là độc nhất. Nhưng coi chừng: đáp án tưởng độc mà cả làng cùng nghĩ chỉ được hạng <b>Khôn lỏi</b>.</li>
              <li>Điểm càng cao, diều càng lên xa: qua ngọn tre, tầng mây, Cung Trăng, rồi tới những vì sao.</li>
              <li><b>Thả vô tận</b>: câu hỏi ngẫu nhiên nối tiếp nhau, chơi tới khi hết gió. Cả lượt dùng <b>chung một đồng hồ gió</b>: bắt đầu 45 giây, gió còn lại chuyển sang câu sau. Mỗi đáp án nạp thêm gió (Thường +3 giây, càng hiếm càng nhiều, Độc nhất +14 giây), nên trả lời nhanh và hiếm thì bay mãi. Vượt qua rìa vũ trụ, diều chui qua lỗ giun sang <b>vòng 2</b> (trời hoàng hôn) rồi <b>vòng 3</b> (đêm hội), mở khóa diều phượng hoàng và diều rồng ngọc.</li>
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
