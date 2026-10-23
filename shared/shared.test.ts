import { describe, expect, it } from 'vitest';
import { BANK } from './bank.js';
import { Matcher, parseRaw } from './match.js';
import { norm } from './normalize.js';
import { GIO_FROM, GIO_MAX, MAX_GIO_POINTS, flightPoints, gioMultiplier, windAfter, MAX_ALT_EXPONENT, MAX_DAILY_POINTS, TIERS_BY_RANK, altitudeFor, bandFor, crossed, formatAlt, isRare, tierFromCounts, streakBonus } from './scoring.js';

const Q = Object.fromEntries(BANK.map((r) => [r.id, parseRaw(r)]));
const matcher = (id: string) => new Matcher(Q[id].strip, Q[id].answers);
const display = (id: string, input: string) => {
  const m = matcher(id).match(input);
  return m ? Q[id].answers.find((a) => a.key === m.key)!.display : null;
};

describe('normalize', () => {
  it('drops tones, đ and spacing', () => {
    expect(norm('Đàn Môi')).toBe('danmoi');
    expect(norm('  bánh   xèo! ')).toBe('banhxeo');
    expect(norm('Hồ Chí Minh')).toBe(norm('ho chi minh'));
  });
});

describe('bank', () => {
  it('has unique ids, five tiers and a hidden answer per question', () => {
    const ids = new Set(BANK.map((b) => b.id));
    expect(ids.size).toBe(BANK.length);
    for (const b of BANK) {
      expect(b.t.length, b.id).toBe(5);
      const q = Q[b.id];
      expect(q.answers.find((a) => a.key === q.krillKey)?.priorTier, b.id).toBe(5);
      expect(q.answers.filter((a) => a.priorTier === 5).length, b.id).toBe(1);
      for (let t = 0; t < 5; t++) expect(q.answers.some((a) => a.priorTier === t), `${b.id} tier ${t}`).toBe(true);
    }
  });
});

describe('matching', () => {
  it('accepts unaccented, aliased and prefixed input', () => {
    expect(display('mon-an', 'banh xeo')).toBe('Bánh xèo');
    expect(display('tinh-thanh', 'sai gon')).toBe('Hồ Chí Minh');
    expect(display('loai-hoa', 'xuyen chi')).toBe('Xuyến chi');
    expect(display('ngon-ngu', 'chăm')).toBe('Tiếng Chăm');
    expect(display('cay-go', 'đa')).toBe('Cây đa');
  });
  it('tolerates small typos on long words only', () => {
    expect(display('nha-khoa-hoc', 'einstien')).toBe('Albert Einstein');
    expect(display('trai-cay', 'cmm')).toBeNull();
    expect(display('loai-chim', 'chim lửa')).toBeNull();
  });
  it('reads brand names with or without their kind word', () => {
    const m = new Matcher([], [
      { key: 'tts', aliases: ['TikTok Shop'] },
      { key: 'mb', aliases: ['MB Bank', 'MB'] },
      { key: 'am', aliases: ['Apple Music'] },
      { key: 'atv', aliases: ['Apple TV+'] },
    ], true);
    expect(m.match('tiktok')).toEqual({ key: 'tts', exact: true });
    expect(m.match('ngân hàng MB')).toEqual({ key: 'mb', exact: true });
    expect(m.match('Apple')?.exact).toBe(false);
    const plain = new Matcher([], [{ key: 'hang', aliases: ['Hang Én'] }, { key: 'giao', aliases: ['Giao hàng'] }]);
    expect(plain.match('Én')).toBeNull();
    expect(plain.match('giao')).toBeNull();
  });
  it('does not offer a different name that only looks close once the tones are gone', () => {
    const m = new Matcher(['sông'], [{ key: 'songhong', aliases: ['Sông Hồng', 'Sông Cái', 'Hồng Hà'] }]);
    expect(m.match('Hoàng Hà')).toBeNull();
    expect(m.match('Hong Ha')?.key).toBe('songhong');
    expect(m.match('Sông Hồnng')?.key).toBe('songhong');
  });
  it('finds the hidden answer', () => {
    const m = matcher('nhac-cu').match('dan moi');
    expect(m?.key).toBe(Q['nhac-cu'].krillKey);
  });
});

