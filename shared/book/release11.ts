// Release set, part 11: body and health, language, knowledge and technology.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE11: ReleaseQuestion[] = [
{id:'r-benh-man',c:'Khoa học',q:'Kể tên một bệnh mạn tính (bệnh kéo dài, khó chữa dứt điểm)',s:['benh'],k:'Behçet|Bệnh Behçet',t:[
'Tiểu đường|Đái tháo đường, Cao huyết áp|Tăng huyết áp, Ung thư',
'Hen suyễn|Hen phế quản, Gout|Gút, Viêm khớp, Mỡ máu|Rối loạn mỡ máu, Suy thận, Viêm dạ dày|Đau dạ dày, Tim mạch|Bệnh tim',
'COPD|Phổi tắc nghẽn mạn tính, Parkinson, Alzheimer, Loãng xương, Lupus|Lupus ban đỏ, Vảy nến, Xơ gan, Viêm gan B, HIV, Động kinh, Trầm cảm, Suy tim, Thoái hóa cột sống, Trĩ, Viêm xoang, Viêm mũi dị ứng',
'Crohn|Bệnh Crohn, Viêm loét đại tràng, Xơ cứng bì, Đa xơ cứng|Xơ cứng rải rác, Basedow|Cường giáp, Suy giáp, Hashimoto, Thalassemia|Tan máu bẩm sinh, Hemophilia|Máu khó đông, Celiac, Gan nhiễm mỡ, Viêm cột sống dính khớp',
'Sarcoidosis, Nhược cơ|Myasthenia gravis, Addison, Cushing, Wilson|Bệnh Wilson, Huntington, ALS|Xơ cứng teo cơ một bên, Sjögren, Fibromyalgia|Đau xơ cơ']},
{id:'r-co-quan',c:'Khoa học',q:'Kể tên một cơ quan hoặc bộ phận nằm bên trong cơ thể người',s:[],k:'Mạc treo|Mạc treo ruột',t:[
'Tim, Gan, Phổi, Dạ dày|Bao tử',
'Thận, Não, Ruột|Ruột non|Ruột già, Lá lách, Bàng quang, Tụy|Tuyến tụy',
'Túi mật, Thực quản, Ruột thừa, Tử cung, Tuyến giáp, Khí quản, Tá tràng, Đại tràng, Tủy sống, Cơ hoành, Thanh quản, Buồng trứng, Phế quản',
'Tuyến ức, Tuyến yên, Tuyến tùng, Niệu đạo, Niệu quản, Hạch bạch huyết, Tuyến tiền liệt, Hồi tràng, Hỗng tràng, Manh tràng, Phúc mạc, Tuyến thượng thận, Tiểu não',
'Màng phổi, Màng ngoài tim, Vùng dưới đồi|Hạ đồi, Hồi hải mã|Hải mã, Hạnh nhân não|Amygdala, Thể chai, Đại tràng sigma, Túi tinh, Mào tinh']},
{id:'r-vitamin',c:'Khoa học',q:'Kể tên một loại vitamin hoặc khoáng chất cần cho cơ thể',s:[],k:'Molypden|Molybden',t:[
'Vitamin C, Canxi, Sắt, Vitamin D',
'Vitamin A, Vitamin B, Kẽm, Vitamin E, Magie, Vitamin B12, Omega 3',
'Kali, Iốt, Vitamin K, Natri, Vitamin B1, Vitamin B6, Axit folic|Vitamin B9|Folate, Biotin|Vitamin B7, Phốt pho, Selen',
'Đồng, Mangan, Crom, Flo, Niacin|Vitamin B3, Riboflavin|Vitamin B2, Vitamin B5|Axit pantothenic, Lưu huỳnh, Clo, Thiamin',
'Coban, Bo, Vanadi, Choline, Silic, Niken, Cobalamin, Retinol']},
{id:'r-ngon-ngu',c:'Ngôn ngữ',q:'Kể tên một ngôn ngữ trên thế giới',s:['tieng','ngonngu'],k:'Tiếng Ainu|Ainu',t:[
'Tiếng Anh, Tiếng Trung|Tiếng Hoa, Tiếng Nhật, Tiếng Hàn',
'Tiếng Pháp, Tiếng Đức, Tiếng Tây Ban Nha, Tiếng Nga, Tiếng Thái, Tiếng Việt',
'Tiếng Ý, Tiếng Bồ Đào Nha, Tiếng Ả Rập, Tiếng Hindi, Tiếng Lào, Tiếng Khmer|Tiếng Campuchia, Tiếng Indonesia, Tiếng Mã Lai, Tiếng Hà Lan, Tiếng Thổ Nhĩ Kỳ, Tiếng Latinh|Tiếng Latin, Tiếng Tagalog|Tiếng Philippines|Tiếng Filipino',
'Tiếng Hy Lạp, Tiếng Do Thái|Tiếng Hebrew, Tiếng Ba Tư|Tiếng Farsi, Tiếng Ba Lan, Tiếng Thụy Điển, Tiếng Phần Lan, Tiếng Hungary, Tiếng Séc, Tiếng Ukraina, Tiếng Bengal, Tiếng Urdu, Tiếng Swahili, Tiếng Miến Điện, Tiếng Mông Cổ, Tiếng Tây Tạng, Tiếng Quảng Đông, Esperanto|Quốc tế ngữ, Tiếng Phạn|Sanskrit',
'Tiếng Basque, Tiếng Iceland, Tiếng Wales, Tiếng Ireland|Tiếng Gael, Tiếng Tamil, Tiếng Telugu, Tiếng Amharic, Tiếng Zulu, Tiếng Yoruba, Tiếng Hausa, Tiếng Quechua, Tiếng Maori, Tiếng Hawaii, Tiếng Navajo, Tiếng Catalan, Tiếng Estonia, Tiếng Albania, Tiếng Gruzia|Tiếng Georgia, Tiếng Armenia']},
{id:'r-chuyen-khoa',c:'Khoa học',q:'Kể tên một chuyên khoa trong bệnh viện',s:['khoa','chuyenkhoa'],k:'Y học hạt nhân',t:[
'Nhi|Khoa nhi, Sản|Sản khoa, Nội|Nội khoa, Ngoại|Ngoại khoa',
'Răng hàm mặt|Nha khoa, Tai mũi họng, Mắt|Nhãn khoa, Da liễu, Tim mạch, Cấp cứu, Thần kinh, Ung bướu, Tâm thần, Chấn thương chỉnh hình|Xương khớp',
'Tiêu hóa, Hô hấp, Thận|Thận học, Tiết niệu, Nội tiết, Truyền nhiễm|Bệnh nhiệt đới, Gây mê hồi sức, Chẩn đoán hình ảnh, Phục hồi chức năng, Huyết học, Y học cổ truyền|Đông y, Lão khoa, Hồi sức tích cực|ICU, Phẫu thuật thẩm mỹ|Thẩm mỹ, Dinh dưỡng, Dị ứng miễn dịch',
'Giải phẫu bệnh, Sơ sinh, Nam học, Hiếm muộn|Hỗ trợ sinh sản, Bỏng, Lồng ngực, Phẫu thuật thần kinh, Nội soi, Xạ trị, Y học thể thao, Pháp y, Vi sinh, Chống độc',
'Y học dự phòng, Dịch tễ, Cơ xương khớp, Phẫu thuật tạo hình, Ký sinh trùng, Y học gia đình, Mạch máu, Truyền máu']},
{id:'r-dh-the-gioi',c:'Thế giới',q:'Kể tên một trường đại học nổi tiếng thế giới (không phải ở Việt Nam)',s:['daihoc','truong','university','dh','hocvien'],k:'Al-Azhar|Đại học Al-Azhar',t:[
'Harvard, Oxford, MIT|Viện Công nghệ Massachusetts, Stanford',
'Cambridge, Yale, Princeton, Columbia, Berkeley|UC Berkeley, Đại học Tokyo|Todai, Đại học Quốc gia Seoul|SNU, Thanh Hoa|Tsinghua, Bắc Kinh|Peking|Bắc Đại',
'Caltech, Chicago|Đại học Chicago, Penn|UPenn, Cornell, NUS|Đại học Quốc gia Singapore, Imperial|Imperial College London, UCLA, Johns Hopkins, NYU, Duke, Brown, Dartmouth, Melbourne, Sydney, Toronto, McGill, ETH Zurich, Sorbonne, Kyoto|Đại học Kyoto, Waseda, Keio, Yonsei, Korea University|Đại học Korea, KAIST, Phục Đán|Fudan, NTU|Nanyang, LSE, UCL',
'Georgetown, Northwestern, Carnegie Mellon, Michigan, Purdue, Georgia Tech, Rice, Vanderbilt, Edinburgh, King\'s College London, Manchester, Heidelberg, TU Munich, Leiden, Uppsala, Karolinska, Monash, ANU, UBC, HKU|Đại học Hồng Kông, Chiết Giang|Zhejiang, Giao thông Thượng Hải, Osaka, Tohoku, POSTECH, Chulalongkorn',
'St Andrews, Durham, Trinity College Dublin, Bologna, Salamanca, KU Leuven|Leuven, EPFL, Sciences Po, École Polytechnique, Lomonosov|MGU, IIT|Viện Công nghệ Ấn Độ, Technion, Coimbra, Charles|Đại học Charles']},
{id:'r-bao-vn',c:'Đời sống',q:'Kể tên một tờ báo hoặc trang tin tức của Việt Nam',s:['bao','trang'],k:'Kiến Thức Ngày Nay',t:[
'VnExpress, Tuổi Trẻ, Thanh Niên, Dân Trí',
'Znews|Zing News|Zing, Nhân Dân, VietNamNet, Kenh14|Kênh 14, 24h, Tiền Phong, Lao Động, Người Lao Động',
'Sài Gòn Giải Phóng, Hà Nội Mới, Công An Nhân Dân, Quân Đội Nhân Dân, Pháp Luật TP.HCM, An Ninh Thủ Đô, Báo Mới, Soha, CafeF, CafeBiz, VTC News, Phụ Nữ|Phụ Nữ TP.HCM|Phụ Nữ Việt Nam, Thể Thao & Văn Hóa, Bóng Đá, Giáo Dục và Thời Đại, VnEconomy, Vietnam News',
'Đời Sống & Pháp Luật, Sức Khỏe & Đời Sống, Kinh Tế & Đô Thị, Saigon Times|Thời báo Kinh tế Sài Gòn, Hoa Học Trò, Mực Tím, Thiếu Niên Tiền Phong, Nhi Đồng, Văn Nghệ, Giáo Dục Việt Nam, VOV, VTV News, Infonet, Người Đưa Tin, VietnamPlus, Đầu Tư, Ngôi Sao|Ngoisao.net, Bongdaplus|Bóng Đá Plus',
'Khăn Quàng Đỏ, Sinh Viên Việt Nam, Tiếp Thị & Gia Đình, Thế Giới Phụ Nữ, Thanh Tra, Đại Đoàn Kết, Pháp Luật Việt Nam, Kiến Thức, Tuổi Trẻ Cười, Thanh Niên Tuần San, Nhịp Cầu Đầu Tư']},
{id:'r-don-vi-do',c:'Khoa học',q:'Kể tên một đơn vị đo lường',s:['donvi'],k:'Sải|Fathom',t:[
'Mét, Kilôgam|Kilogram|Kg|Ký|Kí, Lít, Giây',
'Centimét|Cm|Phân, Gam|Gram, Kilômét|Km|Cây số, Độ C|Độ Celsius, Phút, Giờ, Tấn, Milimét|Mm',
'Inch|Inh, Feet|Foot, Dặm|Mile, Pound|Pao, Ounce, Héc-ta|Hecta|Ha, Mẫu, Sào, Calo|Calorie, Vôn|Volt, Ampe|Ampere, Oát|Watt, Jun|Joule, Niutơn|Newton, Kelvin|Độ K, Độ F|Fahrenheit, Hải lý, Yến, Tạ, Lạng, Byte, Mol, Héc|Hertz, Chỉ|Chỉ vàng, Lượng|Cây vàng, Thước, Tấc',
'Ôm|Ohm, Pascal, Candela, Lumen, Lux, Tesla, Weber, Coulomb, Farad, Henry, Becquerel, Sievert, Năm ánh sáng, Đơn vị thiên văn|AU, Parsec, Atmosphere|Atm, Bar, Mã lực, Carat, Gallon, Pint, Yard',
'Furlong, Angstrom, Dalton, Erg, Dyne, Gauss, Torr, Barn, Slug, Stone, Hộc, Gray, Acre|Mẫu Anh']},
{id:'r-the-thao-nuoc',c:'Thể thao',q:'Kể tên một môn thể thao dưới nước hoặc trên mặt nước',s:['mon'],k:'Bơi chân vịt|Finswimming',t:[
'Bơi lội|Bơi, Lặn, Lướt sóng|Surfing',
'Chèo thuyền|Rowing, Bóng nước|Water polo, Nhảy cầu, Thuyền buồm, Kayak, Canoe, Mô tô nước|Jet ski, Lặn biển|Lặn bình dưỡng khí|Scuba, Bơi nghệ thuật',
'Lướt ván buồm|Windsurfing, SUP|Chèo SUP|Chèo ván đứng, Lướt ván diều|Kitesurfing, Dù kéo|Parasailing, Lướt ván nước|Wakeboard, Trượt nước|Water ski, Đua thuyền rồng|Bơi trải, Đua thuyền máy, Vượt thác|Rafting, Lặn tự do|Freediving, Lặn ống thở|Snorkeling',
'Bơi marathon|Bơi đường dài|Bơi vượt sông, Bodyboard, Flyboard, Khúc côn cầu dưới nước|Underwater hockey, Ba môn phối hợp|Triathlon, Bơi mùa đông, Canyoning, Skimboard, Lướt ván cánh ngầm|Foil',
'Bóng bầu dục dưới nước|Underwater rugby, Kneeboard, Lặn săn cá|Spearfishing, Đua thuyền thúng, Hydroplane, Bóng chuyền dưới nước, Canoe polo']},
{id:'r-tu-muon-phap',c:'Ngôn ngữ',q:'Kể tên một từ tiếng Việt vay mượn từ tiếng Pháp',s:['tu'],k:'Tông đơ',t:[
'Cà phê, Xà phòng, Ga|Nhà ga, Ô tô',
'Bơ, Phô mai, Pa tê, Sơ mi, Cà vạt, Ban công, Xăng, Ga ra, Búp bê, Sô cô la, Va li, Ti vi',
'Ghi đông, Phanh, Lốp, Săm, Vô lăng, Ba lô, Bu gi, Ca cao, Kem, Sốt, Súp, Bít tết, Xà lách, Xi măng, Bê tông, Cờ lê, Tuốc nơ vít, Pin, Mô tô, Xích lô, Sa lông, Phích, Ra đi ô|Radio, Vắc xin, Áp phích, Ga tô, Séc, Sếp, Cao su, Xi rô',
'Măng tô, Mề đay, Mùi soa, Pi gia ma|Pijama, Ác quy, Gạc, Nhà băng, Sen đầm, Lô cốt, Nơ, Ri đô, Phông, Công tơ, Ê ke, Đầm, Mác, Tạp dề, Đi văng, Bốt',
'Măng sét, Gác đờ bu, Poóc ba ga|Pooc-ba-ga, Pê đan, Đề pa, Mát xa, Cu li, Ăng ten, Ô xi, Ma nơ canh']},
];
