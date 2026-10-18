import { useEffect, useState, type ReactNode } from 'react';
import { DAY_BANDS, TIERS, TIERS_BY_RANK, bandFor, formatAlt } from '../../shared/scoring.js';
import { flute } from '../audio/flute';
import { api, type Reveal, type Support } from '../api';
import { TierIcon } from '../icons';
import { LAYOUTS, type SkyScene } from '../scene/sky';
import { challengeLink, readChallenge } from '../shareCard';
import { bankName, vietQr } from '../../shared/banks.js';
import { THEME_ART } from '../themeArt';
import { challengeBanner, seedOf, tauntLine } from '../quips';
import { CheckIcon, CloseIcon, KiteIcon, LetterIcon } from '../glyphs';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { RemindSheet } from '../components/RemindSheet';
import { BagSheet } from '../components/BagSheet';

import { track } from '../track';
import { buzz } from '../haptics';
import { account, addToAlbum, msToNextDay, playerId, prefs, stats, today, vnDay } from '../store';
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
  { id: 'tet', name: 'Tết', tag: 'Ra mắt dịp Tết', desc: 'Mỗi đáp án làm cây mai nhà bé Bi nở thêm hoa. Càng hiếm, hoa nở càng rộ, kèm lì xì, bánh chưng và pháo hoa đêm giao thừa.', measure: 'Thước đo: lộc xuân, số hoa nở' },
  { id: 'hoadang', name: 'Hoa Đăng', tag: 'Đêm rằm Hội An', desc: 'Thả đèn trên sông Hoài đêm rằm. Đáp án càng hiếm, đèn trôi càng xa: qua Chùa Cầu, ra Cửa Đại, tới biển Đông.', measure: 'Thước đo: mét sông trôi' },
  { id: 'lanbien', name: 'Lặn Biển', tag: 'Xuống đáy đại dương', desc: 'Lặn từ rạn san hô Nha Trang xuống vùng biển tối nơi cá tự phát sáng, rồi tới đáy vực sâu 11 km.', measure: 'Thước đo: mét độ sâu' },
  { id: 'amnhac', name: 'Âm Nhạc', tag: 'Đại nhạc hội', desc: 'Mỗi đáp án là một nốt nhạc. Càng hiếm, nốt bay càng cao và khán phòng càng đông, từ sân khấu làng tới đại nhạc hội.', measure: 'Thước đo: khán giả cổ vũ' },
];

/** Lunar New Year 2027 (6 February), for the Tết pack's countdown. */
const TET_2027 = Date.UTC(2027, 1, 6) - 7 * 3600_000;
const daysToTet = () => Math.max(0, Math.ceil((TET_2027 - Date.now()) / 86400_000));

/** Packs this player asked to hear about (kept on the device; the wish is also counted). */
function readWants(): string[] {
  try {
    return JSON.parse(localStorage.getItem('thadieu.themeWants') || '[]');
  } catch {
    return [];
  }
}

