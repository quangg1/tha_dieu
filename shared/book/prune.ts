// Tidying the village book. Some answers are the same thing as another answer with a colour or a material tacked on
// ("Hoa sen trắng" next to "Hoa sen", "Nhẫn vàng" next to "Nhẫn"). They are folded into the plain answer: the longer
// name still scores, as that answer. Colours that name a different species or product stay apart ("Cá voi xanh",
// "Tiêu đen", "Phượng tím", "Rượu vang đỏ"), and so do colour questions, where "Xanh lam" is the answer itself.
import type { QuestionDef } from '../match.js';
import { norm, soft } from '../normalize.js';

const COLOURS = new Set(['đỏ', 'vàng', 'xanh', 'trắng', 'đen', 'tím', 'hồng', 'cam', 'nâu', 'xám', 'bạc', 'lục', 'lam']);

/** Main names folded into the same name without the trailing colour words, wherever that shorter answer exists. */
export const FOLD_COLOUR = new Set(
  `Áo blouse trắng|Bánh chưng xanh|Bọ cạp vàng|Bọ rùa vàng|Bọ xít đỏ|Bọ xít nâu|Bọ xít xanh|Bói cá xanh|Bồ câu nâu|Bông tai bạc|
Bướm phượng đen|Bướm phượng xanh|Bướm trắng|Bướm vàng|Cá chẽm vàng|Cá đù bạc|Cá đục bạc|Cá đục vàng|Cá đuôi gai vàng|
Cá đuôi gai xanh|Cá he vàng|Cá hề đen|Cá hề hồng|Cá hố bạc|Cá hồng bạc|Cá hồng đỏ|Cá lăng vàng|Cá lượng đỏ|Cá lượng vàng|
Cá ngựa đen|Cá ngựa vàng|Cá phèn hồng|Cá phèn vàng|Cá rô phi xanh|Cá thia xanh|Cá thiên thần xanh|Cá trác đỏ|Cá tráp đỏ|
Cá tráp vàng|Cá trê đen|Cá trê trắng|Cá trê vàng|Cào cào xanh|Cháo kê vàng|Chào mào vàng|Chao đỏ|Chao trắng|Chè cam|
Chim gõ kiến nâu|Chim gõ kiến vàng|Chim gõ kiến xanh|Chim hút mật đỏ|Chim thiên đường đỏ|Chuối đỏ|Cò đen|Cò xanh|Cóc vàng|
Cua xanh|Dâu tằm đỏ|Dây chuyền bạc|Dây chuyền vàng|Diệc xanh|Diều hâu đen|Dơi nâu|Ghẹ đỏ|Ghẹ xanh|Ghế nhựa đỏ|Ghế nhựa xanh|
Gỗ hương đỏ|Gỗ trắc đen|Gỗ trắc đỏ|Hải đường đỏ|Hoa ban đỏ|Hoa ban hồng|Hoa bằng lăng tím|Hoa bằng lăng trắng|Hoa cà tím|
Hoa cẩm chướng đỏ|Hoa chuông tím|Hoa chuông vàng|Hoa cúc kim tiền cam|Hoa cúc tím|Hoa cúc trắng|Hoa cúc vàng|
Hoa dạ yến thảo tím|Hoa dâm bụt trắng|Hoa dâm bụt vàng|Hoa diên vĩ tím|Hoa diên vĩ vàng|Hoa đậu biếc trắng|Hoa đậu đỏ|
Hoa đồng tiền đỏ|Hoa gạo trắng|Hoa gạo vàng|Hoa giấy cam|Hoa giấy tím|Hoa giấy trắng|Hoa hải đường đỏ|Hoa hồng cam|
Hoa hồng đen|Hoa hồng môn đỏ|Hoa hồng tím|Hoa hồng vàng|Hoa hồng xanh|Hoa huệ đỏ|Hoa huệ trắng|Hoa lan hài đỏ|Hoa lan hài hồng|
Hoa lan hài vàng|Hoa lan ý trắng|Hoa lay ơn đỏ|Hoa lục bình tím|Hoa lựu đỏ|Hoa ly hồng|Hoa ly vàng|Hoa mai chiếu thủy trắng|
Hoa mai đỏ|Hoa mai trắng|Hoa mai tứ quý vàng|Hoa mai vàng|Hoa mào gà đỏ|Hoa mào gà vàng|Hoa mắc cỡ hồng|Hoa mộc lan tím|
Hoa mộc lan trắng|Hoa mơ trắng|Hoa mua tím|Hoa mua trắng|Hoa păng xê vàng|Hoa phấn đỏ|Hoa phù dung trắng|Hoa sen hồng|
Hoa sen trắng|Hoa sen vàng|Hoa sen xanh|Hoa sim tím|Hoa súng đỏ|Hoa súng tím|Hoa súng trắng|Hoa súng vàng|Hoa sứ đỏ|Hoa sứ hồng|
Hoa sứ trắng|Hoa tầm xuân trắng|Hoa thiên điểu cam|Hoa thủy tiên trắng|Hoa thủy tiên vàng|Hoa thược dược đỏ|Hoa thược dược vàng|
Hoa tóc tiên trắng|Hoa trang đỏ|Hoa trang trắng|Hoa trang vàng|Hoa tulip đỏ|Hoa tulip tím|Hoa tulip trắng|Hoa tulip vàng|
Hoa xác pháo đỏ|Hồng cam|Hồng đen|Hồng đỏ|Hồng tím|Hồng vàng|Hồng xanh|Huệ đỏ|Húng quế tím|Kền kền đen|Khoai tây tím|
Kiến đen|Kiềng bạc|Kim cương đen|Kim cương hồng|Kim cương xanh|Kiwi vàng|Kỳ nhông xanh|Lắc chân bạc|Lắc chân vàng|Lựu đỏ|
Me xanh|Mơ vàng|Muối đen|Nấm mối đen|Nấm mối trắng|Nấm mỡ nâu|Nấm rơm đen|Nấm sò hồng|Nấm sò tím|Nấm sò vàng|
Nấm thủy tiên nâu|Nghệ vàng|Ngọc trai đen|Nhẫn bạc|Nhẫn vàng|Nhện bạc|Nhện đen|Nhện đỏ|Nhím biển đen|Nhím biển đỏ|Nho xanh|
Ong bắp cày vàng|Ong ruồi đen|Ong ruồi đỏ|Ong vàng|Ốc đỏ|Ốc gai đỏ|Ốc móng tay đen|Ốc vú nàng đen|Quả hồng xiêm vàng|Quạ đen|
Rau dền đỏ|Rau đay đỏ|Rau lang tím|Sao biển đỏ|Sao biển xanh|Sò điệp đỏ|Sò điệp nâu|Sóc đen|Su hào tím|Sư tử trắng|Sứa lửa đỏ|
Sứa vàng|Táo xanh|Thạch anh trắng|Thạch anh xanh|Thanh long vàng|Thiên nga trắng|Tôm bạc|Tôm càng đỏ|Tôm mũ ni đỏ|
Tôm mũ ni trắng|Tôm sú đen|Vạc xám|Vải bạt xanh cam|Vẹt mào đen|Việt quất đen|Vòng tay bạc|Xà tích bạc|Cây gạo đỏ|Cây gạo trắng|
Cây trắc đen|Cây trắc đỏ|Cây mun đen|Cây sến xanh|Cây si đỏ|Cây sưa trắng|Cây kim tiền vàng|Cây vạn lộc đỏ|Cây dây nhện xanh|
Canh rau dền đỏ|Cá rô phi đỏ`
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean),
);