describe('scoring', () => {
  it('uses the prior when nobody has played', () => {
    for (let t = 0; t < 5; t++) expect(tierFromCounts(t, 0, 0)).toBe(t);
  });
  it('lets crowd counts move an answer', () => {
    expect(tierFromCounts(4, 300, 1000)).toBe(0);
    expect(tierFromCounts(0, 1, 2000)).toBe(4);
  });
  it('grows ten times every 65 points on days before Nối gió', () => {
    const old = '2026-10-22';
    expect(altitudeFor(65, 'daily', old)).toBeCloseTo(10);
    expect(altitudeFor(130, 'daily', old)).toBeCloseTo(100);
    expect(altitudeFor(0, 'daily', old)).toBe(0);
  });
  it('flies Nối gió flights by the square root of the score', () => {
    // The first answers lift the kite visibly; a perfect day just passes the Moon.
    expect(altitudeFor(70, 'daily', GIO_FROM)).toBeGreaterThan(150);
    expect(altitudeFor(1000, 'daily', GIO_FROM)).toBeGreaterThan(100_000);
    expect(altitudeFor(MAX_GIO_POINTS, 'daily', GIO_FROM)).toBeGreaterThan(384_400_000);
    expect(altitudeFor(MAX_GIO_POINTS * 0.8, 'daily', GIO_FROM)).toBeLessThan(384_400_000);
    expect(altitudeFor(1_000_000)).toBe(altitudeFor(MAX_GIO_POINTS));
    expect(MAX_GIO_POINTS).toBe(4700);
  });
  it('raises the wind with rarer answers in a row and drops it on a common one', () => {
    // Thường, Rất hiếm, Cực hiếm, Khá hiếm (holds), miss (drops), Hiếm, Độc nhất.
    const f = flightPoints([0, 3, 4, 1, -1, 2, 5], GIO_FROM);
    expect(f.map((x) => x.wind)).toEqual([0, 2, 5, 5, 0, 1, 4]);
    expect(f.map((x) => x.points)).toEqual([10, 120, 270, 56, 0, 63, 400]);
    expect(windAfter(11, 5)).toBe(GIO_MAX);
    expect(gioMultiplier(GIO_MAX)).toBe(4);
    // Before the switch, the same flight scores the old way.
    expect(flightPoints([2, 2, 2], '2026-10-01').map((x) => x.points)).toEqual([45, 50, 55]);
  });
  it('stays finite and bounded whatever score it is given', () => {
    expect(altitudeFor(NaN)).toBe(0);
    expect(altitudeFor(Infinity)).toBe(0);
    // A daily score past the most a day can give (a bad stored turn) cannot fly higher than that maximum.
    expect(altitudeFor(1_000_000, 'daily', '2026-10-01')).toBe(altitudeFor(MAX_DAILY_POINTS, 'daily', '2026-10-01'));
    // A very long night keeps lapping the sky but never overflows to Infinity.
    expect(Number.isFinite(altitudeFor(20_000, 'night'))).toBe(true);
    expect(altitudeFor(20_000, 'night')).toBe(Math.pow(10, MAX_ALT_EXPONENT));
  });
  it('formats Vietnamese units', () => {
    expect(formatAlt(1280)).toBe('1.280 m');
    expect(formatAlt(412300000)).toBe('412.300 km');
    expect(formatAlt(2.25e11)).toBe('225 triệu km');
    expect(formatAlt(38000)).toBe('38 km');
  });
  it('reports milestones crossed', () => {
    expect(crossed(900, 12000)?.name).toBe('Máy bay chở khách');
    expect(crossed(12000, 13000)).toBeNull();
  });
  it('orders tiers by rarity with Khôn lỏi second', () => {
    expect(TIERS_BY_RANK.map((t) => t.name)).toEqual(['Thường', 'Khôn lỏi', 'Khá hiếm', 'Hiếm', 'Rất hiếm', 'Cực hiếm', 'Độc nhất']);
    expect(isRare(6)).toBe(false);
    expect(isRare(2)).toBe(true);
  });
  it('titles the day by how high the kite flew', () => {
    expect(bandFor(0).verdict).toMatch(/^Tà tà/);
    expect(bandFor(altitudeFor(300, 'daily', '2026-10-01')).verdict).toMatch(/^Bay bổng/);
    expect(bandFor(altitudeFor(700, 'daily', '2026-10-01')).verdict).toMatch(/^Cung Trăng/);
    expect(bandFor(4e8).verdict).toMatch(/^Cung Trăng/);
  });
  it('caps the streak bonus', () => {
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(3)).toBe(10);
    expect(streakBonus(9)).toBe(20);
  });
});