export default function Home({ sky, soundButton, onPlay, onReview, onAccount }: { sky: SkyScene; soundButton: ReactNode; onPlay: (m: 'daily' | 'night') => void; onReview: (s: Summary) => void; onAccount: () => void }) {
  const [howto, setHowto] = useState(false);
  const [bag, setBag] = useState(false);
  const [menu, setMenu] = useState(false);
  const [themes, setThemes] = useState(false);
  const [wants, setWants] = useState<string[]>(readWants);
  const want = (id: string) => {
    if (wants.includes(id)) return;
    const next = [...wants, id];
    setWants(next);
    try {
      localStorage.setItem('thadieu.themeWants', JSON.stringify(next));
    } catch {
      /* private mode: the wish still counts */
    }
    track('theme_want', { id });
  };
  const [invited, setInvited] = useState('');
  const [sheet, setSheet] = useState<'feedback' | 'support' | 'remind' | null>(null);
  const [support, setSupport] = useState<Support | null>(null);

  useEffect(() => {
    api.support().then(setSupport).catch(() => {});
  }, []);
  // Answers this player typed that the book did not know then, and has learned since.
  const [learned, setLearned] = useState<{ questionId: string; prompt: string; typed: string; answer: string; points?: number }[]>([]);
  useEffect(() => {
    if (!stats().best && !stats().nightBest) return;
    api.notices(playerId()).then((r) => setLearned(r.learned)).catch(() => {});
  }, []);
  // Yesterday's hidden answers open after midnight: into the collection, and once on the home screen.
  const [yday, setYday] = useState<{ day: string; reveal: Reveal[] } | null>(null);
  useEffect(() => {
    if (!stats().best) return;
    api
      .yesterday(playerId())
      .then((r) => {
        if (!r.reveal.length) return;
        const played = r.reveal.some((x) => x.mine || x.tier >= 0);
        if (played) addToAlbum(r.day, r.reveal);
        if (played && prefs.ydaySeen !== r.day) setYday(r);
      })
      .catch(() => {});
  }, []);
  const closeYday = () => {
    if (yday) prefs.ydaySeen = yday.day;
    setYday(null);
  };
  // Bé Bi stands in the painted scene; an invisible button over him lets a tap set him moving.
  const [kid, setKid] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useEffect(() => {
    const read = () => {
      const r = sky.kidRect();
      setKid((k) => (r.w > 0 && (!k || Math.abs(k.x - r.x) + Math.abs(k.y - r.y) + Math.abs(k.w - r.w) > 1) ? r : k));
    };
    read();
    const id = window.setInterval(read, 400);
    return () => window.clearInterval(id);
  }, [sky]);
  const pokeKid = () => {
    if (sky.poke()) {
      buzz(12);
      track('poke');
    }
  };
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
        <span />
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

      {learned.length > 0 && (
        <div className="challenge learned">
          <span className="challenge-k">Sổ của làng vừa học thêm</span>
          {learned.slice(0, 3).map((l) => (
            <p key={l.questionId + l.typed}>
              Bạn từng gõ <b>“{l.typed}”</b> cho câu “{l.prompt}”. Ca đêm đã ghi vào sổ{l.answer.toLowerCase() !== l.typed.toLowerCase() ? <> là <b>{l.answer}</b></> : ''}
              {l.points ? <>, và cộng bù <b>+{l.points} điểm</b> vào chuyến bay hôm đó.</> : ', lần sau gõ là được điểm!'}
            </p>
          ))}
          <button className="toast-link" onClick={() => setLearned([])}>Đã hiểu</button>
        </div>
      )}

      {yday && (
        <div className="challenge yday">
          <span className="challenge-k">Đáp án độc nhất hôm qua</span>
          {yday.reveal.map((r) => (
            <p key={r.questionId} className="yday-row">
              <span>{r.prompt}</span> <b>{r.krill}</b>
              {r.tier === 5 && <em className="rv-found"> bạn tìm ra!</em>}
            </p>
          ))}
          <button className="toast-link" onClick={closeYday}>Đã xem</button>
        </div>
      )}

      <div className="home-hero">
        <span className="home-kicker">Đố chữ mỗi ngày</span>
        <span className="beta-tag">Bản chơi thử</span>
        <h1 className="home-title" aria-label="Bilion">
          <span aria-hidden="true">Bilion</span>
        </h1>
        <p className="home-sub">cùng bé <b>Bi</b> thả diều</p>
        <p className="home-tag">Đáp án càng hiếm, diều càng bay cao.</p>
      </div>

      {kid && (
        <button
          className="kid-poke"
          style={{ left: kid.x, top: kid.y, width: kid.w, height: kid.h }}
          onClick={pokeKid}
          aria-label="Chọc bé Bi"
        />
      )}

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
            <p className="home-line">7 câu hỏi, mỗi câu 25 giây gió và một lần trả lời</p>
            <button className="next-btn" onClick={() => go('daily')}>
              Thả diều <KiteIcon />
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
            <LetterIcon /> {invited || 'Thách bạn bè bay cao hơn'}
          </button>
        )}

        <button className="mine-btn" onClick={onAccount}>
          <span>Bilion của tôi</span>
          <small>{account() ? 'Đã đồng bộ' : 'Chuỗi ngày, bộ sưu tập'}</small>
          <span className="mine-arrow" aria-hidden="true">›</span>
        </button>
      </section>

      {menu && (
        <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="Menu" onClick={() => setMenu(false)}>
          <nav className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <b><span className="logo-bi-s">Bi</span>lion</b>
              <button className="sheet-x" onClick={() => setMenu(false)} aria-label="Đóng menu"><CloseIcon /></button>
            </div>
            {(
              [
                ['Thả vô tận', 'Câu hỏi nối tiếp, chơi tới khi hết gió', () => go('night')],
                ['Gói chủ đề', 'Tết, Hoa Đăng, Lặn Biển, Âm Nhạc', () => { setThemes(true); track('themes'); }, 'Sắp có'],
                ['Bilion của tôi', account() ? `Đã đăng nhập${account()!.name ? ': ' + account()!.name : ''}` : 'Đăng nhập Google, giữ lịch sử trên mọi máy', () => onAccount()],
                ['Bộ sưu tập', 'Diều đã mở khóa và đáp án độc nhất', () => { setBag(true); track('bag'); }],
                ['Cách chơi', 'Luật chơi và cách tính điểm', () => { setHowto(true); track('howto'); }],
                ['Nhắc chơi mỗi ngày', 'Thêm lời nhắc vào lịch của bạn', () => { setSheet('remind'); track('remind_open'); }],
                ['Góp ý', 'Báo lỗi, đề xuất câu hỏi', () => setSheet('feedback')],
                ...(canSupport ? [['Ủng hộ tác giả', 'Chuyển khoản hoặc MoMo', () => { setSheet('support'); track('support'); }]] : []),
                ['Quyền riêng tư', 'Bilion lưu gì về bạn', () => { location.href = '/rieng-tu.html'; }],
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
              <button className="sheet-x" onClick={() => setThemes(false)} aria-label="Đóng"><CloseIcon /></button>
            </div>
            <p className="sup-note">Cùng một câu đố, những bầu trời mới. Luật chơi giữ nguyên, mỗi gói đổi khung cảnh, nhạc nền và thước đo của chuyến đi.</p>
            <div className="themes">
              {THEMES.map((t, i) => (
                <div key={t.id} className={`theme-card${i === 0 ? ' featured' : ''}`} data-pack={t.id}>
                  <div className="theme-art" dangerouslySetInnerHTML={{ __html: THEME_ART[t.id] }} />
                  <span className="theme-lock">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                    {t.id === 'tet' ? `Còn ${daysToTet()} ngày` : 'Sắp ra mắt'}
                  </span>
                  <div className="theme-body">
                    <span className="theme-tag">{t.tag}</span>
                    <b>{t.name}</b>
                    <p>{t.desc}</p>
                    <div className="theme-foot">
                      <small>{t.measure}</small>
                      <button className={`theme-want${wants.includes(t.id) ? ' on' : ''}`} onClick={() => want(t.id)} disabled={wants.includes(t.id)}>
                        {wants.includes(t.id) ? <><CheckIcon /> Sẽ báo bạn</> : 'Muốn chơi gói này'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {bag && <BagSheet sky={sky} onClose={() => setBag(false)} />}

      {sheet === 'feedback' && <FeedbackSheet onClose={() => setSheet(null)} />}
      {sheet === 'remind' && <RemindSheet onClose={() => setSheet(null)} />}

      {sheet === 'support' && support && (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Ủng hộ tác giả" onClick={() => setSheet(null)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Ủng hộ tác giả</h2>
              <button className="sheet-x" onClick={() => setSheet(null)} aria-label="Đóng"><CloseIcon /></button>
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
                <CloseIcon />
              </button>
            </div>
            <ol className="rules">
              <li>Mỗi câu hỏi, bạn chỉ được <b>thả một đáp án</b>. Không có đúng sai, chỉ có đáp án hợp lệ và đáp án hiếm.</li>
              <li>Đáp án <b>càng ít người nghĩ tới</b> càng nhiều điểm. Độ hiếm của từng đáp án được ghi sẵn trong sổ của làng và chỉnh dần theo những ngày trước, nên <b>điểm hiện ra là điểm chốt</b>, chơi sớm hay muộn cũng như nhau.</li>
              <li>Gõ thiếu dấu hay nhầm chính tả? Diều hỏi lại để bạn chốt. Câu chung chung như “chim” sẽ được nhắc kể cụ thể hơn. Đáp án chưa có trong sổ? <b>Thử đáp án khác</b>, không bị trừ gì. Bé Bi ghi lại cho ca đêm xem; nếu đúng, sổ học thêm và lần sau bạn ghé sẽ được báo.</li>
              <li>Mỗi câu có <b>một đáp án làng giấu</b>, tìm ra là độc nhất. Nhưng coi chừng: đáp án tưởng độc mà cả làng cùng nghĩ chỉ được hạng <b>Khôn lỏi</b>.</li>
              <li>Điểm càng cao, diều càng lên xa: qua ngọn tre, tầng mây, Cung Trăng, rồi tới những vì sao.</li>
              <li><b>Thả vô tận</b>: câu hỏi ngẫu nhiên nối tiếp nhau, chơi tới khi hết gió. Cả lượt dùng <b>chung một đồng hồ gió</b>: bắt đầu 45 giây, gió còn lại chuyển sang câu sau. Mỗi đáp án nạp thêm gió (Thường +3 giây, càng hiếm càng nhiều, Độc nhất +14 giây), nên trả lời nhanh và hiếm thì bay mãi. Vượt qua rìa vũ trụ, diều chui qua lỗ giun sang <b>vòng 2</b> (trời hoàng hôn) rồi <b>vòng 3</b> (đêm hội), mở khóa diều phượng hoàng và diều rồng.</li>
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