/** Answers that are not answers to their question at all, found when tidying (by main name). */
export const DROP: Record<string, string[]> = {
  'cay-go': ['Chuối', 'Sa nhân', 'Nhọ nồi', 'Cây bách bộ', 'Cây gấc', 'Cây kỳ nam', 'Cây thông Pinus', 'Dầu gió', 'Cây lôi'],
  'co-the': ['Mồ hôi', 'Nước bọt', 'Nước mắt', 'Ráy tai', 'Tế bào', 'Hồng cầu', 'Bạch cầu', 'Tiểu cầu', 'Huyết tương', 'Dịch não tủy', 'Mạch đập', 'Eo thon', 'Nơ-ron', 'Bạch huyết', 'Vai u', 'Ngực trái'],
  'co-tich': ['Cô bé bán diêm', 'Ông lão đánh cá và con cá vàng', 'Ông lão đánh cá', 'Rùa và thỏ', 'Cáo và quạ', 'Chó sói và cừu non', 'Ve và kiến', 'Đeo nhạc cho mèo', 'Lục Vân Tiên', 'Ông lão đốn củi', 'Cậu bé chăn trâu', 'Sự tích Cột cờ Hà Nội', 'Sự tích con chuột', 'Sự tích con mèo', 'Sự tích con chó', 'Sự tích con ếch', 'Sự tích con kiến', 'Sự tích con bướm', 'Sự tích con đom đóm', 'Sự tích thằng Bờm', 'Sự tích con cuốc'],
  'con-trung': ['Cuốn chiếu', 'Rận cá', 'Kẹp kìm khổng lồ', 'Ve sầu thoát xác', 'Ấu trùng', 'Kiến sư tử trưởng thành'],
  'con-vat-chu-c': ['Cụ Rùa', 'Cá người'],
  'ct-doi': ['Thùy phổi', 'Xương sườn cụt'],
  'ct-mat': ['Ráy tai', 'Nước mắt', 'Hạch nước bọt', 'Chân tóc'],
  'ct-noi': ['Máu', 'Tế bào', 'Hồng cầu', 'Bạch cầu', 'Tiểu cầu', 'Huyết tương', 'Dịch não tủy', 'Bạch huyết', 'Nơ-ron', 'Hậu môn', 'Thượng vị'],
  'danh-thang': ['Sông Tô Lịch', 'Sông Kim Ngưu', 'Sông Nhuệ', 'Kênh Tẻ', 'Kênh Đôi', 'Kênh Tàu Hủ', 'Kênh Thị Nghè', 'Kênh Chợ Gạo', 'Kênh Xà No', 'Kênh Rạch Giá - Hà Tiên', 'Đầm Dơi', 'Kem Tràng Tiền', 'Royal City', 'Times City', 'Vinhomes Ocean Park', 'Vinhomes Central Park', 'Hồ Gươm Plaza', 'Metro số 1', 'Chung cư 42 Nguyễn Huệ', 'Hẻm 76 Đồng Khởi', 'Đường hầm Thủ Thiêm', 'Cầu Khánh Hội', 'Chợ Hồ Thị Kỷ', 'Hồ Hoàng Cầu'],
  'dd-bac': ['Ngã Ba Đồng Lộc'],
  'dd-bien': ['Vịnh Hạ Long', 'Vịnh Lan Hạ', 'Vịnh Bái Tử Long', 'Vịnh Vân Phong', 'Hải đăng Kê Gà', 'Mũi Điện', 'Gành Đá Đĩa', 'Rạn Nam Ô', 'Hòn Chồng', 'Mũi Nghinh Phong', 'Eo Gió'],
  'dd-cau-cho': ['Chợ Rẫy'],
  'dd-chua': ['Bán đảo Sơn Trà'],
  'dd-da-lat': ['Khu du lịch Madagui', 'Thác Đambri', 'Thác Ba Tầng'],
  'dd-dao': ['Vịnh Hạ Long', 'Vịnh Lan Hạ', 'Vịnh Bái Tử Long', 'Vinpearl Nha Trang', 'Bãi Sao', 'Bãi Dài Phú Quốc', 'Nhà tù Côn Đảo'],
  'dd-ditich': ['Bảo tàng Dân tộc học'],
  'dd-hcm': ['Hẻm 76 Đồng Khởi', 'Cầu Khánh Hội'],
  'dd-ho-hn': ['Hồ Tiên Sa', 'Hồ Miễu'],
  'dd-hue': ['Lăng Hoàng hậu'],
  'dd-nui': ['Sa Pa', 'Đồi chè Mộc Châu', 'Ruộng bậc thang Mù Cang Chải', 'Đồng Văn', 'Bản Cát Cát', 'Thung lũng Mường Hoa', 'Hẻm Tu Sản', 'Đồi Mộng Mơ', 'Măng Đen', 'Cao nguyên Lâm Viên', 'Cao nguyên Di Linh', 'Cao nguyên Pleiku', 'Cao nguyên Kon Plông', 'Cao nguyên Đắk Lắk', 'Cao nguyên Mơ Nông', 'Cao nguyên Bắc Hà', 'Cao nguyên Sìn Hồ', 'Cao nguyên Tà Phình'],
  'dd-sa-pa': ['Đỉnh Lùng Cúng', 'Đỉnh Bạch Mộc Lương Tử', 'Đỉnh Nhìu Cồ San', 'Đỉnh Lảo Thẩn'],
  'dd-song': ['Kênh Nhiêu Lộc', 'Kênh Vĩnh Tế', 'Kênh Tàu Hủ', 'Kênh Tẻ', 'Kênh Đôi', 'Kênh Thị Nghè', 'Kênh Chợ Gạo', 'Kênh Xà No', 'Kênh Rạch Giá - Hà Tiên'],
  'dd-thac-hang': ['Hang Rái'],
  'dd-tn': ['Hồ Phú Ninh Đắk Nông'],
  'dd-trung': ['Đèo Prenn', 'Nhà thờ Con Gà', 'Đỉnh Bàn Cờ'],
  'dd-vqg': ['Thung Nham', 'Làng nổi Tân Lập', 'Rừng tràm Gáo Giồng'],
  'do-dung-hoc-tap': ['Cặp tóc', 'Phiếu bé ngoan'],
  'do-uong': ['Mỡ trâu', 'Sữa chua dẻo', 'Xí muội', 'Sữa đặc', 'Smoothie bowl'],
  'du-cocon': ['Bia không cồn', 'Bia gừng'],
  'du-ep': ['Smoothie bowl'],
  'du-sua': ['Sữa đậu nành', 'Sữa hạnh nhân', 'Sữa óc chó', 'Sữa yến mạch', 'Sữa đậu xanh', 'Sữa đậu đỏ', 'Sữa mè đen', 'Sữa gạo', 'Sữa hạt sen', 'Sữa ong chúa', 'Sữa đậu phộng', 'Sữa hạt điều', 'Sữa hạt macca', 'Sữa dừa', 'Bột ngũ cốc', 'Sữa chua dẻo', 'Sữa đặc', 'Matcha'],
  'du-tra': ['Nước đậu đen rang'],
  'du-truyenthong': ['Xí muội', 'Nước tamarind', 'Chè dưỡng nhan'],
  'dv-1tieng': ['Lion', 'Koi', 'Ray', 'Kiang', 'Loon', 'Boa', 'Dắt', 'Mía', 'Sả'],
  'dv-4chan': ['Kangaroo', 'Chuột túi Wallaby', 'Chuột túi đỏ', 'Chuột túi xám', 'Chuột túi cây Goodfellow', 'Thú có túi Wallaroo', 'Chuột túi Potoroo', 'Gấu túi Quokka', 'Chuột nhảy', 'Vượn', 'Vượn đen má trắng', 'Vượn Cao Vít', 'Vượn tay trắng', 'Vượn đen má vàng', 'Vượn đen tuyền', 'Vượn má hung'],
  'dv-bay': ['Sâu bướm', 'Sâu đo bướm', 'Ve sầu thoát xác', 'Kẹp kìm khổng lồ', 'Bọ chó', 'Kiến sư tử trưởng thành', 'Gián đất', 'Mối lính', 'Mối chúa', 'Dế hang', 'Dế Weta'],
  'dv-ca-bien': ['Cá ngựa vằn'],
  'dv-ca-ngot': ['Cá thòi lòi'],
  'dv-chu-b': ['Bọ cạp nước biển'],
  'dv-chu-s': ['Song mã'],
  'dv-dien': ['Đĩa CD', 'Băng video', 'Dây điện', 'Pin', 'Máy đánh chữ'],
  'dv-doc': ['Ve', 'Bọ chét', 'Bọ xít', 'Kỳ nhông', 'Cá đuối điện'],
  'dv-dungcu': ['Ổ khóa', 'Chìa khóa', 'Quang gánh', 'Cối xay lúa', 'Nong', 'Cần câu', 'Nơm', 'Vó', 'Phân bón', 'Sơn', 'Dao bầu'],
  'dv-giong-meo': ['Mèo tam thể', 'Mèo vàng', 'Mèo mun', 'Mèo tuxedo', 'Mèo calico'],
  'dv-noithat': ['Ổ cắm', 'Công tắc', 'Cửa sổ', 'Cửa ra vào', 'Lịch', 'Camera an ninh', 'Bộ phát wifi', 'Đèn pin', 'Chuông cửa', 'Máy hút bụi', 'Điều khiển'],
  'dv-nuoi': ['Bò tót', 'Dê núi'],
  'dv-phi': ['Kiến ăn kiến', 'Cầy hương'],
  'dv-sung': ['Kỳ lân', 'Ốc sừng', 'Ốc mượn hồn sừng', 'Chim mỏ sừng', 'Hươu xạ', 'Lợn hươu', 'Kỳ lân biển', 'Hươu Bambi', 'Cú sừng', 'Voi ma mút'],
  'dv-tam': ['Bông tai', 'Bàn là', 'Son môi', 'Phấn trang điểm', 'Nước hoa'],
  'dv-tuyet': ['Tê giác Java'],
  'dv-vn': ['Sâu chít', 'Đuông dừa', 'Ngán', 'Chuột xạ', 'Sóc bụng đỏ', 'Sóc chân vàng', 'Sóc mõm hung', 'Sóc vằn lưng', 'Đồi', 'Dúi', 'Đon'],
  'dv-vo': ['Sun', 'Mọt ẩm', 'Bọ biển', 'Rận nước', 'Rận biển', 'Rận biển khổng lồ', 'Chân kiếm', 'Chân ngỗng', 'Hà biển', 'Song mã', 'Ốc sò', 'Dắt'],
  'gia-vi': ['Hạt mắc ca', 'Bột năng', 'Bột mì', 'Bột gạo', 'Bột bắp', 'Bột chiên giòn', 'Bột chiên xù', 'Bột năng nước', 'Gelatin', 'Bột rau câu', 'Men nở', 'Bột nở', 'Muối nở', 'Hàn the', 'Phèn chua', 'Nước tro', 'Nước vôi trong', 'Phô mai', 'Sữa đặc', 'Sữa dừa', 'Kem tươi', 'Bơ', 'Bơ lạt', 'Mỡ lợn', 'Tóp mỡ', 'Tôm khô', 'Sá sùng khô', 'Nước dừa', 'Rượu trắng', 'Rượu nếp', 'Bia nấu ăn', 'Bột trà xanh', 'Bột ca cao', 'Màu thực phẩm', 'Màu dành dành', 'Màu lá dứa', 'Màu gấc', 'Lá cẩm', 'Hoa đậu biếc khô', 'Hạt sen gia vị', 'Nước dùng gà', 'Mạch nha'],
  'kn-hangcn': ['Am-pe', 'Micromet'],
  'kn-hangxe': ['Ram giấy'],
  'kn-hinh': ['Bán kính', 'Đường kính', 'Đường cao', 'Đường trung tuyến', 'Đường phân giác', 'Đường trung trực', 'Đường trung bình', 'Đường chéo', 'Tiếp tuyến', 'Dây cung'],
  'kn-monhoc': ['Sinh hoạt lớp', 'Chào cờ'],
  'kn-thoitiet': ['Hạt mưa', 'Bông tuyết', 'Hình lưỡi liềm'],
  'kn-tiente': ['Tiền đồng xu cổ', 'Stablecoin', 'Tiền điện tử', 'Bảng Ai Cập cổ', 'Vàng thỏi'],
  'lang-nghe': ['Làng nghề Hội An', 'Tân Lập', 'Thanh Thủy'],
  'loai-banh': ['Bánh tro tàu'],
  'loai-hoa': ['Hoa hoa giấy', 'Hoa hoa hậu', 'Hoa hoàng nữ', 'Hoa dại'],
  'ma-anvat': ['Muối tôm Tây Ninh'],
  'ma-bac': ['Rươu chưng'],
  'ma-chao': ['Cháo cám', 'Cháo đặc', 'Cháo loãng', 'Cháo cá ngựa'],
  'ma-che': ['Chè xíu mại'],
  'ma-chu-g': ['Gỏi Ý', 'Gỏi Nhật', 'Gỏi Hàn', 'Gỏi Hawaii', 'Gỏi Peru'],
  'ma-chu-n': ['Nước mía', 'Nộm nộm'],
  'ma-chu-x': ['Xôi Nhật', 'Xôi Hàn', 'Xôi Indonesia', 'Xôi Philippines'],
  'ma-com': ['Cơm Nhật', 'Unagi', 'Cơm mít'],
  'ma-goi': ['Phở cuốn', 'Bò bía', 'Nem nướng', 'Nem lụi', 'Bánh tráng cuốn', 'Gỏi Hawaii', 'Gỏi Peru', 'Gỏi Ý', 'Gỏi Nhật', 'Gỏi Hàn', 'Nộm nộm'],
  'ma-lau': ['Lẩu Haidilao', 'Lẩu băng chuyền Kichi'],
  'ma-mam': ['Bún mắm', 'Lẩu mắm', 'Mắm cá mắm'],
  'ma-ngoai': ['Trà sữa trân châu', 'Gỏi Ý', 'Gỏi Hàn', 'Xôi Nhật', 'Xôi Hàn', 'Xôi Indonesia', 'Xôi Philippines'],
  'ma-ngot': ['Chè xíu mại'],
  'ma-soi': ['Bánh lọt', 'Bánh gật gù', 'Bánh đa nem', 'Bánh đa vừng', 'Bánh đa Kế', 'Bánh đa đỏ Kế', 'Kiểng lặng', 'Nậm pịa'],
  'ma-taybac': ['Rượu ngô', 'Rượu táo mèo', 'Rượu ngô men lá', 'Mắc khén'],
  'ma-xoi': ['Xôi Nhật', 'Xôi Hàn', 'Xôi Indonesia', 'Xôi Philippines'],
  'mau-sac': ['Bảy sắc cầu vồng', 'Magenta', 'Cyan', 'Turquoise'],
  'mon-an': ['Sữa đậu nành', 'Nước mía', 'Rượu ngô men lá', 'Cháo cám', 'Cháo đặc', 'Cháo loãng', 'Cháo cá ngựa', 'Chè xíu mại', 'Nộm nộm', 'Gỏi Hawaii', 'Lẩu Haidilao', 'Lẩu băng chuyền Kichi', 'Mắm cá mắm', 'Rươu chưng', 'Cơm mít', 'Kiểng lặng', 'Bánh tro tàu', 'Bỏng ngô', 'Phô mai que'],
  'ms-vn': ['Đỏ thắm'],
  'n-ao-khoac': ['Áo choàng tắm'],
  'n-ban-tay': ['Mồ hôi tay', 'Lông tay'],
  'n-banh-bot-gao': ['Bánh chưng', 'Bánh chưng gù', 'Bánh chưng đen Tày', 'Bánh tét lá cẩm', 'Bánh ú', 'Bánh ú lá tre', 'Bánh ú nước tro', 'Bánh ú trân châu', 'Bánh cốm', 'Cốm gạo', 'Bỏng gạo', 'Bánh bỏng gạo', 'Bánh bột lọc', 'Bánh lọc trần', 'Bánh khoai mì', 'Bánh tằm khoai mì', 'Bánh chuối hấp', 'Bánh chuối hấp nước cốt dừa', 'Bánh chuối nướng', 'Bánh đúc ngô', 'Bánh cay'],
  'n-banh-mi-ngoai': ['Taco', 'Burrito', 'Shawarma', 'Lebkuchen bánh mì'],
  'n-banh-trang': ['Bánh đa đỏ'],
  'n-dac-san-hn': ['Nem chua Thanh Hóa', 'Nhãn lồng Hưng Yên', 'Sữa chua trân châu Hạ Long', 'Bánh mì Hội An Hà Nội', 'Ổi Bo', 'Bánh cuốn Phủ Lý', 'Canh cá Quỳnh Côi', 'Cá kho Vũ Đại', 'Tương Bần', 'Cà phê Giảng', 'Cà phê Đinh', 'Cà phê Lâm', 'Rượu làng Vân'],
  'n-dac-san-hue': ['Dầu tràm Huế', 'Nón lá Huế', 'Hải sản Tam Giang'],
  'n-dao': ['Dao kéo', 'Dao cạo điện'],
  'n-do-nghe': ['Thùng đồ nghề', 'Túi đồ nghề', 'Giấy bóng kính'],
  'n-doan-phim': ['Nhà phân phối'],
  'n-don-dep': ['Bàn là', 'Máy sấy', 'Xà bông rửa tay'],
  'n-hang-khong': ['Phi công không quân', 'Phi công điều khiển drone'],
  'n-hoa-tet': ['Hoa thiên lý', 'Hoa ngâu', 'Hoa lục bình', 'Hoa sen', 'Hoa dã quỳ', 'Hoa mười giờ'],
  'n-mon-bun': ['Bún bánh canh'],
  'n-mon-ca': ['Ếch om chuối đậu', 'Mực cá rim', 'Cá tuyết Na Uy'],
  'n-mon-tet': ['Rượu thuốc', 'Rượu sâm', 'Rượu cúc', 'Nước ngọt Tết', 'Trà Tết', 'Chè xanh', 'Mâm ngũ quả', 'Chè con ông', 'Bánh tây Tết'],
  'n-mon-thai': ['Trà sữa Thái', 'Trà chanh Thái', 'Cha manao', 'Oliang', 'Nam manao', 'Nam dok anchan', 'Bánh tráng nướng Thái', 'Ice cream Thái'],
  'n-mu': ['Mũ quả táo'],
  'n-nong-cu': ['Lưới vây', 'Cần câu', 'Cái lao', 'Thuyền thúng', 'Rơm', 'Mo cau', 'Lon sữa bò đong gạo', 'Bao tải', 'Lồng gà', 'Cái chòi canh', 'Cái phên', 'Cái liếp'],
  'n-pt-bay': ['Trạm vũ trụ quốc tế', 'Trạm Thiên Cung', 'Trạm Mir', 'Máy bay giấy gấp', 'Đĩa bay'],
  'n-qua-vang': ['Gấc non', 'Quả bần', 'Quả vả', 'Quả mãng cầu ta', 'Mãng cầu', 'Quả mãng cầu Xiêm', 'Quả mãng cầu gai', 'Quả sung chín', 'Quả sim vàng', 'Quả me ngọt'],
  'n-quan-ham': ['Học viên sĩ quan', 'Thượng sĩ quân nhân chuyên nghiệp'],
  'n-thuy-san': ['Bò sát', 'Giun quế', 'Cá ngừ vây xanh nuôi', 'Tôm hùm Alaska nuôi nhốt', 'Sam biển'],
  'n-tieng-keu': ['Tích tắc', 'Vi vu', 'Thánh thót', 'Cót két', 'Cót ca cót két', 'Cọt kẹt', 'Sột soạt', 'Lẹt xẹt', 'Trẹt trẹt', 'Tò te', 'Toe toe', 'Bô bô', 'Oa oa', 'Lanh lảnh', 'Rả rích', 'Đùng đục', 'Rè rè'],
  'n-truong-hoc': ['Đội tuyển học sinh giỏi', 'Thanh tra giáo dục', 'Gia sư'],
  'n-vai': ['Jean rách', 'Vải mỏng', 'Vải Hàn Quốc', 'Vải Nhật', 'Vải Thái', 'Vải Ấn Độ'],
  'n-viet-tat': ['Hihi', 'Hehe', 'Ahihi', 'Hix', 'Ok la'],
  'n-xe-2banh': ['Xe mô tô ba bánh', 'Xe đạp trẻ em có bánh phụ', 'Xe Ural'],
  'nc-day': ['Đàn ching'],
  'nc-dt': ['Đàn ching', 'Trống trường'],
  'nc-hoi': ['Đàn môi'],
  'ng-dongphuc': ['Thám tử', 'Điệp viên'],
  'ng-ngoaitroi': ['Người thả diều'],
  'ng-thucong': ['Thợ cạo', 'Thợ làm gấu bông'],
  'ng-yte': ['Huấn luyện viên chó dẫn đường', 'Người khâm liệm'],
  'nghe-nghiep': ['Học sinh', 'Tình nguyện viên'],
  'ngon-ngu': ['Chữ Nôm', 'Chữ nổi Braille', 'Mã Morse', 'Chữ Thái cổ', 'Chữ Chăm', 'Tiếng Elf'],
  'nha-khoa-hoc': ['Chu Văn An', 'Mạc Đĩnh Chi', 'Nguyễn Hiền', 'Trương Hán Siêu', 'Nguyễn Bỉnh Khiêm', 'Đào Duy Từ', 'Ngô Thì Nhậm', 'Nguyễn Thiếp', 'Phan Thanh Giản'],
  'nhac-cu': ['Máy tạo nhịp', 'Vocoder', 'Máy sampler', 'Đàn ching'],
  'nhan-vat-lich-su': ['Nguyễn Nhật Ánh', 'Bảo Ninh', 'Nguyễn Ngọc Tư', 'Hồ Anh Thái', 'Dương Thu Hương', 'Trần Đăng Khoa', 'Lê Minh Khuê', 'Thanh Thảo', 'Y Phương', 'Nguyễn Duy', 'Lâm Thị Mỹ Dạ', 'Hữu Thỉnh', 'Bằng Việt', 'Ngô Bảo Châu', 'Đàm Thanh Sơn', 'Vũ Hà Văn', 'Lê Bá Khánh Trình', 'Dương Nguyệt Ánh', 'Trịnh Xuân Thuận', 'Nguyễn Thanh Liêm', 'Võ Tòng Xuân'],
  'nn-as': ['Chữ Nôm', 'Chữ Thái cổ', 'Chữ Chăm'],
  'nn-laptrinh': ['JSON', 'YAML', 'TOML', 'INI', 'Markdown', 'Protocol Buffers', 'Thrift', 'Dockerfile', 'XML', 'Svelte'],
  'nn-vn': ['Chữ Nôm', 'Chữ Thái cổ', 'Chữ Chăm'],
  'nv-cm': ['Nguyễn Khuyến', 'Tú Xương', 'Tản Đà', 'Trương Vĩnh Ký', 'Đặng Huy Trứ'],
  'nv-khoa-vn': ['Nguyễn Văn Hiệu Xuân'],
  'nv-lanhdao-tg': ['Quan Vũ', 'Gia Cát Lượng'],
  'nv-van-vn': ['Lê Văn Thịnh', 'Nguyễn Hiền'],
  'nv-vdv': ['Mohamed Salah'],
  'phuong-tien': ['Trạm vũ trụ', 'Đĩa bay', 'Trạm vũ trụ quốc tế', 'Máy bay giấy'],
  'pop-app-xem-phim': ['Audible', 'Fonos'],
  'pop-banh-keo': ['Kẹo Cốm', 'Kẹo cu đơ', 'Kẹo Sìu Châu', 'Kẹo dẻo Jelly', 'Cracker'],
  'pop-cong-chua': ['Fiona', 'Odette', 'Mavis', 'Barbie'],
  'pop-do-an-nhanh': ["Pizza 4P's", 'Sushi Hokkaido', 'Tokyo Deli'],
  'pop-doraemon': ['Đèn thần', 'Khăn tay ma thuật', 'Bóng đèn thông minh', 'Kẹo hai mặt', 'Kẹo mây', "Gian's mom", 'Ruko', 'Đậu gió', 'Chuông thần kỳ', 'Bình tưới cây khổng lồ', 'Máy tạo người', 'Thuốc thấy rõ', 'Kính siêu nhìn', 'Bao tay cứu hỏa', 'Dây thun thời gian', 'Bình phun thời gian', 'Kéo cắt thời gian', 'Máy dịch thời gian', 'Băng cứu thương thời gian'],
  'pop-gameshow': ['Táo Quân'],
  'pop-goi-xe': ['Giao Hàng Nhanh', 'Giao Hàng Tiết Kiệm', 'Viettel Post', 'J&T Express', 'Ninja Van', 'VNPost', 'SPX Express', 'BEST Express'],
  'pop-hang-sua': ['Sữa lạc đà', 'Sữa chuối Hàn Quốc'],
  'pop-hoat-hinh-chieu-rap': ['Monsters'],
  'pop-kpop': ['Hanteo'],
  'pop-marvel': ['Spider-Man 3'],
  'pop-mi-goi': ['Mì tôm chua cay', 'Mì Kim Chi'],
  'pop-mon-han': ['Makgeolli', 'Soju', 'Banana milk'],
  'pop-mon-nhat': ['Sake', 'Shochu', 'Umeshu', 'Genmaicha', 'Sencha', 'Hojicha', 'Mugicha', 'Matcha'],
  'pop-nuoc-giai-khat': ['Bia Tiger', 'Bia Heineken', 'Bia Sài Gòn', 'Bia 333', 'Bia Hà Nội', 'Bia Larue', 'Bia Huda', 'Budweiser', 'Strongbow', 'Somersby', 'Smirnoff Ice', 'Soju', 'Sake', 'Cider', 'Nước Nha Đam', 'Nước Rau Má', 'Nước Chanh Muối', 'Nước yến', 'Bạc Hà', 'Trà Đường Đen'],
  'pop-phim-hoa-ngu': ['Tháng năm rực rỡ'],
  'pop-sieu-anh-hung': ['Nick Fury', 'Phil Coulson', 'Chronicle', 'Loki'],
  'pop-sieu-thi': ['BRGMartAeon MaxValu'],
  'pop-son-tung': ['Có Chàng Trai Viết Lên Cây'],
  'pop-xe-may': ['Kymco', 'Sym', 'Hyosung', 'Xe điện VinFast'],
  'qa-all': ['Cúc áo', 'Khóa kéo'],
  'qa-chan': ['Tất', 'Tất cổ ngắn', 'Tất cổ cao', 'Tất lưới', 'Quần tất', 'Xà cạp'],
  'qg-dao': ['Úc'],
  'sinh-vat-bien': ['Hải âu', 'Hải âu lớn', 'Cá heo sông', 'Cá heo Irrawaddy', 'Cá heo sông Amazon', 'Cá heo sông Hằng', 'Cá heo sông Dương Tử', 'Hải cẩu Baikal', 'Thủy tức', 'Cua dừa', 'Cua đỏ đảo Giáng Sinh', 'Cá ngựa vằn'],
  'song-ho': ['Kênh Nhiêu Lộc', 'Kênh Vĩnh Tế', 'Kênh Tàu Hủ', 'Kênh Tẻ', 'Kênh Đôi', 'Kênh Thị Nghè', 'Kênh Chợ Gạo', 'Kênh Xà No', 'Kênh Rạch Giá - Hà Tiên', 'Đầm Dơi'],
  'tg-bien': ['Kênh đào Panama', 'Kênh đào Suez'],
  'tg-dao-ho': ['Tượng Moai'],
  'tg-kientruc': ['Vịnh Victoria Hồng Kông', 'Ngã tư Shibuya', 'Đảo Robben', 'Thành phố Nazca', 'Đại lộ Danh vọng'],
  'tg-nui': ['Núi Olympus Mons'],
  'tg-tp-as': ['Bali', 'Mát-xcơ-va'],
  'tg-tp-eu': ['Santorini', 'Vladivostok', 'Novosibirsk'],
  'tg-tunhien': ['Tượng Moai', 'Thung lũng Napa', 'Cánh đồng hoa tulip Keukenhof'],
  'the-thao': ['Mạt chược', 'Poker', 'Đánh cầu lông chinh'],
  'trai-cay': ['Nho khô', 'Ô mai', 'Hạnh nhân', 'Óc chó', 'Hạt dẻ', 'Măng tre', 'Quả mọng nước'],
  'tro-choi-dan-gian': ['Hát ru', 'Rước đèn', 'Múa lân', 'Thả đèn trời', 'Trò ô chữ', 'Trò chơi lật hình', 'Trò chơi ghép hình', 'Trò đoán ý đồng đội', 'Chơi tú lơ khơ', 'Chơi đốt pháo', 'Chơi quay đĩa'],
  'tt-bong': ['Golf đĩa', 'Khúc côn cầu dưới nước'],
  'tt-dantoc': ['Hát ru', 'Rước đèn', 'Múa lân', 'Thả đèn trời', 'Trò ô chữ', 'Trò chơi lật hình', 'Trò chơi ghép hình', 'Trò đoán ý đồng đội', 'Chơi tú lơ khơ', 'Chơi đốt pháo', 'Chơi quay đĩa', 'Kung fu', 'Cưỡi ngựa'],
  'tt-olympic': ['Bơi chân vịt'],
  'tt-vo': ['Bắn cung', 'Không Khí đạo'],
  'tu-tay': ['Tay không Tay hòm chìa khóa', 'Tay anh chị Buông tay'],
  'tu-troi': ['Trời ơi'],
  'tu-tuonghinh': ['Cao lớn', 'Béo tròn', 'Ngái ngủ', 'Sâu hoắm', 'Uốn lượn'],
  'tu-tuongthanh': ['Hì hục'],
  'tv-all': ['Đài thiên văn Arecibo', 'Kính thiên văn FAST', 'Kính thiên văn ALMA', 'Kính thiên văn Rất Lớn', 'Kính thiên văn Keck', 'Kính thiên văn Subaru', 'Kính thiên văn Cực Lớn', 'Đài quan sát Vera Rubin', 'Kính thiên văn Sự kiện Chân trời', 'Kính thiên văn Yerkes', 'Đài thiên văn Greenwich', 'Đài thiên văn Nha Trang', 'Đài thiên văn Hòa Lạc', 'Tàu con thoi Enterprise'],
  'tv-caycn': ['Bông lục bình', 'Thanh long ruột đỏ'],
  'tv-chomsao': ['Chòm sao Rua'],
  'tv-cu': ['Rau năn', 'Củ hành lá', 'Củ ngót'],
  'tv-hat': ['Hạt dẻ ngựa', 'Hạt cau'],
  'tv-hoa-chu-h': ['Hoa hoa giấy', 'Hoàng hậu', 'Hải quỳ hoa', 'Hoa hậu', 'Hoàng nữ', 'Hành'],
  'tv-hoa-do': ['Cherry', 'Hoa thanh long', 'Hoa sim', 'Hoa ớt cảnh', 'Hoa nhung tuyết đỏ'],
  'tv-hoa-trang': ['Hoa sắn dây'],
  'tv-nam': ['Nấm da', 'Nấm thuốc'],
  'tv-qua-1tieng': ['Măng'],
  'tv-qua-chu-m': ['Mọng nước', 'Măng tre'],
  'tv-qua-chua': ['Ô mai'],
  'tv-qua-do': ['Me', 'Chùm ruột', 'Quả thanh trà', 'Đu đủ chín', 'Quả mua', 'Quả sim', 'Quả sim chín'],
  'tv-quoc-hoa': ['Hoa nữ hoàng', 'Hoa ngải tây', 'Hoa đuôi chồn', 'Hoa phượng tím', 'Hoa đinh tử', 'Hoa păng xê'],
  'tv-rau-thom': ['Rau má', 'Rau mầm', 'Rau dớn', 'Rau sắng', 'Lá bép', 'Rau càng cua', 'Mắc khén', 'Hạt dổi', 'Thảo quả', 'Hạt thì là'],
  'tv-sao': ['Sao Kim'],
  'tv-thaomoc': ['Tinh dầu tràm', 'Tinh dầu sả', 'Tinh dầu bưởi', 'Tinh dầu oải hương', 'Tinh dầu bạc hà', 'Tinh dầu quế', 'Tinh dầu khuynh diệp', 'Dầu cù là', 'Băng phiến', 'Bạc hà não', 'Dầu gió', 'Xạ hương', 'Ngưu hoàng', 'Xuyên sơn giáp', 'Bạch cương tàm', 'Cây nấm lim xanh', 'Lá chuối', 'Lá dong', 'Lá mít', 'Lá gai'],
  'tv-thuysinh': ['Hạt sen'],
  'tv-tim': ['Khoai lang', 'Hoa forget-me-not', 'Hoa linh lan tím'],
  'vh-lehoi': ['Lễ hội pháo hoa Đà Nẵng', 'Lễ hội hoa Đà Lạt'],
  'vh-nghethuat': ['Kịch nói'],
  'vh-nv-cotich': ['Sự tích ông Táo'],
  'vh-nv-vn': ['Typn'],
  'vh-tay-du-ky': ['Xa Trì Quốc'],
  'vh-unesco': ['Vườn quốc gia Hoàng Liên', 'Vườn quốc gia Chư Mom Ray', 'Vườn quốc gia Ba Bể', 'Vườn quốc gia Kon Ka Kinh', 'Vườn quốc gia Bái Tử Long'],
  'x-banh': ['Bánh tro tàu'],
  'x-bay': ['Chim cánh cụt', 'Đà điểu', 'Chim đà điểu Emu', 'Chim Kiwi', 'Chim cánh cụt hoàng đế', 'Chim Dodo', 'Chim Moa', 'Chim cánh cụt lớn', 'Chim cánh cụt Adelie', 'Chim cánh cụt vua', 'Chim cánh cụt Gentoo', 'Chim cánh cụt quai mũ', 'Chim cánh cụt Galapagos', 'Chim cánh cụt nhỏ', 'Chim cánh cụt Rockhopper', 'Chim cánh cụt châu Phi', 'Chim cánh cụt Magellan', 'Vẹt Kakapo', 'Chim Takahe', 'Chim Weka', 'Chim Kagu', 'Sâu bướm', 'Sâu đo bướm', 'Ve sầu thoát xác', 'Kẹp kìm khổng lồ', 'Bọ chó', 'Kiến sư tử trưởng thành', 'Gián đất', 'Mối lính', 'Mối chúa', 'Dế hang', 'Dế Weta', 'Xe tự hành trên Sao Hỏa', 'Xe tự hành Mặt Trăng', 'Trạm vũ trụ', 'Trạm vũ trụ quốc tế'],
  'x-ca': ['Cá người'],
  'x-dan': ['Đàn ching', 'Đàn sampler'],
  'x-nuoc': ['Ếch phi tiêu độc', 'Ếch phi tiêu xanh', 'Ếch phi tiêu vàng', 'Ếch cây mắt đỏ', 'Ếch bay', 'Ếch cây sần Bắc Bộ', 'Cua dừa', 'Cua đỏ đảo Giáng Sinh', 'Linh dương Sitatunga', 'Kỳ giông lửa', 'Ếch giun', 'Ếch giun Việt Nam'],
  'xe-thuy': ['Tàu lặn', 'Tàu lặn biển sâu'],
};

