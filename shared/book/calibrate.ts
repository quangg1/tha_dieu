// Rarity, rechecked by hand (October 2026). Bilion's rarity should say how hard an answer is to come up with: an answer
// almost every Vietnamese player knows well (Kiwi, Dừa, Bàn chân) is never Rất hiếm, however rarely people happen to
// type it; Rất hiếm and Cực hiếm are kept for answers that take real knowledge or memory. Each line sets the starting
// tier of the answers it names (any spelling); crowd counts still take over as people play. The hidden answer is never moved.
export const CALIBRATE: Record<string, Partial<Record<0 | 1 | 2 | 3 | 4, string>>> = {
  'trai-cay': {
    1: 'Kiwi, Dừa, Chanh, Bơ, Chôm chôm, Thanh long, Vải, Nhãn, Đu đủ, Măng cụt, Dâu tây, Mận, Lê, Quýt, Hồng xiêm, Mãng cầu, Khế, Dưa lưới, Cherry',
    2: 'Vú sữa, Roi, Cóc, Lựu, Sung, Hồng, Việt quất, Mơ, Đào, Me, Chanh dây, Dưa gang, Dưa lê, Táo tàu, Sấu, Gấc, Chuối tiêu, Quất, Chà là, Chanh vàng, Mãng cầu xiêm, Cam sành, Bưởi da xanh, Xoài cát Hòa Lộc, Nho Mỹ, Dừa xiêm',
    3: 'Bòn bon, Dâu da, Chùm ruột, Thị, Lêkima, Sim, Nhót, Bình bát, Sa kê, Bần, Thốt nốt, Hạnh, Dâu tằm, Bứa, Muỗm, Trám đen, Cà na, Hồng bì, Ô liu',
  },
  'sinh-vat-bien': {
    1: 'Sao biển, Cá ngựa, Cá đuối, San hô, Hải cẩu, Cá hồi, Tôm hùm, Ghẹ, Ốc, Sò, Cá ngừ, Cá voi xanh, Cá mập trắng',
    2: 'Cá thu, Cá mú, Hải sâm, Bào ngư, Cá kiếm, Sư tử biển, Cá nóc, Rắn biển, Nhím biển, Cá hề, Hải mã, Cá voi sát thủ, Cá mập voi, Hàu, Nghêu, Mực ống, Cá cơm, Cá chim, Bò biển, Cá chình, Hải quỳ, Cá mập đầu búa, Cua biển, Đồi mồi, Cá voi lưng gù, Rùa da, Sò điệp, Tôm sú, Ốc hương, Cá mặt trăng',
    3: 'Kỳ lân biển, Cá đuối manta, Sam, Mực khổng lồ, Cá voi trắng, Cá nhà táng, Cá mập Megalodon, Hải cẩu voi, Cá sấu nước mặn',
  },
  'mau-sac': {
    1: 'Xanh lá, Xanh dương, Xanh da trời, Bạc, Be, Kem, Xanh nước biển, Hồng phấn',
    2: 'Xanh lam, Xanh ngọc, Đỏ đô, Vàng chanh, Xanh rêu, Tím than, Đỏ tươi, Vàng kim, Xanh navy, Xanh lá mạ, Xanh mint, Nâu đất, Màu da, Trắng sữa, Xanh pastel, Xanh lục bảo, Đỏ thẫm, Màu da cam, Màu khaki, Đen tuyền, Trắng tinh, Xanh than, Nâu cà phê, Vàng nhạt, Màu cát',
    3: 'Cánh sen, Hồng đào, Hoa cà, Tím Huế, Đỏ thắm, Xanh biếc, Tím ngắt, Đỏ chót, Vàng óng, Ngọc bích, Màu tro, Màu chì, Màu khói, Màu rượu vang, Xanh két, Màu ngói, Thiên thanh, Tím hoa sim',
  },
  'loai-hoa': {
    1: 'Hoa phượng, Hoa giấy, Hoa nhài, Cẩm tú cầu, Hoa mười giờ, Hoa súng, Hoa sứ, Hoa bằng lăng, Hoa cúc họa mi, Hoa huệ, Hoa thủy tiên, Cẩm chướng, Đồng tiền, Oải hương, Anh đào, Hoa dâm bụt, Hoa xương rồng, Lay ơn, Hoa bỉ ngạn, Hoa ban',
    2: 'Dã quỳ, Hoa dạ yến thảo, Hoa tường vi, Hoa hải đường, Hoa đỗ quyên, Hoa mắc cỡ, Hoa lục bình, Hoa bồ công anh, Hoa sen đá, Hoa mõm chó, Hoa cúc vạn thọ, Hoa thược dược, Hoa mai anh đào, Hoa mơ, Hoa mận, Hoa cà phê, Hoa gạo, Loa kèn, Thạch thảo, Cát tường, Mẫu đơn, Hoa trà, Quỳnh, Hoa chuối, Bông điên điển, Hoa phù dung, Hoa mào gà, Hoa trạng nguyên, Hoa thiên điểu, Hoa linh lan, Hoa anh túc, Hoa diên vĩ, Hoa baby, Hoa păng xê, Hoa lan hồ điệp, Hoa tử đằng, Ngọc lan, Hoa sim, Hoa bưởi, Hoa cải, Dừa cạn, Hoa tầm xuân, Tam giác mạch, Ti gôn, Lộc vừng, Bìm bìm, Hoa mua, Thiên lý, Hoa cau, Hoa ly ly, Hoa salem, Hoa cúc đại đóa, Hoa hồng nhung',
  },
  'the-thao': {
    1: 'Võ, Gym, Bi-a, Yoga, Golf, Đạp xe, Boxing, Pickleball, Điền kinh, Đá cầu, Bóng chày, Karate, Taekwondo, Vovinam, Judo, Cờ tướng, Bóng bầu dục, Trượt tuyết',
    2: 'Lướt sóng, Leo núi, Cử tạ, Đấu kiếm, Khúc côn cầu, Thể dục dụng cụ, Chèo thuyền, Bowling, Futsal, Lặn, Trượt băng, Trượt ván, Bắn súng, Nhảy xa, Nhảy cao, Đua xe, Muay Thái, Kickboxing, MMA, Kung fu, Cờ vây, Thể thao điện tử, Rubik, Nhảy dây, Đua thuyền rồng, Bóng chuyền bãi biển, Nhảy cầu, Bơi nghệ thuật, Bắn cung, Kéo co, Sumo, Đua ngựa, Bóng ném, Nhảy sào, Ném lao, Ba môn phối hợp, Cầu mây, Pétanque, Nhảy dù, Dù lượn, Câu cá, Aerobic, Trượt patin, Phi tiêu, Polo, Cricket, Squash, Bóng nước, Đua mô tô, Nhảy bungee, Parkour, Chạy vượt rào, Chạy tiếp sức, Ném đĩa, Đẩy tạ, Zumba, Pilates, Thái cực quyền',
  },
  'loai-chim': {
    1: 'Chim cánh cụt, Đà điểu, Thiên nga, Quạ, Sáo, Cò, Ngỗng, Hồng hạc, Họa mi, Chích chòe, Ngan, Chim khuyên, Gà tây, Chim cút, Chim yến, Chào mào, Gõ kiến, Chim ruồi, Bói cá, Diều hâu, Vàng anh, Hải âu, Chim sâu',
    2: 'Bồ nông, Sơn ca, Khướu, Kền kền, Chim ưng, Chim cốc, Chim ngói, Chim tu hú, Sáo đá, Chim Kiwi, Vẹt đuôi dài, Ác là, Chim ri, Cu gáy, Chìa vôi, Cuốc, Chèo bẻo, Le le, Vạc, Diệc, Đa đa, Trĩ, Sếu đầu đỏ, Chim hoàng yến, Chim chích, Chim cắt, Gà Đông Tảo, Gà ác, Gà tre, Gà chọi, Vịt bầu, Chim thiên đường, Cú mèo, Chim Dodo, Chim lợn, Chiền chiện, Hồng hoàng, Yểng, Chim cánh cụt hoàng đế, Đại bàng đầu trọc, Vẹt Macaw xanh, Bìm bịp lớn',
  },
  'loai-rau': {
    1: 'Rau má, Rau lang, Bí đỏ, Cà chua, Dưa chuột, Su hào, Hành lá, Rau mùi, Đậu cô ve, Cà tím, Bí xanh, Ớt chuông, Giá, Ngô, Măng, Nấm, Su su, Mướp, Bầu, Rau đay, Mướp đắng, Cải bó xôi, Cần tây, Súp lơ xanh, Đậu bắp, Cải chíp, Hành tây',
    2: 'Húng lủi, Đậu Hà Lan, Cải ngồng, Cải làn, Cải xoăn, Rau mầm, Tỏi tây, Đậu đũa, Bông bí, Rau cần, Lá lốt, Diếp cá, Tía tô, Kinh giới, Húng quế, Ngải cứu, Rau răm, Măng tây, Thì là, Hẹ, Ngó sen, Cà pháo, Bí ngòi, Rau sam, Rau đắng, Cải cúc, Rau ngổ, Rau nhút, Bông súng, Hoa chuối, Củ sen, Xà lách xoong, Dọc mùng, Cải bẹ xanh, Đậu rồng, Cà chua bi, Rau tần dày lá, Rau muống biển, Hoa thiên lý, Cải dưa',
  },
  'nguyen-to': {
    1: 'Chì, Natri, Canxi, Kali, Heli, Clo, Lưu huỳnh, Magie, Urani, Titan, Neon, Photpho, Iot, Bạch kim, Niken, Silic',
    2: 'Flo, Crom, Thiếc, Coban, Liti, Mangan, Argon, Asen, Brom, Rađi, Plutoni, Vonfram, Radon',
  },
  'con-vat-chu-c': {
    1: 'Cò, Cú, Cọp, Chồn, Cá voi, Cá heo, Chuồn chuồn, Châu chấu, Cào cào, Chuột túi, Cá vàng, Cá chép, Cá rô, Cá trê, Cá lóc, Chim sẻ, Chim bồ câu, Cá mập, Chim cánh cụt, Chó sói, Cá ngựa',
    2: 'Cầy, Cánh cam, Cà cuống, Cắc kè, Chuột chũi, Cá đuối, Cú mèo, Chuột hamster, Chuột đồng, Cá rô phi, Cá tra, Cá basa, Cá mè, Cá trắm, Cá diếc, Cá bống, Cá hồi, Cá ngừ, Cá thu, Cá hề, Cá kiếm, Cá nóc, Cá mú, Cá cơm, Cá chim, Cá Koi, Cá rồng, Cá bảy màu, Cá chọi, Chẫu chuộc, Cự đà, Chấy, Cua đồng, Còng, Cáy, Chích chòe, Chào mào, Chim én, Chim cút, Chim sáo, Chuột lang, Chim yến, Cá lăng, Cá tầm, Cá chình, Cá piranha, Chuột nhắt, Culi, Cầy hương, Chạch, Cuốc, Cuốn chiếu, Cun cút',
  },
  'con-trung': {
    1: 'Bọ rùa, Đom đóm, Dế, Cào cào, Mối, Bọ ngựa, Tằm, Bọ cánh cứng, Thiêu thân, Bướm đêm, Rệp, Bọ chét, Rận',
    2: 'Ong vò vẽ, Ong bắp cày, Kiến lửa, Kiến cánh, Cánh cam, Bọ xít, Sâu róm, Bọ hung, Mọt, Cà cuống, Sâu bướm, Ruồi trâu, Muỗi vằn, Dế trũi, Bọ que, Phù du, Muồm muỗm, Chuồn chuồn kim, Ruồi giấm, Sâu đo, Sâu xanh, Rầy nâu, Kiến vàng, Kiến đỏ, Nhặng, Đuông dừa, Bọ gạo',
  },
  'lang-nghe': {
    2: 'Làng gốm Chu Đậu, Làng hoa Sa Đéc, Làng hoa Tây Tựu, Làng giấy dó Yên Thái, Làng kẹo dừa Bến Tre, Làng nước mắm Phan Thiết, Đồng Kỵ, Làng lụa Mã Châu',
  },
  'gia-vi': {
    1: 'Sả, Nghệ, Quế, Hồi, Hạt nêm, Chanh, Hành tím, Dấm, Dầu hào, Tương ớt, Mù tạt, Wasabi, Bột cà ri, Mắm tôm, Dầu ăn, Mật ong',
    2: 'Riềng, Thảo quả, Đinh hương, Mẻ, Me, Ngũ vị hương, Lá chanh, Muối tiêu chanh, Muối ớt, Nước cốt dừa, Nước màu, Bột ớt, Sa tế, Tỏi phi, Hành phi, Dầu mè, Mỡ hành, Đường phèn, Lá nguyệt quế, Lá lốt, Lá dứa, Mắm nêm, Mắm ruốc, Hạt điều màu, Bột canh, Đường thốt nốt',
  },
  'loai-ca': {
    1: 'Cá mè, Cá trắm, Cá bống, Cá nục, Cá cơm, Cá kèo, Cá chim, Cá đối, Cá diếc, Cá mập, Cá hề, Cá kiếm, Cá nóc, Cá tra, Cá ngựa, Cá mú, Lươn, Cá chạch',
    2: 'Cá thát lát, Cá chim trắng, Cá tai tượng, Cá bảy màu, Cá chọi, Cá Koi, Cá đuối, Cá bạc má, Cá hồng, Cá mòi, Cá chuồn, Cá mập voi, Cá mập trắng, Cá bơn, Cá tuyết, Cá trích, Cá sư tử, Cá linh, Cá lăng, Cá chình, Cá hú, Cá dứa, Cá bớp, Cá cờ, Cá trôi, Cá sặc, Cá dĩa, Cá rồng, Cá tầm, Cá piranha, Cá hố, Cá chẽm, Cá thần tiên, Cá neon, Cá lau kiếng, Cá điêu hồng, Cá mặt quỷ',
  },
  'pop-topping': {
    1: 'Đậu đỏ, Trân châu đường đen, Sương sáo, Khúc bạch, Trân châu hoàng kim, Trân châu phô mai, Kem trứng, Dừa non, Khoai môn, Thạch cà phê',
    2: 'Thạch củ năng, Thạch xoài, Thạch dâu, Trân châu caramel, Thạch phô mai, Đào miếng, Vải, Hạt sen, Trân châu 3Q, Thạch trái cây, Thạch matcha, Kem tươi, Bánh quy Oreo, Mochi, Thạch đào, Sữa chua, Ruby đỏ, Đác, Kem socola',
  },
  'pop-mang-xa-hoi': {
    1: 'Threads, Telegram, X, Snapchat, Discord, WhatsApp, Pinterest, LinkedIn, Zoom, Locket, WeChat, Twitter',
    2: 'Reddit, Line, Viber, Microsoft Teams, Google Meet, Lotus, KakaoTalk, Skype, Tumblr, Weibo, Twitch, Douyin, Xiaohongshu, Tinder, Lemon8, Signal, iMessage, Bluesky, Clubhouse, BeReal, Facebook Lite, Mocha, Gapo, QQ',
  },
  'pop-son-tung': {
    1: 'Cơn Mưa Ngang Qua, Không Phải Dạng Vừa Đâu, Chạy Ngay Đi, Có Chắc Yêu Là Đây, Muộn Rồi Mà Sao Còn, Making My Way, Đừng Làm Trái Tim Anh Đau',
    2: 'Buông Đôi Tay Nhau Ra, Thái Bình Mồ Hôi Rơi, Chắc Ai Đó Sẽ Về, Như Ngày Hôm Qua, Khuôn Mặt Đáng Thương, Anh Sai Rồi, Nắng Ấm Xa Dần, Chúng Ta Không Thuộc Về Nhau, There\'s No One At All, Remember Me, Chúng Ta Của Tương Lai',
  },
  'pop-dien-thoai': {
    1: 'Huawei, Sony, Motorola, Honor, Asus, Vsmart, Google Pixel, OnePlus, LG, BlackBerry, Bphone, Masstel, Lenovo, Poco',
    2: 'HTC, Tecno, Infinix, Nothing, ZTE, Meizu, Alcatel, Itel, Siemens, Philips, Q-Mobile, Mobell, Vertu, Pantech, Wiko, Panasonic, Sharp, iQOO, Nubia, Red Magic, Black Shark, Microsoft Lumia, TCL, Ericsson',
  },
  'pop-banh-keo': {
    1: 'Solite, Custas, Hura, Goute, Swing, Pringles, Snickers, M&M, Chupa Chups, Haribo, Orion, Lotte, Halls, Cung Đình, Gery, Nabati, Kinh Đô, Bibica, Hải Hà, Marie, Toblerone, Ferrero Rocher, Pocky, Richy, Slide, Tic Tac, Kinder, Dynamite, Pepero, Twix, Nutella, Hershey\'s',
  },
  'pop-danh-hai': {
    1: 'Bảo Chung, Minh Nhí, Hồng Vân, Lê Giang, Tiến Luật, Lâm Vỹ Dạ, Hứa Minh Đạt, Huỳnh Lập, Mạc Văn Khoa, Long Đẹp Trai, Hải Triều, Nam Thư, Hari Won, Ngô Kiến Huy, Cát Phượng, Diệu Nhi, Thành Lộc, Hữu Châu, Văn Hiệp, Quang Teo, Giang Còi, Trung Ruồi, Chiến Thắng',
    2: 'Bảo Quốc, La Thành, Thái Sơn, Minh Dự, Hoàng Mèo, Anh Đức, Trung Dân, Phước Sang, Duy Phương, Kiều Oanh, Hoàng Sơn, Quốc Khánh, Hán Văn Tình, Vượng Râu, Hồng Đào, Thành Trung, Phú Đôn, Dũng Nhí, Ngọc Giàu, Kim Xuân, Hồng Tơ, Tuyết Thu',
  },
  'pop-xe-may': {
    1: 'Future, Winner, Jupiter, Janus, Grande, Cub, Liberty, Vario, PCX, Attila, Nouvo, Click, Raider, Spacy, Wave Alpha, VinFast Klara, Medley, Satria, Sonic, SH Mode',
    2: 'Primavera, Sprint, Ninja, Z1000, CBR, MSX, Monkey, Rebel, VinFast Evo, VinFast Feliz, Yadea, Gogoro, Dio, Luvias, Nozza, Acruzo, Freego, Latte, Viva, Wave Thái, Dream Thái, Axelo, Hayate, Shark, Angela, Elegant, Mio, Cuxi, Fino, NVX, R15, Harley Davidson, Ducati Monster, Chaly, Dylan, Honda @, Minsk',
  },
  'pop-chuoi-do-uong': {
    1: 'Tocotoco, Koi Thé, Ding Tea, Phê La, Passio, Cafe Amazon, Tiger Sugar, Ông Bầu, Chagee, Luckin Coffee',
    2: 'Milano, Bobapop, Cheese Coffee, The Coffee Bean & Tea Leaf, Costa Coffee, % Arabica, Tim Hortons, Dunkin\', Chatime, Xing Fu Tang, Feeling Tea, Royaltea, Hot & Cold, Aha Cafe, Urban Station, Heytea, Maycha, Share Tea, The Alley, Mega Coffee, Runam, Effoc, Cotti Coffee',
  },
  'pop-do-an-nhanh': {
    1: 'Subway, The Pizza Company, Otoké, Carl\'s Jr, Bonchon, Wendy\'s, Taco Bell, Dairy Queen, Baskin Robbins, Krispy Kreme, Dunkin\' Donuts, Phở 24, Chick-fil-A',
    2: 'Al Fresco\'s, Bánh mì Pewpew, Marukame Udon, Kinh Đô Bakery, Bread Talk, Chowking, Mom\'s Touch, Chester\'s, In-N-Out, Panda Express, Chipotle, Kyochon, BBQ Chicken, Pelicana, Nene Chicken, Ichiran, Ippudo, Pepper Lunch, Hardee\'s, Nando\'s, Arby\'s, Wingstop, Yoshinoya, Sukiya, Auntie Anne\'s, Cinnabon, Sbarro, Chicken Plus, Mang Inasal, Dicos',
  },
  'pop-sieu-thi': {
    1: 'Ministop, MM Mega Market, Emart, GS25, Co.op Food, WinMart+, Co.op Xtra, Daiso, Muji, Costco, Walmart, Satra, Intimex, Kingfoodmart, Lotus\'s, Don Don Donki, Lawson, Citimart, Giant',
    2: 'K-Market, Bách Hóa Gia Đình, Nam An Market, Target, Tesco, Carrefour, Makro, Aldi, Lidl, Hapro, Annam Gourmet, Tops Market, Auchan, Organica, TH True Mart, Vissan, Fuji Mart, CU, Emart24, Alfamart, Indomaret, Maximark, Cheers',
  },
  'pop-mua-sam-online': {
    1: 'Alibaba, eBay, Chợ Tốt, Thế Giới Di Động, Điện Máy Xanh, AliExpress, Shein, FPT Shop, CellphoneS, Hasaki, Facebook Marketplace, 1688, Fahasa, Nguyễn Kim, Pharmacity, Long Châu',
    2: 'Shopee Mall, LazMall, Viettel Store, Topzone, Mediamart, Pico, Hacom, Nhà sách Phương Nam, Vinabook, Fado, JD.com, Tmall, Qoo10, iHerb, Sephora, Pinduoduo, Etsy, Zalora, Điện Máy Chợ Lớn, Guardian, Concung, Bibo Mart, Hoàng Hà Mobile, Di Động Việt, Rakuten, Coupang, Walmart, Best Buy, Adayroi, Wish, Target, Muachung, Hotdeal, Enbac, 5giay, Rongbay',
  },
  'pop-goi-xe': {
    1: 'Now, Ahamove, Lalamove, Loship, Mai Linh, Vinasun, GrabCar, GrabBike, Grab Express, BeFood, GoViet, FastGo',
    2: 'GoFood, inDrive, DoorDash, Grubhub, Meituan, Kakao T, LINE MAN, Tada, Taxi Group, Taxi G7, Xanh SM Bike, Grab Mart, Lyft, Didi, Bolt, Foodpanda, Deliveroo, Emddi, MyGo, Lozi, Instacart, Ola, Yandex Go',
  },
  'pop-ngan-hang': {
    1: 'VIB, HDBank, SHB, MSB, OCB, SeABank, Eximbank, LPBank, SCB, Nam A Bank, Bac A Bank, Cake, Timo, Shinhan Bank, HSBC, Standard Chartered, ABBank, PVcomBank',
    2: 'TNEX, Ngân hàng Nhà nước, Ngân hàng Phát triển Việt Nam, UOB, Citibank, ANZ, Public Bank, CIMB, Woori, Kienlongbank, Saigonbank, NCB, VietABank, Co-opBank, VietBank, PGBank, GPBank, CBBank, OceanBank, Hong Leong Bank, Indovina Bank, VRB',
  },
  'pop-hang-bay': {
    1: 'Emirates, Qatar Airways, Korean Air, Japan Airlines, ANA, Thai Airways, Cathay Pacific, EVA Air, Asiana, Turkish Airlines, Lufthansa, Air France, British Airways, Etihad, China Airlines, Scoot, Cebu Pacific, Malaysia Airlines, Qantas, Jetstar, United Airlines, Delta, American Airlines, KLM',
    2: 'China Southern Airlines, China Eastern Airlines, Air China, Hainan Airlines, Philippine Airlines, Batik Air, Lion Air, Thai AirAsia, Thai Lion Air, Bangkok Airways, Nok Air, Jeju Air, Jin Air, T\'way Air, Air Busan, Peach Aviation, Jetstar Asia, Jetstar Japan, Virgin Australia, Air New Zealand, Southwest Airlines, Air Canada, Swiss, Iberia, Alitalia, easyJet, Ryanair, Wizz Air, Air India, IndiGo, Saudia, Starlux, Tigerair, Hong Kong Airlines, Uzbekistan Airways, VASCO, Pan Am, Virgin Atlantic, Aeroflot, Finnair, Pacific Airlines',
  },
  'pop-nuoc-giai-khat': {
    1: 'Sprite, Mirinda, Revive, Tea Plus, Trà Dr Thanh, Lipton, Twister, Nutriboost, Wake-Up 247, Monster, Yakult, Warrior, Vĩnh Hảo, Dasani, Schweppes, Pocari Sweat, Fuze Tea, Ô Long Suntory, Coca-Cola Zero, Pepsi Zero',
    2: 'Rồng Đỏ, Mountain Dew, Chương Dương, Wonderfarm, Aquarius, Cocoxim, Vfresh, Teppy, Bidrico, Vital, Sarsi, Boncha, Zero Degree, Evian, Perrier, Carabao, Lipovitan, Rockstar, Nước Yến Sanest, Birdy, G7, Splash, Nước Sâm Bí Đao',
  },
  'pop-hang-sua': {
    1: 'Vinasoy, Ensure, Similac, Enfa, Meiji, Friso, Anlene, Yakult, Ba Vì, Hanoimilk, IDP, Ông Thọ, Dielac, Nesvita, Susu, LiF, Yomost, Morinaga, Aptamil, Glico, Betagen, Probi, Fristi, Pediasure, Nan, Danone, Dutch Lady, Nutricare, Vitadairy, Dutch Mill, Vitamilk',
    2: 'Long Thành Milk, Ngôi Sao Phương Nam, Grow Plus, Glucerna, Boncare, Dumex, Nutrilon, Hipp, Kabrita, Wakodo, Bellamy\'s, Blackmores, Activia, Yoplait, President, Lactasoy, Goldsoy, Anchor, A2, Arla, Devondale, Fonterra, Klim, Carnation, Ridielac, Colosbaby, Hikid, Oatly, Almond Breeze, Silk, Alpro, 137 Degrees, Kendamil, Physiolac, Bledina, Gallia, Guigoz, Wyeth, Mead Johnson',
  },
  'pop-mi-goi': {
    1: 'Vifon, Indomie, Nissin, Miliket, 3 Miền, Tiến Vua, Modern, Koreno, Nongshim, Mama, Acecook, Bản Mì, Siukay, Nhớ Mãi Mãi, Buldak, Chapagetti, Neoguri, Jin Ramen, Paldo, Mì Ly',
    2: 'Udon Sukiyaki, Mì Trứng Vàng, Handy Hảo Hảo, Maruchan, Top Ramen, Lucky Me!, Mì Koka, Mie Sedaap, Khang Sư Phụ, Ottogi, Myojo, Sapporo, Wai Wai, Supermi, Sarimi, Demae Ramen, Dosirak, Maggi, Mamee, Mì Chính Hiệu, Phở Vifon, Phở Đệ Nhất, Miến Phú Hương',
  },
  'pop-bai-hat-tet': {
    1: 'Mùa xuân đầu tiên, Cánh thiệp đầu xuân, Như hoa mùa xuân, Bài ca Tết cho em, Đón xuân này nhớ xuân xưa, Mừng tuổi mẹ, Điệp khúc mùa xuân, Anh cho em mùa xuân, Xuân này con không về, Năm qua đã làm gì, Sắp đến Tết rồi, Xúc xắc xúc xẻ',
    2: 'Tết bình an, Đón Xuân, Xuân Phương Nam, Hoa xuân, Mùa xuân bên cửa sổ, Xuân yêu thương, Mùa xuân trên thành phố Hồ Chí Minh, Hoa cỏ mùa xuân, Xuân tha hương, Tâm sự nàng xuân, Ngày xuân thăm nhau, Đám cưới đầu xuân, Mùa xuân làng lúa làng hoa',
  },
  'pop-app-hoc': {
    1: 'Khan Academy, Coursera, Hocmai, VioEdu, Monkey Junior, Prep, OLM, VietJack, Tuyensinh247, Udemy, Gauth, Azota, Gemini, Claude, Grammarly, Wikipedia, Loigiaihay, Lazi, Tienganh123, Mathway, Memrise, Cake, Violympic, TED, Google Scholar, Hoc247, Moon.vn, Vuihoc, Từ điển Laban, IOE',
    2: 'Shub Classroom, Codecademy, edX, Skillshare, Cambly, Anki, Brainly, Scratch, Code.org, GeoGebra, Desmos, MochiMochi, TFlat, Trạng Nguyên Tiếng Việt, Babbel, Busuu, LingoDeer, BBC Learning English, Topica Native, Edmodo, K12Online, VnEdu, Canvas, Brilliant, LinkedIn Learning, MasterClass, Chegg, Socratic, italki, Preply, HelloTalk, Rosetta Stone, Symbolab, Clevai, Marathon Education, Kyna, Unica, Hoc10, Kiến Guru',
  },
  'pop-bai-hat-thieu-nhi': {
    1: 'Bài ca đi học, Chú voi con ở bản Đôn, Cô giáo em, Tập tầm vông, Em là bông hồng nhỏ, Bé lên ba, Con gà trống, Đàn gà con, Cá vàng bơi, Năm ngón tay ngoan, Mẹ yêu không nào, Chim vành khuyên, Trái đất này là của chúng mình, Ba thương con, Cháu lên ba, Bà còng đi chợ, Cô và mẹ, Rước đèn tháng tám, Tết Trung thu, Đêm Trung thu, Cháu vẽ ông mặt trời, Ai yêu Bác Hồ Chí Minh hơn thiếu niên nhi đồng, Cùng nhau ta đi lên, Thật là hay, Ngày đầu tiên đi học, Quả gì, Đàn vịt con, Bông hoa mừng cô, Tiếng ve gọi hè, Đếm sao, Ồ sao bé không lắc',
  },
  'pop-app-xem-phim': {
    1: 'iQIYI, WeTV, TV360, MyTV, K+, Disney+, Prime Video, HBO Go, SoundCloud, VTV Go, POPS, Viki, YouTube Music, Apple TV+, Bilibili, Shazam',
  },
  'n-qua-vang': {
    1: 'Khế, Mơ, Dưa lưới, Bưởi, Cam, Quýt, Hồng, Lê, Chuối tiêu, Ổi, Thanh long vàng, Dưa lê',
    2: 'Thị, Bí đỏ, Quất, Chanh dây, Mận vàng, Táo vàng, Sa kê, Đào vàng, Dưa hoàng kim, Nhót, Bòn bon, Kiwi vàng, Cà chua vàng, Ớt chuông vàng, Hồng xiêm, Dưa bở, Táo mèo, Chuối ngự',
  },
  'n-vai': {
    1: 'Gấm, Satin, Chiffon, Kate, Polyester, Tơ tằm, Thổ cẩm, Dạ, Da lộn, Vải đũi, Vải dù, Vải bố',
    2: 'Organza, Tweed, Flannel, Lụa Hà Đông, Nilon, Cashmere, Rayon, Spandex, Tencel, Modal, Vải sợi tre, Lụa Mỹ A, The, Tuyn, Nhung tăm, Vải xô, Vải lưới, Vải thun lạnh, Vải canvas, Vải tafta, Vải tulle, Vải kim sa, Vải nhũ, Vải gai, Vải đay, Vải thô, Lãnh Mỹ A, Vải bạt, Vải không dệt, Vải nỉ bông, Vải caro',
  },
  'n-nong-cu': {
    1: 'Mai, Thuổng, Cào, Nơm, Vó, Cối xay, Cối giã, Sàng, Mẹt, Rổ, Rá, Chum, Cày tay, Bình tưới, Ô doa, Dao rựa',
    2: 'Lờ, Đó, Máy tuốt lúa, Cối đá, Chày, Ách, Xe bò, Cót, Guồng nước, Cọn nước, Lưỡi cày, Cuốc chim, Giần, Quạt thóc, Đòn xóc, Chài, Lưới đánh cá, Gùi, Rìu, Xà beng, Chĩa, Đinh ba, Vợt, Bù nhìn, Cân đòn, Đấu, Thưng, Rọ, Giỏ cá, Đôi quang, Bồ, Gầu giai',
  },
  'n-giay-hieu': {
    1: 'Asics, Skechers, Crocs, Reebok, Fila, Jordan, Dr. Martens, Gucci, Balenciaga, Prada, Louis Vuitton, Chanel, Dior, Onitsuka Tiger, Mizuno, Under Armour, Li-Ning, Anta, Yeezy, Biti\'s Hunter, Vascara, Juno, UGG, Charles & Keith, Pedro, Lacoste, Zara, Christian Louboutin, Jimmy Choo, Birkenstock, Timberland, Clarks, Bata, Havaianas, Hoka, Salomon',
    2: 'Ecco, Geox, Steve Madden, Nine West, Aldo, Yonex, Kappa, Umbro, Diadora, Brooks, Saucony, On Running, Keds, Superga, Golden Goose, Hermès, Versace, Burberry, Valentino, Givenchy, Fendi, Off-White, Alexander McQueen, Saint Laurent, Peak, Xtep, Kamito, Ellesse, Champion, Kenzo, Y-3, Palladium, Ralph Lauren, Tommy Hilfiger, Calvin Klein, Michael Kors, Coach, Guess, H&M, Uniqlo, Mango, Bershka, Merrell, The North Face, Columbia, Toms, Allbirds, Lascal, Hush Puppies, Rockport, Le Coq Sportif, Lotto, Hummel, Joma, Kelme, Domba, Dincox, Victor, Wika, Mitre, Pan, Warrior, Feiyue, Fitflop, Camper, Melissa, Erke, Kangaroos, Teva, Keen, Sperry, Veja, Heelys, Bally, Moncler',
  },
  'n-mon-thai': {
    1: 'Cà ri đỏ, Tom kha gai, Lẩu Thái hải sản, Lẩu Thái chua cay, Cơm chiên dứa, Satay, Gà xào lá húng quế, Mì tom yum, Gỏi xoài Thái, Chè Thái, Xôi sầu riêng, Bánh crepe Thái, Khao pad, Pad kra pao, Cá chẽm hấp chanh, Thịt heo nướng Thái, Cà ri vàng',
    2: 'Larb, Khao man gai, Khao soi, Moo ping, Kaeng massaman, Panang, Pad see ew, Kanom krok, Tub tim grob, Lod chong, Moo kratha, Miang kham, Gai tod, Bua loy, Yam woon sen, Boat noodles, Crying tiger, Tod mun pla, Hor mok, Pla rad prik, Kai jeow, Kuay teow, Khao niao, Som tam thai, Sai ua, Nam tok, Gaeng som, Kem cuộn, Kluay tod, Mee krob, Pad woon sen, Khao kha moo, Moo grob, Poo pad pong karee, Khanom jeen',
  },
  'n-banh-mi-ngoai': {
    1: 'Bagel, Pizza, Naan, Pita, Focaccia, Ciabatta, Bánh mì đen, Bánh mì nguyên cám, Sourdough, Pretzel, Tortilla, Club sandwich, Bánh mì sữa Hokkaido, Muffin Anh, Pain au chocolat, Melonpan, Bánh mì Hàn Quốc, Bánh mì nướng bơ tỏi, Bánh mì Nhật',
    2: 'Pumpernickel, Bánh mì lúa mạch đen, Chapati, Roti, Paratha, Lavash, Bánh mì Ý panini, Grissini, Crumpet, Scone, Bánh mì dứa, Bánh mì xá xíu, Mantou, Youtiao, Katsu sando, Tamago sando, Bánh mì tỏi Hàn Quốc, Bánh mì trứng Hàn Quốc, Roti canai, Kaya toast, Dosa, Pide, Lahmacun, Babka, Panettone, Stollen, Arepa, Injera, Khachapuri, Simit, Kouign-amann, Pandesal, Bánh mì chuối, Bánh mì Pullman, Monkey bread, Matzah, Pupusa, Concha, Bánh mì cà ri Nhật, Bánh mì Đài Loan, Bánh mì kim sa, Pain de mie',
  },
  'n-pasta': {
    1: 'Fettuccine, Linguine, Fusilli, Farfalle, Ravioli, Tagliatelle, Gnocchi, Rigatoni, Tortellini, Cannelloni, Aglio e olio, Pesto, Mac and cheese, Nui xào, Penne arrabbiata',
    2: 'Vongole, Orzo, Capellini, Bucatini, Pappardelle, Conchiglie, Ditalini, Rotini, Ziti, Cacio e pepe, Amatriciana, Puttanesca, Arrabbiata, Marinara, Mì Ý mực đen, Spaghetti meatballs, Pasta salad, Penne alla vodka, Gnocchi khoai tây, Cavatappi, Agnolotti, Tortelloni, Tagliolini, Mì Ý cá hồi, Mì Ý cá ngừ, Mì Ý nấm truffle, Mì Ý mentaiko, Paccheri, Strozzapreti, Trofie, Pastitsio, Orecchiette con cime di rapa',
  },
  'n-dac-san-hn': {
    1: 'Bún đậu mắm tôm, Xôi xéo, Nem rán, Bánh tôm Hồ Tây, Kem Tràng Tiền, Phở cuốn, Bún riêu, Ô mai, Bánh đúc nóng, Nem chua rán, Bánh gối, Bánh mì sốt vang, Trà chanh, Phở gà, Ốc luộc, Bánh trôi bánh chay',
    2: 'Bún mọc, Miến lươn, Phở chiên phồng, Bún dọc mùng, Chè bà cốt, Bánh khúc, Bánh giò, Bánh cốm Hàng Than, Bánh rán, Cháo trai, Bánh đa cua Hà Nội, Sấu dầm, Phở xào, Phở trộn, Phở sốt vang, Bún ốc nguội, Lẩu riêu cua, Kem Thủy Tạ, Cà phê muối, Sữa chua nếp cẩm, Bò nhúng dấm, Chim quay, Giò chả Hà Nội, Chả mực, Ngô nướng, Bia hơi Hà Nội, Chè khúc bạch, Chè đỗ đen, Kem xôi, Bún ngan, Miến ngan, Ốc nóng',
  },
  'n-dac-san-hue': {
    1: 'Bánh ướt thịt nướng, Nem lụi, Tôm chua, Bánh canh Nam Phổ, Bún hến, Bánh ram ít, Chè hạt sen, Bánh ít lá gai, Tré, Mắm ruốc Huế, Chè bột lọc, Cháo hến, Nem chua Huế, Cơm âm phủ, Vả trộn, Bánh xèo Huế, Chả Huế, Chè đậu ngự',
    2: 'Bánh hỏi Huế, Bánh khoái cá kình, Chè sen trần, Bánh phu thê, Bánh su sê Huế, Bánh in, Mít trộn, Bánh canh cá lóc, Bánh bèo nậm lọc, Bánh ép Huế, Bánh mì O Thanh, Heo quay Huế, Chè Mụ Ba, Cơm vua Huế, Cơm chay Huế, Hến xúc bánh tráng, Trà cung đình Huế, Rượu Minh Mạng, Kẹo cau Huế, Chả tôm Huế, Bánh nậm tôm, Bánh lọc lá, Mứt gừng Kim Long, Gà chua Huế, Bún mắm nêm Huế',
  },
  'n-hoa-tet': {
    1: 'Hoa thủy tiên, Hoa lay ơn, Hoa thược dược, Hoa vạn thọ, Hoa cát tường, Hoa đồng tiền, Hoa hồng, Hoa tulip, Cây phát tài, Cây kim ngân, Cây trạng nguyên, Hoa mẫu đơn, Cây quất cảnh, Cây kim quất, Cây tắc, Hoa cúc mâm xôi, Mai chiếu thủy, Hoa đỗ quyên, Cây lộc vừng, Cây kim tiền, Hoa hướng dương, Hoa cẩm chướng, Cây bưởi cảnh, Đào phai, Đào bích, Đào Nhật Tân',
    2: 'Hoa trà, Cây phật thủ, Tùng la hán, Cây đào thế, Cây hồng cảnh, Cúc họa mi, Lan đai châu, Lan cymbidium, Lan vanda, Lan kiếm, Hoa loa kèn, Hoa cẩm tú cầu, Hoa phong lữ, Cây hoa giấy, Hoa dâm bụt, Hoa ngọc lan, Hoa sen đá, Hoa dạ yến thảo, Hoa thạch thảo, Hoa sống đời, Hoa salem, Hoa baby, Hoa địa lan, Mai trắng, Mai Yên Tử, Cây vạn lộc, Cây bonsai, Cây sanh, Cây si, Cây trúc phú quý, Cây lưỡi hổ, Cây hồng môn, Hoa thiên điểu, Cây mai tứ quý, Mai giảo, Đào thất thốn, Hoa mơ, Hoa mận trắng, Hoa hải đường, Hoa trà my, Lan hoàng thảo, Hoa quỳnh, Hoa nhài, Hoa violet',
  },
  'pop-google': {
    1: 'Google Classroom, Google Calendar, Google Forms, Google Slides, Google Lens, Google Earth, Google Pay, Pixel, YouTube Music, YouTube Kids, Google Home, Google Assistant, Google Search, Waze, Google Chat, Blogger, Gboard, Chromebook, Google Scholar, Google Street View, YouTube Shorts, YouTube Premium, Google One, Google Cloud, Google Analytics, Google Ads, Hangouts, Google Keep',
    2: 'Google Tin tức, Google Sites, Google Fit, Google Duo, Google+, Fitbit, Google Arts & Culture, Google Trends, Google Books, Google Fonts, Firebase, Google Colab, Picasa, Stadia, Google Glass, Chromecast, NotebookLM, Google Flights, Google Workspace, Google Authenticator, Nest Hub, Orkut, Google Finance, Google Reader, Tensor, Google Sky',
  },
  'pop-apple': {
    1: 'iPad Pro, iPad Air, iPad mini, MacBook Air, MacBook Pro, AirPods Pro, Apple TV, iPod, AirTag, Magic Mouse, Magic Keyboard, Vision Pro, Apple Pencil, iPhone SE, EarPods',
    2: 'AirPods Max, HomePod, iPod touch, Mac Pro, Mac Studio, HomePod mini, Studio Display, Pro Display XDR, Magic Trackpad, Apple Watch Ultra, Apple Watch SE, AirPort, Time Capsule, iPod classic, Newton, Apple II, Macintosh, iBook, PowerBook, MagSafe, Siri Remote, eMac, Power Mac, Lisa, iPod nano, iPod shuffle',
  },
  'pop-doraemon': {
    1: 'Dorami, Jaiko, Sewashi, Mini Dora, Khăn trùm thời gian, Áo choàng tàng hình, Đèn pin phóng to, Bút chì tự trả lời, Kẹo dịch, Đội quân Doraemon',
    2: 'Mẹ Chaien, Mũ đá cuội, Đồng hồ ngưng đọng thời gian, Gương lật ngược, Máy dịch, Bà nội Nobita, Pisuke, Dora the Kid, Dora-nichov, Dora-rinho, Wang Dora, Elmatador, Dora-med III, Máy ước, Máy nếu như, Đường hầm xuyên trái đất, Lilulu, Ông Kaminari, Mèo Mii của Shizuka, Điện thoại dạo, Máy cho mượn',
  },
  'pop-cong-chua': {
    1: 'Tiana, Pocahontas, Merida, Raya, Mirabel, Tinker Bell, Alice, Esmeralda, Nala, Judy Hopps, Vanellope, Lilo, Elastigirl, Joy, Sofia',
    2: 'Asha, Ella, Wendy, Megara, Jane Porter, Kida, Giselle, Elena, Anastasia, Isabela Madrigal, Luisa Madrigal, Mei Lee, Riley, Ellie, Colette, Violet Parr, Kiara, Mal, Evie, Nani, Mary Poppins, Leia, Rey, Dory, Jessie, Sadness, Anxiety',
  },
  'pop-hang-xa-xi': {
    1: 'Fendi, Givenchy, Valentino, Celine, Dolce & Gabbana, Armani, Michael Kors, Coach, Ralph Lauren, Tom Ford, Cartier, Rolex, Tiffany & Co., Bulgari, Hugo Boss, Christian Louboutin, Jimmy Choo, Longchamp, Kate Spade, Marc Jacobs, Omega',
    2: 'Bottega Veneta, Moschino, Miu Miu, Alexander McQueen, Balmain, Off-White, Kenzo, Salvatore Ferragamo, Montblanc, Goyard, Maison Margiela, Comme des Garçons, Issey Miyake, Vivienne Westwood, Tory Burch, Furla, Mulberry, Chloé, Lanvin, Moncler, Stone Island, Patek Philippe, Audemars Piguet, Van Cleef & Arpels, Chopard, Jacquemus, Golden Goose, Philipp Plein, Dsquared2, Loro Piana, Zegna',
  },
  'pop-my-pham-han': {
    1: 'Skin1004, Torriden, Anua, Round Lab, Klavuu, Tony Moly, Nature Republic, The Saem, Holika Holika, Mamonde, IOPE, Dr. Jart+, AHC, Medicube, Mediheal, Banila Co, Peripera, Merzy, Clio, Beauty of Joseon, Bbia, Espoir, Lilybyred',
  },
  'pop-ngoai-hang-anh': {
    1: 'Wolverhampton, Brighton, Crystal Palace, Fulham, Brentford, Nottingham Forest, Southampton, Leeds United, Bournemouth, Burnley, Sunderland, Watford, Norwich City, Stoke City, West Bromwich Albion',
  },
  'nv-bong-vang': {
    1: 'Rivaldo, Luís Figo, Michael Owen, Pavel Nedvěd, Andriy Shevchenko, Fabio Cannavaro, Rodri, Ousmane Dembélé',
  },
  'nv-nobel-van': {
    3: 'Sully Prudhomme, Theodor Mommsen, Paul Heyse, Bjørnstjerne Bjørnson, Eyvind Johnson, Halldór Laxness, Giorgos Seferis, Ivo Andrić, Juan Ramón Jiménez, Salvatore Quasimodo, Camilo José Cela, Jaroslav Seifert, Claude Simon, Elias Canetti, Imre Kertész, Herta Müller, Gerhart Hauptmann, Henryk Sienkiewicz, Selma Lagerlöf, Maurice Maeterlinck, Jon Fosse, Abdulrazak Gurnah, Annie Ernaux, Louise Glück, Olga Tokarczuk, Peter Handke, Patrick Modiano, Svetlana Alexievich, Wisława Szymborska, Czesław Miłosz, Tomas Tranströmer, Derek Walcott, Patrick White, Miguel Ángel Asturias, Gabriela Mistral, Wole Soyinka, Elfriede Jelinek, Le Clézio, Eugene O\'Neill, Sinclair Lewis, Romain Rolland, Anatole France, Luigi Pirandello, Knut Hamsun, Ivan Bunin, Cao Hành Kiện, Naguib Mahfouz',
  },
  'dv-giong-meo': {
    1: 'Mèo Nga xanh, Mèo Ai Cập, Mèo Himalaya, Mèo Exotic',
    3: 'Mèo Burmilla, Mèo Sokoke, Mèo Kurilian Bobtail, Mèo Highlander, Mèo Minskin, Mèo Bambino, Mèo Elf, Mèo Dwelf, Mèo Ukrainian Levkoy, Mèo Serengeti, Mèo Cheetoh, Mèo Thai Lilac, Mèo Suphalak, Mèo Wichienmaat, Mèo Sangkhaya, Mèo Colorpoint Shorthair, Mèo Javanese, Mèo Snowshoe',
  },
  'n-thuy-san': {
    1: 'Cá mè, Cá trôi, Cá rô đồng, Cá chình, Cá tầm, Cá hồi, Cá mú, Cá kèo, Hàu, Ngao, Sò huyết, Ốc hương, Ốc bươu, Cá koi, Cá sấu, Mực, Ghẹ, Cá chẽm, Cá bống tượng',
  },
  'dv-thu': {
    1: 'Thỏ, Lừa, Lạc đà, Nhím, Chồn, Gấu Bắc Cực, Đười ươi, Tinh tinh, Khỉ đột, Gấu túi, Báo đốm, Linh dương, Tuần lộc, Hải cẩu, Chuột hamster, Báo săn, Linh cẩu',
    2: 'Bò tót, Lợn rừng, Gấu trúc đỏ, Thú mỏ vịt, Hải ly, Rái cá, Sóc bay, Chuột chũi, Lạc đà Alpaca, Khỉ đầu chó, Linh dương đầu bò, Nai sừng tấm, Cầy, Mèo rừng, Gấu mèo, Sao la, Hổ Bengal, Lười, Tê tê, Gấu nâu, Gấu xám, Vượn cáo, Chuột túi Wallaby, Báo sư tử, Cáo Bắc Cực, Lạc đà không bướu, Hà mã lùn, Thú ăn kiến, Tatu, Lửng mật, Sư tử biển, Voọc, Cu li',
  },
  'dv-ca-bien': {
    1: 'Cá chình, Cá hồng, Cá mòi, Cá đối, Cá chuồn, Cá mập trắng, Cá mập voi, Cá trích, Cá ngừ vây xanh',
    2: 'Cá chẽm, Cá hố, Cá cờ, Cá bò, Cá mặt quỷ, Cá dìa, Cá sòng, Cá ngân, Cá bè, Cá nhám, Cá đuối điện, Cá mập đầu búa, Cá mập hổ, Cá bơn, Cá tuyết, Cá sư tử, Cá đuối manta, Cá mặt trăng',
  },
  'dv-ca-ngot': {
    1: 'Cá diếc, Cá bống, Cá linh, Cá kèo, Cá thát lát, Cá tai tượng, Cá bảy màu, Cá chọi, Cá Koi, Lươn, Cá rồng',
    2: 'Cá chim trắng, Cá lăng, Cá trôi, Cá ngạnh, Cá sặc, Cá hú, Cá lau kiếng, Cá dĩa, Cá thần tiên, Cá neon, Cá piranha, Cá tầm, Cá chình, Cá điêu hồng, Cá lóc bông, Cá chày, Cá mương, Cá he, Cá anh vũ, Cá rô đầu vuông, Cá trê phi',
  },
  'dv-bosat': {
    1: 'Tắc kè hoa, Rắn hổ mang, Trăn, Rồng Komodo, Ba ba, Rắn hổ mang chúa, Nhái, Chẫu chuộc, Nòng nọc, Kỳ giông, Rắn nước, Rắn lục',
    2: 'Rắn cạp nong, Rắn cạp nia, Rắn ráo, Rắn biển, Rắn chuông, Rắn mamba, Trăn Anaconda, Rùa tai đỏ, Rùa cạn, Đồi mồi, Cá sấu hoa cà, Thằn lằn bóng, Ễnh ương, Ếch phi tiêu độc, Kỳ giông Mexico, Rùa Galapagos, Khủng long, Cóc tía, Rắn sữa, Kỳ nhông Iguana, Rùa núi vàng, Ếch bò',
  },
  'dv-nuoi': {
    1: 'Cừu, Thỏ, Bồ câu, Ngan, Chim cút, Vẹt, Tằm, Ong, Cá bảy màu, Cá chọi, Cá Koi, Chuột hamster, Gà tây, Lừa, Chuột lang, Nhím, Sóc',
  },
  'dv-phi': {
    1: 'Báo săn, Linh dương, Tinh tinh, Khỉ đột, Linh cẩu, Đà điểu, Cá sấu, Hồng hạc, Lạc đà, Kền kền, Khỉ',
    2: 'Linh dương đầu bò, Khỉ đầu chó, Cầy mangut, Lợn bướu, Tắc kè hoa, Rắn mamba, Vượn cáo, Tê giác trắng, Tê giác đen, Lửng mật, Chó hoang châu Phi, Cáo Fennec, Sói đất, Hươu cao cổ lùn, Linh dương Kudu, Chim thư ký, Ruồi tsetse, Bọ hung',
  },
  'dv-sung': {
    1: 'Cừu, Linh dương, Sơn dương, Tuần lộc, Bò rừng, Hươu cao cổ, Bọ hung, Khủng long ba sừng',
    2: 'Bò tót, Dê núi, Bò Tây Tạng, Linh dương đầu bò, Nai sừng tấm, Sao la, Ibex, Hoẵng, Trâu nước, Bọ cánh cứng sừng, Okapi, Nai sừng xám, Linh dương Kudu, Bò xạ hương, Dê rừng',
  },
  'dv-doc': {
    1: 'Rắn hổ mang, Cá nóc, Ong bắp cày, Kiến lửa, Rết, Sâu róm, Rắn hổ mang chúa, Rắn lục, Bạch tuộc đốm xanh, Ếch phi tiêu độc, Nhện góa phụ đen',
    2: 'Rồng Komodo, Cá sư tử, Rắn đuôi chuông, Nhím biển, Rắn cạp nong, Rắn cạp nia, Rắn biển, Rắn mamba, Cá mặt quỷ, Nhện Tarantula, Sứa hộp, Ốc nón, Thú mỏ vịt, Cá đuối, Cóc mía, Rắn taipan, Ong mặt quỷ, Rắn chàm quạp, Sứa lửa, Bọ cạp hoàng đế, Ong đất, Kỳ nhông lửa',
  },
  'dv-bay': {
    1: 'Bướm đêm, Bọ ngựa, Bọ cánh cứng, Thiêu thân, Cào cào, Ong bắp cày, Cánh cam, Bọ xít, Kiến cánh, Sóc bay, Cá chuồn',
    2: 'Thằn lằn bay, Bọ hung, Cà cuống, Bọ que, Bọ lá, Chuồn chuồn kim, Ruồi giấm, Muỗi vằn, Ruồi trâu, Dơi muỗi, Dơi quỷ, Nhặng, Bướm vua, Ếch bay, Pteranodon, Ruồi xanh, Mọt, Mối, Dơi ngựa',
  },
  'dv-vo': {
    1: 'Tôm tít, Hàu, Sò điệp, Bào ngư, Ốc bươu, Ốc nhồi, Mực ống, Ốc hương, Sò huyết, Cua biển, Hến, Còng, Ốc mượn hồn',
    2: 'Cua gạch, Cua lột, Cua dừa, Tép, Tôm hùm đất, Ba khía, Rạm, Dã tràng, Ốc móng tay, Ốc len, Ốc mỡ, Ốc vặn, Sò lông, Tu hài, Ghẹ hoa, Tôm he, Mực lá, Bạch tuộc đốm xanh, Ốc đá, Vẹm, Trai, Cáy, Ốc gạo, Mực nang, Cua hoàng đế, Sam, Ốc sên biển',
  },
  'tv-cu': {
    1: 'Hành tây, Củ dền, Khoai sọ, Khoai mỡ, Tỏi, Gừng, Nghệ, Củ kiệu, Hành tím, Riềng, Củ sen, Củ cải đỏ',
    2: 'Củ từ, Củ mài, Củ năng, Củ ấu, Củ dong, Củ sắn dây, Khoai nưa, Củ ráy, Củ tam thất, Củ hoài sơn, Khoai lang Nhật, Củ sâm đất, Củ cải trắng Đà Lạt',
  },
  'tv-hat': {
    1: 'Mắc ca, Điều, Đậu đỏ, Hạt sen, Lúa mì, Yến mạch, Hạt dưa, Hạt hướng dương, Hạt bí, Hạnh nhân, Óc chó, Hạt dẻ, Hạt cà phê, Gạo nếp, Hạt é, Hạt chia, Hạt dẻ cười',
    2: 'Kê, Lúa mạch, Đậu trắng, Đậu lăng, Đậu gà, Cốm, Hạt mít, Quinoa, Hạt ca cao, Hạt thông, Hạt phỉ, Hạt lanh, Gạo lứt, Nếp cẩm, Đậu rồng, Đậu ván, Hạt điều màu, Đậu ngự, Hạt mít, Đậu thận',
  },
  'tv-nam': {
    1: 'Nấm sò, Nấm đùi gà, Nấm mỡ, Ngân nhĩ, Nấm tràm, Nấm mối, Nấm Truffle, Nấm bào ngư, Nấm độc, Nấm shiitake',
  },
  'tv-qua-do': {
    1: 'Mận, Dâu tây, Lựu, Cherry, Gấc, Hồng, Táo tàu, Roi, Ổi ruột đỏ, Thanh long ruột đỏ, Cà chua bi, Nho đỏ',
    2: 'Nhót, Mâm xôi, Nam việt quất, Sơ ri, Dâu tằm, Táo mèo, Đào, Quả vả, Kỷ tử, Thù lù, Trứng cá, Quýt hồng, Xuân đào, Ớt sừng, Ớt hiểm, Bòn bon đỏ',
  },
  'tv-qua-chua': {
    1: 'Khế, Cóc, Mơ, Me, Sấu, Quất, Dứa, Quýt, Dâu tây, Cà chua, Kiwi, Chanh vàng, Táo xanh, Nho xanh',
    2: 'Bần, Bòn bon, Chùm ruột, Nhót, Táo mèo, Sơ ri, Dâu da, Việt quất, Mâm xôi, Lựu chua, Thanh mai, Quả trám, Bứa, Tai chua, Hồng bì, Chanh đào, Me Thái, Ổi xanh',
  },
  'tv-qua-1tieng': {
    1: 'Mận, Lê, Bơ, Quýt, Khế, Roi, Lựu, Hồng, Mơ, Đào, Na, Dâu',
    2: 'Cóc, Me, Sấu, Quất, Gấc, Thị, Sung, Sim, Nhót, Vả, Trâm, Hạnh',
  },
  'tv-qua-chu-m': {
    1: 'Mơ, Me, Mận hậu, Mít Thái, Mâm xôi',
  },
  'dd-song': {
    1: 'Bạch Đằng, Sông Hàn, Sông Thu Bồn, Sông Lô, Sông Đuống, Sông Cầu, Sông Gianh, Sông Bến Hải, Sông Tô Lịch, Sông Đáy, Sông Thái Bình, Sông Vàm Cỏ, Sông Nho Quế',
    2: 'Sông Thao, Sông Thương, Sông Kỳ Cùng, Sông Bằng, Sông Gâm, Sông Chảy, Sông Lục Nam, Sông Nhuệ, Sông Kim Ngưu, Sông Chu, Sông Nhật Lệ, Sông Thạch Hãn, Sông Trà Khúc, Sông Đà Rằng, Sông Sê San, Sông Srêpốk, Sông Bé, Sông Cổ Chiên, Sông Hàm Luông, Sông Ba Lai, Sông Luộc, Sông La, Sông Hiếu, Sông Côn, Sông Dinh, Sông Kinh Thầy, Sông Cấm, Sông Lạch Tray, Sông Văn Úc, Sông Đa Nhim, Sông Vu Gia, Sông Cửa Đại, Sông Hoài',
  },
  'dd-thac-hang': {
    1: 'Thác Bản Giốc, Hang Sửng Sốt, Hang Đầu Gỗ, Hang Én, Động Thiên Đường, Thác Datanla, Thác Pongour, Động Tam Thanh, Động Tiên Sơn, Thác Bạc, Thác Prenn, Thác Cam Ly, Thác Dray Nur, Hang Múa, Pác Bó',
    2: 'Động Ngườm Ngao, Thác Dải Yếm, Thác Mơ, Động Thiên Cung, Hang Luồn, Hang Va, Hang Tú Làn, Thác Voi, Thác Đambri, Thác Giang Điền, Thác Yang Bay, Động Huyền Không, Động Âm Phủ, Hang Tiên, Hang Tối, Hang Rục Cà Roòng, Hang Trống, Hang Bồ Nâu, Hang Trinh Nữ, Hang Sáng Tối, Hang Pa Thơm, Thác Dray Sáp, Động Từ Thức, Thác Ba Vì, Thác Ao Vua, Hang Lùng Khúy, Hang Puông, Động Nhị Thanh',
  },
  'tg-bien': {
    1: 'Nam Đại Dương, Địa Trung Hải, Biển Đỏ, Biển Đen, Biển Caribe, Biển Bắc, Biển Caspi, Biển Nhật Bản, Vịnh Thái Lan, Vịnh Bắc Bộ, Vịnh Mexico, Vịnh Ba Tư, Vịnh Bengal, Vịnh Cam Ranh, Vịnh Nha Trang, Biển Hoa Đông, Vịnh Bái Tử Long, Vịnh Lan Hạ',
    2: 'Biển Baltic, Biển Philippines, Biển Arab, Vịnh Vân Phong, Vịnh Xuân Đài, Vịnh Lăng Cô, Vịnh Đà Nẵng, Vịnh Quy Nhơn, Vịnh Vĩnh Hy, Biển Aegean, Biển Adriatic, Biển Na Uy, Biển Barents, Vịnh Hudson, Vịnh Alaska, Vịnh Aden, Vịnh Oman, Vịnh Tokyo, Vịnh San Francisco, Eo biển Malacca, Eo biển Gibraltar, Eo biển Bering, Eo biển Đài Loan, Eo biển Hormuz, Eo biển Manche, Biển Azov, Biển Marmara, Vịnh Bột Hải, Vịnh Manila, Vịnh Rạch Giá, Vịnh Gành Rái, Vịnh Dung Quất, Biển Galilee, Biển Celebes, Biển Sulu, Biển Java, Biển Tasman',
  },
  'nv-vua': {
    1: 'An Dương Vương, Lý Bí, Lý Thánh Tông, Lý Nhân Tông, Lý Chiêu Hoàng, Hồ Quý Ly, Minh Mạng, Tự Đức, Hàm Nghi, Duy Tân, Khải Định, Thành Thái',
    2: 'Lý Thái Tông, Trần Anh Tông, Mạc Đăng Dung, Nguyễn Nhạc, Thiệu Trị, Triệu Quang Phục, Mai Thúc Loan, Phùng Hưng, Trần Minh Tông, Hồ Hán Thương, Lê Thái Tông, Lê Nhân Tông, Đồng Khánh, Dương Tam Kha, Lê Nghi Dân, Lê Hiển Tông, Lê Chiêu Thống, Trần Duệ Tông',
  },
  'nv-tuong': {
    1: 'Trần Quang Khải, Phạm Ngũ Lão, Yết Kiêu, Trần Bình Trọng, Lê Lai, Bùi Thị Xuân, Hoàng Hoa Thám, Trần Khánh Dư, Nguyễn Trung Trực, Trương Định',
    2: 'Cao Lỗ, Lê Chân, Dã Tượng, Trần Nhật Duật, Nguyễn Xí, Đinh Lễ, Trần Nguyên Hãn, Lê Văn Duyệt, Nguyễn Tri Phương, Cao Thắng, Nguyễn Thị Định, Văn Tiến Dũng, Nguyễn Chí Thanh, Tôn Thất Thuyết, Phan Đình Phùng, Võ Tánh, Trần Quang Diệu, Nguyễn Hữu Cảnh, Lê Phụng Hiểu, Đặng Dung, Hoàng Cầm, Trần Văn Trà, Lê Trọng Tấn',
  },
  'nv-nu': {
    1: 'Lý Chiêu Hoàng, Ỷ Lan, Huyền Trân, Bùi Thị Xuân, Bà Huyện Thanh Quan, Nguyễn Thị Minh Khai, Mạc Thị Bưởi, Mỵ Châu, Đoàn Thị Điểm, Nam Phương Hoàng hậu, Đặng Thùy Trâm, Nguyễn Thị Định, Nguyễn Thị Bình, Lê Chân',
    2: 'Phùng Thị Chính, Dương Vân Nga, Nguyễn Thị Lộ, Lê Ngọc Hân, Từ Dũ, Cô Giang, Sương Nguyệt Anh, Hoàng Thị Loan, Nguyễn Thị Thập, Mẹ Thứ, Võ Thị Thắng, Lê Thị Hồng Gấm, Nguyễn Thị Duệ, Trần Thị Lý, Hồ Thị Bi, Nguyễn Thị Chiên, An Tư',
  },
  'nv-tran': {
    1: 'Trần Anh Tông, Trần Quang Khải, Trần Khánh Dư, Phạm Ngũ Lão, Yết Kiêu, Trần Bình Trọng, Chu Văn An, Mạc Đĩnh Chi, Huyền Trân, Hồ Quý Ly, Trần Ích Tắc',
    2: 'Lê Văn Hưu, Thoát Hoan, Ô Mã Nhi, Nguyễn Phi Khanh, Đặng Dung, Trần Minh Tông, Dã Tượng, Trần Nhật Duật, Tuệ Tĩnh, Hàn Thuyên, Trương Hán Siêu, Trần Liễu, Toa Đô, Nguyễn Hiền, Trần Quốc Tảng, Linh Từ Quốc Mẫu, An Tư, Trần Khát Chân, Chế Mân, Pháp Loa, Đặng Tất, Trần Nguyên Đán',
  },
  'nv-ly-le': {
    1: 'Lý Thánh Tông, Lý Nhân Tông, Lý Chiêu Hoàng, Ỷ Lan, Tô Hiến Thành, Lê Lai, Nguyễn Thị Lộ, Lương Thế Vinh, Ngô Sĩ Liên, Lê Văn Thịnh',
    2: 'Lý Thần Tông, Lý Anh Tông, Lý Cao Tông, Nguyễn Xí, Đinh Lễ, Trần Nguyên Hãn, Lê Thái Tông, Lê Nhân Tông, Thân Nhân Trung, Lê Phụng Hiểu, Vạn Hạnh, Nùng Trí Cao, Lê Nghi Dân, Nguyễn Chích, Lê Lễ, Mãn Giác thiền sư, Lý Long Tường, Trần Lý, Trần Tự Khánh, Lý Tử Tấn, Phan Phu Tiên, Nguyễn Minh Không, Đàm Văn Lễ',
  },
  'nv-cm': {
    1: 'Hoàng Hoa Thám, Cao Thắng, Phan Châu Trinh, Nguyễn Thái Học, Trần Phú, Lê Hồng Phong, Nguyễn Thị Minh Khai, Lý Tự Trọng, Phạm Văn Đồng, Nguyễn Văn Trỗi, Phan Đình Giót, Tôn Đức Thắng, Trường Chinh, Lê Duẩn, Bế Văn Đàn, Tô Vĩnh Diện, Lê Văn Tám, Đặng Thùy Trâm, Phạm Tuân, Võ Văn Kiệt, Nguyễn Văn Linh, Huỳnh Thúc Kháng, Vừ A Dính, Cù Chính Lan, Nguyễn Văn Cừ, Hà Huy Tập',
  },
  'nv-van-vn': {
    1: 'Tú Xương, Xuân Diệu, Huy Cận, Hàn Mặc Tử, Tố Hữu, Nguyễn Bính, Ngô Tất Tố, Vũ Trọng Phụng, Thạch Lam, Nguyễn Tuân, Kim Lân, Xuân Quỳnh, Trần Đăng Khoa, Nguyễn Khuyến, Tản Đà, Chế Lan Viên, Thế Lữ, Quang Dũng, Nguyễn Bỉnh Khiêm, Nguyễn Công Trứ, Cao Bá Quát, Nguyễn Huy Thiệp, Bảo Ninh, Nguyễn Minh Châu, Thanh Hải, Viễn Phương, Tế Hanh, Chính Hữu, Phạm Tiến Duật, Nguyễn Khoa Điềm, Nguyễn Quang Sáng, Đoàn Giỏi, Võ Quảng, Nguyễn Ngọc Tư, Lưu Trọng Lư, Nhất Linh, Khái Hưng, Nguyễn Công Hoan, Hoài Thanh, Sơn Nam, Bằng Việt',
    2: 'Lê Văn Hưu, Chu Văn An, Mạc Đĩnh Chi, Trương Hán Siêu, Đoàn Thị Điểm, Nguyễn Gia Thiều, Ngô Thì Nhậm, Nguyễn Huy Tưởng, Hoàng Cầm, Nguyễn Dữ, Phạm Quỳnh, Nguyễn Văn Vĩnh',
    3: 'Hàn Thuyên, Trần Quang Triều, Ngô Sĩ Liên',
  },
  'nv-nhacsi-tg': {
    1: 'Joseph Haydn, George Frideric Handel, Franz Schubert, Johannes Brahms, Franz Liszt, Claude Debussy, Johann Strauss, Giuseppe Verdi, Richard Wagner, Sergei Rachmaninoff, Antonín Dvořák, Felix Mendelssohn, Robert Schumann, Giacomo Puccini',
    2: 'Igor Stravinsky, Edvard Grieg, Gioachino Rossini, Antonio Salieri, Camille Saint-Saëns, Maurice Ravel, Erik Satie, Gustav Mahler, Georges Bizet, Niccolò Paganini, Sergei Prokofiev, Dmitri Shostakovich, Bedřich Smetana, Edward Elgar, Gustav Holst, Carl Orff, Philip Glass, John Cage, Leonard Bernstein, Aram Khachaturian, Richard Strauss, Hildegard von Bingen, Clara Schumann',
  },
  'vh-nv-cotich': {
    1: 'Cô bé bán diêm, Lý Thông, Chị Hằng, An Tiêm, Aladdin và cây đèn thần, Pinocchio, Ngưu Lang, Chức Nữ, Trương Chi, Mỵ Châu, Trọng Thủy, Lạc Long Quân, Âu Cơ, Ông Bụt, Lang Liêu, Chử Đồng Tử, Tiên Dung, Mỵ Nương, Rùa Vàng, Thần đèn, Sói xám, Ngọc Hoàng, Vịt con xấu xí, Rapunzel, Hoàng tử ếch, Jack, Ông lão đánh cá, Thumbelina, Zeus, Hercules, Thor',
  },
  'vh-unesco': {
    1: 'Hội Gióng, Ca trù, Nhã nhạc, Đờn ca tài tử, Hát xoan, Ví giặm, Hoàng thành Thăng Long, Bài chòi, Không gian văn hóa cồng chiêng, Hát then, Xòe Thái, Cao nguyên đá Đồng Văn, Bia tiến sĩ Văn Miếu - Quốc Tử Giám, Châu bản triều Nguyễn, Hát văn, Thực hành tín ngưỡng thờ Mẫu Tam phủ',
  },
  'dt-all': {
    1: 'Dao, Gia Rai, Ê Đê, Ba Na, Chăm, Mnông, Thổ, Khơ Mú, Hà Nhì, Lào, Sán Dìu, Xơ Đăng, Cơ Ho',
  },
  'tt-olympic': {
    1: 'Karate, Taekwondo, Judo, Thể dục dụng cụ, Điền kinh, Bóng ném, Bóng nước, Bóng bầu dục, Khúc côn cầu, Bóng chuyền bãi biển, Bắn súng, Bắn cung, Đấu kiếm, Vật, Cử tạ, Chèo thuyền, Nhảy cầu, Bơi nghệ thuật, Trượt băng, Trượt tuyết, Nhảy xa, Nhảy cao, Golf',
    2: 'Lướt sóng, Lướt ván buồm, Chèo thuyền kayak, Thuyền buồm, Trượt ván, Leo núi, Cưỡi ngựa, Nhảy sào, Ném lao, Ném đĩa, Đẩy tạ, Chạy vượt rào, Chạy tiếp sức, Ba môn phối hợp, Breaking, Bơi marathon, Curling, Năm môn phối hợp hiện đại, BMX, Ném búa, Mười môn phối hợp',
  },
  'nc-dt': {
    1: 'Đàn nguyệt, Tỳ bà, Cồng chiêng, Mõ, Phách, Khèn, Đàn đá, Trống đồng, Đàn tính, Kèn lá, Đàn môi, T\'rưng, Đàn đáy',
    2: 'Đàn k\'ní, Klông pút, Đàn goong, Đinh năm, Kèn bầu, Đàn sến, Đàn tam, Ghi ta phím lõm, Đàn tam thập lục, Đàn chapi, Trống cơm, Sênh tiền, Tù và, Sáo mèo, Đàn hồ, Trống chầu, Song loan',
  },
  'nc-day': {
    1: 'Đàn nhị, Ukulele, Cello, Guitar bass, Ghi ta điện, Đàn nguyệt, Tỳ bà, Đàn hạc, Viola, Contrabass, Đàn đáy, Đàn tính, Đàn mandolin, Đàn banjo, Đàn tam thập lục',
    2: 'Đàn sến, Đàn k\'ní, Đàn goong, Ghi ta phím lõm, Ghi ta Hawaii, Đàn zither, Đàn tam, Đàn hồ, Sitar, Nhị hồ, Cổ tranh, Koto, Đàn balalaika, Đàn lia, Đàn luýt, Đàn harpsichord, Đàn gayageum, Đàn oud, Đàn chapi, Đàn bouzouki, Đàn kora, Đàn cổ cầm',
  },
  'hh-kl': {
    1: 'Liti, Titan, Crom, Mangan, Coban, Niken, Vonfram, Platin, Plutoni, Rađi, Cađimi, Bari',
    2: 'Beri, Vanađi, Gali, Molipđen, Palađi, Poloni, Iriđi, Osimi, Bitmut, Tali, Neođim, Xesi, Stronti, Ziriconi, Thori, Rubiđi',
  },
  'kn-daquy': {
    1: 'Thạch anh, Ngọc bích, Mã não, Thạch anh tím, Hổ phách, Ngọc mắt mèo, Topaz, Opal, Đá mặt trăng, Mắt hổ, Garnet, Ngọc lam, San hô đỏ, Thạch anh hồng',
    2: 'Spinel, Tourmaline, Peridot, Aquamarine, Lapis lazuli, Tanzanite, Moissanite, Zircon, Alexandrite, Morganite, Citrine, Obsidian, Malachite, Xà cừ, Thạch anh khói, Thạch anh tóc, Đá mặt trời, Jasper, Ngọc Hòa Điền, Ngọc bích Myanmar, Labradorite, Fluorite, Hematite, Pyrite, Thạch anh ưu linh',
  },
  'kn-hangxe': {
    1: 'Mitsubishi, Nissan, Tesla, Audi, Volkswagen, Lexus, Porsche, Ferrari, Lamborghini, Chevrolet, Peugeot, Volvo, Subaru, Rolls-Royce, Bentley, Ducati, Harley-Davidson, Piaggio, SYM, BYD, Kawasaki, Bugatti, Jaguar, Land Rover, Mini, Isuzu, Jeep, Thaco, Maserati, McLaren, Aston Martin, Fiat, Renault, Daewoo, Cadillac',
    2: 'Citroën, Skoda, Daihatsu, Hino, KTM, Triumph, Lincoln, Dodge, Infiniti, Acura, Genesis, MG, Geely, Chery, Wuling, Lada, Alfa Romeo, Lotus, Rivian, Polestar, Opel, Ssangyong, Royal Enfield, Benelli, Aprilia, MV Agusta, Husqvarna, Kymco, Yadea, Gogoro, Dat Bike, Selex Motors, Pega, Hongqi, Great Wall, Changan, Nio, XPeng, Li Auto, Zeekr, Lynk & Co, Maybach, Hummer, Chrysler, Saab, Datsun, Tata Motors, Bajaj, Koenigsegg, Pagani, Seat, Smart, GMC, Buick, Lucid, Proton, Perodua, Trabant, Moskvich, Volga, DeLorean, Brabus, Mansory, Shelby, Haojue, Minsk, Jawa, Cupra, Dacia',
  },
};
