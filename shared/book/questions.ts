// Every question in the game: the handcrafted bank (extended with the village book) plus questions generated from book labels.
import { BANK } from '../bank.js';
import { parseRaw, type QuestionDef } from '../match.js';
import { addMore, buildSpec, extendQuestion, resolveTraps, type Built, type Source, type Spec } from './build.js';
import { MORE } from './more.js';
import { LEXICONS } from './index.js';

const S = (lex: string, all?: string[], extra: Partial<Source> = {}): Source => ({ lex, all, ...extra });

/** Handcrafted questions keep their curated tiers; the book adds the long tail of rarer answers. */
const EXTEND: Record<string, Source[]> = {
  'tinh-thanh': [S('diaphuong')],
  'trai-cay': [S('thucvat', ['traicay'])],
  'sinh-vat-bien': [S('dongvat', ['bien'])],
  'mon-an': [S('monan', undefined, { not: ['ngoai'] })],
  'mau-sac': [S('mausac')],
  'nhac-cu': [S('nhaccu')],
  'loai-hoa': [S('thucvat', ['hoa'])],
  'chau-a': [S('quocgia', ['as'])],
  'the-thao': [S('thethao')],
  'phuong-tien': [S('xe')],
  'nha-khoa-hoc': [S('nhanvat', ['khoa'])],
  'do-bep': [S('dovat', ['bep'])],
  'co-the': [S('cothe')],
  'loai-chim': [S('dongvat', ['chim'])],
  'loai-rau': [S('thucvat', ['rau'])],
  'nghe-nghiep': [S('nghe')],
  'ngon-ngu': [S('ngonngu', ['tn'])],
  'loai-banh': [S('monan', ['banh'])],
  'nguyen-to': [S('hoahoc')],
  'danh-thang': [S('diadanh', undefined, { not: ['tp'] })],
  'tro-choi-dan-gian': [S('vanhoa', ['trochoi'])],
  'do-uong': [S('douong')],
  'con-trung': [S('dongvat', ['contrung'])],
  'song-ho': [S('diadanh', undefined, { any: ['song', 'ho'] })],
  'thu-do': [S('thudo')],
  'nhan-vat-lich-su': [S('nhanvat', ['vn'], { not: ['bongda', 'vdv', 'nhacsi', 'hoasi'] })],
  'lang-nghe': [S('vanhoa', ['langnghe'])],
  'do-dung-hoc-tap': [S('dovat', ['hoc'])],
  'cay-go': [S('thucvat', ['caygo'])],
  'gia-vi': [S('thucvat', ['giavi'])],
  tet: [S('vanhoa', ['tet']), S('monan', ['tet']), S('thucvat', ['tet'])],
  'co-tich': [S('cotich', ['vn', 'truyen'], { any: ['cotich', 'truyenthuyet', 'ngungon', 'truyencuoi'] })],
  'loai-ca': [S('dongvat', ['ca'])],
};

const q = (id: string, c: string, text: string, from: Source[], more: Partial<Spec> = {}): Spec => ({ id, c, q: text, from, ...more });

/**
 * "Khôn lỏi" answers: the pick that feels clever but that half the village reaches for.
 * Hand-marked here from day one; the server also finds them from play (see answer()).
 */
const TRAPS: Record<string, string[]> = {
  'nha-khoa-hoc': ['Nikola Tesla'],
  'loai-chim': ['Chim cánh cụt', 'Đà điểu'],
  'sinh-vat-bien': ['Cá ngựa'],
  'thu-do': ['Canberra', 'Ottawa', 'Naypyidaw'],
  'chau-a': ['Triều Tiên'],
  'dv-thu': ['Cá voi', 'Dơi', 'Thú mỏ vịt'],
  'dv-bay': ['Cá chuồn', 'Sóc bay'],
  'dv-1tieng': ['Kiến'],
  'so-nguyen-to': ['2'],
  'so-chinh-phuong': ['169'],
  'tv-qua-chua': ['Cóc'],
  'nguyen-to': ['Urani'],
  'tg-kientruc': ['Angkor Wat'],
  'qg-noi': ['Mông Cổ'],
};