/** Spellings attached to the wrong answer (a kite under "glider", a flower under "cherry"): the answer stays, they go. */
export const UNALIAS: Record<string, string[]> = {
  'xe-tho': ['Diều'],
  'tv-qua-do': ['Hoa anh đào', 'Sakura'],
  'kn-hangxe': ['Yamaha Audio'],
};

/** Answers merged into another answer of the same question (main name → target main name). */
export const MERGE: Record<string, Record<string, string>> = {
  'tv-hoa-chu-h': { 'Hồng ngoại Pháp': 'Hồng ngoại', 'Hồng môn trắng': 'Hồng môn đỏ' },
};

/** Per question, the soft keys of every name of a struck answer (filled as the book is built). */
export const STRUCK = new Map<string, Set<string>>();

/** Names refused outright though no longer in the book at all (a hidden answer that did not fit, since replaced). */
const REFUSE: Record<string, string[]> = { 'n-quan-ham': ['Chuẩn úy'] };
for (const [id, names] of Object.entries(REFUSE)) STRUCK.set(id, new Set(names.flatMap((n) => [soft(n), 'n:' + norm(n)])));

/** True when the input is one of the names the tidy-up struck from this question. */
export function struck(qid: string, input: string): boolean {
  const s = STRUCK.get(qid);
  return !!s && (s.has(soft(input)) || s.has('n:' + norm(input)));
}

