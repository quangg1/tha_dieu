import { describe, expect, it } from 'vitest';
import { Matcher } from '../match.js';
import { soft } from '../normalize.js';
import { firstLetter, syllables } from './build.js';
import { struck } from './prune.js';
import { BOOK, BOOK_BY_ID, DROPPED } from './questions.js';

const match = (id: string, input: string) => {
  const q = BOOK_BY_ID.get(id)!;
  const m = new Matcher(q.strip, q.answers).match(input);
  return m ? { display: q.answers.find((a) => a.key === m.key)!.display, exact: m.exact } : null;
};

describe('village book', () => {
  it('has hundreds of questions with unique ids and keys', () => {
    expect(BOOK.length).toBeGreaterThan(250);
    expect(new Set(BOOK.map((q) => q.id)).size).toBe(BOOK.length);
    expect(DROPPED).toEqual([]);
    for (const q of BOOK) {
      expect(new Set(q.answers.map((a) => a.key)).size, q.id).toBe(q.answers.length);
      expect(q.answers.filter((a) => a.priorTier === 5).length, q.id).toBe(1);
      expect(q.answers.find((a) => a.priorTier === 5)!.key, q.id).toBe(q.krillKey);
      expect(q.answers.length, q.id).toBeGreaterThanOrEqual(8);
    }
  });

  it('strikes answers that do not fit their question, and remembers their names', () => {
    expect(match('x-bay', 'Chim cánh cụt')).toBeNull();
    expect(match('co-the', 'Nước mắt')).toBeNull();
    expect(struck('x-bay', 'chim cánh cụt')).toBe(true);
    expect(struck('x-bay', 'chim canh cut')).toBe(true);
    expect(struck('x-bay', 'Đại bàng')).toBe(false);
    expect(struck('x-bay', 'dai bang')).toBe(false);
    expect(struck('n-quan-ham', 'Chuẩn úy')).toBe(true);
    expect(struck('n-quan-ham', 'Đại úy')).toBe(false);
    expect(match('x-bay', 'Đại bàng')).not.toBeNull();
    expect(BOOK_BY_ID.get('dv-sung')!.answers.find((a) => a.key === BOOK_BY_ID.get('dv-sung')!.krillKey)!.display).not.toBe('Voi ma mút');
  });

  it('holds well over ten thousand answers', () => {
    expect(BOOK.reduce((s, q) => s + q.answers.length, 0)).toBeGreaterThan(10000);
  });

  it('tells answers apart by their tones', () => {
    expect(match('dv-1tieng', 'dê')).toEqual({ display: 'Dê', exact: true });
    expect(match('dv-1tieng', 'dế')).toEqual({ display: 'Dế', exact: true });
    expect(match('dv-1tieng', 'de')?.exact).toBe(false);
    expect(match('dv-1tieng', 'meo')).toEqual({ display: 'Mèo', exact: true });
  });

  it('drops classifier words and accepts other names', () => {
    expect(match('dv-thu', 'con hổ')?.display).toBe('Hổ');
    expect(match('tinh-thanh', 'tỉnh Lào Cai')?.display).toBe('Lào Cai');
    expect(match('qg-eu', 'Germany')?.display).toBe('Đức');
    expect(match('nn-laptrinh', 'C#')?.display).toBe('C♯');
    expect(match('nn-laptrinh', 'c++')?.display).toBe('C++');
  });

  it('applies word rules to Vietnamese names only', () => {
    expect(match('dv-chu-b', 'bee')).toBeNull();
    expect(match('dv-chu-b', 'bò')?.display).toBe('Bò');
    expect(match('qg-chu-b', 'Brazil')?.display).toBe('Brazil');
    expect(match('qg-chu-b', 'Bỉ')?.display).toBe('Bỉ');
    expect(match('qg-chu-c', 'China')).toBeNull();
    expect(firstLetter('Đức')).toBe('đ');
    expect(firstLetter('Ấn Độ')).toBe('a');
    expect(syllables('Lào')).toBe(1);
    expect(syllables('Peru')).toBeNull();
    expect(syllables('Bat')).toBeNull();
    expect(syllables('chim sẻ')).toBe(2);
  });

  it('folds place-named dishes into the dish', () => {
    expect(match('mon-an', 'bún chả Hà Nội')?.display).toBe('Bún chả');
  });

  it('builds number questions by rule', () => {
    expect(match('so-nguyen-to', '97')?.display).toBe('97');
    expect(match('so-nguyen-to', '91')).toBeNull();
    expect(match('so-nam-nhuan', '2100')).toBeNull();
    expect(match('so-nam-nhuan', '2000')).toBeNull();
    expect(match('so-nam-nhuan', '2024')?.display).toBe('2024');
  });

  it('keeps vague words out of the answers', () => {
    const q = BOOK_BY_ID.get('tv-nam')!;
    expect(q.answers.some((a) => a.key === soft('Nấm'))).toBe(false);
    expect(q.vague).toContain('nấm');
  });
});
