import { describe, expect, it } from 'vitest';
import { BANK } from './bank.js';
import { Matcher, parseRaw } from './match.js';
import { norm } from './normalize.js';
import { altitudeFor, crossed, formatAlt, tierFromCounts, streakBonus } from './scoring.js';

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
  it('grows ten times every 65 points', () => {
    expect(altitudeFor(65)).toBeCloseTo(10);
    expect(altitudeFor(130)).toBeCloseTo(100);
    expect(altitudeFor(0)).toBe(0);
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
  it('caps the streak bonus', () => {
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(3)).toBe(10);
    expect(streakBonus(9)).toBe(20);
  });
});