const lower = (s: string) => s.normalize('NFC').toLowerCase();

/** Folds colour variants into their plain answer. The day's hidden answer is never folded away. */
export function foldColours(q: QuestionDef): QuestionDef {
  q = dropAndMerge(q);
  if (q.id.startsWith('ms-') || q.id.startsWith('mau-') || q.family === 'mausac' || q.category === 'Màu sắc') return q;
  const byName = new Map<string, number>();
  q.answers.forEach((a, i) => byName.set(lower(a.aliases[0] ?? a.display), i));
  const gone = new Set<number>();
  const extra = new Map<number, string[]>();
  q.answers.forEach((a, i) => {
    const name = a.aliases[0] ?? a.display;
    if (!FOLD_COLOUR.has(name) || a.key === q.krillKey) return;
    const w = name.split(/\s+/);
    let k = w.length;
    while (k > 1 && COLOURS.has(lower(w[k - 1]))) k--;
    const target = byName.get(lower(w.slice(0, k).join(' ')));
    if (target == null || target === i || gone.has(target)) return;
    gone.add(i);
    extra.set(target, [...(extra.get(target) ?? []), ...a.aliases]);
  });
  if (!gone.size) return q;
  const answers = q.answers
    .map((a, i) => (extra.has(i) ? { ...a, aliases: [...a.aliases, ...extra.get(i)!.filter((x) => !a.aliases.includes(x))] } : a))
    .filter((_, i) => !gone.has(i));
  return { ...q, answers, traps: q.traps?.filter((t) => answers.some((a) => a.key === t)) };
}

