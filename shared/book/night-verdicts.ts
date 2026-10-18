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
  day: '2026-10-17',
  pending: [
    { q: 'pop-hoat-hinh-chieu-rap', key: 'mởcửara', valid: false, canonical: 'Mở cửa ra', reason: 'Không có phim hoạt hình chiếu rạp nào tên “Mở cửa ra”.' },
    { q: 'du-truyenthong', key: 'tràgừng', valid: true, canonical: 'Trà gừng', reason: 'Trà gừng (nước gừng) là thức uống dân gian lâu đời của người Việt.' },
  ],
  submissions: [
    { q: 'nv-bongda-tg', key: 'sadiomane', valid: true, canonical: 'Sadio Mané', reason: 'Tiền đạo người Senegal, vô địch Champions League 2019 cùng Liverpool.' },
    { q: 'dd-bac', key: 'sapa', valid: true, canonical: 'Sa Pa', reason: 'Sa Pa (Lào Cai) là điểm du lịch nổi tiếng bậc nhất miền Bắc.' },
    { q: 'qg-chu-t', key: 'timo', valid: false, canonical: 'Đông Timor', reason: 'Tên tiếng Việt của nước này là Đông Timor, bắt đầu bằng chữ Đ.' },
    { q: 'so-nam-nhuan', key: '2022', valid: false, canonical: '2022', reason: '2022 không chia hết cho 4 nên không phải năm nhuận.' },
    { q: 'xe-tho', key: 'vệtinh', valid: false, canonical: 'Vệ tinh', reason: 'Vệ tinh không phải phương tiện chở người hay hàng, và thường có động cơ đẩy.' },
    { q: 'dd-trung', key: 'nhatrang', valid: true, canonical: 'Nha Trang', reason: 'Thành phố biển Nha Trang (Khánh Hòa) là điểm du lịch hàng đầu miền Trung.' },
    { q: 'qg-chu-t', key: 'tiamo', valid: false, canonical: 'Tiamo', reason: 'Không có quốc gia nào tên Tiamo.' },
    { q: 'pop-nuoc-giai-khat', key: 'mrbeast', valid: false, canonical: 'MrBeast', reason: 'MrBeast là YouTuber; chưa có nhãn nước đóng chai hay đóng lon mang tên này.' },
    { q: 'pop-phim-hoa-ngu', key: 'thanhxuân', valid: false, canonical: 'Thanh xuân', reason: '“Thanh xuân” là một thể loại phim, không phải tên một bộ phim cụ thể.' },
    { q: 'x-vang', key: 'photon', valid: false, canonical: 'Photon', reason: 'Photon là hạt ánh sáng, không có màu vàng riêng.' },
    { q: 'x-vang', key: 'plasma', valid: true, canonical: 'Huyết tương', reason: 'Huyết tương (plasma) có màu vàng nhạt.' },
    { q: 'x-vang', key: 'giấy', valid: false, canonical: 'Giấy', reason: 'Giấy thông thường có màu trắng; quá chung chung.' },
    { q: 'x-vang', key: 'mặttrời', valid: true, canonical: 'Mặt trời', reason: 'Mặt trời thường được nhìn và vẽ có màu vàng.' },
    { q: 'x-vang', key: 'sun', valid: true, canonical: 'Mặt trời', reason: 'Tên tiếng Anh của Mặt trời.' },
    { q: 'ct-noi', key: 'neron', valid: false, canonical: 'Nơ-ron', reason: 'Nơ-ron là một tế bào thần kinh, không phải một cơ quan.' },
    { q: 'ct-noi', key: 'dâychằng', valid: true, canonical: 'Dây chằng', reason: 'Dây chằng là bộ phận bên trong cơ thể, cùng loại với gân đã có trong sổ.' },
    { q: 'nv-bongda-tg', key: 'lukaku', valid: true, canonical: 'Romelu Lukaku', reason: 'Tiền đạo người Bỉ, từng khoác áo Chelsea, Man United và Inter Milan.' },
    { q: 'pop-nuoc-giai-khat', key: 'tea365', valid: false, canonical: 'Tea365', reason: 'Không có nhãn nước giải khát đóng chai hay đóng lon nào tên Tea365 trên thị trường.' },
    { q: 'dd-nam', key: 'phanthiết', valid: false, canonical: 'Phan Thiết', reason: 'Phan Thiết thuộc Nam Trung Bộ, tức miền Trung, không phải miền Nam.' },
    { q: 'pop-hoat-hinh-chieu-rap', key: 'mởcửara', valid: false, canonical: 'Mở cửa ra', reason: 'Không có phim hoạt hình chiếu rạp nào tên “Mở cửa ra”.' },
    { q: 'qg-eu', key: 'venezuala', valid: false, canonical: 'Venezuela', reason: 'Venezuela ở Nam Mỹ, không phải châu Âu.' },
    { q: 'qg-eu', key: 'venezela', valid: false, canonical: 'Venezuela', reason: 'Venezuela ở Nam Mỹ, không phải châu Âu.' },
    { q: 'du-truyenthong', key: 'tràgừng', valid: true, canonical: 'Trà gừng', reason: 'Trà gừng (nước gừng) là thức uống dân gian lâu đời của người Việt.' },
    { q: 'nghe-nghiep', key: 'banhang', valid: true, canonical: 'Nhân viên bán hàng', reason: 'Đúng là một nghề; sổ đã có với tên Nhân viên bán hàng.' },
    { q: 'dd-cho-noi', key: 'bađình', valid: false, canonical: 'Ba Đình', reason: 'Ba Đình là một khu ở Hà Nội; miền Tây không có chợ nổi nào tên Ba Đình.' },
    { q: 'sinh-vat-bien', key: 'cáigìđólạhoắc', valid: false, canonical: 'Cái gì đó lạ hoắc', reason: 'Không phải tên một sinh vật cụ thể.' },
  ],
};
