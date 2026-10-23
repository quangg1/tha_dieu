// Release set, part 1: places. Same format as the bank (five tier lines, ',' between answers, '|' between spellings).
// Every prompt here has a few answers anyone says at once and a tail that takes real knowledge to reach.
import type { RawQuestion } from '../bank.js';

export type ReleaseQuestion = RawQuestion & { lv?: number; until?: string };

export const RELEASE1: ReleaseQuestion[] = [
{id:'r-tp-thai',c:'Thế giới',q:'Kể tên một thành phố hoặc điểm du lịch của Thái Lan',s:['thanhpho','tp','dao'],k:'Bueng Kan',t:[
'Bangkok|Băng Cốc, Pattaya, Phuket',
'Chiang Mai, Krabi, Hua Hin, Ayutthaya',
'Chiang Rai, Koh Samui|Samui, Pai, Udon Thani, Khon Kaen, Hat Yai, Kanchanaburi, Sukhothai, Nong Khai, Phi Phi|Koh Phi Phi',
'Ubon Ratchathani, Nakhon Ratchasima|Korat, Surat Thani, Rayong, Koh Phangan, Koh Tao, Lopburi, Nakhon Phanom, Mukdahan, Trang, Songkhla, Nan, Lampang, Mae Hong Son, Koh Chang',
'Phitsanulok, Sakon Nakhon, Roi Et, Buriram, Surin, Chanthaburi, Trat, Koh Lipe, Satun, Yala, Pattani, Phetchabun, Loei, Kalasin, Koh Lanta']},
{id:'r-dao-tg',c:'Thế giới',q:'Kể tên một hòn đảo nổi tiếng ở nước ngoài',s:['dao','hondao'],k:'Socotra',t:[
'Bali, Hawaii, Phuket',
'Jeju, Santorini, Greenland, Madagascar, Sicily, Okinawa',
'Boracay, Langkawi, Hokkaido, Tasmania, Mykonos, Tahiti, Bora Bora, Galápagos|Galapagos, Maui',
'Borneo, Sumatra, Java, Lombok, Palawan, Cebu, Penang, Koh Samui, Capri, Corsica, Sardinia, Crete, Mallorca, Ibiza, Zanzibar, Bermuda, Oahu',
'Lanzarote, Tenerife, Madeira, Komodo, Flores, Đảo Phục Sinh|Easter Island, Svalbard, Faroe, Isle of Skye, Rhodes, Corfu, Gozo, Réunion, Moorea, Lord Howe']},
{id:'r-sa-mac',c:'Thế giới',q:'Kể tên một sa mạc trên thế giới',s:['samac'],k:'Dasht-e Lut',t:[
'Sahara, Gobi',
'Kalahari, Atacama, Ả Rập|Sa mạc Ả Rập',
'Namib, Mojave, Thar, Sonora, Nam Cực|Sa mạc Nam Cực',
'Taklamakan, Great Victoria|Victoria lớn, Simpson, Gibson, Syria|Sa mạc Syria, Chihuahua, Patagonia, Karakum, Kyzylkum, Negev, Sinai, Rub al Khali, Death Valley|Thung lũng Chết',
'Libya|Sa mạc Libya, Nubia|Sa mạc Nubia, Ogaden, Danakil, Great Basin, Colorado Plateau, Badain Jaran, Tengger, Ordos, Great Sandy, Tanami, Strzelecki, Sechura, Monte']},
{id:'r-day-nui',c:'Thế giới',q:'Kể tên một dãy núi trên thế giới',s:['daynui','day','nui'],k:'Drakensberg',t:[
'Himalaya|Hy Mã Lạp Sơn, Alps|Anpơ',
'Andes, Rocky|Rockies, Hoàng Liên Sơn, Trường Sơn',
'Ural, Pyrenees, Kavkaz|Caucasus, Appalachian, Atlas, Karakoram, Hindu Kush, Côn Lôn',
'Carpathian|Carpat, Apennine, Scandinavia, Thiên Sơn, Pamir, Sierra Nevada, Dolomites, Balkan, Zagros, Great Dividing Range|Dãy Phân thủy lớn, Western Ghats, Altai, Tần Lĩnh',
'Brooks, Alaska Range, Cascade, Sierra Madre, Taurus, Elburz|Alborz, Hijaz, Ruwenzori, Ahaggar, Tibesti, Arakan, Tenasserim, Cardamom, Đạo Ngân Sơn|Ngân Sơn, Pu Đen Đinh, Bạch Mã, Cửu Hoa']},
{id:'r-nui-tg',c:'Thế giới',q:'Kể tên một ngọn núi nổi tiếng trên thế giới',s:['nui','ngonnui','dinh'],k:'Mount Kailash|Kailash',t:[
'Everest, Phú Sĩ|Fuji',
'Kilimanjaro, Mont Blanc, K2, Olympus',
'Matterhorn, Denali, Aconcagua, Elbrus, Thái Sơn, Hoàng Sơn, Vesuvius',
'Kangchenjunga, Annapurna, Lhotse, Makalu, Etna, Rushmore, Table Mountain|Núi Bàn, Ararat, Sinai, Kinabalu, Rainier, Nga Mi Sơn, Hoa Sơn, Võ Đang',
'Cho Oyu, Dhaulagiri, Manaslu, Nanga Parbat, Eiger, Jungfrau, Uluru, Cotopaxi, Chimborazo, Popocatépetl, Krakatoa, Merapi, Bromo, Rinjani, Pinatubo, Mayon, Halla|Hallasan']},
{id:'r-ky-quan',c:'Thế giới',q:'Kể tên một công trình kiến trúc nổi tiếng thế giới mà ai cũng nhận ra',s:['thap','cong'],k:'Đền Borobudur|Borobudur',t:[
'Tháp Eiffel, Vạn Lý Trường Thành, Kim tự tháp Giza|Kim tự tháp',
'Tượng Nữ thần Tự do, Đền Taj Mahal|Taj Mahal, Đấu trường La Mã|Colosseum, Tháp nghiêng Pisa, Angkor Wat',
'Nhà hát Opera Sydney, Big Ben, Cầu Cổng Vàng, Tượng Chúa Cứu Thế, Machu Picchu, Burj Khalifa, Tử Cấm Thành, Điện Kremlin',
'Petra, Sagrada Família, Cung điện Versailles, Khải Hoàn Môn, Parthenon, Tower Bridge|Cầu Tháp London, Lâu đài Neuschwanstein, Nhà thờ Đức Bà Paris, Tháp đôi Petronas, Marina Bay Sands, Stonehenge, Đền Parthenon, Nhà Trắng',
'Hagia Sophia, Alhambra, Chichén Itzá, Bagan, Potala, Moai, Tháp CN|CN Tower, Empire State, Atomium, Tháp Tokyo, Tokyo Skytree, Nhà thờ Thánh Basil, Cổng Brandenburg, Đền Kiyomizu, Chùa Vàng Shwedagon']},
{id:'r-hn-pho',c:'Du lịch',q:'Kể tên một con phố ở khu phố cổ Hà Nội',s:['pho','duong','phohang'],k:'Hàng Vải',t:[
'Hàng Đào, Hàng Bạc, Hàng Mã',
'Tạ Hiện, Hàng Buồm, Hàng Ngang, Hàng Gai, Mã Mây, Hàng Bè',
'Hàng Đường, Hàng Bông, Hàng Bồ, Hàng Thiếc, Hàng Quạt, Hàng Trống, Lương Văn Can, Hàng Giấy, Hàng Chiếu, Hàng Muối, Đinh Liệt, Cầu Gỗ',
'Hàng Lược, Hàng Cót, Hàng Gà, Hàng Điếu, Hàng Da, Hàng Nón, Hàng Mắm, Hàng Thùng, Hàng Khoai, Hàng Chĩnh, Hàng Hòm, Hàng Phèn, Hàng Rươi, Hàng Than, Lò Rèn, Lò Sũ, Đồng Xuân, Hàng Cân, Hàng Tre, Hàng Dầu, Hàng Mành, Hàng Đồng, Hàng Bút, Hàng Ống, Hàng Hành, Nguyễn Hữu Huân',
'Hàng Cá, Hàng Chai, Chả Cá, Gầm Cầu, Ngõ Tạm Thương, Hàng Hương, Thuốc Bắc, Bát Đàn, Bát Sứ, Ngõ Gạch, Phùng Hưng, Nguyễn Siêu, Hàng Chuối']},
{id:'r-hcm-dd',c:'Du lịch',q:'Kể tên một địa điểm nổi tiếng ở TP. Hồ Chí Minh',s:['diadiem'],k:'Chùa Bà Thiên Hậu',t:[
'Chợ Bến Thành, Nhà thờ Đức Bà, Phố đi bộ Nguyễn Huệ',
'Dinh Độc Lập, Bưu điện Thành phố, Bitexco, Landmark 81, Phố Bùi Viện, Địa đạo Củ Chi',
'Thảo Cầm Viên, Chợ Lớn, Bến Nhà Rồng, Công viên Đầm Sen, Suối Tiên, Bảo tàng Chứng tích Chiến tranh, Nhà hát Thành phố, Ủy ban Nhân dân Thành phố, Cần Giờ, Chợ Bình Tây, Hồ Con Rùa, Cầu Ánh Sao',
'Phố sách Nguyễn Văn Bình, Bảo tàng Mỹ thuật, Chùa Vĩnh Nghiêm, Chùa Ngọc Hoàng, Nhà thờ Tân Định, Thủ Thiêm, Cầu Ba Son, Bến Bạch Đằng, Phố Tây Phạm Ngũ Lão, Chung cư 42 Nguyễn Huệ, Hồ Bán Nguyệt, Chợ Tân Định, Chợ An Đông, Saigon Centre, Takashimaya, Vincom Đồng Khởi',
'Bảo tàng Áo dài, Bảo tàng Lịch sử, Đình Minh Hương Gia Thạnh, Hội quán Nghĩa An, Chùa Giác Lâm, Nhà thờ Huyện Sỹ, Nhà thờ Cha Tam, Lăng Ông Bà Chiểu, Rừng Sác, Đảo Khỉ Cần Giờ, Khu du lịch Văn Thánh, Bình Quới, Cầu Mống, Cầu Khánh Hội']},
{id:'r-hn-dd',c:'Du lịch',q:'Kể tên một địa điểm nổi tiếng ở Hà Nội',s:['diadiem'],k:'Đình Kim Liên',t:[
'Hồ Gươm|Hồ Hoàn Kiếm, Lăng Bác|Lăng Chủ tịch Hồ Chí Minh, Văn Miếu',
'Chùa Một Cột, Hồ Tây, Phố cổ, Cầu Long Biên, Nhà hát Lớn, Tháp Rùa, Đền Ngọc Sơn',
'Hoàng thành Thăng Long, Chùa Trấn Quốc, Nhà thờ Lớn, Cầu Thê Húc, Chợ Đồng Xuân, Phố đi bộ Hồ Gươm, Bảo tàng Dân tộc học, Cột cờ Hà Nội, Lotte Center, Keangnam, Cầu Nhật Tân, Phố đường tàu',
'Đền Quán Thánh, Phủ Tây Hồ, Nhà tù Hỏa Lò, Ô Quan Chưởng, Làng gốm Bát Tràng, Làng lụa Vạn Phúc, Thành cổ Loa|Cổ Loa, Bảo tàng Lịch sử Quốc gia, Bảo tàng Mỹ thuật, Phủ Chủ tịch, Nhà sàn Bác Hồ, Công viên Thống Nhất, Hồ Trúc Bạch, Chùa Quán Sứ, Đền Bạch Mã',
'Chùa Kim Liên, Chùa Láng, Chùa Hà, Đền Voi Phục, Chùa Thầy, Chùa Tây Phương, Chùa Hương, Làng cổ Đường Lâm, Ba Vì, Đền Hai Bà Trưng, Gò Đống Đa, Bảo tàng Phụ nữ, Nhà thờ Cửa Bắc, Ga Hà Nội, Chợ Hôm']},
{id:'r-ninh-binh',c:'Du lịch',q:'Kể tên một điểm du lịch ở Ninh Bình',s:['diadiem'],k:'Động Vân Trình',t:[
'Tràng An, Tam Cốc, Chùa Bái Đính',
'Hang Múa, Bích Động, Cố đô Hoa Lư|Hoa Lư, Vân Long',
'Thung Nham, Nhà thờ Phát Diệm, Vườn quốc gia Cúc Phương|Cúc Phương, Thung lũng Mua, Đền Thái Vi, Đền Vua Đinh Tiên Hoàng, Đền Vua Lê Đại Hành',
'Đầm Vân Long, Động Thiên Hà, Động Am Tiên, Hang Bụt, Chùa Bích Động, Kênh Gà, Suối nước nóng Kênh Gà, Đảo Kong|Phim trường Kong, Thung lũng Tràng An, Chùa Địa Tạng Phi Lai, Núi Ngọc Mỹ Nhân, Làng Văn Lâm, Làng thêu Văn Lâm',
'Động Thiên Tôn, Động Tiên Hang Luồn, Chùa Non Nước, Núi Non Nước, Đền Trần, Hồ Đồng Chương, Hồ Yên Thắng, Thành Nhà Hồ, Hang Địa Linh, Hang Lấm']},
{id:'r-ha-giang',c:'Du lịch',q:'Kể tên một điểm du lịch ở Hà Giang',s:['diadiem'],k:'Cột mốc 428',t:[
'Mã Pí Lèng|Đèo Mã Pí Lèng, Cột cờ Lũng Cú|Lũng Cú',
'Sông Nho Quế, Đồng Văn|Phố cổ Đồng Văn, Cao nguyên đá Đồng Văn, Dinh thự họ Vương|Nhà Vương',
'Quản Bạ|Cổng trời Quản Bạ, Núi Đôi Quản Bạ|Núi đôi Cô Tiên, Hoàng Su Phì, Ruộng bậc thang Hoàng Su Phì, Dốc Thẩm Mã, Yên Minh, Mèo Vạc, Hẻm Tu Sản',
'Làng Lô Lô Chải, Phố Cáo, Chợ phiên Đồng Văn, Chợ tình Khâu Vai, Sủng Là, Nhà của Pao, Thác Tiên Đèo Gió, Rừng thông Yên Minh, Làng Nặm Đăm, Làng Thiên Hương, Phìn Hồ, Thôn Lũng Cẩm, Hang Lùng Khúy',
'Chín khoanh, Dốc Chín Khoanh, Bản Phùng, Thông Nguyên, Cánh đồng tam giác mạch, Cột cờ Thành phố Hà Giang, Suối Thác Bạc, Động Lùng Khúy, Lũng Táo, Sảng Tủng']},
{id:'r-quang-ninh',c:'Du lịch',q:'Kể tên một điểm du lịch ở Quảng Ninh',s:['diadiem'],k:'Đảo Trà Bản',t:[
'Vịnh Hạ Long, Yên Tử',
'Bãi Cháy, Sun World Hạ Long, Đảo Tuần Châu, Cô Tô, Vịnh Bái Tử Long',
'Đảo Quan Lạn, Đảo Ngọc Vừng, Móng Cái, Trà Cổ, Hang Sửng Sốt, Đảo Ti Tốp, Động Thiên Cung, Hòn Gà Chọi',
'Làng chài Cửa Vạn, Hang Đầu Gỗ, Hang Luồn, Bình Liêu, Cột mốc 1305, Đảo Vĩnh Thực, Đảo Thanh Lân, Vân Đồn, Cầu Bãi Cháy, Bảo tàng Quảng Ninh, Chùa Ba Vàng, Chùa Cái Bầu, Đảo Minh Châu',
'Hòn Trống Mái, Hòn Đỉnh Hương, Động Mê Cung, Hang Bồ Nâu, Hang Trinh Nữ, Bãi Sậu, Đông Triều, Uông Bí, Mũi Sa Vĩ, Thác Khe Vằn, Đình Quan Lạn']},
{id:'r-hoi-an',c:'Du lịch',q:'Kể tên một điểm tham quan ở Hội An hoặc Quảng Nam',s:['diadiem'],k:'Hội quán Triều Châu',t:[
'Phố cổ Hội An, Chùa Cầu',
'Thánh địa Mỹ Sơn|Mỹ Sơn, Cù Lao Chàm, Biển An Bàng, Biển Cửa Đại, Rừng dừa Bảy Mẫu',
'Làng gốm Thanh Hà, Làng rau Trà Quế, Hội quán Phúc Kiến, Nhà cổ Tấn Ký, Chợ Hội An, Sông Hoài, Hội An Ký Ức, VinWonders Nam Hội An, Làng mộc Kim Bồng',
'Nhà cổ Phùng Hưng, Nhà thờ tộc Trần, Hội quán Quảng Đông, Bảo tàng Gốm sứ mậu dịch, Chùa Ông, Làng chài Tân Thành, Biển Hà My, Đảo ký ức Hội An, Làng bánh tráng Cẩm Hà',
'Hội quán Hải Nam, Hội quán Trung Hoa, Chùa Phước Lâm, Chùa Chúc Thánh, Nhà cổ Đức An, Giếng Bá Lễ, Làng Cẩm Phô, Phố Nguyễn Thái Học, Tam Thanh|Làng bích họa Tam Thanh, Hồ Phú Ninh']},
{id:'r-phu-quoc',c:'Du lịch',q:'Kể tên một điểm du lịch ở Phú Quốc',s:['diadiem'],k:'Hòn Rỏi',t:[
'Bãi Sao, Grand World, VinWonders Phú Quốc',
'Bãi Dài, Hòn Thơm|Cáp treo Hòn Thơm, Chợ đêm Phú Quốc, Nhà tù Phú Quốc, Dinh Cậu, Safari Phú Quốc',
'Sunset Town, Bãi Trường, Gành Dầu, Mũi Gành Dầu, Hòn Móng Tay, Hòn Gầm Ghì, Suối Tranh, Làng chài Hàm Ninh, Nhà thùng nước mắm',
'Bãi Khem, Bãi Ông Lang, Bãi Vòng, Hòn Mây Rút, Hòn Dừa, Rạch Vẹm, Vườn tiêu, Thiền viện Trúc Lâm Hộ Quốc, Chùa Hộ Quốc, Cầu Hôn, Cửa Cạn, Vườn quốc gia Phú Quốc',
'Hòn Thơm Nature Park, Hòn Kim Quy, Mũi Ông Đội, Suối Đá Bàn, Núi Chúa, Làng chài Cửa Cạn, Bãi Thơm, Dinh Bà, Công viên bãi Rạch Tràm']},
{id:'r-da-nang',c:'Du lịch',q:'Kể tên một địa điểm nổi tiếng ở Đà Nẵng',s:['diadiem'],k:'Đỉnh Bàn Cờ',t:[
'Cầu Rồng, Bà Nà Hills|Bà Nà, Cầu Vàng',
'Biển Mỹ Khê, Ngũ Hành Sơn, Bán đảo Sơn Trà|Sơn Trà, Chùa Linh Ứng, Cầu Sông Hàn, Đèo Hải Vân',
'Chợ Hàn, Chợ Cồn, Cầu Tình Yêu, Cá chép hóa rồng, Nhà thờ Con Gà, Asia Park|Sun World Asia Park, Bảo tàng Chăm, Cầu Trần Thị Lý, Biển Non Nước, Suối Mơ, Thác Mơ',
'Làng đá Non Nước, Rạn Nam Ô, Ghềnh Bàng, Làng chài Nam Ô, Bảo tàng 3D, Bảo tàng Đà Nẵng, Hòn Chảo, Hồ Hòa Trung, Suối khoáng nóng Núi Thần Tài, Thần Tài|Núi Thần Tài, Bãi Bụt, Bãi Rạng',
'Cầu Thuận Phước, Cầu Nguyễn Văn Trỗi, Chùa Pháp Lâm, Đình Hải Châu, Hải Vân Quan, Ga Kim Liên, Bãi Bắc, Bãi Nam, Mũi Nghê, Cây đa ngàn năm Sơn Trà']},
{id:'r-nha-trang',c:'Du lịch',q:'Kể tên một điểm du lịch ở Nha Trang hoặc Khánh Hòa',s:['diadiem'],k:'Hòn Bà',t:[
'VinWonders Nha Trang|Vinpearl, Tháp Bà Ponagar',
'Hòn Mun, Đảo Hòn Tằm, Hòn Chồng, Nhà thờ Núi, Viện Hải dương học, Chùa Long Sơn',
'Bình Ba, Bình Hưng, Đảo Yến, Vịnh Ninh Vân, Bãi Dài Cam Ranh, Đầm Nha Phu, I-Resort, Tháp Trầm Hương, Chợ Đầm, Hòn Lao|Đảo Khỉ',
'Vịnh Vân Phong, Điệp Sơn, Mũi Đôi, Hòn Một, Hòn Tre, Bãi Tranh, Suối Ba Hồ, Suối Tiên Nha Trang, Thác Yang Bay, Bãi Dốc Lết, Hòn Chồng Hòn Vợ, Biệt thự Bảo Đại',
'Hòn Nội, Hòn Ngoại, Đảo Bích Đầm, Lagi Lagoon, Thác Hòn Bà, Chùa Ốc, Hải đăng Đá Lẻ, Bãi Rạn, Gành Đỏ, Vịnh Cam Ranh']},
{id:'r-chua-vn',c:'Du lịch',q:'Kể tên một ngôi chùa nổi tiếng ở Việt Nam',s:['chua'],k:'Chùa Dâu',t:[
'Chùa Một Cột, Chùa Bái Đính, Chùa Hương',
'Chùa Thiên Mụ, Chùa Trấn Quốc, Chùa Tam Chúc, Chùa Yên Tử|Yên Tử, Chùa Linh Ứng, Chùa Cầu',
'Chùa Bút Tháp, Chùa Tây Phương, Chùa Thầy, Chùa Keo, Chùa Quán Sứ, Chùa Phật Tích, Chùa Vĩnh Nghiêm, Chùa Giác Lâm, Chùa Ngọc Hoàng, Chùa Bà Thiên Hậu, Chùa Dơi, Chùa Bà Đen, Chùa Ba Vàng',
'Chùa Kim Liên, Chùa Láng, Chùa Hà, Chùa Thiên Hưng, Chùa Đồng, Chùa Cổ Lễ, Chùa Phổ Minh, Chùa Côn Sơn, Chùa Từ Hiếu, Chùa Từ Đàm, Chùa Huyền Không, Chùa Long Sơn, Chùa Ông Núi, Chùa Thập Tháp, Chùa Hang, Chùa Khleang, Chùa Vàm Rây, Chùa Phước Duyên, Chùa Linh Phước, Thiền viện Trúc Lâm',
'Chùa Bổ Đà, Chùa Mía, Chùa Phúc Khánh, Chùa Diên Hựu, Chùa Lương, Chùa Đậu, Chùa Thái Lạc, Chùa Nhẫm Dương, Chùa Bối Khê, Chùa Trăm Gian, Chùa Kim Sơn, Chùa Giác Viên, Chùa Âng, Chùa Xiêm Cán, Chùa Sóc Lớn']},
{id:'r-nha-tho-vn',c:'Du lịch',q:'Kể tên một nhà thờ nổi tiếng ở Việt Nam',s:['nhatho'],k:'Nhà thờ Chính tòa Bắc Ninh',t:[
'Nhà thờ Đức Bà, Nhà thờ Lớn Hà Nội|Nhà thờ Lớn',
'Nhà thờ Phát Diệm, Nhà thờ Tân Định, Nhà thờ Con Gà|Nhà thờ Chánh tòa Đà Lạt, Nhà thờ Đá Sa Pa, Nhà thờ Núi Nha Trang|Nhà thờ Núi',
'Nhà thờ Phủ Cam, Nhà thờ Bùi Chu, Nhà thờ Cửa Bắc, Nhà thờ Huyện Sỹ, Nhà thờ Cha Tam, Nhà thờ Domaine de Marie, Nhà thờ La Vang|Vương cung thánh đường La Vang, Nhà thờ Chánh tòa Đà Nẵng',
'Nhà thờ Hàm Long, Nhà thờ Thái Hà, Nhà thờ Sở Kiện, Nhà thờ Hải Lý, Nhà thờ đổ Hải Lý, Nhà thờ Phú Nhai, Nhà thờ Kẻ Sặt, Nhà thờ Tam Tòa, Nhà thờ Cù Lao Giêng, Nhà thờ Mằng Lăng, Nhà thờ Cái Bè, Nhà thờ Ngọc Lâm, Nhà thờ Vĩnh Long',
'Nhà thờ Trái Tim Đức Mẹ, Nhà thờ Bến Tre, Nhà thờ Chợ Quán, Nhà thờ Thủ Đức, Nhà thờ Hạnh Thông Tây, Nhà thờ Xứ Đoài, Nhà thờ Nam Định, Nhà thờ Kon Tum|Nhà thờ gỗ Kon Tum, Nhà thờ Tắc Sậy, Nhà thờ Đức Bà Phú Hòa']},
{id:'r-cau-vn',c:'Du lịch',q:'Kể tên một cây cầu nổi tiếng ở Việt Nam',s:['cau'],k:'Cầu Đông Ba',t:[
'Cầu Long Biên, Cầu Rồng, Cầu Vàng',
'Cầu Trường Tiền, Cầu Nhật Tân, Cầu Thê Húc, Cầu Chương Dương, Cầu Thăng Long, Cầu Sài Gòn, Cầu Cần Thơ, Cầu Ánh Sao',
'Cầu Ba Son|Cầu Thủ Thiêm 2, Cầu Mỹ Thuận, Cầu Bãi Cháy, Cầu Bạch Đằng, Cầu Sông Hàn, Cầu Tình Yêu, Cầu Thuận Phước, Cầu Phú Mỹ, Cầu Hàm Rồng, Cầu Hiền Lương, Cầu Ngói Thanh Toàn, Cầu Rạch Miễu',
'Cầu Vĩnh Tuy, Cầu Thanh Trì, Cầu Vĩnh Thịnh, Cầu Cổ Chiên, Cầu Hàm Luông, Cầu Bình Triệu, Cầu Mống, Cầu Khánh Hội, Cầu Kính Rồng Mây, Cầu Tràng Tiền, Cầu Phú Lương, Cầu Bính, Cầu Hoàng Văn Thụ, Cầu Tân Vũ, Cầu Trần Thị Lý',
'Cầu Mỹ Lợi, Cầu Cao Lãnh, Cầu Vàm Cống, Cầu Đầm Thị Nại|Cầu Thị Nại, Cầu Tuyên Sơn, Cầu Nguyễn Văn Trỗi, Cầu Dã Viên, Cầu Hóa An, Cầu Ghềnh, Cầu Đồng Nai, Cầu Kiền, Cầu Đuống']},
{id:'r-deo-vn',c:'Du lịch',q:'Kể tên một con đèo ở Việt Nam',s:['deo'],k:'Đèo Khau Cọ',t:[
'Đèo Hải Vân, Mã Pí Lèng',
'Đèo Ô Quy Hồ, Đèo Khau Phạ, Đèo Pha Đin, Đèo Bảo Lộc, Đèo Prenn, Đèo Cù Mông',
'Đèo Ngoạn Mục, Đèo Lò Xo, Đèo Ngang, Đèo Cả, Đèo Thung Khe, Đèo Mã Phục, Đèo Hoàng Su Phì, Đèo Mimosa, Đèo Đá Trắng, Đèo Lũng Lô, Đèo Gió',
'Đèo Hoàng Liên Sơn, Đèo Pắc Ma, Đèo Khánh Lê, Đèo Phượng Hoàng, Đèo Vi Ô Lắc, Đèo Mẹ Bồng Con, Đèo Tam Điệp, Đèo Cả Rá, Đèo An Khê, Đèo Chuối, Đèo Măng Đen, Đèo Le, Đèo Sông Pha',
'Đèo Pha Long, Đèo Si Ma Cai, Đèo Chín Khoanh, Đèo Tà Xùa, Đèo Mã Hồng, Đèo Keo Nưa, Đèo Ba Dội, Đèo Rù Rì, Đèo Bình Đê, Đèo Tô Hạp']},
{id:'r-bao-tang',c:'Du lịch',q:'Kể tên một bảo tàng nổi tiếng ở Việt Nam',s:['baotang'],k:'Bảo tàng Gốm Bát Tràng',t:[
'Bảo tàng Lịch sử Quốc gia, Bảo tàng Hồ Chí Minh',
'Bảo tàng Dân tộc học, Bảo tàng Chứng tích Chiến tranh, Bảo tàng Phụ nữ Việt Nam, Bảo tàng Mỹ thuật Việt Nam, Bảo tàng Quân sự|Bảo tàng Lịch sử Quân sự Việt Nam',
'Bảo tàng Hà Nội, Bảo tàng Điêu khắc Chăm, Bảo tàng Cổ vật Cung đình Huế, Bảo tàng Áo dài, Bảo tàng Hải dương học, Bảo tàng Không quân, Bảo tàng Cách mạng, Bảo tàng Thành phố Hồ Chí Minh, Bảo tàng Lịch sử TP.HCM',
'Bảo tàng Văn hóa các dân tộc Việt Nam, Bảo tàng Địa chất, Bảo tàng Thiên nhiên Việt Nam, Bảo tàng Tôn Đức Thắng, Bảo tàng Hậu cần, Bảo tàng Biên phòng, Bảo tàng Công an, Bảo tàng Hải quân, Bảo tàng Đà Nẵng, Bảo tàng Quảng Ninh, Bảo tàng Lâm Đồng, Bảo tàng Đắk Lắk, Bảo tàng Cà phê',
'Bảo tàng Gốm sứ Mậu dịch Hội An, Bảo tàng Văn hóa Sa Huỳnh, Bảo tàng Sơn mài, Bảo tàng Tranh 3D Đà Nẵng, Bảo tàng Nghệ thuật Đương đại, Bảo tàng Y học cổ truyền, Bảo tàng Dệt may, Bảo tàng Nam Bộ kháng chiến, Bảo tàng Bến Tre']},
{id:'r-cho-vn',c:'Du lịch',q:'Kể tên một khu chợ nổi tiếng ở Việt Nam',s:['cho'],k:'Chợ Vồ',t:[
'Chợ Bến Thành, Chợ Đồng Xuân',
'Chợ Đông Ba, Chợ Hàn, Chợ nổi Cái Răng, Chợ Đà Lạt, Chợ Lớn, Chợ Bình Tây',
'Chợ Cồn, Chợ Hội An, Chợ Đầm, Chợ Tân Định, Chợ Hôm, Chợ Long Biên, Chợ Bắc Hà, Chợ tình Khâu Vai, Chợ đêm Phú Quốc, Chợ Châu Đốc, Chợ Rẫy',
'Chợ Bà Chiểu, Chợ An Đông, Chợ Hồ Thị Kỷ, Chợ Kim Biên, Chợ Nhật Tảo, Chợ Ninh Hiệp, Chợ Mơ, Chợ Ngã Tư Sở, Chợ Bưởi, Chợ Đồng Hới, Chợ Vinh, Chợ Cái Bè, Chợ Phong Điền, Chợ Ngã Bảy, Chợ Viềng',
'Chợ Âm phủ, Chợ Mường Hum, Chợ Đồng Văn, Chợ Mèo Vạc, Chợ Cốc Ly, Chợ Sa Pa, Chợ Cầu Muối, Chợ Bà Hoa, Chợ Lạng Sơn, Chợ Kỳ Lừa, Chợ Đông Kinh, Chợ Sắt']},
{id:'r-san-bay',c:'Giao thông',q:'Kể tên một sân bay ở Việt Nam',s:['sanbay','canghangkhong'],k:'Sân bay Nà Sản',t:[
'Tân Sơn Nhất, Nội Bài',
'Đà Nẵng, Cam Ranh, Phú Quốc, Long Thành, Cát Bi, Liên Khương',
'Phú Bài, Vinh, Cần Thơ, Thọ Xuân, Vân Đồn, Côn Đảo, Phù Cát, Buôn Ma Thuột, Pleiku',
'Chu Lai, Đồng Hới, Tuy Hòa, Rạch Giá, Cà Mau, Điện Biên, Biên Hòa, Gia Lâm, Kép, Phan Rang',
'Nà Sản, Sa Pa, Lai Châu, Quảng Trị, Phan Thiết, Thành Sơn, Sóc Trăng, Bạch Mai, Trường Sa']},
{id:'r-khu-vui-choi',c:'Du lịch',q:'Kể tên một công viên giải trí hoặc khu vui chơi nổi tiếng',s:['congvien','khuvuichoi'],k:'Everland',t:[
'Disneyland, Suối Tiên, Đầm Sen',
'Universal Studios, VinWonders, Sun World Bà Nà Hills|Bà Nà Hills, Hồ Mây|Hồ Mây Park, Asia Park',
'Lotte World, Thảo Cầm Viên, Công viên nước Hồ Tây, Sun World Hạ Long, Vinpearl Safari, Grand World, Hồ Tây, KizCiti, Tuần Châu, Fansipan Legend',
'Ocean Park, Legoland, SeaWorld, Six Flags, Busch Gardens, Disney World, Tokyo DisneySea, Universal Studios Japan, Dream World, Genting, Sentosa, Gardens by the Bay, Safari World, Công viên Yên Sở, Công viên Thủ Lệ',
'Tivoli, Efteling, Europa-Park, Port Aventura, Cedar Point, Knott\'s Berry Farm, Fuji-Q Highland, Nagashima Spa Land, Chimelong, Happy Valley, Ferrari World, Warner Bros. World, Movie World, Luna Park']},
{id:'r-tinh-dac-san',c:'Ẩm thực',q:'Kể tên một đặc sản của Đà Lạt',s:[],k:'Trà Cầu Đất',t:[
'Dâu tây, Bánh tráng nướng, Mứt',
'Sữa đậu nành, Atiso|Trà atiso, Hồng treo gió|Hồng khô, Lẩu gà lá é, Bánh căn, Rau Đà Lạt',
'Kem bơ, Sữa chua dâu, Nem nướng Đà Lạt, Bánh ướt lòng gà, Bánh mì xíu mại, Rượu vang Đà Lạt, Cà phê Cầu Đất, Mứt dâu, Mứt hồng, Hoa Đà Lạt',
'Bơ sáp, Hồng giòn, Chuối Laba, Hạt dẻ, Sương sáo, Chè hồng, Bánh bông lan nướng, Lẩu bò Ba Toa, Bánh canh bột xắt, Ốc nhồi, Gà nướng cơm lam, Su su Đà Lạt, Khoai lang mật, Dâu tằm, Chanh dây',
'Mứt sen, Mứt bí, Bánh tráng ruột, Kẹo đậu phộng, Măng tây, Cà phê chồn, Bánh pía Đà Lạt']},
];