function dropAndMerge(q: QuestionDef): QuestionDef {
  const drop = new Set((DROP[q.id] ?? []).map(lower));
  const merge = MERGE[q.id] ?? {};
  const unalias = new Set((UNALIAS[q.id] ?? []).map(lower));
  if (!drop.size && !Object.keys(merge).length && !unalias.size) return q;
  const main = (a: QuestionDef['answers'][number]) => lower(a.aliases[0] ?? a.display);
  const loose = q.answers.flatMap((a) => a.aliases.filter((x) => unalias.has(lower(x))));
  const trimmed = q.answers.map((a) => {
    const aliases = a.aliases.filter((x) => !unalias.has(lower(x)));
    if (aliases.length === a.aliases.length || !aliases.length) return a;
    return { ...a, aliases, display: unalias.has(lower(a.display)) ? aliases[0] : a.display };
  });
  q = { ...q, answers: trimmed };
  let answers = q.answers.filter((a) => a.key === q.krillKey || !drop.has(main(a)));
  // What the struck answers were called, so a player typing one hears at once that it does not fit (instead of the
  // referee being asked, and perhaps teaching it back to the book).
  // Toneless spellings count too ("chim canh cut"), as "n:" keys, unless an answer still in the book reads the same.
  const names = (a: QuestionDef['answers'][number]) => [a.key, ...a.aliases.map(soft), ...a.aliases.map((x) => 'n:' + norm(x))];
  const kept = new Set(answers.flatMap(names));
  const gone = [...q.answers.filter((a) => !answers.includes(a)).flatMap(names), ...loose.flatMap((x) => [soft(x), 'n:' + norm(x)])];
  const struck = gone.filter((k) => k && k !== 'n:' && !kept.has(k));
  if (struck.length) STRUCK.set(q.id, new Set([...(STRUCK.get(q.id) ?? []), ...struck]));
  for (const [from, to] of Object.entries(merge)) {
    const src = answers.find((a) => main(a) === lower(from));
    const dst = answers.find((a) => main(a) === lower(to));
    if (!src || !dst || src === dst || src.key === q.krillKey) continue;
    answers = answers.filter((a) => a !== src).map((a) => (a === dst ? { ...a, aliases: [...a.aliases, ...src.aliases.filter((x) => !a.aliases.includes(x))] } : a));
  }
  return { ...q, answers, traps: q.traps?.filter((t) => answers.some((a) => a.key === t)) };
}
