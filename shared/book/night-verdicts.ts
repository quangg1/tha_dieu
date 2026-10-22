// Written by the night shift: its verdicts on new answers players typed. The nightly cron applies the batch once
// (by its day) to the database. Each run replaces the whole object.

export interface NightVerdict {
  /** Question id. */
  q: string;
  /** The answer as stored (pending answers: its key; submissions: the input key). */
  key: string;
  valid: boolean;
  /** Proper Vietnamese name when valid; for a misspelling of a book answer, that answer's name. */
  canonical: string;
  /** One short Vietnamese sentence, shown to players when an answer is refused. */
  reason: string;
}

/** A second look at an answer the book learned from players, the referee or Wikidata: keep it, or take it out. */
export interface NightReview {
  q: string;
  /** The answer's key, as listed under `learned` in the queue. */
  key: string;
  keep: boolean;
  /** Why it goes, in one short Vietnamese sentence (shown to players who type it again). */
  reason: string;
}

export const NIGHT_VERDICTS: { day: string; pending: NightVerdict[]; submissions: NightVerdict[]; learned?: NightReview[] } = {
  day: '2026-10-22',
  pending: [],
  submissions: [
    { q: 'gia-vi', key: 'ximăng', valid: false, canonical: 'Xi măng', reason: 'Xi măng là vật liệu xây dựng, không phải gia vị.' },
    { q: 'loai-rau', key: 'bànphímmáytính', valid: false, canonical: 'Bàn phím máy tính', reason: 'Bàn phím máy tính là đồ điện tử, không phải rau.' },
    { q: 'dv-vn', key: 'gấuboo', valid: false, canonical: 'Gấu Boo', reason: '“Gấu Boo” là tên gọi vui trên mạng, không phải loài động vật hoang dã của Việt Nam.' },
    { q: 'dv-vn', key: 'gấuđỏ', valid: false, canonical: 'Gấu đỏ', reason: 'Không có loài gấu đỏ nào sống hoang dã ở Việt Nam.' },
    { q: 'pop-ngan-hang', key: 'mbb', valid: true, canonical: 'MB Bank', reason: 'MBB là mã cổ phiếu của Ngân hàng Quân đội (MB Bank).' },
    { q: 'pop-pokemon', key: 'gigagon', valid: false, canonical: 'Gigagon', reason: 'Không có Pokémon thế hệ đầu nào tên Gigagon.' },
    { q: 'pop-mua-sam-online', key: 'tiktok', valid: true, canonical: 'TikTok Shop', reason: 'TikTok Shop là sàn mua sắm trực tuyến ngay trong ứng dụng TikTok.' },
    { q: 'co-tich', key: 'mada', valid: false, canonical: 'Ma da', reason: 'Ma da là hồn ma trong tín ngưỡng dân gian, không phải tên một truyện cổ tích hay truyền thuyết.' },
    { q: 'pop-son-tung', key: 'chúngtakothuộcvềnhau', valid: true, canonical: 'Chúng Ta Không Thuộc Về Nhau', reason: 'Bài hát năm 2016 của Sơn Tùng M-TP.' },
    { q: 'kn-monhoc', key: 'chụphình', valid: false, canonical: 'Chụp hình', reason: 'Chụp hình không phải môn học trong chương trình phổ thông.' },
    { q: 'pop-mua-sam-online', key: 'stressmama', valid: false, canonical: 'Stressmama', reason: 'Không có ứng dụng hay trang mua sắm nào tên Stressmama.' },
  ],
  learned: [],
};