export const SPECS: Spec[] = [
  // ---------------------------------------------------------------- Động vật
  q('dv-thu', 'Động vật', 'Kể tên một loài thú', [S('dongvat', ['thu'])]),
  q('dv-ca-bien', 'Đại dương', 'Kể tên một loài cá biển', [S('dongvat', ['ca', 'bien'])], { strip: ['ca'] }),
  q('dv-ca-ngot', 'Động vật', 'Kể tên một loài cá nước ngọt', [S('dongvat', ['ca', 'nuocngot'])], { strip: ['ca'] }),
  q('dv-bosat', 'Động vật', 'Kể tên một loài bò sát hoặc lưỡng cư', [S('dongvat', undefined, { any: ['bosat', 'luongcu'] })]),
  q('dv-nuoi', 'Động vật', 'Kể tên một con vật được người nuôi', [S('dongvat', ['nuoi'])], { n: 'Vật nuôi trong nhà, gia súc, gia cầm đều được tính.' }),
  q('dv-phi', 'Động vật', 'Kể tên một con vật sống ở châu Phi', [S('dongvat', ['phi'])]),
  q('dv-vn', 'Động vật', 'Kể tên một loài động vật hoang dã quý hiếm của Việt Nam', [S('dongvat', ['vn'])]),
  q('dv-sung', 'Động vật', 'Kể tên một con vật có sừng', [S('dongvat', ['sung'])]),
  q('dv-doc', 'Động vật', 'Kể tên một con vật có nọc độc', [S('dongvat', ['doc'])]),
  q('dv-dem', 'Động vật', 'Kể tên một con vật hoạt động về đêm', [S('dongvat', ['dem'])]),
  q('dv-bay', 'Động vật', 'Kể tên một con vật biết bay nhưng không phải chim', [S('dongvat', ['bay'], { not: ['chim'] })]),
  q('dv-tuyet', 'Động vật', 'Kể tên một loài động vật đã tuyệt chủng', [S('dongvat', ['tuyet'])], { min: 12 }),
  q('dv-4chan', 'Động vật', 'Kể tên một con vật đi bằng bốn chân', [S('dongvat', ['4chan'])]),
  q('dv-vo', 'Đại dương', 'Kể tên một loài tôm, cua, ốc, sò hoặc mực', [S('dongvat', undefined, { any: ['giapxac', 'thanmem'] })]),
  q('dv-chu-b', 'Động vật', 'Kể tên một con vật bắt đầu bằng chữ B', [S('dongvat')], { start: 'b' }),
  q('dv-chu-t', 'Động vật', 'Kể tên một con vật bắt đầu bằng chữ T', [S('dongvat')], { start: 't' }),
  q('dv-chu-h', 'Động vật', 'Kể tên một con vật bắt đầu bằng chữ H', [S('dongvat')], { start: 'h' }),
  q('dv-chu-s', 'Động vật', 'Kể tên một con vật bắt đầu bằng chữ S', [S('dongvat')], { start: 's' }),
  q('dv-chu-n', 'Động vật', 'Kể tên một con vật bắt đầu bằng chữ N', [S('dongvat')], { start: 'n' }),
  q('dv-1tieng', 'Động vật', 'Kể tên một con vật có tên chỉ một tiếng', [S('dongvat')], { syllables: 1, n: 'Ví dụ: “gà”, không phải “gà tây”.' }),

  // ---------------------------------------------------------------- Thực vật
  q('tv-cu', 'Thực vật', 'Kể tên một loại củ', [S('thucvat', ['cu'])]),
  q('tv-thaomoc', 'Thực vật', 'Kể tên một loại cây thuốc hoặc thảo mộc', [S('thucvat', ['thaomoc'])]),
  q('tv-hat', 'Thực vật', 'Kể tên một loại hạt ăn được', [S('thucvat', ['hat'])]),
  q('tv-nam', 'Thực vật', 'Kể tên một loại nấm', [S('thucvat', ['nam'])], { strip: ['nam'] }),
  q('tv-caycanh', 'Thực vật', 'Kể tên một loại cây cảnh', [S('thucvat', ['caycanh'])]),
  q('tv-hoa-vang', 'Thực vật', 'Kể tên một loài hoa màu vàng', [S('thucvat', ['hoa', 'vang'])]),
  q('tv-hoa-do', 'Thực vật', 'Kể tên một loài hoa màu đỏ', [S('thucvat', ['hoa', 'do'])]),
  q('tv-hoa-trang', 'Thực vật', 'Kể tên một loài hoa màu trắng', [S('thucvat', ['hoa', 'trang'])]),
  q('tv-tim', 'Thực vật', 'Kể tên một loại hoa, quả hoặc rau có màu tím', [S('thucvat', ['tim'])]),
  q('tv-qua-do', 'Thực vật', 'Kể tên một loại quả có màu đỏ', [S('thucvat', ['traicay', 'do'])]),
  q('tv-qua-chua', 'Ẩm thực', 'Kể tên một loại quả có vị chua', [S('thucvat', ['traicay', 'chua'])]),
  q('tv-thuysinh', 'Thực vật', 'Kể tên một loài cây sống dưới nước', [S('thucvat', ['thuysinh'])]),
  q('tv-caycn', 'Thực vật', 'Kể tên một loại cây công nghiệp', [S('thucvat', ['caycn'])], { n: 'Cây trồng để làm nguyên liệu: cà phê, cao su…' }),
  q('tv-qua-1tieng', 'Ẩm thực', 'Kể tên một loại quả có tên chỉ một tiếng', [S('thucvat', ['traicay'])], { syllables: 1 }),
  q('tv-qua-chu-m', 'Ẩm thực', 'Kể tên một loại quả bắt đầu bằng chữ M', [S('thucvat', ['traicay'])], { start: 'm' }),
  q('tv-qua-chu-c', 'Ẩm thực', 'Kể tên một loại quả bắt đầu bằng chữ C', [S('thucvat', ['traicay'])], { start: 'c' }),
  q('tv-hoa-chu-h', 'Thực vật', 'Kể tên một loài hoa (tên bắt đầu bằng chữ H không tính chữ “hoa”)', [S('thucvat', ['hoa'])], {
    start: 'h',
    min: 10,
  }),

  // ---------------------------------------------------------------- Ẩm thực
  q('ma-soi', 'Ẩm thực', 'Kể tên một món bún, phở, mì, miến hoặc hủ tiếu', [S('monan', ['soi'])]),
  q('ma-che', 'Ẩm thực', 'Kể tên một loại chè', [S('monan', ['che'])], { strip: ['che'] }),
  q('ma-chao', 'Ẩm thực', 'Kể tên một món cháo', [S('monan', ['chao'])], { strip: ['chao'] }),
  q('ma-xoi', 'Ẩm thực', 'Kể tên một món xôi', [S('monan', ['xoi'])], { strip: ['xoi'] }),
  q('ma-lau', 'Ẩm thực', 'Kể tên một món lẩu', [S('monan', ['lau'])], { strip: ['lau'] }),
  q('ma-canh', 'Ẩm thực', 'Kể tên một món canh hoặc súp', [S('monan', ['canh'])], { strip: ['canh'] }),
  q('ma-goi', 'Ẩm thực', 'Kể tên một món gỏi hoặc nộm', [S('monan', ['goi'])]),
  q('ma-anvat', 'Ẩm thực', 'Kể tên một món ăn vặt', [S('monan', ['anvat'])]),
  q('ma-nuong', 'Ẩm thực', 'Kể tên một món nướng', [S('monan', ['nuong'])]),
  q('ma-mam', 'Ẩm thực', 'Kể tên một loại mắm', [S('monan', ['mam'])], { strip: ['mam'] }),
  q('ma-com', 'Ẩm thực', 'Kể tên một món cơm', [S('monan', ['com'])]),
  q('ma-ngoai', 'Ẩm thực', 'Kể tên một món ăn nước ngoài', [S('monan', ['ngoai'])]),
  q('ma-ngot', 'Ẩm thực', 'Kể tên một món tráng miệng hoặc đồ ngọt', [S('monan', ['ngot'])]),
  q('ma-bac', 'Ẩm thực', 'Kể tên một món ăn đặc trưng của miền Bắc', [S('monan', ['bac'], { not: ['ngoai'] })]),
  q('ma-trung', 'Ẩm thực', 'Kể tên một món ăn đặc trưng của miền Trung', [S('monan', ['trung'], { not: ['ngoai'] })]),
  q('ma-nam', 'Ẩm thực', 'Kể tên một món ăn đặc trưng của miền Nam', [S('monan', ['nam'], { not: ['ngoai'] })]),
  q('ma-taybac', 'Ẩm thực', 'Kể tên một món ăn của vùng núi phía Bắc', [S('monan', ['taybac'])]),
  q('ma-chu-g', 'Ẩm thực', 'Kể tên một món ăn bắt đầu bằng chữ G', [S('monan')], { start: 'g' }),
  q('ma-chu-n', 'Ẩm thực', 'Kể tên một món ăn bắt đầu bằng chữ N', [S('monan')], { start: 'n' }),
  q('ma-chu-x', 'Ẩm thực', 'Kể tên một món ăn bắt đầu bằng chữ X', [S('monan')], { start: 'x' }),
  q('ma-banh-ngoai', 'Ẩm thực', 'Kể tên một loại bánh của nước ngoài', [S('monan', ['banh', 'ngoai'])]),

  // ---------------------------------------------------------------- Đồ uống
  q('du-tra', 'Đồ uống', 'Kể tên một loại trà', [S('douong', ['tra'])], { strip: ['tra'] }),
  q('du-cocon', 'Đồ uống', 'Kể tên một loại đồ uống có cồn', [S('douong', ['cocon'])]),
  q('du-cafe', 'Đồ uống', 'Kể tên một món cà phê', [S('douong', ['cafe'])]),
  q('du-truyenthong', 'Đồ uống', 'Kể tên một thức uống truyền thống của Việt Nam', [S('douong', ['truyenthong'])]),
  q('du-ep', 'Đồ uống', 'Kể tên một loại nước ép hoặc sinh tố', [S('douong', undefined, { any: ['nuocep', 'sinhto'] })]),
  q('du-sua', 'Đồ uống', 'Kể tên một thức uống làm từ sữa', [S('douong', ['sua'])]),

  // ---------------------------------------------------------------- Địa lý Việt Nam
  q('dp-bien', 'Địa lý', 'Kể tên một tỉnh thành giáp biển', [S('diaphuong', ['bien'])], { n: 'Tính theo 63 tỉnh thành trước sáp nhập 2025.' }),
  q('dp-34', 'Địa lý', 'Kể tên một trong 34 tỉnh thành sau sáp nhập 2025', [S('diaphuong', ['con'])], { n: 'Áp dụng từ 1/7/2025.' }),
  q('dp-bac', 'Địa lý', 'Kể tên một tỉnh thành miền Bắc', [S('diaphuong', ['bac'])], { n: 'Tính cả tên tỉnh cũ trước sáp nhập 2025.' }),
  q('dp-trung', 'Địa lý', 'Kể tên một tỉnh thành miền Trung hoặc Tây Nguyên', [S('diaphuong', ['trung'])], { n: 'Tính cả tên tỉnh cũ trước sáp nhập 2025.' }),
  q('dp-nam', 'Địa lý', 'Kể tên một tỉnh thành miền Nam', [S('diaphuong', ['nam'])], { n: 'Tính cả tên tỉnh cũ trước sáp nhập 2025.' }),
  q('dp-bien-gioi', 'Địa lý', 'Kể tên một tỉnh giáp Trung Quốc, Lào hoặc Campuchia', [S('diaphuong', undefined, { any: ['gtq', 'glao', 'gcpc'] })], {
    n: 'Tính theo 63 tỉnh thành trước sáp nhập 2025.',
  }),
  q('dp-chu-b', 'Địa lý', 'Kể tên một tỉnh thành bắt đầu bằng chữ B', [S('diaphuong')], { start: 'b', min: 10, n: 'Tính cả tên tỉnh cũ.' }),
  q('dd-tp', 'Địa lý', 'Kể tên một thành phố hoặc đô thị của Việt Nam', [S('diadanh', ['tp'])]),
  q('dd-tp-bien', 'Du lịch', 'Kể tên một thành phố biển của Việt Nam', [S('diadanh', ['tp', 'bien'])]),
  q('dd-bien', 'Du lịch', 'Kể tên một bãi biển của Việt Nam', [S('diadanh', ['bien'], { not: ['tp'] })]),
  q('dd-dao', 'Du lịch', 'Kể tên một hòn đảo hoặc quần đảo của Việt Nam', [S('diadanh', ['dao'])]),
  q('dd-nui', 'Du lịch', 'Kể tên một ngọn núi hoặc con đèo ở Việt Nam', [S('diadanh', undefined, { any: ['nui', 'deo'] })]),
  q('dd-chua', 'Văn hóa', 'Kể tên một ngôi chùa, đền hoặc nhà thờ nổi tiếng ở Việt Nam', [S('diadanh', ['chua'])]),
  q('dd-hn', 'Du lịch', 'Kể tên một địa điểm nổi tiếng ở Hà Nội', [S('diadanh', ['hn'])]),
  q('dd-hcm', 'Du lịch', 'Kể tên một địa điểm nổi tiếng ở TP Hồ Chí Minh', [S('diadanh', ['hcm'])]),
  q('dd-ditich', 'Lịch sử', 'Kể tên một di tích lịch sử của Việt Nam', [S('diadanh', ['ditich'])]),
  q('dd-song', 'Địa lý', 'Kể tên một con sông của Việt Nam', [S('diadanh', ['song'])]),
  q('dd-thac-hang', 'Du lịch', 'Kể tên một thác nước hoặc hang động ở Việt Nam', [S('diadanh', undefined, { any: ['thac', 'hang'] })]),
  q('dd-cau-cho', 'Du lịch', 'Kể tên một cây cầu hoặc khu chợ nổi tiếng ở Việt Nam', [S('diadanh', undefined, { any: ['cau', 'cho'] })]),
  q('dd-vqg', 'Du lịch', 'Kể tên một vườn quốc gia hoặc khu bảo tồn ở Việt Nam', [S('diadanh', ['vqg'])]),
  q('dd-tn', 'Du lịch', 'Kể tên một địa danh ở Tây Nguyên', [S('diadanh', ['tn'])]),
  q('dd-trung', 'Du lịch', 'Kể tên một điểm du lịch miền Trung', [S('diadanh', ['trung'], { not: ['tp', 'song'] })]),
  q('dd-bac', 'Du lịch', 'Kể tên một điểm du lịch miền Bắc (ngoài Hà Nội)', [S('diadanh', ['bac'], { not: ['tp', 'song', 'hn'] })]),
  q('dd-nam', 'Du lịch', 'Kể tên một điểm du lịch miền Nam', [S('diadanh', ['nam'], { not: ['tp', 'song'] })]),

  // ---------------------------------------------------------------- Thế giới
  q('qg-eu', 'Thế giới', 'Kể tên một quốc gia ở châu Âu', [S('quocgia', ['eu'])]),
  q('qg-af', 'Thế giới', 'Kể tên một quốc gia ở châu Phi', [S('quocgia', ['af'])]),
  q('qg-my', 'Thế giới', 'Kể tên một quốc gia ở châu Mỹ', [S('quocgia', undefined, { any: ['bm', 'nm'] })]),
  q('qg-dd', 'Thế giới', 'Kể tên một quốc gia ở châu Đại Dương', [S('quocgia', ['dd'])], { min: 12 }),
  q('qg-dao', 'Thế giới', 'Kể tên một quốc đảo', [S('quocgia', ['dao'])], { n: 'Quốc gia nằm trọn trên đảo hoặc quần đảo.' }),
  q('qg-noi', 'Thế giới', 'Kể tên một quốc gia không giáp biển', [S('quocgia', ['noi'])]),
  q('qg-trungdong', 'Thế giới', 'Kể tên một quốc gia Trung Đông', [S('quocgia', ['trungdong'])]),
  q('qg-eu27', 'Thế giới', 'Kể tên một nước thành viên Liên minh châu Âu (EU)', [S('quocgia', ['eu27'])]),
  q('qg-asean', 'Thế giới', 'Kể tên một nước thành viên ASEAN', [S('quocgia', ['asean'])], { min: 10, level: 1 }),
  q('qg-chu-b', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ B', [S('quocgia')], { start: 'b' }),
  q('qg-chu-c', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ C', [S('quocgia')], { start: 'c' }),
  q('qg-chu-m', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ M', [S('quocgia')], { start: 'm' }),
  q('qg-chu-s', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ S', [S('quocgia')], { start: 's' }),
  q('qg-chu-t', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ T', [S('quocgia')], { start: 't' }),
  q('qg-chu-n', 'Thế giới', 'Kể tên một quốc gia bắt đầu bằng chữ N', [S('quocgia')], { start: 'n' }),
  q('qg-1tieng', 'Thế giới', 'Kể tên một quốc gia có tên tiếng Việt chỉ một tiếng', [S('quocgia')], { syllables: 1, min: 10, n: 'Ví dụ: “Lào”.' }),
  q('td-eu', 'Thế giới', 'Kể tên thủ đô của một nước châu Âu', [S('thudo', ['eu'])]),
  q('td-as', 'Thế giới', 'Kể tên thủ đô của một nước châu Á', [S('thudo', ['as'])]),
  q('td-af', 'Thế giới', 'Kể tên thủ đô của một nước châu Phi', [S('thudo', ['af'])]),
  q('td-my', 'Thế giới', 'Kể tên thủ đô của một nước châu Mỹ', [S('thudo', undefined, { any: ['bm', 'nm'] })]),
  q('tg-tp-as', 'Thế giới', 'Kể tên một thành phố ở châu Á (ngoài Việt Nam)', [S('thegioi', ['tp', 'as']), S('thudo', ['as'], { not: ['vn'] })]),
  q('tg-tp-eu', 'Thế giới', 'Kể tên một thành phố ở châu Âu', [S('thegioi', ['tp', 'eu']), S('thudo', ['eu'])]),
  q('tg-tp-my', 'Thế giới', 'Kể tên một thành phố ở châu Mỹ', [S('thegioi', ['tp'], { any: ['bm', 'nm'] }), S('thudo', undefined, { any: ['bm', 'nm'] })]),
  q('tg-kientruc', 'Thế giới', 'Kể tên một công trình kiến trúc nổi tiếng thế giới', [S('thegioi', ['kientruc'])]),
  q('tg-tunhien', 'Thế giới', 'Kể tên một kỳ quan thiên nhiên trên thế giới', [S('thegioi', ['tunhien'])]),
  q('tg-song', 'Thế giới', 'Kể tên một con sông trên thế giới (ngoài Việt Nam)', [S('thegioi', ['song'])]),
  q('tg-nui', 'Thế giới', 'Kể tên một ngọn núi, dãy núi hoặc sa mạc trên thế giới', [S('thegioi', undefined, { any: ['nui', 'samac'] })]),
  q('tg-bien', 'Thế giới', 'Kể tên một đại dương, biển hoặc vịnh', [S('thegioi', ['bien'])]),
  q('tg-dao-ho', 'Thế giới', 'Kể tên một hòn đảo hoặc hồ nổi tiếng thế giới', [S('thegioi', undefined, { any: ['dao', 'ho'] })]),

  // ---------------------------------------------------------------- Lịch sử, nhân vật
  q('nv-vua', 'Lịch sử', 'Kể tên một vị vua Việt Nam', [S('nhanvat', ['vn', 'vua'])]),
  q('nv-tuong', 'Lịch sử', 'Kể tên một danh tướng Việt Nam', [S('nhanvat', ['vn', 'tuong'])]),
  q('nv-nu', 'Lịch sử', 'Kể tên một người phụ nữ Việt Nam nổi tiếng trong lịch sử', [
    S('nhanvat', ['vn', 'nu'], { any: ['dung', 'bac', 'ngo', 'dinh', 'tienle', 'ly', 'tran', 'ho', 'le', 'mac', 'lt', 'tayson', 'nguyen', 'cd', 'cm'] }),
  ]),
  q('nv-tran', 'Lịch sử', 'Kể tên một nhân vật lịch sử thời nhà Trần', [S('nhanvat', ['tran'])]),
  q('nv-ly-le', 'Lịch sử', 'Kể tên một nhân vật lịch sử thời Lý hoặc Lê sơ', [S('nhanvat', undefined, { any: ['ly', 'le'] })]),
  q('nv-nguyen', 'Lịch sử', 'Kể tên một nhân vật thời nhà Nguyễn', [S('nhanvat', ['nguyen'])]),
  q('nv-cm', 'Lịch sử', 'Kể tên một anh hùng hoặc nhân vật thời kháng chiến', [S('nhanvat', ['vn'], { any: ['cm', 'cd'] })]),
  q('nv-van-vn', 'Văn học', 'Kể tên một nhà văn hoặc nhà thơ Việt Nam', [S('nhanvat', ['vn', 'van'])]),
  q('nv-van-tg', 'Văn học', 'Kể tên một nhà văn hoặc nhà thơ nước ngoài', [S('nhanvat', ['tg', 'van'])]),
  q('nv-nhacsi-vn', 'Âm nhạc', 'Kể tên một nhạc sĩ Việt Nam', [S('nhanvat', ['vn', 'nhacsi'])]),
  q('nv-nhacsi-tg', 'Âm nhạc', 'Kể tên một nhà soạn nhạc cổ điển', [S('nhanvat', ['tg', 'nhacsi'])]),
  q('nv-hoasi', 'Nghệ thuật', 'Kể tên một họa sĩ hoặc nhà điêu khắc nổi tiếng', [S('nhanvat', ['hoasi'])]),
  q('nv-bongda-tg', 'Thể thao', 'Kể tên một cầu thủ bóng đá nổi tiếng thế giới', [S('nhanvat', ['tg', 'bongda'])]),
  q('nv-bongda-vn', 'Thể thao', 'Kể tên một cầu thủ bóng đá Việt Nam', [S('nhanvat', ['vn', 'bongda'])], { min: 12 }),
  q('nv-triet', 'Khoa học', 'Kể tên một nhà triết học hoặc nhà tư tưởng', [S('nhanvat', ['triet'])]),
  q('nv-thamhiem', 'Khoa học', 'Kể tên một nhà thám hiểm hoặc nhà du hành vũ trụ', [S('nhanvat', ['thamhiem'])]),
  q('nv-lanhdao-tg', 'Lịch sử', 'Kể tên một vua, hoàng đế hoặc lãnh tụ nổi tiếng thế giới', [S('nhanvat', ['tg', 'lanhdao'])]),
  q('nv-vdv', 'Thể thao', 'Kể tên một vận động viên nổi tiếng (ngoài bóng đá)', [S('nhanvat', ['vdv'])]),
  q('nv-khoa-vn', 'Khoa học', 'Kể tên một nhà khoa học, thầy thuốc hoặc học giả Việt Nam', [S('nhanvat', ['vn', 'khoa'])]),

  // ---------------------------------------------------------------- Văn học, truyện
  q('vh-cotich-tg', 'Văn học', 'Kể tên một truyện cổ tích nước ngoài', [S('cotich', ['tg', 'truyen', 'cotich'])]),
  q('vh-nv-cotich', 'Văn học', 'Kể tên một nhân vật trong truyện cổ tích hoặc truyền thuyết', [S('cotich', ['nv'], { any: ['cotich', 'truyenthuyet'] })]),
  q('vh-tacpham-vn', 'Văn học', 'Kể tên một tác phẩm văn học Việt Nam', [S('cotich', ['vn', 'truyen', 'vanhoc'])]),
  q('vh-tacpham-tg', 'Văn học', 'Kể tên một tác phẩm văn học nước ngoài', [S('cotich', ['tg', 'truyen', 'vanhoc'])]),
  q('vh-nv-vn', 'Văn học', 'Kể tên một nhân vật trong văn học Việt Nam', [S('cotich', ['vn', 'nv', 'vanhoc'])]),
  q('vh-nv-tg', 'Văn học', 'Kể tên một nhân vật trong tiểu thuyết nước ngoài', [S('cotich', ['tg', 'nv', 'vanhoc'])]),
  q('vh-hoathinh', 'Tuổi thơ', 'Kể tên một nhân vật hoạt hình hoặc truyện tranh', [S('cotich', ['nv', 'hoathinh'])]),

  // ---------------------------------------------------------------- Đời sống
  q('ng-yte', 'Đời sống', 'Kể tên một nghề trong ngành y', [S('nghe', ['yte'])]),
  q('ng-dongphuc', 'Đời sống', 'Kể tên một nghề thường mặc đồng phục', [S('nghe', ['dongphuc'])]),
  q('ng-ngoaitroi', 'Đời sống', 'Kể tên một nghề làm việc ngoài trời', [S('nghe', ['ngoaitroi'])]),
  q('ng-nghethuat', 'Nghệ thuật', 'Kể tên một nghề liên quan đến nghệ thuật', [S('nghe', ['nghethuat'])]),
  q('ng-tho', 'Đời sống', 'Kể tên một nghề có tên bắt đầu bằng chữ “thợ”', [S('nghe')], { head: 'thợ' }),
  q('ng-thucong', 'Văn hóa', 'Kể tên một nghề thủ công truyền thống', [S('nghe', ['thucong'])]),
  q('dv-dien', 'Đời sống', 'Kể tên một đồ dùng chạy bằng điện', [S('dovat', ['dien'])]),
  q('dv-noithat', 'Đời sống', 'Kể tên một món đồ nội thất trong nhà', [S('dovat', ['noithat'])]),
  q('dv-tam', 'Đời sống', 'Kể tên một vật dụng trong phòng tắm hoặc để dọn dẹp', [S('dovat', ['tam'])]),
  q('dv-dungcu', 'Đời sống', 'Kể tên một dụng cụ sửa chữa hoặc làm vườn', [S('dovat', ['dungcu'])]),
  q('dv-xua', 'Văn hóa', 'Kể tên một vật dụng xưa của người Việt', [S('dovat', ['xua'])]),
  q('dv-nhon', 'Đời sống', 'Kể tên một đồ vật sắc hoặc nhọn', [S('dovat', ['nhon'])]),
  q('dv-ngu', 'Đời sống', 'Kể tên một thứ trong phòng ngủ', [S('dovat', ['ngu'])]),
  q('qa-all', 'Thời trang', 'Kể tên một món đồ thời trang hoặc phụ kiện', [S('quanao')]),
  q('qa-dau', 'Thời trang', 'Kể tên một thứ đội hoặc đeo trên đầu', [S('quanao', ['dau'])]),
  q('qa-chan', 'Thời trang', 'Kể tên một loại giày dép', [S('quanao', ['chan'])]),
  q('qa-truyenthong', 'Thời trang', 'Kể tên một trang phục truyền thống (Việt Nam hoặc thế giới)', [S('quanao', ['truyenthong'])]),
  q('qa-phukien', 'Thời trang', 'Kể tên một phụ kiện hoặc món trang sức', [S('quanao', undefined, { any: ['phukien', 'trangsuc'] })]),
  q('qa-ao', 'Thời trang', 'Kể tên một loại áo', [S('quanao', ['ao'])], { strip: ['ao'] }),
  q('xe-thuy', 'Giao thông', 'Kể tên một phương tiện đi trên mặt nước', [S('xe', ['thuy'])]),
  q('xe-tho', 'Giao thông', 'Kể tên một phương tiện không có động cơ', [S('xe', ['tho'])]),
  q('xe-chuyendung', 'Giao thông', 'Kể tên một loại xe chuyên dụng', [S('xe', ['chuyendung'])]),
  q('ct-noi', 'Cơ thể', 'Kể tên một cơ quan bên trong cơ thể', [S('cothe', ['noi'])]),
  q('ct-mat', 'Cơ thể', 'Kể tên một bộ phận trên khuôn mặt', [S('cothe', ['mat'])]),
  q('ct-doi', 'Cơ thể', 'Kể tên một bộ phận cơ thể mà ta có một đôi', [S('cothe', ['doi'])]),
  q('ct-xuong', 'Cơ thể', 'Kể tên một bộ phận ở tay hoặc chân', [S('cothe', undefined, { any: ['tay', 'chan'] })]),
  q('ms-xanh', 'Ngôn ngữ', 'Kể tên một sắc độ của màu xanh', [S('mausac', ['xanh'])]),
  q('ms-vn', 'Ngôn ngữ', 'Kể tên một màu gọi theo tên một vật quen thuộc', [S('mausac', ['vn'])], { n: 'Như “màu cánh sen”, “màu da bò”.' }),

  // ---------------------------------------------------------------- Văn hóa
  q('vh-lehoi', 'Văn hóa', 'Kể tên một lễ hội truyền thống Việt Nam', [S('vanhoa', ['lehoi'])]),
  q('vh-ngayle', 'Văn hóa', 'Kể tên một ngày lễ trong năm', [S('vanhoa', ['ngayle'])]),
  q('vh-nghethuat', 'Văn hóa', 'Kể tên một loại hình nghệ thuật truyền thống Việt Nam', [S('vanhoa', ['nghethuat'])]),
  q('vh-unesco', 'Văn hóa', 'Kể tên một di sản Việt Nam được UNESCO ghi danh', [S('vanhoa', ['unesco']), S('diadanh', ['unesco'])], {
    n: 'Di sản vật thể hoặc phi vật thể.',
  }),
  q('dt-all', 'Văn hóa', 'Kể tên một trong 54 dân tộc Việt Nam', [S('dantoc')]),

  // ---------------------------------------------------------------- Thể thao, âm nhạc
  q('tt-bong', 'Thể thao', 'Kể tên một môn thể thao dùng bóng hoặc cầu', [S('thethao', ['bong'])]),
  q('tt-olympic', 'Thể thao', 'Kể tên một môn thi đấu ở Thế vận hội', [S('thethao', ['olympic'])]),
  q('tt-nuoc', 'Thể thao', 'Kể tên một môn thể thao dưới nước', [S('thethao', ['nuoc'])]),
  q('tt-vo', 'Thể thao', 'Kể tên một môn võ', [S('thethao', ['vo'])], { strip: ['vo'] }),
  q('tt-dantoc', 'Tuổi thơ', 'Kể tên một môn thể thao hoặc trò chơi dân tộc', [S('thethao', ['dantoc']), S('vanhoa', ['trochoi'])]),
  q('tt-doi', 'Thể thao', 'Kể tên một môn thể thao thi đấu đồng đội', [S('thethao', ['doi'])]),
  q('nc-dt', 'Âm nhạc', 'Kể tên một nhạc cụ dân tộc Việt Nam', [S('nhaccu', ['dt'])]),
  q('nc-day', 'Âm nhạc', 'Kể tên một nhạc cụ có dây', [S('nhaccu', ['day'])]),
  q('nc-hoi', 'Âm nhạc', 'Kể tên một nhạc cụ thổi', [S('nhaccu', ['hoi'])]),
  q('nc-go', 'Âm nhạc', 'Kể tên một nhạc cụ gõ', [S('nhaccu', ['go'])]),

  // ---------------------------------------------------------------- Khoa học, vũ trụ
  q('hh-kl', 'Khoa học', 'Kể tên một kim loại', [S('hoahoc', ['kl'])], { n: 'Nguyên tố kim loại; hợp kim không tính.' }),
  q('hh-khi', 'Khoa học', 'Kể tên một nguyên tố ở thể khí ở nhiệt độ phòng', [S('hoahoc', ['khi'])], { min: 10 }),
  q('hh-1chu', 'Khoa học', 'Kể tên một nguyên tố có ký hiệu chỉ một chữ cái', [S('hoahoc', ['1chu'])], { min: 12 }),
  q('hh-phongxa', 'Khoa học', 'Kể tên một nguyên tố phóng xạ', [S('hoahoc', ['phongxa'])]),
  q('tv-hemt', 'Vũ trụ', 'Kể tên một thiên thể trong Hệ Mặt Trời', [S('thienvan', ['hemt'])]),
  q('tv-chomsao', 'Vũ trụ', 'Kể tên một chòm sao', [S('thienvan', ['chomsao'])]),
  q('tv-sao', 'Vũ trụ', 'Kể tên một ngôi sao hoặc thiên hà', [S('thienvan', undefined, { any: ['sao', 'thienha'] })]),
  q('tv-tau', 'Vũ trụ', 'Kể tên một tàu vũ trụ, vệ tinh hoặc kính thiên văn', [S('thienvan', ['tau'])]),
  q('tv-all', 'Vũ trụ', 'Kể tên một thứ bạn có thể gặp trong vũ trụ', [S('thienvan')]),

  // ---------------------------------------------------------------- Ngôn ngữ
  q('nn-laptrinh', 'Công nghệ', 'Kể tên một ngôn ngữ lập trình', [S('ngonngu', ['laptrinh'])]),
  q('nn-vn', 'Ngôn ngữ', 'Kể tên một ngôn ngữ của các dân tộc ở Việt Nam', [S('ngonngu', ['vn'])]),
  q('nn-eu', 'Ngôn ngữ', 'Kể tên một ngôn ngữ ở châu Âu', [S('ngonngu', ['tn', 'eu'])]),
  q('nn-as', 'Ngôn ngữ', 'Kể tên một ngôn ngữ ở châu Á', [S('ngonngu', ['tn', 'as'])]),
  q('tu-tuongthanh', 'Ngôn ngữ', 'Kể tên một từ tượng thanh (mô phỏng âm thanh)', [S('tungu', ['tuongthanh'])], { n: 'Ví dụ: “róc rách”.' }),
  q('tu-tuonghinh', 'Ngôn ngữ', 'Kể tên một từ láy gợi tả dáng vẻ, hình ảnh', [S('tungu', ['tuonghinh'])], { n: 'Ví dụ: “lom khom”.' }),
  q('tu-camxuc', 'Ngôn ngữ', 'Kể tên một từ chỉ cảm xúc', [S('tungu', ['camxuc'])]),
  q('tu-tinhcach', 'Ngôn ngữ', 'Kể tên một tính từ chỉ tính cách con người', [S('tungu', ['tinhcach'])]),
  q('tu-nuoc', 'Ngôn ngữ', 'Kể tên một từ ghép bắt đầu bằng “nước”', [S('tungu', ['w-nuoc'])], { n: 'Ví dụ: “nước mắt”.' }),
  q('tu-mat', 'Ngôn ngữ', 'Kể tên một từ ghép bắt đầu bằng “mặt”', [S('tungu', ['w-mat'])], { n: 'Ví dụ: “mặt nạ”.' }),
  q('tu-long', 'Ngôn ngữ', 'Kể tên một từ ghép bắt đầu bằng “lòng”', [S('tungu', ['w-long'])]),
  q('tu-tay', 'Ngôn ngữ', 'Kể tên một từ ghép có chữ “tay”', [S('tungu', ['w-tay'])]),
  q('tu-troi', 'Ngôn ngữ', 'Kể tên một từ ghép kết thúc bằng “trời”', [S('tungu', ['w-troi'])], { n: 'Ví dụ: “bầu trời”.' }),

  // ---------------------------------------------------------------- Khái niệm, công nghệ
  q('kn-monhoc', 'Tuổi thơ', 'Kể tên một môn học ở trường phổ thông', [S('khainiem', ['monhoc'])]),
  q('kn-nganh', 'Đời sống', 'Kể tên một ngành học đại học', [S('khainiem', ['nganh'])]),
  q('kn-hinh', 'Khoa học', 'Kể tên một hình trong hình học', [S('khainiem', ['hinh'])]),
  q('kn-donvi', 'Khoa học', 'Kể tên một đơn vị đo lường', [S('khainiem', ['donvi'])]),
  q('kn-tiente', 'Thế giới', 'Kể tên một đơn vị tiền tệ', [S('khainiem', ['tiente'])]),
  q('kn-daquy', 'Khoa học', 'Kể tên một loại đá quý hoặc ngọc', [S('khainiem', ['daquy'])]),
  q('kn-chatlieu', 'Đời sống', 'Kể tên một loại vật liệu hoặc chất liệu', [S('khainiem', ['chatlieu'])]),
  q('kn-thoitiet', 'Khoa học', 'Kể tên một hiện tượng thời tiết hoặc thiên nhiên', [S('khainiem', ['thoitiet'])]),
  q('kn-hangxe', 'Giao thông', 'Kể tên một hãng xe ô tô hoặc xe máy', [S('khainiem', ['hangxe'])]),
  q('kn-hangcn', 'Công nghệ', 'Kể tên một hãng công nghệ hoặc điện thoại', [S('khainiem', ['hangcn'])]),
  q('kn-app', 'Công nghệ', 'Kể tên một ứng dụng, mạng xã hội hoặc trò chơi điện tử', [S('khainiem', ['app'])]),

  // ---------------------------------------------------------------- Câu hỏi chéo chủ đề
  q('x-bay', 'Tổng hợp', 'Kể tên một thứ có thể bay', [S('dongvat', ['bay']), S('xe', undefined, { any: ['khong', 'vutru'] })]),
  q('x-nuoc', 'Tổng hợp', 'Kể tên một thứ bạn có thể thấy trên sông hoặc dưới biển', [
    S('dongvat', undefined, { any: ['bien', 'nuocngot'] }),
    S('xe', ['thuy']),
    S('thucvat', ['thuysinh']),
  ]),
  q('x-vang', 'Tổng hợp', 'Kể tên một thứ có màu vàng', [S('thucvat', ['vang']), S('mausac', ['vang'], { not: ['coban'] })]),
  q('x-do', 'Tổng hợp', 'Kể tên một thứ có màu đỏ', [S('thucvat', ['do']), S('mausac', ['do'], { not: ['coban'] })]),
  q('x-banh', 'Tổng hợp', 'Kể tên một thứ có tên bắt đầu bằng chữ “bánh”', [S('monan', ['banh'])], { head: 'bánh' }),
  q('x-ca', 'Tổng hợp', 'Kể tên một thứ có tên bắt đầu bằng chữ “cá”', [S('dongvat'), S('monan')], { head: 'cá' }),
  q('x-xe', 'Tổng hợp', 'Kể tên một thứ có tên bắt đầu bằng chữ “xe”', [S('xe')], { head: 'xe' }),
  q('x-dan', 'Tổng hợp', 'Kể tên một thứ có tên bắt đầu bằng chữ “đàn”', [S('nhaccu')], { head: 'đàn', min: 10 }),
];

/* ------------------------------------------------------------------ number questions */

function numberQuestion(id: string, c: string, prompt: string, note: string, values: number[], tierOf: (v: number) => number, krill: number): Built {
  const answers = values.map((v) => ({ key: String(v), display: String(v), priorTier: v === krill ? 5 : tierOf(v), aliases: [String(v)] }));
  return { id, category: c, prompt, note, strip: ['so'], vague: [], krillKey: String(krill), answers, level: 2, family: 'so', pool: answers.length };
}

const primes = Array.from({ length: 99 }, (_, i) => i + 2).filter((n) => Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d));
const squares = Array.from({ length: 22 }, (_, i) => (i + 10) ** 2);
const leaps = Array.from({ length: 100 }, (_, i) => 2001 + i).filter((y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0);

const NUMBER_QUESTIONS: Built[] = [
  numberQuestion('so-nguyen-to', 'Con số', 'Kể tên một số nguyên tố nhỏ hơn 100', 'Gõ bằng chữ số, ví dụ “7”.', primes, (v) => (v <= 7 ? 0 : v <= 19 ? 1 : v <= 41 ? 2 : v <= 71 ? 3 : 4), 89),
  numberQuestion('so-chinh-phuong', 'Con số', 'Kể tên một số chính phương có ba chữ số', 'Số bằng bình phương của một số nguyên, ví dụ 144 = 12².', squares, (v) =>
    [100, 144, 400, 900].includes(v) ? 0 : [121, 169, 196, 225, 625].includes(v) ? 1 : [256, 289, 324, 361, 441, 484].includes(v) ? 2 : v < 800 ? 3 : 4, 961),
  numberQuestion('so-nam-nhuan', 'Con số', 'Kể tên một năm nhuận trong thế kỷ 21', 'Từ năm 2001 đến 2100.', leaps, (v) => (v >= 2016 && v <= 2028 ? 0 : v <= 2036 ? 1 : v <= 2052 ? 2 : v <= 2076 ? 3 : 4), 2096),
];

/* ------------------------------------------------------------------ the whole book */

function assemble() {
  const out: QuestionDef[] = [];
  for (const raw of BANK) {
    const base = parseRaw(raw);
    const ext = EXTEND[raw.id];
    const qd00 = ext ? extendQuestion(base, ext, LEXICONS) : base;
    const qd0 = MORE[raw.id] ? addMore(qd00, MORE[raw.id]) : qd00;
    const qd = { ...qd0, traps: resolveTraps(qd0.answers, TRAPS[raw.id]) };
    const strong = qd.answers.filter((a) => a.priorTier <= 1).length;
    out.push({ ...qd, level: qd.answers.length >= 60 && strong >= 3 ? 1 : 2, family: qd.family ?? raw.id });
  }
  const dropped: string[] = [];
  for (const spec of SPECS) {
    const b0 = buildSpec(TRAPS[spec.id] ? { ...spec, traps: TRAPS[spec.id] } : spec, LEXICONS);
    const b = b0 && MORE[spec.id] ? { ...b0, ...addMore(b0, MORE[spec.id]) } : b0;
    if (b) out.push(b);
    else dropped.push(spec.id);
  }
  out.push(...NUMBER_QUESTIONS.map((n) => ({ ...n, traps: resolveTraps(n.answers, TRAPS[n.id]) })));
  return { questions: out, dropped };
}

const assembled = assemble();

/** Every playable question, built once per process. */
export const BOOK: QuestionDef[] = assembled.questions;
/** Specs left out for having too few answers (reported by the book checker). */
export const DROPPED: string[] = assembled.dropped;
export const BOOK_BY_ID = new Map(BOOK.map((x) => [x.id, x]));

/** Changes whenever a question's wording or hidden answer changes, so servers know to resync the questions table. */
export const BOOK_VERSION = (() => {
  let h = 2166136261;
  const s = BOOK.map((x) => [x.id, x.prompt, x.category, x.note ?? '', x.krillKey, x.level, x.family].join('|')).join('\n');
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return `${BOOK.length}-${(h >>> 0).toString(36)}`;
})();

export function answerCount(id: string) {
  return BOOK_BY_ID.get(id)?.answers.length ?? 0;
}