describe('laps of the sky', () => {
  it('wraps past the edge of the universe and names the lap', async () => {
    const { lapOf, formatAlt, crossed, CEILING_L, altitudeFor } = await import('./scoring.js');
    const lap2 = Math.pow(10, CEILING_L + 3);
    expect(lapOf(lap2).lap).toBe(2);
    expect(Math.round(lapOf(lap2).inner)).toBe(1000);
    expect(formatAlt(lap2)).toBe('Vòng 2 · 1.000 m');
    expect(crossed(Math.pow(10, CEILING_L - 1), lap2)?.name).toBe('Vòng 2');
    expect(lapOf(altitudeFor(800, 'night')).lap).toBe(2);
    expect(lapOf(altitudeFor(820, 'daily')).lap).toBe(1);
  });
});

import { boardName, rudeName } from './names.js';

describe('board names', () => {
  it('refuses rude names, with or without tones, and keeps innocent ones', () => {
    for (const bad of ['đồ ngu', 'Đm mày', 'dit me', 'con cac', 'F u c k', 'vcl luôn', 'óc chó']) expect(rudeName(bad), bad).toBe(true);
    for (const ok of ['Nguyễn Văn An', 'Đeo kính', 'Các bạn ơi', 'Cặp đôi', 'Lan Chi', 'Bé Bi', 'Hoàng Anh Tuấn']) expect(rudeName(ok), ok).toBe(false);
    expect(boardName('  Bé   Bi  ')).toBe('Bé Bi');
    expect(boardName('đồ ngu')).toBeNull();
  });
});

describe('chat shorthand', () => {
  it('reads "ko", "k" and "đc" as the words they stand for', () => {
    const m = new Matcher(['bai'], [
      { key: 'ctktvn', aliases: ['Chúng Ta Không Thuộc Về Nhau'], priorTier: 3 },
      { key: 'vk', aliases: ['Vitamin K'], priorTier: 2 },
    ]);
    expect(m.match('chúng ta ko thuộc về nhau')?.key).toBe('ctktvn');
    expect(m.match('Chúng ta k thuộc về nhau')?.exact).toBe(true);
    expect(m.match('Vitamin K')?.key).toBe('vk');
  });
});

describe('trailing filler words', () => {
  const m = new Matcher(['bai'], [
    { key: 'dvt', aliases: ['Đừng Về Trễ'], priorTier: 4 },
    { key: 'lt', aliases: ['Lạc Trôi'], priorTier: 0 },
    { key: 'cnd', aliases: ['Chạy Ngay Đi'], priorTier: 1 },
    { key: 'ctktvn', aliases: ['Chúng Ta Không Thuộc Về Nhau'], priorTier: 2 },
  ]);
  it('reads an answer with a sentence-final filler tacked on ("nha", "nhé")', () => {
    expect(m.match('đừng về trễ nha')).toEqual({ key: 'dvt', exact: true });
    expect(m.match('lạc trôi nhé')).toEqual({ key: 'lt', exact: true });
  });
  it('does not cut a word that is really the end of the title', () => {
    expect(m.match('Chạy Ngay Đi')).toEqual({ key: 'cnd', exact: true });
    expect(m.match('chạy ngay đi')?.key).toBe('cnd');
    expect(m.match('chúng ta không thuộc về nhau')?.key).toBe('ctktvn');
  });
});

describe('day band by rank, titles', async () => {
  const { dayBand } = await import('./scoring.js');
  const { titleAt, titlesBetween, TITLES } = await import('./titles.js');
  it('places a Nối gió day by rank in the village, with points standing in for a small village', () => {
    const d = GIO_FROM;
    expect(dayBand({ altitude: 0, score: 900, rank: 2, players: 400, day: d })).toBe(5);
    expect(dayBand({ altitude: 0, score: 900, rank: 4, players: 400, day: d })).toBe(5);
    expect(dayBand({ altitude: 0, score: 900, rank: 30, players: 400, day: d })).toBe(4);
    expect(dayBand({ altitude: 0, score: 300, rank: 200, players: 400, day: d })).toBe(2);
    expect(dayBand({ altitude: 0, score: 50, rank: 390, players: 400, day: d })).toBe(0);
    expect(dayBand({ altitude: 0, score: 750, rank: 1, players: 5, day: d })).toBe(3);
    expect(dayBand({ altitude: 0, score: 0, rank: 1, players: 1, day: d })).toBe(0);
  });
  it('adds daily points up to a title that only moves forward', () => {
    expect(titleAt(0).here.name).toBe(TITLES[0].name);
    const j = titleAt(9_500);
    expect(j.here.name).toBe('Bậc thầy gió');
    expect(j.left).toBe(12_500 - 9_500);
    expect(titlesBetween(80, 650).map((s) => s.name)).toEqual(['Tập thả', 'Biết đón gió', 'Thả có nghề']);
    expect(titleAt(1e9).next).toBeNull();
  });
});
