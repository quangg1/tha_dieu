// Fifth pass, after the tidy-up: depth for prompts the game really asks, checked answer by answer. Same format as
// more4.ts: tier lines 2–4 only, answers split by ',', spellings by '|'. A name that already exists only adds its
// spellings. Nothing here is a guess: when unsure whether a name truly answers the prompt, it stays out.

const T = (t2: string, t3: string, t4 = ''): string[] => ['', '', t2, t3, t4];

export const MORE5: Record<string, string[]> = {
  'pop-bai-hat-tet': T(
    'Sắp đến Tết rồi, Xúc xắc xúc xẻ, Hoa xuân',
    'Xuân tha hương, Tâm sự nàng xuân, Tết xa, Ngày xuân thăm nhau, Đám cưới đầu xuân',
  ),
  'pop-bai-hat-thieu-nhi': T(
    'Cháu lên ba, Bà còng đi chợ|Bà còng đi chợ trời mưa, Ba bà đi bán lợn con, Cô và mẹ, Mẹ ơi tại sao, Lý cây xanh, Cả tuần đều ngoan, Mời bạn ăn, Rước đèn tháng tám, Tết Trung thu, Đêm Trung thu, Chim chích bông, Cháu vẽ ông mặt trời, Đêm qua em mơ gặp Bác Hồ|Em mơ gặp Bác Hồ',
    'Ồ sao bé không lắc, Trường chúng cháu là trường mầm non, Chị ong nâu và em bé, Tiếng chú gà trống gọi, Em tập lái ô tô, Đi một hai, Cháu thương chú bộ đội, Bạn ơi lắng nghe, Lớp chúng ta đoàn kết, Tia nắng hạt mưa, Gà trống mèo con và cún con, Con chuồn chuồn, Thằng Cuội, Cô giáo miền xuôi, Hoa lá mùa xuân, Bác Hồ người cho em tất cả, Sắp đến Tết rồi, Xúc xắc xúc xẻ, Cái bống, Đàn vịt con, Bông hoa mừng cô, Cùng múa hát dưới trăng, Đố quả, Khăn quàng thắm mãi vai em, Ngày em vào Đội, Tiếng ve gọi hè',
  ),
  'nv-nu': T(
    'Hoàng Thị Loan, Nguyễn Thị Thập, Mẹ Thứ|Nguyễn Thị Thứ',
    'Nguyễn Thị Thanh, Hà Thị Quế, Tạ Thị Kiều, Kan Lịch, Hoàng Ngân, Thiều Hoa, Hồ Đề, Phật Nguyệt, Ngô Chi Lan, Trịnh Thị Ngọc Trúc, Nguyễn Thị Bích Châu',
  ),
  'qa-truyenthong': T(
    'Nón ba tầm, Áo tơi, Shalwar kameez, Turban|Khăn turban, Váy flamenco, Burqa',
    'Áo chẽn, Váy lĩnh, Mũ cánh chuồn, Sarafan, Kokoshnik, Jeogori, Chima, Đường trang|Tangzhuang, Changshan, Lehenga, Dhoti, Sherwani, Keffiyeh|Khăn keffiyeh, Gho, Kira, Baju Kurung, Chut Thai, Váy sinh|Sinh Lào, Fez|Mũ fez, Huipil, Bunad, Furisode, Haori, Jinbei, Boubou, Agbada, Djellaba, Niqab, Chador',
  ),
  'nc-phim': T(
    'Piano kỹ thuật số|Digital piano|Đàn piano kỹ thuật số, Keytar|Đàn keytar',
    'Đàn quay|Hurdy-gurdy, Pianola|Piano tự động|Player piano, Wurlitzer|Đàn Wurlitzer, Nyckelharpa, Taishōgoto|Taishogoto',
  ),
  'ms-vn': T(
    'Da cam|Màu da cam|Cam|Màu cam, Xanh lá cây|Màu lá cây|Xanh lá, Xanh nước biển|Màu nước biển, Xanh da trời|Màu da trời, Xanh cổ vịt|Màu xanh cổ vịt|Cổ vịt, Tím than|Màu tím than, Xanh rêu|Màu rêu, Trắng sữa|Màu sữa, Vàng chanh|Màu vàng chanh',
    'Màu chàm|Chàm, Xám tro|Màu tro, Xám khói|Màu khói, Xám chì|Màu chì, Màu bạc|Bạc, Vàng kim|Màu vàng kim, Màu đồng|Vàng đồng, Trắng ngà|Màu ngà, Màu kem, Xanh ô liu|Màu ô liu, Xanh ngọc|Màu ngọc|Ngọc bích, Hồng đào|Màu hồng đào, Màu bơ, Vàng cát|Màu cát, Tím cà|Màu cà tím, Nâu hạt dẻ|Màu hạt dẻ, Màu gỗ|Nâu gỗ, Nâu socola|Màu socola|Màu sô-cô-la, Đỏ rượu vang|Màu rượu vang, Xanh bạc hà|Màu bạc hà|Xanh mint, Trắng tuyết|Màu tuyết, Trắng ngọc trai|Màu ngọc trai, Xanh lục bảo|Lục bảo, Hồng sen|Màu hồng sen, Đen than|Màu than, Đỏ máu|Màu máu, Vàng mù tạt|Màu mù tạt',
  ),
  'tv-hoa-chu-h': T(
    'Hạnh|Hoa hạnh',
    'Hoàng thảo|Hoa hoàng thảo, Huỳnh liên|Hoa huỳnh liên, Hoàng điệp|Hoa hoàng điệp, Hòe|Hoa hòe, Hyacinth|Hoa hyacinth, Hydrangea|Hoa hydrangea, Heather|Hoa heather',
    'Hẹ trắng|Hẹ|Hoa hẹ, Hồng môn đỏ|Hồng môn|Hoa hồng môn',
  ),
  'nv-bong-vang': T('', 'Ada Hegerberg|Hegerberg, Megan Rapinoe|Rapinoe'),
  'kn-hangxe': T('', 'Ram|RAM Trucks'),
  'xe-tho': T(
    'Xuồng ba lá, Xe đạp thồ, Xe cải tiến, Ván trượt tuyết|Snowboard, Xe đạp đua|Xe đạp đường trường|Road bike',
    'Ghe bầu, Thuyền mành, Gondola|Thuyền gondola, Xe đạp BMX|BMX, Xe đạp fixed gear|Fixie, Giày trượt băng, Tàu buồm',
  ),
  'vh-nv-cotich': T(
    'Ngưu Lang, Chức Nữ, Trương Chi, Vũ Nương|Vũ Thị Thiết, Ông Táo|Táo Quân, Nguyệt Lão|Ông Tơ Bà Nguyệt, Từ Thức, Hùng Vương|Vua Hùng, Người đẹp ngủ trong rừng|Công chúa ngủ trong rừng|Aurora, Belle|Người đẹp và quái vật, Hoàng tử ếch, Vịt con xấu xí, Jack|Jack và cây đậu thần, Ông lão đánh cá, Thumbelina|Cô bé tí hon',
    'Tích Chu, Trương Sinh|Chàng Trương, Tú Uyên, Giáng Kiều, Giáng Hương, Cậu Cóc|Con cóc là cậu ông trời, Rumpelstiltskin, Sinbad, Bà tiên đỡ đầu, Hera, Apollo, Hades, Aphrodite, Achilles, Odysseus, Perseus, Odin, Loki',
  ),
  'nv-tran': T(
    'Thoát Hoan, Ô Mã Nhi, Nguyễn Phi Khanh, Đặng Dung',
    'Đặng Tất, Toa Đô, Trần Quý Khoáng|Trùng Quang Đế, Trần Ngỗi|Giản Định Đế',
  ),
  'n-viet-tat': T(
    'Sn|Sinh nhật, Sr|Sorry, R|Rồi, Fb|Facebook, Sđt|Số điện thoại, Ngta|Người ta, Bjo|Bây giờ, Đh|Đại học, Kt|Kiểm tra',
    'Plz|Please, Ily|I love you|Ilu, Gg|Good game, Afk, Cty|Công ty, Kq|Kết quả, Ktx|Ký túc xá, Ig|Instagram, Zl|Zalo, Mng|Mọi người, Bik|Biết, Hok|Hk|Không',
  ),
};
