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

export const NIGHT_VERDICTS: { day: string; pending: NightVerdict[]; submissions: NightVerdict[] } = {
  day: '2026-10-17',
  pending: [
    { q: 'pop-hoat-hinh-chieu-rap', key: 'mởcửara', valid: false, canonical: 'Mở cửa ra', reason: 'Không có phim hoạt hình chiếu rạp nào tên như vậy.' },
    { q: 'du-truyenthong', key: 'tràgừng', valid: true, canonical: 'Trà gừng', reason: 'Thức uống dân gian quen thuộc của người Việt.' },
  ],
  submissions: [
    { q: 'nv-bongda-tg', key: 'sadiomane', valid: true, canonical: 'Sadio Mané', reason: 'Tiền đạo người Senegal, từng vô địch Champions League cùng Liverpool.' },
    { q: 'dd-bac', key: 'sapa', valid: true, canonical: 'Sa Pa', reason: 'Thị xã du lịch nổi tiếng ở Lào Cai.' },
    { q: 'so-nam-nhuan', key: '2022', valid: false, canonical: '2022', reason: '2022 không chia hết cho 4 nên không phải năm nhuận.' },
    { q: 'xe-tho', key: 'vệtinh', valid: false, canonical: 'Vệ tinh', reason: 'Vệ tinh không phải phương tiện đi lại và thường có động cơ đẩy.' },
    { q: 'dd-trung', key: 'nhatrang', valid: true, canonical: 'Nha Trang', reason: 'Thành phố biển du lịch nổi tiếng của Khánh Hòa.' },
    { q: 'qg-chu-t', key: 'tiamo', valid: false, canonical: 'Tiamo', reason: 'Không có quốc gia nào tên Tiamo.' },
    { q: 'pop-nuoc-giai-khat', key: 'mrbeast', valid: false, canonical: 'MrBeast', reason: 'MrBeast là một YouTuber, không phải nhãn nước giải khát.' },
    { q: 'x-vang', key: 'photon', valid: false, canonical: 'Photon', reason: 'Photon là hạt ánh sáng, bản thân không có màu vàng.' },
    { q: 'x-vang', key: 'mặttrời', valid: true, canonical: 'Mặt trời', reason: 'Mặt trời thường được vẽ và nhìn thấy có màu vàng.' },
    { q: 'x-vang', key: 'sun', valid: true, canonical: 'Mặt trời', reason: 'Tên tiếng Anh của Mặt trời.' },
    { q: 'ct-noi', key: 'neron', valid: false, canonical: 'Nơ-ron', reason: 'Nơ-ron là tế bào thần kinh, không phải một cơ quan.' },
    { q: 'nv-bongda-tg', key: 'lukaku', valid: true, canonical: 'Romelu Lukaku', reason: 'Tiền đạo người Bỉ, từng khoác áo Chelsea, Man United và Inter.' },
    { q: 'pop-hoat-hinh-chieu-rap', key: 'mởcửara', valid: false, canonical: 'Mở cửa ra', reason: 'Không có phim hoạt hình chiếu rạp nào tên như vậy.' },
    { q: 'qg-eu', key: 'venezuala', valid: false, canonical: 'Venezuela', reason: 'Venezuela ở Nam Mỹ, không phải châu Âu.' },
    { q: 'nghe-nghiep', key: 'banhang', valid: true, canonical: 'Nhân viên bán hàng', reason: 'Bán hàng là một nghề phổ biến.' },
    { q: 'qg-eu', key: 'venezela', valid: false, canonical: 'Venezuela', reason: 'Venezuela ở Nam Mỹ, không phải châu Âu.' },
    { q: 'du-truyenthong', key: 'tràgừng', valid: true, canonical: 'Trà gừng', reason: 'Thức uống dân gian quen thuộc của người Việt.' },
    { q: 'dd-cho-noi', key: 'bađình', valid: false, canonical: 'Ba Đình', reason: 'Ba Đình là một quận ở Hà Nội, không phải chợ nổi miền Tây.' },
    { q: 'sinh-vat-bien', key: 'cáigìđólạhoắc', valid: false, canonical: 'Cái gì đó lạ hoắc', reason: 'Không phải tên một sinh vật cụ thể.' },
  ],
};
