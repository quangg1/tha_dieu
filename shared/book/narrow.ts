// Narrow prompts that replace the endless ones (see RETIRED in questions.ts): the same topics, asked so that the
// answers are many but finite, the way Krillion asks "Name a Pokémon" rather than "Name a creature".
// Same format as the bank: five tier lines (0 most common … 4 rarest), answers split by ',', spellings by '|'.
import type { RawQuestion } from '../bank.js';

/** lv overrides the level the book would guess from the answer count (1 easy … 3 hard). */
export const NARROW: (RawQuestion & { lv?: number })[] = [
/* ---------------------------------------------------------------- things, colours, home */
{id:'n-pt-bay',c:'Giao thông',q:'Kể tên một loại phương tiện bay',s:['may','chiec'],k:'Thủy phi cơ',t:[
'Máy bay, Trực thăng|Máy bay trực thăng',
'Khinh khí cầu, Tàu vũ trụ|Phi thuyền, Tên lửa, Drone|Flycam|Máy bay không người lái, Dù lượn|Dù',
'Máy bay phản lực, Máy bay chiến đấu|Tiêm kích, Tàu con thoi, Khí cầu, Máy bay cánh quạt, Tàu lượn|Tàu lượn trên không, Máy bay chở khách|Máy bay dân dụng, Máy bay vận tải, Máy bay ném bom, Máy bay trinh sát, Máy bay tàng hình',
'Khí cầu Zeppelin|Zeppelin, Máy bay siêu thanh|Concorde, Máy bay giấy, Xe bay|Ô tô bay, Ba lô phản lực|Jetpack, Diều lượn|Tàu lượn treo, Máy bay hai tầng cánh, Máy bay huấn luyện, Máy bay nông nghiệp, Trực thăng cứu thương, Máy bay chữa cháy, Máy bay tư nhân|Chuyên cơ',
'Máy bay mô hình, Máy bay điều khiển từ xa, Taxi bay, Tàu bay|Phi cơ, Dù bay động cơ|Paramotor, Máy bay một chỗ ngồi, Trạm vũ trụ quốc tế|ISS']},
{id:'n-xe-2banh',c:'Giao thông',q:'Kể tên một loại xe có hai bánh',s:['xe','chiec'],k:'Xe đạp tandem|Xe đạp đôi',t:[
'Xe đạp, Xe máy|Xe gắn máy',
'Xe đạp điện, Xe máy điện, Xe tay ga|Tay ga, Xe số, Xe côn tay|Côn tay',
'Xe đạp địa hình|Xe đạp leo núi, Xe đạp đua|Xe đạp thể thao, Xe đạp gấp, Xe phân khối lớn|Mô tô phân khối lớn|Xe PKL, Xe cào cào|Xe địa hình, Xe Cub|Cub, Xe đạp mini, Xe đạp trẻ em, Xe Vespa|Vespa, Xe scooter điện|Scooter, Xe cân bằng|Segway',
'Xe đạp fixed gear|Fixed gear, Xe đạp BMX|BMX, Xe đạp touring, Xe đạp cổ|Xe đạp Phượng Hoàng, Xe mô tô đua|Xe đua, Xe chopper|Chopper, Xe cruiser, Xe naked bike, Xe touring, Xe Minsk|Minsk, Xe Dream|Dream, Xe Wave, Xe 67|Honda 67, Xe đạp thồ, Xe đạp trợ lực',
'Xe đạp nằm, Xe đạp bánh béo|Fat bike, Xe mô tô ba bánh, Xe máy cảnh sát, Xe mô tô địa hình enduro, Xe trượt scooter|Xe trượt']},
{id:'n-qua-vang',c:'Ẩm thực',q:'Kể tên một loại quả có màu vàng khi chín',s:['qua','trai'],k:'Lêkima|Trứng gà',t:[
'Chuối, Xoài',
'Dứa|Thơm|Khóm, Mít, Đu đủ, Sầu riêng, Chanh vàng',
'Khế, Mơ, Dưa lưới|Dưa vàng, Thị, Bưởi, Cam, Quýt, Hồng, Bí đỏ|Bí ngô, Quất|Tắc, Chanh dây|Chanh leo, Mận vàng, Lê, Táo vàng, Thanh long vàng|Thanh long ruột trắng vỏ vàng',
'Mãng cầu, Sa kê, Đào vàng, Dưa hoàng kim, Nhót, Ổi, Bòn bon, Cóc chín, Gấc non, Lê vàng Hàn Quốc|Lê Hàn Quốc, Kiwi vàng, Cà chua vàng, Ớt chuông vàng, Mướp đắng chín',
'Trái mắc cọp, Quả dâu da, Quả bần, Quả vả, Quả thanh trà, Quả chay, Quả ngấy vàng, Quả mâm xôi vàng, Quả hồng xiêm vàng']},
{id:'n-giuong',c:'Đời sống',q:'Kể tên một món đồ thường có trên giường ngủ',s:['cai','chiec'],k:'Topper',t:[
'Gối, Chăn|Mền',
'Đệm|Nệm, Ga giường|Ga trải giường|Drap, Gối ôm, Màn|Mùng',
'Vỏ gối|Áo gối, Vỏ chăn|Áo chăn, Chiếu, Gấu bông|Thú bông, Điện thoại, Chăn điện, Gối cao su',
'Chăn lông vũ, Chăn bông, Chăn hè|Chăn mỏng, Gối cổ|Gối chữ U, Gối kê chân, Tấm bảo vệ đệm, Chiếu điều hòa|Chiếu mát, Chiếu trúc, Chiếu cói, Màn khung, Sạc điện thoại, Sách, Bịt mắt|Bịt mắt ngủ',
'Gối tựa đầu giường, Chăn lông cừu, Túi chườm, Đệm sưởi, Gối thảo dược, Đồng hồ báo thức']},
{id:'n-don-dep',c:'Đời sống',q:'Kể tên một dụng cụ dùng để dọn dẹp nhà cửa',s:['cai','cay','chiec'],k:'Chổi lông gà',t:[
'Chổi, Cây lau nhà|Chổi lau nhà',
'Máy hút bụi, Hót rác|Ky hốt rác|Xẻng hót rác, Giẻ lau|Khăn lau, Xô|Xô nước, Thùng rác',
'Robot hút bụi, Cây gạt kính|Gạt kính, Găng tay cao su|Găng tay, Bàn chải|Bàn chải cọ, Chổi cọ toilet|Cọ bồn cầu, Nước lau sàn, Nước lau kính, Chổi quét mạng nhện|Chổi mạng nhện',
'Cây lau nhà xoay 360|Chổi lau xoay, Máy lau nhà, Máy rửa xe|Máy xịt rửa, Chổi chít, Chổi tre, Chổi rơm, Khăn microfiber, Miếng bọt biển|Mút rửa, Cây thông bồn cầu|Thụt bồn cầu, Bình xịt, Túi rác, Máy hút bụi cầm tay',
'Máy giặt thảm, Máy hơi nước|Máy vệ sinh hơi nước, Cây lăn bụi|Lăn bụi quần áo, Chổi cước, Bàn chải sắt']},
{id:'n-ghe',c:'Đời sống',q:'Kể tên một loại ghế',s:['ghe','chiec','cai'],k:'Ghế bố',t:[
'Ghế sofa|Sô pha|Sofa, Ghế nhựa',
'Ghế gỗ, Ghế xoay, Ghế đẩu, Ghế xếp|Ghế gấp, Ghế bập bênh, Ghế lười|Ghế hạt xốp',
'Ghế tựa, Ghế dài|Ghế băng, Ghế đôn|Đôn, Ghế mây, Ghế massage, Ghế công thái học, Ghế gaming, Ghế quầy bar, Ghế ăn dặm, Ghế văn phòng, Ghế thư giãn, Ghế đá, Ghế xích đu|Xích đu',
'Ghế bành, Ghế võng, Ghế ngồi bệt, Ghế giám đốc, Ghế trẻ em, Ghế ô tô, Ghế hội trường, Ghế cắt tóc, Ghế nha khoa, Ghế lăn|Xe lăn, Ghế băng chờ|Ghế chờ, Ghế tắm nắng|Ghế bãi biển, Ghế sofa giường|Sofa giường, Ghế Windsor, Ghế Eames, Tràng kỷ',
'Ghế Tolix, Ghế bàn học, Ghế xếp du lịch|Ghế dã ngoại, Ghế cao, Ghế sân vận động, Ngai vàng']},
{id:'n-bep-dien',c:'Đời sống',q:'Kể tên một thiết bị điện trong căn bếp',s:['may','cai','chiec','noi'],k:'Máy làm sữa hạt',t:[
'Nồi cơm điện, Tủ lạnh, Lò vi sóng',
'Bếp từ, Ấm siêu tốc|Ấm đun nước, Máy xay sinh tố, Nồi chiên không dầu, Lò nướng',
'Bếp hồng ngoại|Bếp điện, Máy rửa bát|Máy rửa chén, Máy hút mùi, Nồi áp suất điện, Máy ép trái cây|Máy ép, Máy pha cà phê, Máy lọc nước, Nồi lẩu điện, Máy đánh trứng',
'Máy nướng bánh mì, Máy xay thịt, Máy làm sữa đậu nành, Nồi nấu chậm, Máy xay cà phê, Tủ đông, Lò nướng thùng, Chảo điện, Bếp nướng điện, Máy hút chân không, Máy làm bánh mì, Máy làm kem, Máy làm sữa chua, Nồi cơm điện tử, Ấm sắc thuốc điện',
'Máy rửa rau củ, Máy ép chậm, Máy làm đá, Máy hâm sữa, Máy làm bánh waffle, Nồi chiên hơi nước, Tủ mát']},
{id:'n-vai',c:'Thời trang',q:'Kể tên một loại vải',s:['vai'],k:'Đũi',t:[
'Lụa, Cotton|Vải bông|Cô tông, Jean|Bò|Denim',
'Kaki, Len, Nỉ, Thun, Voan, Ren, Nhung, Lanh|Linen',
'Gấm, Satin, Chiffon, Kate, Polyester, Tơ tằm, Thổ cẩm, Dạ, Da lộn, Organza, Tweed, Flannel, Lụa tơ tằm, Lụa Hà Đông, Nilon|Nylon, Vải dù, Vải bố|Canvas',
'Cashmere, Rayon, Spandex|Lycra, Tencel, Modal, Vải sợi tre|Bamboo, Lụa Mỹ A, Lãnh Mỹ A, The, Tuyn, Voan lụa, Nhung tăm, Kaki thun, Jean rách, Vải cát hàn, Vải tole, Vải xô|Xô muslin, Vải lưới, Vải nỉ bông, Vải gân, Vải bóng',
'Lụa Vạn Phúc, Lụa Bảo Lộc, Vải lanh Hà Lan, Vải thô, Vải gai, Vải tơ chuối, Vải sen|Tơ sen, Vải đay, Vải thổ cẩm Mường']},
{id:'n-dao',c:'Đời sống',q:'Kể tên một loại dao',s:['dao','con','cai'],k:'Dao quắm',t:[
'Dao phay|Dao chặt, Dao gọt|Dao gọt hoa quả',
'Dao thái, Dao rựa, Dao găm, Dao cạo, Dao mổ, Dao rọc giấy',
'Dao bầu, Dao bấm, Dao xếp|Dao gấp, Dao Thụy Sĩ, Dao Thái Lan|Dao Thái, Dao santoku, Dao cắt bánh mì, Dao ăn|Dao bít tết, Dao lọc xương|Dao lọc, Dao bào, Dao phết bơ, Mã tấu, Dao đa năng, Dao làm bếp',
'Dao quắm, Dao bổ cau, Dao cau, Dao Phúc Sen, Dao Đa Sỹ, Dao chặt xương, Dao bổ dưa, Dao tỉa|Dao khắc, Dao rèn, Dao gốm, Dao Nhật|Dao Nhật Bản, Dao Đức, Dao kéo|Kéo, Dao cạo râu, Dao trổ|Dao trổ gỗ, Lưỡi lam, Dao đi rừng, Dao sinh tồn',
'Dao Gurkha|Kukri, Dao Bowie, Dao karambit|Karambit']},
{id:'n-nong-cu',c:'Đời sống',q:'Kể tên một nông cụ truyền thống của nhà nông',s:['cai','chiec'],k:'Gàu dai',t:[
'Cày, Bừa, Cuốc, Liềm',
'Xẻng, Hái, Quang gánh|Đòn gánh, Thúng, Nong, Nia, Gàu sòng',
'Mai, Thuổng, Cào, Nơm, Vó, Cối xay|Cối xay lúa, Cối giã|Cối giã gạo, Sàng, Mẹt, Rổ, Rá, Bồ, Lờ, Đó, Gàu dai',
'Máy tuốt lúa|Máy tuốt, Cối đá, Chày, Ách|Ách trâu, Xe bò|Xe trâu, Gióng, Bồ cót, Cót, Thuyền thúng, Guồng nước, Cọn nước, Lưỡi cày, Cuốc chim, Mo cau, Rơm',
'Cối xay bột, Đôi quang, Xe cút kít, Vồ đập đất, Lưới vây, Vợt']},
{id:'n-do-nghe',c:'Đời sống',q:'Kể tên một dụng cụ trong hộp đồ nghề sửa chữa',s:['cai','cay','chiec'],k:'Thước thủy',t:[
'Búa, Kìm, Tua vít',
'Cờ lê, Mỏ lết, Cưa, Thước dây|Thước, Khoan|Máy khoan, Đinh, Ốc vít',
'Đục, Dao rọc giấy, Băng dính điện|Băng keo, Bút thử điện, Lục giác|Bộ lục giác, Tô vít đa năng, Kéo cắt tôn, Giấy nhám, Keo 502|Keo dán, Máy mài, Mỏ hàn, Kìm cắt, Kìm điện, Đèn pin, Bay|Bay xây',
'Thước thủy|Thước nivô, Ê tô, Dây dọi, Xà beng, Đèn khò, Súng bắn keo, Súng bắn đinh|Súng bắn ghim, Thước kẹp, Máy cưa, Máy bắn vít, Đồng hồ đo điện|Đồng hồ vạn năng, Cưa sắt, Cần siết, Bào, Kìm mỏ nhọn, Kìm bấm',
'Cảo|Vam, Bàn ren, Mũi taro, Dụng cụ tuốt dây, Máy cắt gạch']},
{id:'n-mu',c:'Thời trang',q:'Kể tên một loại mũ hoặc nón',s:['mu','non','chiec','cai'],k:'Nón ngựa',t:[
'Nón lá, Mũ bảo hiểm',
'Mũ lưỡi trai, Mũ len, Mũ cối, Mũ tai bèo|Mũ bucket',
'Mũ phớt, Mũ beret|Mũ bê rê, Mũ rộng vành, Mũ cao bồi, Nón quai thao, Nón bài thơ, Mũ bơi, Mũ cử nhân|Mũ tốt nghiệp, Mũ ông già Noel, Mũ phù thủy, Mũ đầu bếp, Mũ bảo hộ, Mũ sinh nhật, Mũ trùm|Mũ trùm đầu, Mũ cánh chuồn, Vương miện',
'Mũ fedora, Mũ beanie, Mũ snapback, Mũ cói|Nón cói, Mũ panama, Mũ nồi, Mũ ni, Mũ miện, Mũ phi công, Mũ thủy thủ, Mũ y tá, Mũ kêpi|Mũ kê-pi, Mũ chóp|Mũ chóp cao, Mũ quả dưa, Nón tơi, Nón mê, Nón Huế, Mũ bảo hiểm fullface|Fullface, Mũ bảo hiểm nửa đầu',
'Nón ngựa Phú Gia, Mũ mấn, Mũ tai thỏ, Mũ lông, Mũ trùm bông']},
{id:'n-ao-khoac',c:'Thời trang',q:'Kể tên một loại áo khoác',s:['ao','chiec'],k:'Áo tơi',t:[
'Áo khoác gió|Áo gió, Áo phao, Áo hoodie',
'Áo khoác jean|Áo khoác bò, Áo khoác da, Áo măng tô|Áo dạ, Áo cardigan, Áo blazer, Áo vest',
'Áo bomber, Áo khoác chống nắng|Áo chống nắng, Áo khoác kaki, Áo khoác nỉ, Áo gile, Áo khoác dù, Áo phao lông vũ, Áo khoác lông, Áo mưa, Áo len khoác, Áo khoác thể thao',
'Áo parka, Áo trench coat, Áo khoác varsity|Áo bóng chày, Áo khoác hai lớp, Áo khoác cardigan, Áo khoác lửng|Áo croptop khoác, Áo khoác teddy, Áo khoác quân đội|Áo lính, Áo choàng, Áo poncho, Áo khoác tuyết|Áo trượt tuyết, Áo khoác flannel, Áo khoác phi công',
'Áo tơi, Áo khoác lông cừu, Áo khoác bông|Áo bông, Áo choàng tắm, Áo khoác dệt kim']},
{id:'n-trang-suc',c:'Thời trang',q:'Kể tên một món trang sức',s:['chiec','doi'],k:'Xà tích',t:[
'Nhẫn, Dây chuyền|Vòng cổ',
'Bông tai|Khuyên tai, Vòng tay|Lắc tay, Lắc chân|Vòng chân, Kiềng',
'Mặt dây chuyền, Trâm cài tóc|Trâm, Ghim cài áo|Cài áo, Khuyên mũi, Khuyên rốn, Vương miện, Nhẫn cưới, Nhẫn đính hôn, Vòng ngọc, Vòng bạc, Đồng hồ, Choker, Charm',
'Kẹp cà vạt, Khuy măng sét|Cúc măng sét, Hoa tai|Hoa tai ngọc trai, Dây chuyền ngọc trai, Nhẫn đôi, Vòng hạt|Chuỗi hạt, Vòng trầm hương, Vòng tỳ hưu, Ear cuff, Bờm đính đá, Khuyên lưỡi, Kiềng bạc',
'Xà tích, Vòng cổ dân tộc, Bộ trang sức cưới, Dây chuyền thánh giá, Vòng dâu tằm']},
{id:'n-quan',c:'Thời trang',q:'Kể tên một loại quần',s:['quan','chiec'],k:'Quần ống sớ',t:[
'Quần jean|Quần bò, Quần đùi|Quần short',
'Quần âu|Quần tây, Quần kaki, Quần jogger, Quần legging, Quần thể thao',
'Quần ống rộng, Quần ống loe, Quần culottes, Quần yếm, Quần lửng, Quần cargo|Quần túi hộp, Quần baggy, Quần ngủ, Quần lót, Quần bơi, Quần nỉ, Quần đũi, Quần lụa, Quần bò rách',
'Quần tất|Quần tất da, Quần ống côn, Quần skinny, Quần cạp cao, Quần chun, Quần giả váy, Quần ống suông, Quần the, Quần dài|Quần ống dài, Quần mặc nhà, Quần hip hop, Quần kiểu Thái|Quần Thái',
'Quần ống sớ, Quần lá tọa, Quần chẽn, Quần sooc kaki, Quần dù']},
{id:'n-giay-hieu',c:'Thời trang',q:'Kể tên một thương hiệu giày',s:['giay','hang'],k:'Thượng Đình',t:[
'Nike, Adidas, Biti\'s|Bitis',
'Converse, Vans, Puma, New Balance, Ananas, MLB',
'Asics, Skechers, Crocs, Reebok, Fila, Jordan|Air Jordan, Dr. Martens, Clarks, Bata, Timberland, Birkenstock, Havaianas, Vascara, Juno, Onitsuka Tiger, Mizuno, Under Armour, Salomon, Hoka, Li-Ning|Lining, Anta, Biti\'s Hunter',
'Christian Louboutin|Louboutin, Jimmy Choo, Gucci, Balenciaga, Prada, Saint Laurent, Golden Goose, UGG, Aldo, Charles & Keith, Pedro, Ecco, Geox, Steve Madden, Nine West, Lacoste, Puma Suede, Yonex, Kappa, Umbro, Diadora, Brooks, Saucony, On Running|On',
'Thượng Đình, Hồng Thạnh, Lascal, Gosto, Đông Hải']},
/* ---------------------------------------------------------------- jobs, school, words */
{id:'n-quan-ham',lv:2,c:'Lịch sử',q:'Kể tên một cấp bậc quân hàm trong Quân đội nhân dân Việt Nam',s:['cap','quanham'],k:'Đại úy quân nhân chuyên nghiệp|Đại úy QNCN',t:[
'Đại tướng, Thượng tá, Đại úy',
'Trung tướng, Thiếu tướng, Đại tá, Trung tá, Thiếu tá, Thượng úy, Trung úy, Thiếu úy',
'Binh nhất, Binh nhì, Hạ sĩ, Trung sĩ, Thượng sĩ',
'Thượng tướng, Đô đốc|Đô đốc Hải quân, Phó Đô đốc, Chuẩn Đô đốc, Học viên sĩ quan',
'Thượng sĩ quân nhân chuyên nghiệp, Thiếu úy quân nhân chuyên nghiệp, Trung úy quân nhân chuyên nghiệp']},
{id:'n-truong-hoc',c:'Tuổi thơ',q:'Kể tên một chức vụ hoặc vai trò trong trường học',s:['co','thay','ban'],k:'Sao đỏ',t:[
'Hiệu trưởng, Giáo viên chủ nhiệm|Cô chủ nhiệm|Thầy chủ nhiệm, Lớp trưởng',
'Hiệu phó|Phó hiệu trưởng, Lớp phó học tập, Lớp phó, Tổ trưởng, Bí thư|Bí thư chi đoàn, Bảo vệ|Bác bảo vệ, Giáo viên bộ môn',
'Lớp phó văn thể mỹ|Lớp phó văn nghệ, Lớp phó lao động, Thủ quỹ, Tổ phó, Cô lao công|Lao công, Thủ thư|Cô thủ thư, Y tá trường|Cán bộ y tế, Kế toán, Giám thị, Tổng phụ trách Đội, Chi đội trưởng, Liên đội trưởng, Cờ đỏ, Phó bí thư, Cán sự môn, Giáo vụ',
'Trưởng ban nề nếp, Bàn trưởng, Nhóm trưởng, Đội trưởng|Đội viên, Thư ký lớp, Văn thư, Hội trưởng hội phụ huynh, Chủ tịch hội đồng trường, Tổ trưởng chuyên môn, Giáo viên thực tập|Giáo sinh, Cô cấp dưỡng|Cấp dưỡng, Chú lái xe, Trưởng ban văn nghệ, Thầy giám thị',
'Phụ trách sao nhi đồng, Sao trưởng, Tổ trưởng trực nhật, Chủ nhiệm câu lạc bộ, Đội trưởng đội bóng']},
{id:'n-hang-khong',c:'Giao thông',q:'Kể tên một nghề làm việc ở sân bay hoặc hãng hàng không',s:['nhan','vien'],k:'Kiểm soát viên không lưu',t:[
'Phi công, Tiếp viên hàng không|Tiếp viên',
'Cơ trưởng, Cơ phó, Nhân viên an ninh|An ninh sân bay, Nhân viên check-in|Nhân viên làm thủ tục',
'Kiểm soát viên không lưu|Không lưu, Kỹ sư máy bay|Kỹ sư bảo dưỡng, Hải quan|Nhân viên hải quan, Công an cửa khẩu|Biên phòng cửa khẩu, Nhân viên mặt đất, Nhân viên hành lý|Nhân viên bốc xếp, Điều phái viên bay|Điều phái bay, Tiếp viên trưởng, Nhân viên quầy vé|Bán vé, Lái xe đẩy tàu bay|Xe kéo máy bay',
'Nhân viên khí tượng hàng không, Nhân viên cứu hỏa sân bay, Nhân viên tra nạp xăng dầu|Tra nạp nhiên liệu, Nhân viên suất ăn, Nhân viên vệ sinh máy bay, Phi công huấn luyện|Giáo viên bay, Kỹ thuật viên radar, Nhân viên phục vụ phòng chờ, Nhân viên hướng dẫn tàu bay|Marshaller, Nhân viên điều độ',
'Nhân viên bãi đỗ, Nhân viên xe buýt sân đỗ, Nhân viên kiểm định an toàn, Nhân viên y tế sân bay']},
{id:'n-doan-phim',c:'Điện ảnh',q:'Kể tên một công việc trong đoàn làm phim',s:['nguoi'],k:'Thư ký trường quay',t:[
'Đạo diễn, Diễn viên',
'Biên kịch, Quay phim|Nhà quay phim, Nhà sản xuất, Diễn viên đóng thế|Cascadeur',
'Dựng phim|Biên tập phim, Hóa trang|Trang điểm, Phục trang, Đạo cụ, Ánh sáng|Kỹ thuật ánh sáng, Âm thanh|Kỹ thuật âm thanh, Trợ lý đạo diễn, Diễn viên quần chúng, Nhà thiết kế mỹ thuật|Thiết kế bối cảnh, Kỹ xảo|Hiệu ứng hình ảnh, Nhạc sĩ phim|Soạn nhạc phim, Casting|Tuyển diễn viên, Diễn viên lồng tiếng|Lồng tiếng',
'Đạo diễn hình ảnh, Chỉ đạo võ thuật, Biên đạo hành động, Thư ký trường quay, Giám đốc sản xuất, Trợ lý sản xuất, Phụ trách hậu cần, Chỉnh màu|Colorist, Phụ đề, Nhà phân phối, Quản lý bối cảnh, Tiếng động|Foley, Kỹ thuật viên máy quay, Người cầm boom, Người điều khiển flycam',
'Huấn luyện động vật, Đóng thế bằng tay, Người vẽ storyboard, Quản lý diễn viên']},
{id:'n-ban-tay',c:'Cơ thể',q:'Kể tên một bộ phận trên bàn tay',s:['ngon'],k:'Ô mô cái',t:[
'Ngón tay, Móng tay, Lòng bàn tay',
'Ngón cái, Ngón trỏ, Ngón giữa, Ngón áp út, Ngón út, Mu bàn tay',
'Cổ tay, Đốt ngón tay, Vân tay, Kẽ tay|Kẽ ngón tay, Khớp ngón tay|Khớp tay',
'Đầu ngón tay, Chỉ tay|Đường chỉ tay, Gân tay, Mạch máu|Tĩnh mạch, Da tay, Xương đốt, Biểu bì móng|Khóe móng',
'Ô mô cái, Ô mô út, Xương bàn tay, Lưỡi liềm móng']},
{id:'n-nuoc-cham',c:'Ẩm thực',q:'Kể tên một loại nước chấm hoặc nước sốt',s:['nuoc'],k:'Mắm tôm chua',t:[
'Nước mắm, Mắm tôm, Xì dầu|Nước tương',
'Tương ớt, Muối tiêu chanh, Nước mắm chua ngọt, Tương cà|Sốt cà chua, Mắm nêm, Mayonnaise|Sốt mayonnaise',
'Muối ớt, Nước mắm gừng, Tương đen, Mắm me|Nước mắm me, Mắm gừng, Muối tôm, Tương hột, Chao, Nước tương tỏi ớt, Muối ớt xanh, Sốt me, Mù tạt, Sa tế, Xốt BBQ',
'Tương bần, Mắm ruốc, Mắm cáy, Nước chấm bánh cuốn, Nước mắm tỏi ớt, Mắm sả, Muối lá é, Muối hột ớt, Sốt phô mai, Sốt chua ngọt, Sốt teriyaki, Wasabi, Dầu hào, Tương đậu phộng|Sốt đậu phộng, Sốt mè rang, Sốt thái',
'Mắm tôm chua, Muối kiến vàng, Chẳm chéo, Mắm cá linh, Nước mắm Phan Thiết|Nước mắm Phú Quốc']},
{id:'n-tieng-keu',c:'Động vật',q:'Kể tên tiếng kêu của một con vật',s:['tieng','keu'],k:'Ủn ỉn',t:[
'Gâu gâu, Meo meo, Ò ó o',
'Quạc quạc|Cạp cạp, Cục tác, Chiếp chiếp|Chiêm chiếp, Be be, Ò ò|Bò ò, Ộp ộp|Ếch kêu ộp ộp',
'Ủn ỉn|Ụt ịt, Hí|Hí hí, Gầm|Gừ gừ, Rống, Vo ve, Ri ri|Rỉ rả, Cúc cu|Gù gù, Hú, Chít chít, Tắc kè|Tắc kè kêu, Ve ve, Sủa, Gáy|Gà gáy, Líu lo, Quác|Quạ kêu quác quác, Ngao|Meo ngao',
'Vi vu, Ríu rít, Rúc, Hống, Rít, Khè khè, Ụm bò, Oang oác, Lục cục, Te te, Tu hú, Bìm bịp, Cu cu, Ồ ồ, Ủm ủm',
'Gù cúc, Kéc kéc, Chép chép, Thánh thót']},
{id:'n-viet-tat',lv:1,c:'Ngôn ngữ',q:'Kể tên một từ viết tắt hay dùng khi nhắn tin',s:[],k:'Hpbd',t:[
'K|Ko|Không, Đc|Dc|Được, Ok|Oke',
'Ny|Người yêu, J|Gì, Mn|Mọi người, Bn|Bạn, Ib|Inbox, Cmt|Comment, Ns|Nói, Tks|Thanks|Thank you',
'Ae|Anh em, Ad|Admin, Kb|Kết bạn, Ntn|Như thế nào, Nma|Nhưng mà, Bff, Hpbd|Happy birthday, Stt|Status, Vk|Vợ, Ck|Chồng, Gd|Gia đình, Hn|Hôm nay, Bh|Bao giờ, Ms|Mới, Tn|Tin nhắn, Lm|Làm, Ok la|Okela, Omg, Lol, Brb, Fyi, Asap, Pm, Dm, Tl|Trả lời, Rep',
'Đt|Điện thoại, Bt|Bình thường, Vs|Với, Cx|Cũng, Mk|Mình, Ng|Người, Tr|Trời, Nx|Nữa, Lun|Luôn, Iu|Yêu, Kh|Khum, Hum|Hông, Pp|Bye bye, Gn|Good night, Gm|Good morning, Hnay, Wtf, Idk, Btw, Tbh, Irl, Ofc, Np, Thx, Ty',
'Đg|Đang, Chs|Chơi, Bík|Biết, Hix|Huhu, Kkk|Kaka, Hihi, Hehe, Ahihi']},
{id:'n-inside-out',lv:3,c:'Điện ảnh',q:'Kể tên một cảm xúc là nhân vật trong phim Những mảnh ghép cảm xúc (Inside Out)',s:[],k:'Hoài Niệm|Nostalgia',t:[
'Vui Vẻ|Niềm Vui|Joy, Buồn Bã|Nỗi Buồn|Sadness',
'Giận Dữ|Cơn Giận|Anger, Sợ Hãi|Nỗi Sợ|Fear, Chán Ghét|Ghê Tởm|Disgust',
'Lo Âu|Lo Lắng|Anxiety',
'Ganh Tị|Ghen Tị|Envy, Xấu Hổ|Ngượng Ngùng|Embarrassment, Chán Nản|Uể Oải|Ennui',
'']},
{id:'n-con-giap',lv:1,c:'Văn hóa',q:'Kể tên một con giáp trong 12 con giáp',s:['con','tuoi'],k:'Hợi|Lợn|Heo',t:[
'Tý|Chuột, Rồng|Thìn, Hổ|Dần|Cọp',
'Mèo|Mão|Mẹo, Ngựa|Ngọ, Trâu|Sửu',
'Rắn|Tỵ, Dê|Mùi, Khỉ|Thân, Gà|Dậu, Chó|Tuất',
'',
'']},
/* ---------------------------------------------------------------- food */
{id:'n-mon-bun',lv:1,c:'Ẩm thực',q:'Kể tên một món bún',s:['bun','mon'],k:'Bún kèn',t:[
'Bún chả, Bún bò Huế|Bún bò, Bún riêu|Bún riêu cua',
'Bún đậu mắm tôm|Bún đậu, Bún thịt nướng, Bún ốc, Bún cá, Bún mắm, Bún măng vịt|Bún vịt',
'Bún thang, Bún chả cá, Bún mọc, Bún bò Nam Bộ|Bún bò xào, Bún nem|Bún chả giò, Bún hến, Bún mắm nêm, Bún sứa, Bún ngan, Bún cá rô đồng, Bún dọc mùng, Bún gà, Bún lươn, Bún cua, Bún xào, Bún trộn, Bún sườn, Bún tôm, Bún nước lèo, Bún quậy, Bún chả Hà Nội',
'Bún kèn, Bún bung, Bún suông, Bún mắm cá linh, Bún cá ngừ, Bún cá thu, Bún nghêu, Bún bò Bến Nghé, Bún riêu ốc, Bún ốc nguội, Bún mọc dọc mùng, Bún chả que, Bún chay, Bún mì, Bún gạo lứt, Bún bò giò heo, Bún thịt luộc, Bún chấm, Bún mắm tôm, Bún cá Châu Đốc, Bún tôm Hải Phòng, Bún cá cay Hải Phòng, Bún gỏi dà, Bún nước kèn',
'Bún tôm chua, Bún cù kỳ, Bún chả cá Quy Nhơn, Bún sứa Nha Trang, Bún bò bắp, Bún xào Singapore']},
{id:'n-banh-trang',c:'Ẩm thực',q:'Kể tên một món ăn làm từ bánh tráng',s:['banh','mon'],k:'Bánh tráng phơi sương',t:[
'Bánh tráng trộn, Bánh tráng nướng|Pizza Việt',
'Bánh tráng cuốn|Bánh tráng cuốn thịt heo, Bánh tráng me, Bánh tráng muối ớt|Bánh tráng muối, Bánh tráng dẻo|Bánh tráng dẻo tôm, Gỏi cuốn, Chả giò|Nem rán',
'Bánh tráng chấm|Bánh tráng chấm sa tế, Bánh tráng bơ, Bánh tráng cuộn|Bánh tráng cuộn bơ, Bánh tráng phơi sương|Bánh tráng Trảng Bàng, Bánh tráng kẹp|Bánh tráng kẹp Đà Lạt, Bánh tráng cháy tỏi, Bánh tráng sate, Bánh tráng xì ke, Bánh tráng đập|Bánh đập, Bánh tráng mè|Bánh tráng mè nướng, Bánh tráng sữa, Bánh tráng dừa, Bánh tráng ớt',
'Bánh tráng nhúng, Bánh tráng cuốn cá, Bánh tráng cuốn bò, Bánh tráng chiên, Bánh tráng nước dừa, Bánh tráng tôm, Bánh tráng hành, Bánh tráng ruốc, Bánh tráng tắc, Bánh tráng cuốn tép, Cá cuốn bánh tráng|Cá nướng cuốn bánh tráng, Bò cuốn bánh tráng, Thịt luộc cuốn bánh tráng, Bánh tráng lụi, Nem nướng cuốn bánh tráng',
'Bánh tráng gạo lứt, Bánh tráng chuối nướng, Bánh tráng mắm ruốc, Bánh tráng ngọt']},
{id:'n-mon-thai',c:'Ẩm thực',q:'Kể tên một món ăn Thái Lan',s:['mon'],k:'Massaman|Cà ri Massaman',t:[
'Tom yum|Canh chua Thái|Lẩu Thái, Pad Thai|Phở xào Thái|Mì xào Thái',
'Gỏi đu đủ|Som tum|Som tam, Xôi xoài|Mango sticky rice, Cà ri xanh|Green curry, Trà sữa Thái|Trà Thái, Gà nướng Thái|Gai yang',
'Cà ri đỏ|Red curry, Massaman|Cà ri Massaman, Tom kha gai|Canh gà nước cốt dừa, Khao pad|Cơm chiên Thái, Pad kra pao|Thịt xào lá húng quế, Larb|Gỏi thịt bằm, Khao man gai|Cơm gà Thái, Khao soi|Mì cà ri, Moo ping|Thịt heo nướng xiên, Chè Thái, Bánh crepe Thái|Roti chuối, Mì tom yum, Gỏi xoài Thái, Cá chẽm hấp chanh|Pla nueng manao, Satay|Sa tế xiên nướng, Cơm chiên dứa',
'Panang|Cà ri Panang, Yam woon sen|Gỏi miến Thái, Pla rad prik|Cá chiên sốt ớt, Kai jeow|Trứng chiên Thái, Khao niao|Xôi Thái, Boat noodles|Mì thuyền, Pad see ew|Mì xào nước tương, Rad na, Hor mok, Tod mun pla|Chả cá Thái, Kanom krok|Bánh dừa Thái, Tub tim grob|Chè hạt lựu, Lod chong, Gaeng som, Nam tok, Sai ua|Xúc xích Thái, Kuay teow|Hủ tiếu Thái, Khao kha moo|Chân giò kho Thái, Moo kratha|Lẩu nướng Thái',
'Miang kham, Khanom chan, Tom saap, Gaeng hang lay, Khanom jeen']},
{id:'n-banh-mi-ngoai',c:'Ẩm thực',q:'Kể tên một loại bánh mì của nước ngoài',s:['banh','mi','banhmi'],k:'Challah',t:[
'Bánh sừng bò|Croissant, Bánh mì Pháp|Baguette',
'Bánh mì gối|Sandwich|Bánh mì sandwich, Hamburger|Bánh hamburger, Bánh mì Thổ Nhĩ Kỳ|Kebab|Doner kebab, Hotdog|Bánh mì kẹp xúc xích, Bánh mì hoa cúc|Brioche',
'Bagel, Pizza, Naan|Bánh naan, Pita|Bánh pita, Focaccia, Ciabatta, Bánh mì đen, Bánh mì nguyên cám, Sourdough|Bánh mì chua, Pretzel|Bánh quy xoắn, Tortilla|Bánh tortilla, Bánh mì nướng bơ tỏi|Bánh mì bơ tỏi, Muffin Anh|English muffin, Bánh mì sữa Hokkaido|Bánh mì sữa',
'Pain au chocolat, Melonpan|Bánh mì dưa lưới, Bánh mì cà ri Nhật|Kare pan, Bánh mì Hàn Quốc|Bánh mì bơ tỏi Hàn Quốc, Bánh mì Đài Loan, Bánh mì kim sa|Bánh bao chiên, Bánh mì lúa mạch đen|Rye bread, Pumpernickel, Bánh mì soda Ireland|Soda bread, Bánh mì ngô|Cornbread, Chapati, Roti|Bánh roti, Paratha, Lavash, Bánh mì Ý panini|Panini, Grissini, Bánh mì que Pháp, Crumpet, Scone, Bánh mì quế|Cinnamon roll',
'Challah, Stollen, Panettone, Pandoro, Pão de queijo, Arepa, Injera, Khachapuri, Simit, Bialy']},
{id:'n-pasta',c:'Ẩm thực',q:'Kể tên một loại mì Ý hoặc món mì Ý',s:['mi','miy'],k:'Orecchiette',t:[
'Spaghetti|Mì Ý, Mì Ý sốt bò bằm|Bolognese|Spaghetti bò bằm, Carbonara|Mì Ý carbonara',
'Lasagna|Lasagne, Macaroni|Nui, Penne, Mì Ý sốt kem|Alfredo|Fettuccine Alfredo, Mì Ý hải sản|Spaghetti hải sản',
'Fettuccine, Linguine, Fusilli|Nui xoắn, Farfalle|Nui nơ, Ravioli, Tagliatelle, Gnocchi, Rigatoni, Tortellini, Cannelloni, Aglio e olio|Mì Ý tỏi ớt, Pesto|Mì Ý sốt pesto, Mì Ý sốt cà chua|Pomodoro, Mac and cheese|Nui phô mai, Vongole|Mì Ý nghêu',
'Orzo, Capellini|Angel hair, Bucatini, Pappardelle, Conchiglie|Nui vỏ sò, Ditalini, Rotini, Ziti, Cacio e pepe, Amatriciana, Puttanesca, Arrabbiata, Marinara, Mì Ý mực đen|Squid ink, Mì Ý cay, Spaghetti meatballs|Mì Ý thịt viên, Pasta salad|Salad mì Ý, Lasagna rau củ',
'Orecchiette, Strozzapreti, Trofie, Cavatelli, Paccheri']},
{id:'n-dac-san-hn',c:'Ẩm thực',q:'Kể tên một món ăn đặc trưng của Hà Nội',s:['mon'],k:'Chả rươi',t:[
'Phở|Phở Hà Nội, Bún chả|Bún chả Hà Nội',
'Chả cá Lã Vọng|Chả cá, Bánh cuốn|Bánh cuốn Thanh Trì, Cốm|Cốm làng Vòng, Bún thang, Bún ốc, Cà phê trứng',
'Bánh tôm Hồ Tây|Bánh tôm, Bún đậu mắm tôm|Bún đậu, Xôi xéo, Nem rán|Nem, Bánh đúc nóng, Ô mai|Ô mai Hàng Đường, Kem Tràng Tiền, Nem chua rán, Phở cuốn, Phở chiên phồng, Bún riêu, Bánh gối, Bún mọc, Bún dọc mùng, Miến lươn, Lẩu riêu cua',
'Bánh mì sốt vang, Phở xào, Chè bà cốt, Chè Hà Nội, Bánh khúc, Bánh giò, Bánh dày Quán Gánh, Bánh cốm Hàng Than, Canh cá Quỳnh Côi, Bún chả que tre, Phở gà, Phở sốt vang, Trà chanh|Trà chanh Hà Nội, Kem Bờ Hồ, Ốc luộc, Bánh trôi tàu, Bánh rán, Bánh bột lọc|Quẩy nóng, Nộm bò khô|Nộm Hồ Hoàn Kiếm',
'Bún thang Cầu Gỗ, Xôi Yến, Canh bún, Chè sen, Mứt sen, Giò chả Ước Lễ, Bánh cuốn Phủ Lý, Cháo sườn sụn']},
{id:'n-dac-san-hue',c:'Ẩm thực',q:'Kể tên một món ăn đặc trưng của Huế',s:['mon'],k:'Chè bột lọc heo quay',t:[
'Bún bò Huế|Bún bò, Cơm hến',
'Bánh bèo, Bánh lọc|Bánh bột lọc, Bánh nậm, Bánh khoái, Chè Huế, Mè xửng',
'Bánh ướt thịt nướng, Nem lụi, Tôm chua, Bánh canh Nam Phổ, Bún hến, Bánh ram ít, Bánh xèo Huế, Chè hạt sen, Chè bột lọc heo quay, Bánh ít lá gai, Bánh hỏi Huế, Bánh tét Huế, Tré|Tré Huế, Mắm ruốc Huế, Cháo hến, Bánh khoái cá kình, Nem chua Huế, Bún thịt nướng Huế',
'Chè Huế thập cẩm, Chè đậu ván, Chè khoai môn, Bánh đúc Huế, Bánh bột lọc trần, Bánh ướt cuốn tôm chấy, Bánh canh cá lóc, Cơm âm phủ, Vả trộn, Mít trộn, Bánh in, Bánh phu thê Huế|Bánh xu xê, Mứt gừng Huế, Bánh nậm ngọt, Bánh cuốn Huế, Bún thịt nướng',
'Chè sen nhãn|Chè hạt sen bọc nhãn, Cơm hến Cồn Hến, Bún bò giò heo, Bánh khoái Thượng Tứ, Nem công chả phượng']},
{id:'n-mon-tet',c:'Ẩm thực',q:'Kể tên một món ăn ngày Tết của người Việt',s:['mon','banh'],k:'Chè kho',t:[
'Bánh chưng, Bánh tét',
'Giò lụa|Chả lụa|Giò, Dưa hành, Thịt kho tàu|Thịt kho hột vịt|Thịt kho trứng, Canh khổ qua|Canh mướp đắng, Mứt|Mứt Tết, Xôi gấc',
'Thịt đông, Gà luộc, Nem rán|Chả giò, Củ kiệu|Củ kiệu tôm khô, Dưa món, Canh măng|Canh măng móng giò, Hạt dưa, Kẹo lạc, Mứt dừa, Mứt gừng, Mứt sen, Bánh mứt kẹo, Giò thủ, Lạp xưởng|Lạp xường, Nộm, Canh bóng, Bánh phồng tôm, Bánh in, Bánh khảo',
'Thịt nấu đông, Canh bóng thả, Gà luộc lá chanh, Mứt bí, Mứt me, Mứt khoai lang|Khoai lang sấy, Mứt cà rốt, Mứt tắc, Hạt bí, Hạt hướng dương, Hạt điều, Kẹo dừa, Bánh tổ, Bánh gai, Bánh ít, Bánh ú, Bánh thuẫn, Bánh phu thê, Bánh dày, Bánh chưng gấc, Tôm khô, Chả cá, Xôi đậu xanh, Xôi vò, Canh hầm|Canh xương hầm, Thịt bò khô|Khô bò',
'Thịt ngâm mắm, Dưa cải muối, Tré, Thịt heo ngâm nước mắm, Bánh chưng chay']},
{id:'n-hoa-tet',c:'Thực vật',q:'Kể tên một loài hoa hoặc cây cảnh chưng ngày Tết',s:['hoa','cay','canh'],k:'Cây mãn đình hồng',t:[
'Hoa đào|Đào, Hoa mai|Mai vàng|Mai',
'Cây quất|Quất|Tắc, Hoa cúc|Cúc mâm xôi, Hoa lan|Lan hồ điệp, Hoa ly',
'Hoa thủy tiên|Thủy tiên, Hoa lay ơn|Lay ơn, Hoa thược dược, Hoa vạn thọ|Cúc vạn thọ, Hoa cát tường, Hoa đồng tiền, Hoa hồng, Hoa tulip, Hoa mẫu đơn, Hoa trà|Hoa trà mi, Hoa sen, Cây phát tài|Phát tài, Cây kim ngân, Cây trạng nguyên|Hoa trạng nguyên, Cây bưởi cảnh|Bưởi cảnh, Cây phật thủ|Phật thủ, Mai chiếu thủy, Tùng la hán, Cây đào thế|Đào thế, Cây hồng cảnh',
'Hoa đỗ quyên, Hoa dạ yến thảo, Hoa thạch thảo, Hoa cẩm chướng, Hoa sống đời|Sống đời, Hoa cúc đại đóa, Hoa cúc tiger, Hoa salem, Hoa baby, Hoa địa lan, Lan hoàng thảo, Hoa lan vũ nữ, Mai trắng|Bạch mai, Đào phai, Đào bích, Đào Nhật Tân, Mai Yên Tử, Cây lộc vừng|Lộc vừng, Cây kim tiền, Cây vạn lộc, Cây ngũ gia bì, Cây hoa giấy',
'Hoa mõm sói, Hoa violet, Cây đa búp đỏ, Hoa đào rừng']},
/* ---------------------------------------------------------------- pop culture */
{id:'pop-marvel',c:'Điện ảnh',q:'Kể tên một bộ phim của Marvel (Vũ trụ Điện ảnh Marvel)',n:'Phim chiếu rạp thuộc MCU, kể cả phim Người Nhện của Sony–Marvel.',s:['phim'],k:'The Incredible Hulk|Người khổng lồ xanh phi thường',t:[
'Avengers: Endgame|Hồi kết|Endgame, Iron Man|Người Sắt, Avengers|Biệt đội siêu anh hùng',
'Avengers: Infinity War|Cuộc chiến vô cực|Infinity War, Spider-Man: No Way Home|Không còn nhà, Black Panther|Chiến binh Báo Đen, Captain America, Thor, Doctor Strange|Phù thủy tối thượng, Guardians of the Galaxy|Vệ binh dải ngân hà',
'Iron Man 2, Iron Man 3, Thor: Ragnarok|Tận thế Ragnarok, Captain America: Civil War|Nội chiến siêu anh hùng|Civil War, Captain America: The Winter Soldier|Chiến binh mùa đông, Avengers: Age of Ultron|Đế chế Ultron, Ant-Man|Người kiến, Captain Marvel|Đại úy Marvel, Spider-Man: Homecoming|Người Nhện: Trở về nhà, Spider-Man: Far From Home|Người Nhện xa nhà, Black Widow|Góa phụ đen, Shang-Chi|Shang-Chi và huyền thoại thập nhẫn, Eternals|Chủng tộc bất tử, Deadpool & Wolverine, Guardians of the Galaxy Vol. 2|Vệ binh dải ngân hà 2, Guardians of the Galaxy Vol. 3|Vệ binh dải ngân hà 3, Doctor Strange in the Multiverse of Madness|Phù thủy tối thượng trong đa vũ trụ hỗn loạn, Black Panther: Wakanda Forever|Wakanda bất diệt',
'Thor: The Dark World|Thế giới bóng tối, Thor: Love and Thunder|Tình yêu và sấm sét, Captain America: The First Avenger|Kẻ báo thù đầu tiên, Ant-Man and the Wasp|Người kiến và chiến binh ong, Ant-Man and the Wasp: Quantumania|Thế giới lượng tử, The Marvels|Biệt đội Marvel, Captain America: Brave New World|Thế giới mới, Thunderbolts|Thunderbolts*, The Fantastic Four: First Steps|Bộ tứ siêu đẳng: Bước đi đầu tiên',
'The Incredible Hulk|Người khổng lồ xanh phi thường, Spider-Man: Brand New Day']},
{id:'pop-bts-bp',lv:1,c:'Âm nhạc',q:'Kể tên một thành viên của nhóm BTS hoặc Blackpink',s:[],k:'Jin|Kim Seok-jin',t:[
'Lisa, Jennie, Jisoo, Rosé|Rose|Chaeyoung, Jungkook|Jeon Jungkook',
'V|Taehyung|Kim Taehyung, Jimin|Park Jimin, Suga|Yoongi|Min Yoongi|Agust D, RM|Namjoon|Kim Namjoon|Rap Monster',
'J-Hope|Jhope|Hoseok|Jung Hoseok',
'','']},
{id:'pop-lien-quan',c:'Giải trí',q:'Kể tên một tướng trong Liên Quân Mobile',s:['tuong'],k:'Goverra',t:[
'Nakroth, Murad, Valhein, Violet',
'Butterfly, Yorn, Krixi, Tel\'Annas, Raz, Ryoma, Zuka, Lữ Bố|Lubu, Điêu Thuyền, Triệu Vân, Ngộ Không, Florentino, Elsu, Hayate, Tulen, Liliana, Airi, Quillen, Superman, Batman, Wonder Woman',
'Arthur, Thane, Toro, Grakk, Alice, Chaugnar, Mganga, Kahlii, Natalya, Veera, Lauriel, Ilumia, Zephys, Kriknak, Omega, Mina, Taara, Gildur, Slimz, Maloch, Lumburr, Skud, Kil\'Groth, The Flash|Flash, Joker, Aleister, Preyta, Wisp, Zill, Arum, Marja, Ishar, Capheny, Thorne, Lindis, Yena, Sephera, Rouie, Annette, Baldum, Wiro, Amily, Max, Qi, Roxie, Moren, Payna, Richter, Enzo, Allain, Volkath, Dirak, Paine, Laville, Sinestrea, Keera, Ata, Yan, Aoi, Errol, Krizzix, Teeri, Iggy, Tachi, Celica, Dextra, Bijan, Erin, Bonnie, Ming, Zata, Stuart, Bright, Yue, Eland\'orr, Lorion, Billow, Heino, Kaine, Ignis, Biron, Jinna, Astrid, Xeniel, Fennik, Azzen\'Ka',
'Goverra, Bolt Baron, Charlotte, Sinestrea, Dolia, Eland\'orr, Allain, Lumburr','']},
{id:'pop-pokemon',lv:2,c:'Giải trí',q:'Kể tên một Pokémon thế hệ đầu tiên (151 con đầu)',s:[],k:'Mew',t:[
'Pikachu, Charmander, Bulbasaur, Squirtle, Charizard',
'Raichu, Mewtwo, Snorlax, Jigglypuff, Psyduck, Meowth, Eevee, Gengar, Gyarados, Magikarp, Onix, Charmeleon, Ivysaur, Venusaur, Wartortle, Blastoise, Pidgey, Caterpie, Butterfree, Ditto, Vulpix, Ninetales, Lapras, Dragonite, Machop, Geodude, Abra, Slowpoke',
'Metapod, Weedle, Kakuna, Beedrill, Pidgeotto, Pidgeot, Rattata, Raticate, Spearow, Fearow, Ekans, Arbok, Sandshrew, Sandslash, Nidoran, Nidorina, Nidoqueen, Nidorino, Nidoking, Clefairy, Clefable, Wigglytuff, Zubat, Golbat, Oddish, Gloom, Vileplume, Paras, Parasect, Venonat, Venomoth, Diglett, Dugtrio, Persian, Golduck, Mankey, Primeape, Growlithe, Arcanine, Poliwag, Poliwhirl, Poliwrath, Kadabra, Alakazam, Machoke, Machamp, Bellsprout, Weepinbell, Victreebel, Tentacool, Tentacruel, Graveler, Golem, Ponyta, Rapidash, Slowbro, Magnemite, Magneton, Farfetch\'d, Doduo, Dodrio, Seel, Dewgong, Grimer, Muk, Shellder, Cloyster, Gastly, Haunter, Drowzee, Hypno, Krabby, Kingler, Voltorb, Electrode, Exeggcute, Exeggutor, Cubone, Marowak, Hitmonlee, Hitmonchan, Lickitung, Koffing, Weezing, Rhyhorn, Rhydon, Chansey, Tangela, Kangaskhan, Horsea, Seadra, Goldeen, Seaking, Staryu, Starmie, Mr. Mime, Scyther, Jynx, Electabuzz, Magmar, Pinsir, Tauros, Vaporeon, Jolteon, Flareon, Porygon, Omanyte, Omastar, Kabuto, Kabutops, Aerodactyl, Articuno, Zapdos, Moltres, Dratini, Dragonair',
'','']},
{id:'pop-google',c:'Công nghệ',q:'Kể tên một sản phẩm hoặc ứng dụng của Google',s:['google','ung','dung'],k:'Google Keep',t:[
'Gmail, YouTube, Google Maps|Maps|Bản đồ, Google Chrome|Chrome',
'Google Drive|Drive, Google Dịch|Google Translate|Google Translate, Google Meet|Meet, Android, Google Docs|Docs, Google Sheets|Sheets|Trang tính, Google Photos|Google Ảnh, Play Store|CH Play|Google Play, Gemini|Bard',
'Google Classroom|Classroom, Google Calendar|Lịch Google, Google Keep, Google Forms|Forms|Biểu mẫu, Google Slides|Trang trình bày, Google Lens, Google Earth, Google Pay|Google Wallet, Pixel|Google Pixel, YouTube Music, YouTube Kids, Google Home|Google Nest, Google Assistant|Trợ lý Google, Google Tin tức|Google News, Google Sites, Google Scholar|Google Học thuật, Blogger, Gboard, Google Fit, Chromebook, Google Analytics, Google Ads, Google Search|Google Tìm kiếm, Hangouts, Google Duo, Google+, Waze, Fitbit, Google Chat',
'Google Lens, Google Arts & Culture, Google Trends, Google Books, Google Fonts, Google Cloud, Firebase, Google Colab, Google Sky, Google Street View|Street View, Picasa, Google Reader, Stadia, Google Glass, Nest Hub, Chromecast, NotebookLM, Google Finance, Google Flights, Google Domains, Google Workspace|G Suite, YouTube Shorts, YouTube Premium, Google One, Google Authenticator, Tensor',
'Google Wave, Orkut, Google Buzz, Google Allo, Google Inbox']},
{id:'pop-apple',c:'Công nghệ',q:'Kể tên một sản phẩm phần cứng của Apple',s:['apple'],k:'Apple Pencil',t:[
'iPhone, iPad, MacBook|Macbook Air|Macbook Pro',
'AirPods, Apple Watch, iMac, Mac mini',
'iPad Pro, iPad Air, iPad mini, MacBook Air, MacBook Pro, AirPods Pro, AirPods Max, Apple TV, HomePod, iPod|iPod nano|iPod shuffle, iPod touch, AirTag, Apple Pencil, Magic Mouse|Chuột Apple, Magic Keyboard|Bàn phím Apple, Vision Pro|Apple Vision Pro, Mac Pro, Mac Studio, HomePod mini, iPhone SE',
'Studio Display, Pro Display XDR, Magic Trackpad, Apple Watch Ultra, Apple Watch SE, AirPort|AirPort Extreme, Time Capsule, iPod classic, Newton, Apple II, Macintosh, eMac, iBook, PowerBook, Power Mac, MagSafe, EarPods, Siri Remote',
'Apple I, Lisa, Xserve']},
{id:'pop-doraemon',c:'Tuổi thơ',q:'Kể tên một nhân vật hoặc bảo bối trong Doraemon',s:[],k:'Dorami',t:[
'Doraemon, Nobita, Xuka|Shizuka, Chaien|Jaian|Gian, Xeko|Suneo, Cánh cửa thần kỳ|Cửa thần kỳ|Cửa đi khắp nơi',
'Dekhi|Dekisugi, Dorami, Chong chóng tre, Bánh mì trí nhớ, Cỗ máy thời gian, Đèn pin thu nhỏ, Túi thần kỳ|Túi 4 chiều, Mẹ Nobita|Bà Tamako|Tamako, Bố Nobita|Ông Nobi|Nobisuke, Thầy giáo|Thầy giáo của Nobita, Bánh rán|Dorayaki',
'Jaiko|Chaiko|Em gái Chaien, Mẹ Chaien, Sewashi|Cháu Nobita, Mini Dora, Đội quân Doraemon|Doraemon thân yêu, Khăn trùm thời gian, Máy dịch, Kẹo dịch|Thạch dịch thuật, Điện thoại dạo|Bốt điện thoại nếu như, Áo choàng tàng hình, Mũ đá cuội|Mũ đá cuội vô hình, Đèn pin phóng to, Cỗ máy may mắn, Gương lật ngược, Đồng hồ ngưng đọng thời gian, Bút chì tự trả lời|Bút chì máy tính, Máy cho mượn, Dây thừng thần kỳ, Bánh quy mạnh mẽ, Đôi giày khổng lồ, Súng bắn không khí|Pháo không khí, Ông Kaminari|Ông hàng xóm khó tính',
'Bà nội Nobita, Pisuke|Khủng long Pisuke, Lilulu|Riruru',
'']},
{id:'pop-cong-chua',c:'Tuổi thơ',q:'Kể tên một công chúa hoặc nữ chính Disney',s:['cong','chua','nang'],k:'Tiana',t:[
'Elsa, Lọ Lem|Cinderella, Bạch Tuyết|Snow White, Nàng tiên cá|Ariel',
'Anna, Belle|Người đẹp|Bella, Rapunzel|Công chúa tóc mây, Jasmine|Công chúa Jasmine, Moana, Mulan|Hoa Mộc Lan, Aurora|Người đẹp ngủ trong rừng',
'Pocahontas, Merida|Công chúa tóc xù, Tiana|Công chúa và con ếch, Raya, Mirabel, Asha, Ella, Alice, Wendy, Tinker Bell|Tiên Tinker Bell, Esmeralda, Megara|Meg, Jane Porter|Jane, Nala',
'Kida, Giselle, Vanellope, Elena|Elena xứ Avalor, Sofia|Công chúa Sofia, Anastasia, Odette|Công chúa thiên nga, Mavis, Fiona|Công chúa Fiona, Leia|Công chúa Leia, Barbie',
'Eilonwy, Melody, Calla, Mira']},
{id:'pop-hang-xa-xi',lv:2,c:'Thời trang',q:'Kể tên một thương hiệu thời trang xa xỉ',s:['hang'],k:'Loewe',t:[
'Gucci, Louis Vuitton|LV, Chanel, Dior|Christian Dior',
'Hermès|Hermes, Prada, Versace, Balenciaga, Burberry, Saint Laurent|Yves Saint Laurent|YSL',
'Fendi, Givenchy, Valentino, Celine, Bottega Veneta, Dolce & Gabbana|D&G, Armani|Giorgio Armani, Moschino, Miu Miu, Loewe, Alexander McQueen, Balmain, Off-White, Tom Ford, Ralph Lauren, Michael Kors, Coach, Kenzo, Hugo Boss|Boss, Salvatore Ferragamo|Ferragamo, Cartier, Rolex, Tiffany & Co.|Tiffany, Bulgari|Bvlgari, Montblanc, Goyard, Jimmy Choo, Christian Louboutin|Louboutin',
'Maison Margiela, Rick Owens, Comme des Garçons, Issey Miyake, Vivienne Westwood, Marc Jacobs, Kate Spade, Tory Burch, Longchamp, Furla, Mulberry, Chloé, Lanvin, Jil Sander, Thom Browne, Brunello Cucinelli, Loro Piana, Zegna|Ermenegildo Zegna, Moncler, Stone Island, Patek Philippe, Audemars Piguet, Omega, Van Cleef & Arpels, Chopard, Harry Winston, Jacquemus, Acne Studios, Golden Goose, Elie Saab, Dsquared2, Philipp Plein',
'Schiaparelli, Delvaux, Berluti, Brioni, Kiton']},
{id:'pop-my-pham-han',lv:2,c:'Mua sắm',q:'Kể tên một thương hiệu mỹ phẩm Hàn Quốc',s:['hang'],k:'Primera',t:[
'Innisfree, Laneige, Some By Mi',
'Sulwhasoo, Ohui, Whoo|The History of Whoo, The Face Shop, Black Rouge, Romand|Rom&nd, 3CE, Klairs|Dear Klairs, Cosrx, Hera, Missha, Etude House|Etude',
'Skin1004, Torriden, Anua, Round Lab, Klavuu, Tony Moly, Nature Republic, The Saem, Holika Holika, Mamonde, IOPE, Su:m37, Dr. Jart+, AHC, Medicube, Mediheal, Banila Co, Peripera, Merzy, Espoir, Lilybyred, Bbia, Huxley, Goodal, Isntree, Beauty of Joseon, Clio, Skinfood, Neogen, Mizon, Purito, Belif, Primera, Ma:nyo|Manyo, VT Cosmetics|VT, Cell Fusion C, Hanyul, Aestura, Illiyoon, Jumiso, Numbuzin, Abib, Axis-Y, Wonjin, Dr. Ceuracle, Celimax, Mediheal',
'Shangpree, A\'pieu, It\'s Skin, Leaders, Benton, Pyunkang Yul, Sioris, Ample:N, Tocobo, Fwee, Hince, Amuse, Wakemake, Dasique, Unleashia, Fourth Ray, Nacific, Secret Key, Elizavecca, Lador, Ryo, Mise en Scène, Moonshot, Too Cool For School, Laneige Men, Innisfree Man',
'Daeng Gi Meo Ri, Sooryehan, Coreana, Charmzone, Enprani']},
/* ---------------------------------------------------------------- sport, books, history */
{id:'pop-ngoai-hang-anh',lv:2,c:'Thể thao',q:'Kể tên một câu lạc bộ từng đá giải Ngoại hạng Anh',s:['clb','doi'],k:'Swindon Town',t:[
'Manchester United|MU|Man Utd, Liverpool, Chelsea, Arsenal',
'Manchester City|Man City, Tottenham|Tottenham Hotspur|Spurs, Newcastle United|Newcastle, Aston Villa, Leicester City|Leicester, Everton, West Ham United|West Ham',
'Wolverhampton|Wolves, Brighton|Brighton & Hove Albion, Crystal Palace, Fulham, Brentford, Nottingham Forest, Southampton, Leeds United|Leeds, Bournemouth|AFC Bournemouth, Burnley, Sunderland, Watford, Norwich City|Norwich, Stoke City|Stoke, West Bromwich Albion|West Brom, Sheffield United, Middlesbrough, Blackburn Rovers|Blackburn, Bolton Wanderers|Bolton, Swansea City|Swansea, Wigan Athletic|Wigan, Ipswich Town|Ipswich, Luton Town|Luton, Hull City, Cardiff City, Queens Park Rangers|QPR, Portsmouth, Reading',
'Birmingham City, Blackpool, Charlton Athletic|Charlton, Coventry City, Derby County, Huddersfield Town, Sheffield Wednesday, Wimbledon, Oldham Athletic, Barnsley, Bradford City',
'Swindon Town']},
{id:'nv-bong-vang',lv:2,c:'Thể thao',q:'Kể tên một cầu thủ từng giành Quả bóng Vàng',n:'Giải Ballon d\'Or của tạp chí France Football.',s:[],k:'Igor Belanov',t:[
'Lionel Messi|Messi, Cristiano Ronaldo|Ronaldo CR7|CR7',
'Ronaldo Nazário|Ronaldo béo|Rô béo, Ronaldinho, Kaká, Zinedine Zidane|Zidane, Luka Modrić|Modric, Karim Benzema|Benzema',
'Michel Platini|Platini, Marco van Basten|Van Basten, Johan Cruyff|Cruyff, Franz Beckenbauer|Beckenbauer, Rivaldo, Luís Figo|Figo, Michael Owen|Owen, Pavel Nedvěd|Nedved, Andriy Shevchenko|Shevchenko, Fabio Cannavaro|Cannavaro, Roberto Baggio|Baggio, George Weah|Weah, Rodri, Ousmane Dembélé|Dembele, Lothar Matthäus|Matthäus, Ruud Gullit|Gullit, Gerd Müller, Eusébio, George Best, Bobby Charlton, Lev Yashin|Yashin, Alfredo Di Stéfano|Di Stefano, Paolo Rossi, Hristo Stoichkov|Stoichkov, Jean-Pierre Papin|Papin, Matthias Sammer|Sammer, Alexia Putellas, Aitana Bonmatí',
'Stanley Matthews, Raymond Kopa|Kopa, Luis Suárez Miramontes, Omar Sívori|Sivori, Josef Masopust, Denis Law, Flórián Albert, Gianni Rivera, Oleg Blokhin|Blokhin, Allan Simonsen, Kevin Keegan|Keegan, Karl-Heinz Rummenigge|Rummenigge, Igor Belanov',
'']},
{id:'nv-nobel-van',lv:3,c:'Văn học',q:'Kể tên một nhà văn hoặc nhà thơ từng đoạt giải Nobel Văn học',s:[],k:'Krasznahorkai László|László Krasznahorkai',t:[
'Ernest Hemingway|Hemingway, Rabindranath Tagore|Tagore|Ta-go, Mạc Ngôn|Mo Yan',
'Gabriel García Márquez|García Márquez|Marquez, Albert Camus|Camus, Kawabata Yasunari|Kawabata, Han Kang, Bob Dylan, Kazuo Ishiguro|Ishiguro, Mikhail Sholokhov|Sholokhov|Sô-lô-khốp, Boris Pasternak|Pasternak, Aleksandr Solzhenitsyn|Solzhenitsyn, Jean-Paul Sartre|Sartre, Hermann Hesse|Hesse, Rudyard Kipling|Kipling, Pablo Neruda|Neruda, John Steinbeck|Steinbeck, Thomas Mann',
'William Faulkner|Faulkner, Toni Morrison, Orhan Pamuk|Pamuk, Ōe Kenzaburō|Oe Kenzaburo, Ivan Bunin|Bunin, Joseph Brodsky|Brodsky, Octavio Paz, Mario Vargas Llosa|Vargas Llosa, Doris Lessing, Alice Munro, Louise Glück, Annie Ernaux, Abdulrazak Gurnah, Jon Fosse, Patrick Modiano, Svetlana Alexievich, Peter Handke, Olga Tokarczuk, Wisława Szymborska|Szymborska, Czesław Miłosz, Seamus Heaney, Samuel Beckett|Beckett, T.S. Eliot, George Bernard Shaw|Bernard Shaw, W.B. Yeats|Yeats, Winston Churchill|Churchill, Pearl S. Buck|Pearl Buck, Ernest Hemingway, Sinclair Lewis, Eugene O\'Neill, Saul Bellow, Gabriela Mistral, Selma Lagerlöf, Knut Hamsun, Henryk Sienkiewicz, Romain Rolland, Anatole France, Maurice Maeterlinck, Luigi Pirandello, Naguib Mahfouz, Wole Soyinka, Nadine Gordimer, J.M. Coetzee|Coetzee, V.S. Naipaul|Naipaul, Cao Hành Kiện|Gao Xingjian, Imre Kertész, Elfriede Jelinek, Harold Pinter, José Saramago|Saramago, Dario Fo, Günter Grass, Camilo José Cela, Derek Walcott, Tomas Tranströmer, Bjørnstjerne Bjørnson, Sully Prudhomme, Theodor Mommsen, Paul Heyse, Gerhart Hauptmann, André Gide, Hermann Hesse, Halldór Laxness, Juan Ramón Jiménez, Salvatore Quasimodo, Giorgos Seferis, Ivo Andrić, Miguel Ángel Asturias, Heinrich Böll, Eyvind Johnson, Patrick White, Elias Canetti, William Golding, Claude Simon, Jaroslav Seifert, Le Clézio|J.M.G. Le Clézio, Herta Müller, Dario Fo',
'','']},
{id:'vh-tay-du-ky',c:'Văn học',q:'Kể tên một nhân vật trong Tây Du Ký',s:[],k:'Lục Nhĩ Mi Hầu',t:[
'Tôn Ngộ Không|Ngộ Không|Tề Thiên Đại Thánh, Trư Bát Giới|Bát Giới, Đường Tăng|Đường Tam Tạng|Tam Tạng, Sa Tăng|Sa Ngộ Tĩnh',
'Bạch Long Mã, Ngưu Ma Vương, Thiết Phiến Công Chúa|Bà La Sát, Hồng Hài Nhi, Bạch Cốt Tinh, Như Lai|Phật Tổ Như Lai, Quan Âm|Quan Âm Bồ Tát|Quan Thế Âm, Ngọc Hoàng',
'Thái Thượng Lão Quân, Na Tra, Nhị Lang Thần|Dương Tiễn, Thác Tháp Thiên Vương|Lý Tịnh, Thái Bạch Kim Tinh, Hằng Nga, Nữ vương Nữ Nhi Quốc|Nữ Nhi Quốc, Kim Giác Đại Vương|Kim Giác, Ngân Giác Đại Vương|Ngân Giác, Hoàng Mi Đại Vương|Hoàng Mi, Bồ Đề Tổ Sư, Đông Hải Long Vương|Long Vương, Diêm Vương, Tây Vương Mẫu|Vương Mẫu, Cự Linh Thần, Nhện tinh|Tri Thù Tinh, Thanh Ngưu Tinh, Sư Đà Vương|Sư Đà Lĩnh, Kim Sí Đại Bằng, Thổ Địa, Hắc Hùng Tinh|Gấu đen, Thiên Bồng Nguyên Soái, Quyển Liêm Đại Tướng, Đường Thái Tông|Lý Thế Dân, Ngụy Trưng, Hồng Hài Nhi',
'Văn Thù Bồ Tát, Phổ Hiền Bồ Tát, Di Lặc|Phật Di Lặc, Ô Kê Quốc Vương, Xa Trì Quốc, Thỏ Ngọc tinh|Thỏ Ngọc, Ngọc Diện Công Chúa, Hoàng Phong Quái, Hổ Lực Đại Tiên, Lộc Lực Đại Tiên, Dương Lực Đại Tiên, Trấn Nguyên Tử, Linh Cảm Đại Vương, Độc Giác Quỷ Vương, Hạt Tử Tinh|Bò cạp tinh, Bạch Hoa Xà tinh, Kim Ngư tinh, Thanh Sư, Bạch Tượng, Huệ Ngạn Hành Giả|Mộc Tra',
'']},
{id:'vh-harry-potter',lv:2,c:'Văn học',q:'Kể tên một nhân vật trong truyện Harry Potter',s:[],k:'Nick suýt mất đầu|Nearly Headless Nick',t:[
'Harry Potter|Harry, Hermione Granger|Hermione, Ron Weasley|Ron, Voldemort|Chúa tể Voldemort|Tom Riddle',
'Albus Dumbledore|Dumbledore|Cụ Dumbledore, Severus Snape|Snape|Thầy Snape, Rubeus Hagrid|Hagrid, Draco Malfoy|Malfoy|Draco, Sirius Black|Sirius, Dobby, Minerva McGonagall|McGonagall, Ginny Weasley|Ginny, Luna Lovegood|Luna, Neville Longbottom|Neville',
'Fred Weasley|Fred, George Weasley|George, Remus Lupin|Lupin, Bellatrix Lestrange|Bellatrix, Hedwig, Cedric Diggory|Cedric, Cho Chang, Lucius Malfoy, Dudley Dursley|Dudley, Vernon Dursley, Petunia Dursley|Dì Petunia, Peter Pettigrew|Đuôi Trùn, Mắt Điên Moody|Moody, Nymphadora Tonks|Tonks, Dolores Umbridge|Umbridge, Gilderoy Lockhart|Lockhart, Quirinus Quirrell|Quirrell, Horace Slughorn|Slughorn, Filius Flitwick|Flitwick, Sybill Trelawney|Trelawney, Argus Filch|Filch, Myrtle khóc nhè|Myrtle, Fawkes, Buckbeak|Bằng Mã, Nagini, Crookshanks, Scabbers, Kreacher, Gellert Grindelwald|Grindelwald, Newt Scamander, Lily Potter, James Potter, Molly Weasley, Arthur Weasley, Percy Weasley, Bill Weasley, Charlie Weasley, Fleur Delacour|Fleur, Viktor Krum|Krum, Bà Pomfrey|Madam Pomfrey, Ollivander, Aberforth Dumbledore, Barty Crouch, Rita Skeeter, Oliver Wood, Pomona Sprout|Giáo sư Sprout, Kingsley Shacklebolt',
'Seamus Finnigan, Dean Thomas, Lavender Brown, Parvati Patil, Padma Patil, Vincent Crabbe|Crabbe, Gregory Goyle|Goyle, Teddy Lupin, Albus Severus Potter, Scorpius Malfoy, Narcissa Malfoy, Regulus Black, Cornelius Fudge, Rufus Scrimgeour, Xenophilius Lovegood, Griphook, Fang, Hokey, Winky, Firenze, Aragog, Norbert, Fluffy|Chó ba đầu, Peeves, Mundungus Fletcher, Lee Jordan, Katie Bell, Colin Creevey, Ernie Macmillan, Hannah Abbott, Zacharias Smith, Romilda Vane, Cormac McLaggen, Marcus Flint, Alastor Moody, Fenrir Greyback, Igor Karkaroff, Olympe Maxime|Bà Maxime, Ludo Bagman, Arabella Figg|Bà Figg, Helga Hufflepuff, Godric Gryffindor, Rowena Ravenclaw, Salazar Slytherin, Nicolas Flamel',
'']},
{id:'nv-tong-thong-my',c:'Lịch sử',q:'Kể tên một tổng thống Mỹ',s:['tongthong'],k:'Chester A. Arthur|Chester Arthur',t:[
'Donald Trump|Trump, Barack Obama|Obama, Abraham Lincoln|Lincoln, George Washington|Washington',
'Joe Biden|Biden, John F. Kennedy|Kennedy|JFK, Bill Clinton|Clinton, George W. Bush|Bush con, Franklin D. Roosevelt|Franklin Roosevelt|FDR, Richard Nixon|Nixon, Thomas Jefferson|Jefferson, Ronald Reagan|Reagan',
'George H. W. Bush|Bush cha, Theodore Roosevelt|Teddy Roosevelt, Jimmy Carter|Carter, Lyndon B. Johnson|Lyndon Johnson, Dwight D. Eisenhower|Eisenhower, Harry S. Truman|Truman, Gerald Ford|Ford, Woodrow Wilson|Wilson, John Adams, Andrew Jackson|Jackson, James Madison|Madison, James Monroe|Monroe, Ulysses S. Grant|Grant',
'John Quincy Adams, Martin Van Buren, William Henry Harrison, John Tyler, James K. Polk|Polk, Zachary Taylor, Millard Fillmore, Franklin Pierce, James Buchanan, Andrew Johnson, Rutherford B. Hayes, James A. Garfield|Garfield, Grover Cleveland|Cleveland, Benjamin Harrison, William McKinley|McKinley, William Howard Taft|Taft, Warren G. Harding|Harding, Calvin Coolidge|Coolidge, Herbert Hoover|Hoover',
'']},
/* ---------------------------------------------------------------- places */
{id:'dd-ho-hn',c:'Du lịch',q:'Kể tên một hồ ở Hà Nội',s:['ho'],k:'Hồ Văn Chương',t:[
'Hồ Gươm|Hồ Hoàn Kiếm, Hồ Tây',
'Hồ Trúc Bạch, Hồ Thiền Quang, Hồ Thủ Lệ, Hồ Bảy Mẫu|Hồ Ba Mẫu, Hồ Ngọc Khánh, Hồ Giảng Võ, Hồ Thành Công',
'Hồ Văn Chương, Hồ Đống Đa, Hồ Linh Đàm, Hồ Định Công, Hồ Yên Sở, Hồ Kim Liên, Hồ Hoàng Cầu, Hồ Láng Thượng, Hồ Đền Lừ, Hồ Văn Quán, Hồ Nghĩa Đô, Hồ Đắc Di, Hồ Hai Bà Trưng, Hồ Suối Hai, Hồ Đồng Mô, Hồ Quan Sơn',
'Hồ Mễ Trì, Hồ Thanh Nhàn, Hồ Ngọc Hà, Hồ Đầm Vân Trì|Đầm Vân Trì, Hồ Tuy Lai, Hồ Ngải Sơn, Hồ Xuân Khanh, Hồ Văn Sơn, Hồ Đồng Quan, Hồ Hạ Đình, Hồ Phùng Khoang, Hồ Tân Mai',
'']},
{id:'dd-da-lat',c:'Du lịch',q:'Kể tên một điểm tham quan ở Đà Lạt',s:[],k:'Đường hầm điêu khắc',t:[
'Hồ Xuân Hương, Thung lũng Tình Yêu, Chợ Đà Lạt|Chợ đêm Đà Lạt',
'Langbiang|Núi Langbiang, Ga Đà Lạt|Ga xe lửa Đà Lạt, Đồi chè Cầu Đất|Cầu Đất, Hồ Tuyền Lâm, Thiền viện Trúc Lâm, Thác Datanla, Quảng trường Lâm Viên|Quảng trường hoa dã quỳ, Dinh Bảo Đại|Dinh III',
'Thác Prenn, Thác Pongour, Thác Cam Ly, Nhà thờ Con Gà|Nhà thờ chính tòa Đà Lạt, Biệt thự Hằng Nga|Crazy House|Ngôi nhà điên, Đồi Mộng Mơ, Vườn hoa thành phố|Vườn hoa Đà Lạt, Hồ Than Thở, Đường hầm điêu khắc|Đường hầm đất sét, Chùa Linh Phước|Chùa Ve Chai, Đồi cỏ hồng, Hồ Đa Thiện, Thung lũng Vàng, Đỉnh Lang Biang, Rừng thông, Cáp treo Đà Lạt, Đường hoa mai anh đào, Làng hoa Vạn Thành, Đồi chè Tâm Châu, Ga Trại Mát, Nhà ga Đà Lạt, Puppy Farm|Trang trại cún, Fresh Garden, Quê Garden, Samten Hills, Đồi thông Hai Mộ, Hồ Chiến Thắng, Viện Pasteur Đà Lạt, Trường Cao đẳng Sư phạm Đà Lạt, Biệt điện Trần Lệ Xuân, Dinh I, Dinh II, Nhà thờ Domaine de Marie',
'Thác Voi, Thác Hang Cọp, Thác Bảo Đại, Núi Bà, Đồi Robin, Đồi Thiên Phúc Đức, Hồ Vô Cực, Làng Cù Lần, Làng hoa Thái Phiên, Ma Rừng Lữ Quán, Chùa Linh Sơn, Thiền viện Vạn Hạnh, Dốc Nhà Làng, Khu Hòa Bình, Cây thông cô đơn, Rừng thông Bidoup, Bidoup - Núi Bà|Vườn quốc gia Bidoup Núi Bà',
'']},
{id:'dd-sa-pa',c:'Du lịch',q:'Kể tên một điểm tham quan ở Sa Pa',s:[],k:'Bản Tả Phìn|Tả Phìn',t:[
'Fansipan|Đỉnh Fansipan, Bản Cát Cát|Cát Cát',
'Thác Bạc, Núi Hàm Rồng|Hàm Rồng, Đèo Ô Quy Hồ|Ô Quy Hồ, Nhà thờ đá Sa Pa|Nhà thờ đá, Thung lũng Mường Hoa|Mường Hoa, Bản Tả Van|Tả Van, Cầu Mây',
'Bản Lao Chải|Lao Chải, Bản Tả Phìn|Tả Phìn, Thác Tình Yêu, Chợ tình Sa Pa, Chợ Sa Pa, Cổng Trời Ô Quy Hồ|Cổng Trời, Bãi đá cổ Sa Pa, Hồ Sa Pa, Bản Sín Chải, Bản Bản Hồ|Bản Hồ, Ruộng bậc thang Sa Pa|Ruộng bậc thang, Ga cáp treo Fansipan|Cáp treo Fansipan, Đỉnh Fansipan Legend|Sun World Fansipan Legend, Đỉnh Lảo Thẩn|Lảo Thẩn, Moana Sa Pa, Tu viện cổ Tả Phìn, Bản Ý Linh Hồ, Bản Seo Mí Tỷ',
'Đỉnh Lùng Cúng, Bản Lếch Dao, Bản Nậm Cang, Rừng Trúc Tả Van, Đỉnh Bạch Mộc Lương Tử|Ky Quan San, Đỉnh Nhìu Cồ San, Suối Mường Hoa, Thung lũng Sử Pán, Bản Sử Pán, Làng Ma Tra',
'']},
{id:'dd-hue',c:'Du lịch',q:'Kể tên một di tích hoặc điểm tham quan ở Huế',s:[],k:'Hổ Quyền',t:[
'Đại Nội|Hoàng thành Huế|Kinh thành Huế, Chùa Thiên Mụ, Cầu Trường Tiền, Sông Hương',
'Lăng Tự Đức, Lăng Khải Định, Lăng Minh Mạng, Ngọ Môn, Điện Thái Hòa, Chợ Đông Ba, Núi Ngự Bình, Kỳ Đài|Cột cờ Huế',
'Lăng Gia Long, Lăng Thiệu Trị, Lăng Đồng Khánh, Lăng Dục Đức, Tử Cấm Thành, Đàn Nam Giao, Hổ Quyền, Điện Hòn Chén, Văn Miếu Huế, Cung An Định, Trường Quốc Học|Quốc Học Huế, Nhà thờ Phủ Cam, Chùa Từ Hiếu, Chùa Từ Đàm, Thế Miếu, Hiển Lâm Các, Cửu Đỉnh, Cung Diên Thọ, Phu Văn Lâu, Cầu ngói Thanh Toàn, Làng cổ Phước Tích, Biển Thuận An, Đầm Lập An, Đèo Hải Vân, Bạch Mã|Vườn quốc gia Bạch Mã, Lăng Cô, Phá Tam Giang, Đồi Thiên An, Hồ Thủy Tiên|Công viên nước bỏ hoang, Làng hương Thủy Xuân',
'Điện Kiến Trung, Duyệt Thị Đường, Lầu Ngũ Phụng, Cửa Hiển Nhơn, Cửa Thượng Tứ, Tàng Thư Lâu, Hồ Tịnh Tâm, Trấn Hải Thành, Nhà vườn An Hiên, Nhà vườn Ngọc Sơn, Chùa Huyền Không Sơn Thượng, Chùa Báo Quốc, Chùa Diệu Đế, Đồi Vọng Cảnh, Ga Huế, Cầu Dã Viên, Cầu Phú Xuân, Bảo tàng Cổ vật Cung đình Huế, Đường Lê Lợi Huế',
'']},
{id:'tg-olympic',lv:3,c:'Thế giới',q:'Kể tên một thành phố từng hoặc sắp đăng cai Thế vận hội',n:'Cả Thế vận hội Mùa hè và Mùa đông.',s:['thanhpho'],k:'Antwerp',t:[
'Paris, Tokyo, Bắc Kinh|Beijing, London|Luân Đôn',
'Los Angeles, Rio de Janeiro|Rio, Sydney, Seoul, Athens|Athena|Aten, Barcelona, Moscow|Mát-xcơ-va|Moskva, Atlanta, Berlin',
'Brisbane, Amsterdam, Stockholm, Helsinki, Melbourne, Rome|Roma, Mexico City, Munich|München, Montreal, St. Louis|Saint Louis, Antwerp|Antwerpen, Sochi, Pyeongchang|PyeongChang, Vancouver, Nagano, Sapporo, Salt Lake City, Turin|Torino, Lillehammer, Calgary, Sarajevo, Lake Placid, Innsbruck, Grenoble, Albertville, Milan|Milano, Cortina d\'Ampezzo|Cortina',
'Chamonix, St. Moritz|Sankt Moritz, Garmisch-Partenkirchen, Oslo, Squaw Valley',
'']},
/* ---------------------------------------------------------------- animals, plants, sky */
{id:'dv-giong-cho',c:'Động vật',q:'Kể tên một giống chó',s:['cho','con','giong'],k:'Chó Bắc Hà',t:[
'Husky, Chó Phú Quốc|Phú Quốc, Corgi, Poodle|Chó Poodle',
'Chihuahua, Pug, Golden Retriever|Golden, Becgie|Chó Becgie|Chó Đức|German Shepherd|Chó chăn cừu Đức, Alaska|Alaskan Malamute, Samoyed, Shiba Inu|Shiba, Phốc sóc|Pomeranian, Chó cỏ|Chó ta, Bulldog, Labrador, Pitbull',
'Rottweiler, Doberman, Chó lạp xưởng|Dachshund, Beagle, Akita, Chó Bắc Kinh|Pekingese, Chó Nhật|Japanese Chin, Shih Tzu, Chow Chow, Dalmatian|Chó đốm, Border Collie, Becgie Bỉ|Malinois, Ngao Tây Tạng|Tibetan Mastiff, Yorkshire Terrier|Yorkshire, Maltese|Chó Maltese, Schnauzer, Great Dane|Chó Ngao Đan Mạch, Saint Bernard|Chó Saint Bernard, Greyhound, Bull Terrier, Cane Corso|Corso, Boxer, Phốc hươu|Chó Min Pin, Chó H\'Mông cộc đuôi|H\'Mông cộc đuôi, Chó Lài, Chó Bắc Hà, Chó Mông Cổ|Chó cỏ Mông Cổ, Shar Pei, Bichon Frise|Bichon, Cocker Spaniel, Chó chăn cừu Úc|Australian Shepherd, Pháp Bulldog|French Bulldog|Bull Pháp, Chó Bully|American Bully, Chó Becgie trắng',
'Basset Hound, Bloodhound, Whippet, Afghan Hound, Borzoi, Weimaraner, Vizsla, Dogo Argentino, Mastiff, Newfoundland, Bernese|Bernese Mountain Dog, Akita Mỹ, Kai Ken, Jindo|Chó Jindo, Papillon, Cavalier King Charles, Jack Russell Terrier, Westie|West Highland Terrier, Scottish Terrier, Fox Terrier, Airedale, Collie|Chó Lassie, Shetland Sheepdog, Old English Sheepdog, Alaskan Klee Kai, Kangal, Chó Xoloitzcuintli|Chó không lông Mexico, Chó Basenji, Chó Rhodesian Ridgeback',
'']},
{id:'dv-giong-meo',c:'Động vật',q:'Kể tên một giống mèo',s:['meo','con','giong'],k:'Mèo Khao Manee',t:[
'Mèo Anh lông ngắn|Mèo Aln|British Shorthair, Mèo Ba Tư|Persian, Mèo ta|Mèo mướp',
'Mèo Xiêm|Siamese, Mèo Munchkin|Munchkin|Mèo chân ngắn, Mèo tai cụp|Scottish Fold, Mèo Maine Coon|Maine Coon, Mèo Sphynx|Mèo không lông|Sphynx, Mèo Ragdoll|Ragdoll, Mèo Bengal|Bengal, Mèo Anh lông dài|British Longhair',
'Mèo Exotic|Exotic Shorthair|Mèo Ba Tư mặt tịt, Mèo Nga xanh|Russian Blue, Mèo Ai Cập|Egyptian Mau, Mèo Abyssinian|Abyssinian, Mèo Miến Điện|Burmese, Mèo Himalaya|Himalayan, Mèo rừng Na Uy|Norwegian Forest, Mèo Thổ Nhĩ Kỳ|Turkish Angora|Mèo Angora, Mèo Devon Rex|Devon Rex, Mèo tam thể, Mèo vàng, Mèo mun|Mèo đen, Mèo Ragamuffin, Mèo Savannah|Savannah, Mèo Mỹ lông ngắn|American Shorthair, Mèo Thái|Mèo Thái Lan, Mèo Xiêm Thái',
'Mèo Cornish Rex, Mèo Selkirk Rex, Mèo Birman|Mèo Miến Điện thiêng, Mèo Tonkinese, Mèo Bombay, Mèo Chartreux, Mèo Somali, Mèo Balinese, Mèo Siberia|Siberian, Mèo Manx|Mèo cụt đuôi, Mèo Bobtail Nhật|Japanese Bobtail, Mèo Toyger, Mèo Ocicat, Mèo Lykoi|Mèo người sói, Mèo Peterbald, Mèo Don Sphynx, Mèo Korat, Mèo Singapura, Mèo Havana Brown, Mèo Nebelung, Mèo LaPerm, Mèo American Curl|Mèo tai xoắn, Mèo Chausie, Mèo Pixie-bob',
'']},
{id:'tv-go-quy',lv:2,c:'Thực vật',q:'Kể tên một loại gỗ',s:['go','cay'],k:'Gỗ Nghiến',t:[
'Gỗ lim|Lim, Gỗ thông|Thông, Gỗ sồi|Sồi',
'Gỗ gụ|Gụ, Gỗ hương|Hương, Gỗ trắc|Trắc, Gỗ mun|Mun, Gỗ xoan|Xoan|Xoan đào, Gỗ mít|Mít, Gỗ cao su|Cao su, Gỗ keo|Keo, Gỗ óc chó|Óc chó|Walnut, Gỗ tràm|Tràm, Gỗ tre|Tre',
'Gỗ sến|Sến, Gỗ táu|Táu, Gỗ đinh|Đinh, Gỗ cẩm lai|Cẩm lai, Gỗ gõ|Gõ đỏ, Gỗ pơ mu|Pơ mu, Gỗ sưa|Sưa|Trắc thối, Gỗ nghiến|Nghiến, Gỗ giáng hương|Giáng hương, Gỗ căm xe|Căm xe, Gỗ teak|Giá tỵ|Teak, Gỗ tần bì|Tần bì|Ash, Gỗ phong|Maple, Gỗ anh đào|Cherry, Gỗ hồ đào|Hickory, Gỗ bạch đàn|Bạch đàn, Gỗ mỡ|Mỡ, Gỗ dầu|Dầu, Gỗ chò chỉ|Chò chỉ, Gỗ kim giao|Kim giao, Gỗ thủy tùng|Thủy tùng, Gỗ hoàng đàn|Hoàng đàn, Gỗ trầm hương|Trầm hương|Trầm, Gỗ đàn hương|Đàn hương, Gỗ MDF|MDF, Gỗ ép|Gỗ công nghiệp, Gỗ thông Phần Lan, Gỗ dổi|Dổi, Gỗ vàng tâm|Vàng tâm, Gỗ muồng|Muồng, Gỗ me tây, Gỗ bằng lăng, Gỗ sao|Sao, Gỗ chiu liu, Gỗ cà chít, Gỗ huỳnh đàn, Gỗ cẩm thị, Gỗ bách xanh|Bách xanh, Gỗ tuyết tùng|Tuyết tùng, Gỗ balsa|Balsa',
'Gỗ ngọc am, Gỗ trai, Gỗ lát hoa|Lát hoa, Gỗ hồng sắc, Gỗ cẩm xe, Gỗ ké, Gỗ trám, Gỗ re, Gỗ vạng, Gỗ sa mu|Sa mu, Gỗ bồ đề, Gỗ xà cừ|Xà cừ, Gỗ muồng đen, Gỗ dáng hương, Gỗ gù hương, Gỗ cà te, Gỗ lim xanh, Gỗ mahogany|Dái ngựa',
'']},
{id:'tv-rau-thom',c:'Thực vật',q:'Kể tên một loại rau thơm (rau gia vị)',s:['rau','la','cay'],k:'Rau ngổ|Ngò om',t:[
'Rau mùi|Ngò|Ngò rí, Húng quế|Rau quế, Tía tô, Hành lá|Hành',
'Rau răm, Kinh giới, Diếp cá|Rau diếp cá, Thì là, Ngò gai|Mùi tàu, Húng lủi|Húng bạc hà|Bạc hà, Rau mùi tàu',
'Húng Láng, Lá lốt, Rau ngổ|Ngò om, Hẹ|Lá hẹ, Sả, Lá chanh, Lá chúc|Lá chanh Thái, Rau má, Mùi tây|Ngò tây|Parsley, Kinh giới Ý|Oregano, Hương thảo|Rosemary, Xạ hương|Thyme, Lá nguyệt quế|Lá thơm|Bay leaf, Rau mầm, Rau thơm, Lá é, Lá cách, Lá mơ|Mơ lông, Lá sung, Lá đinh lăng|Đinh lăng, Ngổ điếc, Lá tía tô đất, Rau đắng',
'Húng chó|Húng trâu, Húng cây, Húng chanh|Tần dày lá, Ngò ôm, Hành tăm, Rau càng cua, Rau mùi Lào|Thì là Lào, Lá giang, Lá bép, Rau dớn, Rau sắng, Ngải cứu|Ngải, Lá móc mật, Mắc khén, Hạt dổi|Lá dổi, Thảo quả, Lá xương sông, Lá trầu không|Trầu không, Tarragon, Hạt thì là, Lá cà ri, Xô thơm|Sage, Ngò rí Mỹ, Bạc hà âu|Mint',
'']},
{id:'tv-quoc-hoa',lv:3,c:'Thực vật',q:'Kể tên một loài hoa được coi là quốc hoa của một nước',s:['hoa'],k:'Hoa Mugunghwa|Mugunghwa|Hoa dâm bụt Syria',t:[
'Hoa sen|Sen, Hoa anh đào|Anh đào|Sakura, Hoa tulip|Tulip|Uất kim hương',
'Hoa hồng|Hồng, Hoa mẫu đơn|Mẫu đơn, Hoa cúc|Cúc|Hoa cúc vàng, Hoa lan|Lan, Hoa hướng dương|Hướng dương, Hoa nhài|Nhài|Hoa lài',
'Hoa mugunghwa|Mugunghwa|Hoa dâm bụt Syria, Hoa diên vĩ|Diên vĩ|Iris|Hoa iris, Hoa đỗ quyên|Đỗ quyên, Hoa phượng tím|Phượng tím, Hoa sứ|Sứ|Hoa champa|Hoa đại, Hoa dâm bụt|Dâm bụt|Râm bụt|Hoa bụp, Hoa mai|Mai, Hoa lan hồ điệp|Lan hồ điệp, Hoa nữ hoàng|Protea, Hoa thủy tiên|Thủy tiên, Hoa cẩm chướng|Cẩm chướng, Hoa hồng Tudor, Hoa xương rồng|Xương rồng, Hoa thạch nam|Thạch nam, Hoa ngô đồng, Hoa cúc trắng|Cúc trắng, Hoa keo vàng|Keo vàng|Wattle, Hoa trà|Hoa trà mi|Trà mi, Hoa mận',
'Hoa Rafflesia|Rafflesia, Hoa giọt tuyết, Hoa edelweiss|Nhung tuyết, Hoa linh lan|Linh lan, Hoa thanh cúc|Thanh cúc, Hoa anh túc|Anh túc, Hoa ngải tây, Hoa súng xanh|Súng xanh, Hoa đuôi chồn, Hoa ngọc lan, Hoa bougainvillea|Hoa giấy, Hoa ratchaphruek|Muồng hoàng yến, Hoa Kalachuchi|Hoa sứ trắng, Hoa Sampaguita, Hoa sen xanh, Hoa phong lan Vanda|Vanda, Hoa đinh tử, Hoa păng xê|Păng xê',
'']},
{id:'tv-ve-tinh',lv:3,c:'Vũ trụ',q:'Kể tên một mặt trăng (vệ tinh tự nhiên) trong Hệ Mặt Trời',s:['ve','tinh','vetinh'],k:'Miranda',t:[
'Mặt Trăng|Trăng|Moon, Titan',
'Europa, Ganymede, Io, Callisto, Phobos, Deimos, Enceladus, Triton, Charon',
'Mimas, Rhea, Iapetus, Dione, Tethys, Hyperion, Phoebe, Miranda, Ariel, Umbriel, Titania, Oberon, Nereid, Amalthea, Himalia, Proteus, Pan, Atlas, Prometheus, Pandora, Janus, Epimetheus, Puck, Larissa, Dysnomia, Nix, Hydra, Kerberos, Styx, Hi\'iaka, Namaka',
'Metis, Adrastea, Thebe, Leda, Elara, Carme, Pasiphae, Sinope, Ananke, Lysithea, Telesto, Calypso, Helene, Ymir, Cordelia, Ophelia, Bianca, Cressida, Desdemona, Juliet, Portia, Rosalind, Belinda, Perdita, Mab, Cupid, Caliban, Sycorax, Naiad, Thalassa, Despina, Galatea, Halimede, Sao, Neso, Psamathe, Laomedeia',
'']},
{id:'n-thuy-san',c:'Đại dương',q:'Kể tên một loài thủy sản được nuôi ở Việt Nam',s:['con','ca','tom'],k:'Cá bớp',t:[
'Tôm sú, Cá tra|Cá basa, Tôm thẻ|Tôm thẻ chân trắng',
'Cá rô phi, Cá chép, Cá trắm|Cá trắm cỏ, Cá lóc|Cá quả|Cá chuối, Cá trê, Cua|Cua biển, Ếch, Lươn, Cá diêu hồng|Diêu hồng, Tôm càng xanh, Tôm hùm, Ba ba',
'Cá mè, Cá trôi, Cá rô đồng, Cá chình, Cá tầm, Cá hồi|Cá hồi vân, Cá bớp, Cá mú|Cá song, Cá chẽm|Cá vược, Cá kèo, Cá thát lát|Cá thác lác, Cá bống tượng, Cá chạch, Hàu, Ngao|Nghêu, Sò huyết, Ốc hương, Ốc bươu, Tôm hùm bông, Cá chim vây vàng|Cá chim, Cá hồng mỹ, Cá đối, Rong nho, Ngọc trai|Trai ngọc, Sò điệp, Bào ngư, Hải sâm, Cá koi|Cá chép Nhật, Cá cảnh, Cá sấu',
'Cá lăng, Cá ngạnh, Cá leo, Cá tai tượng, Cá sặc, Cá he, Cá chày, Cá mè hoa, Cá trắm đen, Cá rô đầu vuông, Cá chép giòn, Cá trắm giòn, Cá rô phi đỏ, Tôm rằn, Tôm đất, Cá dìa, Cá ngựa, Cua gạch, Ghẹ, Vẹm xanh, Tu hài, Mực, Bạch tuộc, Ốc nhảy, Ốc len, Sá sùng, Rong sụn, Rong câu',
'']},
{id:'n-mon-ca',c:'Ẩm thực',q:'Kể tên một món ăn chế biến từ cá',s:['mon'],k:'Cá kho làng Vũ Đại',t:[
'Cá kho|Cá kho tộ, Canh chua cá, Cá chiên|Cá rán, Chả cá',
'Cá nướng, Cá hấp, Lẩu cá, Gỏi cá, Cháo cá, Bún cá, Cá sốt cà chua, Cá kho tiêu, Canh cá, Cá lóc nướng trui',
'Chả cá Lã Vọng, Cá kho riềng, Cá kho dưa, Cá om dưa, Cá rô kho, Cá chép om dưa, Cá chép hấp bia, Cá chiên xù, Cá kho làng Vũ Đại|Cá kho Vũ Đại, Cá bống kho tiêu, Cá nục kho, Cá ngừ kho, Cá trê nướng, Cá hồi nướng, Sashimi cá hồi|Sashimi, Sushi, Cá viên chiên|Cá viên, Chả cá thát lát, Mắm cá, Canh chua cá lóc, Cá kèo nướng, Lẩu cá kèo, Cá lóc hấp bầu, Cá rán sốt chua ngọt, Cá chiên nước mắm, Cá hấp xì dầu, Cá diêu hồng chiên, Cá nục hấp cuốn bánh tráng, Cá thu sốt cà, Cá khô|Khô cá, Bánh canh chả cá, Cá linh kho, Cá kho khế, Cá nấu riêu, Cá om chuối đậu, Cá chép om, Cá chép chiên giòn, Gỏi cá trích, Gỏi cá mai, Fish and chips, Cá nướng giấy bạc',
'Cá kho rau răm, Cá đuối nướng, Cá lăng nướng, Cá chình nướng, Cá nướng muối ớt, Cá bò khô, Cá thu một nắng, Cá rán giòn, Cá hấp gừng hành, Cá ngừ áp chảo, Cá nướng lá chuối, Cá linh chiên giòn, Cá rô đồng kho, Cá kho nghệ, Canh cá nấu măng chua, Cá thính, Gỏi cá nhệch, Cháo cá chép, Cá lóc kho tộ',
'']},
{id:'n-banh-bot-gao',c:'Ẩm thực',q:'Kể tên một loại bánh làm từ bột gạo',s:['banh'],k:'Bánh tẻ',t:[
'Bánh cuốn, Bánh xèo, Bánh bèo',
'Bánh khọt, Bánh căn, Bánh đúc, Bánh ướt, Bánh hỏi, Bánh canh, Bánh tráng|Bánh đa',
'Bánh tẻ, Bánh giầy|Bánh dày, Bánh bò, Bánh da lợn, Bánh chưng|Bánh tét, Bánh ít, Bánh nậm, Bánh bột lọc, Bánh giò, Bánh đúc lạc, Bánh đúc nóng, Bánh tai heo, Bánh phu thê, Bánh gai, Bánh trôi|Bánh trôi nước, Bánh chay, Bánh khúc, Bánh gối, Bánh đa cua|Bánh đa đỏ, Bánh phở|Phở, Bún, Bánh hỏi Bình Định, Bánh ram, Bánh tằm|Bánh tằm bì, Bánh lá|Bánh lá dừa, Bánh ú, Bánh bò thốt nốt, Bánh chuối hấp, Bánh bò nướng, Bánh in, Bánh khảo, Bánh gạo, Bánh phồng|Bánh phồng nếp, Bánh cốm',
'Bánh đúc mặn, Bánh đúc ngọt, Bánh lá gai, Bánh nếp, Bánh dẻo, Bánh chưng gù, Bánh ống, Bánh bò hấp, Bánh khoai mì, Bánh bèo chén, Bánh hỏi heo quay, Bánh căn Phan Rang, Bánh xèo miền Tây, Bánh cuốn Thanh Trì, Bánh tráng phơi sương, Bánh đa nem, Bánh mướt, Bánh rợm, Bánh răng bừa, Bánh nhãn, Bánh thuẫn, Bánh bò bông, Bánh cáy, Bánh tro|Bánh gio',
'']},
{id:'nc-phim',lv:3,c:'Âm nhạc',q:'Kể tên một nhạc cụ có phím đàn (bàn phím)',s:['dan'],k:'Celesta',t:[
'Đàn piano|Piano|Dương cầm, Đàn organ|Organ|Đàn oóc',
'Keyboard|Đàn keyboard|Đàn điện tử, Đàn accordion|Accordion|Phong cầm, Đàn piano điện|Piano điện, Đàn grand piano|Đại dương cầm',
'Đàn harpsichord|Harpsichord, Melodica|Kèn melodica, Đàn organ ống|Organ ống|Organ nhà thờ, Synthesizer|Đàn synth, Celesta, Clavichord, Đàn harmonium|Harmonium, Đàn upright piano|Piano đứng, Đàn toy piano|Đàn piano đồ chơi, Đàn Hammond|Hammond organ, Rhodes|Đàn Rhodes, Mellotron, Bàn phím MIDI|MIDI keyboard',
'Spinet, Virginal, Fortepiano, Carillon, Đàn bayan|Bayan, Đàn concertina|Concertina, Glockenspiel phím, Ondes Martenot, Clavinet, Đàn piano cánh',
'']},
];
