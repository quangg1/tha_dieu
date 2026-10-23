// Release set, part 8: more places, at home and abroad.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE8: ReleaseQuestion[] = [
{id:'r-tp-tbn',c:'Thế giới',q:'Kể tên một thành phố của Tây Ban Nha',s:['thanhpho','tp'],k:'Toledo',t:[
'Madrid, Barcelona',
'Valencia, Sevilla, Bilbao, Málaga',
'Granada, Ibiza, Mallorca|Palma, Córdoba, San Sebastián, Zaragoza, Alicante',
'Salamanca, Santiago de Compostela, Cádiz, Marbella, Pamplona, Valladolid, Murcia, Vigo, A Coruña, Girona, Tarragona, Segovia, Ronda, Benidorm, Santander',
'Oviedo, Gijón, Burgos, León, Cuenca, Cáceres, Mérida, Almería, Huelva, Jerez, Lleida, Tenerife, Las Palmas, Sitges, Logroño, Ávila']},
{id:'r-tp-nga',c:'Thế giới',q:'Kể tên một thành phố của Nga',s:['thanhpho','tp'],k:'Murmansk',t:[
'Moskva|Moscow|Mát-xcơ-va, Saint Petersburg|Xanh Pê-téc-bua|Leningrad',
'Vladivostok, Sochi, Kazan',
'Novosibirsk, Yekaterinburg, Volgograd|Stalingrad, Kaliningrad, Irkutsk, Nizhny Novgorod',
'Samara, Rostov|Rostov trên sông Đông, Omsk, Krasnoyarsk, Perm, Ufa, Khabarovsk, Yakutsk, Sevastopol, Tula, Smolensk, Arkhangelsk, Novgorod, Pskov, Yaroslavl, Suzdal, Vladimir',
'Tver, Kursk, Voronezh, Saratov, Tomsk, Chelyabinsk, Barnaul, Kemerovo, Norilsk, Magadan, Petropavlovsk-Kamchatsky, Ulan-Ude, Chita, Astrakhan, Grozny, Makhachkala, Krasnodar, Anapa, Kostroma']},
{id:'r-tp-canada',c:'Thế giới',q:'Kể tên một thành phố của Canada',s:['thanhpho','tp'],k:'Whitehorse',t:[
'Toronto, Vancouver',
'Montreal, Ottawa, Quebec|Thành phố Quebec, Calgary',
'Edmonton, Winnipeg, Niagara Falls, Victoria, Halifax',
'Hamilton, Mississauga, Regina, Saskatoon, Kelowna, Banff, Whistler, Kingston, London, Waterloo, Windsor, St. John\'s, Fredericton, Charlottetown, Moncton',
'Yellowknife, Iqaluit, Thunder Bay, Sudbury, Gatineau, Laval, Surrey, Burnaby, Richmond, Kitchener, Oshawa, Red Deer, Lethbridge, Kamloops, Nanaimo, Jasper']},
{id:'r-tp-dna',c:'Thế giới',q:'Kể tên một thành phố của Indonesia, Malaysia hoặc Philippines',s:['thanhpho','tp'],k:'Ipoh',t:[
'Jakarta, Kuala Lumpur, Manila',
'Bali|Denpasar, Penang, Malacca|Melaka, Cebu, Bandung, Surabaya',
'Yogyakarta, Medan, Johor Bahru, Kota Kinabalu, Kuching, Putrajaya, Langkawi, Davao, Quezon, Makati, Boracay',
'Semarang, Makassar, Palembang, Batam, Lombok, Ubud, Malang, Solo|Surakarta, George Town, Shah Alam, Petaling Jaya, Kota Bharu, Miri, Sandakan, Baguio, Iloilo, Bacolod, Puerto Princesa, Zamboanga, Vigan, Tagaytay, Angeles',
'Balikpapan, Pontianak, Banjarmasin, Manado, Jayapura, Padang, Pekanbaru, Kupang, Labuan Bajo, Seremban, Kuantan, Kuala Terengganu, Alor Setar, Taiping, Cagayan de Oro, General Santos, Legazpi, Dumaguete, Tacloban']},
{id:'r-tp-lao-cam',c:'Thế giới',q:'Kể tên một thành phố hoặc điểm du lịch của Lào hoặc Campuchia',s:['thanhpho','tp'],k:'Kampot',t:[
'Viêng Chăn|Vientiane, Phnôm Pênh|Phnom Penh, Siem Reap|Xiêm Riệp',
'Luang Prabang|Luông Pha Băng, Angkor Wat|Angkor, Sihanoukville|Kompong Som, Vang Vieng|Vàng Viêng',
'Pakse|Pắc Xế, Savannakhet|Xa-van-na-khẹt, Battambang, Kep, Cánh đồng Chum, Bokeo, Si Phan Đôn|4000 đảo, Wat Phou|Vat Phu, Koh Rong',
'Kampong Cham, Kratie, Mondulkiri, Ratanakiri, Koh Ker, Preah Vihear, Tonle Sap|Biển Hồ, Bavet, Poipet, Xiêng Khoảng|Phonsavan, Thakhek, Nong Khiaw, Muang Ngoi, Luang Namtha, Oudomxay, Attapeu, Sekong, Champasak|Chăm-pa-sắc',
'Pursat, Takeo, Svay Rieng, Prey Veng, Kampong Thom, Kampong Speu, Koh Kong, Stung Treng, Pailin, Sam Neua, Phongsaly, Bolaven, Salavan, Muang Khong, Huay Xai']},
{id:'r-song-tg',c:'Thế giới',q:'Kể tên một con sông nổi tiếng trên thế giới',s:['song','dongsong'],k:'Sông Orinoco',t:[
'Sông Nile|Nin, Sông Amazon, Sông Mê Kông|Mekong',
'Sông Hoàng Hà, Sông Dương Tử|Trường Giang, Sông Hằng, Sông Mississippi, Sông Thames, Sông Seine, Sông Danube|Đa-nuýp',
'Sông Rhine, Sông Volga, Sông Tigris, Sông Euphrates, Sông Ấn|Sông Indus, Sông Congo, Sông Jordan, Sông Hudson, Sông Colorado, Sông Tiber, Sông Chao Phraya|Sông Chao Phraya Thái Lan, Sông Hán|Sông Hàn Seoul',
'Sông Niger, Sông Zambezi, Sông Missouri, Sông Yukon, Sông Saint Lawrence, Sông Yenisei, Sông Ob, Sông Lena, Sông Amur|Hắc Long Giang, Sông Brahmaputra, Sông Irrawaddy, Sông Salween, Sông Elbe, Sông Loire, Sông Po, Sông Douro, Sông Dnieper, Sông Don, Sông Paraná, Sông Rio Grande',
'Sông Murray, Sông Darling, Sông Orange, Sông Limpopo, Sông Ural, Sông Oder, Sông Vistula, Sông Rhône, Sông Garonne, Sông Ebro, Sông Tagus, Sông Shannon, Sông Mackenzie, Sông Columbia, Sông Ohio, Sông Châu Giang, Sông Hoài, Sông Tùng Hoa, Sông Sumida']},
{id:'r-ho-tg',c:'Thế giới',q:'Kể tên một hồ nước nổi tiếng trên thế giới',s:['ho'],k:'Hồ Tanganyika',t:[
'Biển Hồ|Tonle Sap, Hồ Baikal, Biển Chết',
'Biển Caspi, Hồ Victoria, Ngũ Đại Hồ, Hồ Titicaca, Hồ Tây|Tây Hồ Hàng Châu',
'Hồ Superior, Hồ Michigan, Hồ Huron, Hồ Erie, Hồ Ontario, Hồ Geneva|Hồ Léman, Hồ Como, Hồ Garda, Hồ Loch Ness, Hồ Tahoe, Hồ Biwa, Hồ Kawaguchi',
'Hồ Malawi, Hồ Chad, Biển Aral, Hồ Inle, Hồ Toba, Hồ Bled, Hồ Hallstatt, Hồ Lucerne, Hồ Constance|Hồ Bodensee, Hồ Balaton, Hồ Ohrid, Hồ Ladoga, Hồ Great Salt, Hồ Crater, Hồ Louise, Hồ Moraine, Hồ Pangong, Hồ Dal, Hồ Thanh Hải, Hồ Động Đình, Hồ Bà Dương',
'Hồ Issyk-Kul, Hồ Van, Hồ Urmia, Hồ Nasser, Hồ Volta, Hồ Kivu, Hồ Turkana, Hồ Nicaragua, Hồ Maracaibo, Hồ Winnipeg, Hồ Great Bear, Hồ Taupo, Hồ Tekapo, Hồ Plitvice, Hồ Saimaa, Hồ Vänern, Hồ Natron, Hồ Retba, Hồ Hillier']},
{id:'r-thac-tg',c:'Thế giới',q:'Kể tên một thác nước nổi tiếng trên thế giới',s:['thac'],k:'Thác Kaieteur',t:[
'Thác Niagara, Thác Bản Giốc',
'Thác Victoria, Thác Angel, Thác Iguazu',
'Thác Đức Thiên|Thác Detian, Thác Hoàng Quả Thụ, Thác Gullfoss, Thác Seljalandsfoss, Thác Skógafoss, Thác Yosemite, Thác Kegon, Thác Khone Phapheng|Khone Phapheng',
'Thác Plitvice, Thác Rhine, Thác Kuang Si, Thác Erawan, Thác Tugela, Thác Sutherland, Thác Jog, Thác Dettifoss, Thác Godafoss, Thác Multnomah, Thác Havasu, Thác Huka, Thác Wallaman, Thác Nachi, Thác Ban Gioc, Thác Pongour, Thác Datanla',
'Thác Gocta, Thác Mardalsfossen, Thác Vettisfossen, Thác Langfoss, Thác Dudhsagar, Thác Tad Fane, Thác Tad Lo, Thác Bigar, Thác Krimml, Thác Staubbach, Thác Reichenbach, Thác Wailua, Thác Akaka, Thác Shoshone']},
{id:'r-dd-mien-tay',c:'Du lịch',q:'Kể tên một điểm du lịch ở miền Tây Nam Bộ',s:['diadiem'],k:'Rừng tràm Trà Sư',t:[
'Chợ nổi Cái Răng, Mũi Cà Mau, Núi Sam',
'Cồn Phụng, Bến Ninh Kiều, Chùa Bà Châu Đốc|Miếu Bà Chúa Xứ, Cù lao Ông Hổ, Đồng Tháp Mười, Làng hoa Sa Đéc',
'Vườn quốc gia Tràm Chim|Tràm Chim, Nhà cổ Huỳnh Thủy Lê, Núi Cấm, Hà Tiên, Thạch Động, Cồn Thới Sơn, Cồn Sơn, Chợ nổi Ngã Bảy, Chợ nổi Cái Bè, Khu du lịch Mỹ Khánh, Chùa Dơi, Chùa Kh\'leang, Đất Mũi, Hòn Sơn, Nam Du',
'Vườn quốc gia U Minh Hạ, U Minh Thượng, Rừng đước Năm Căn, Gò Tháp, Xẻo Quýt, Lăng Ông Thoại Ngọc Hầu, Óc Eo, Tượng đài Thoại Ngọc Hầu, Cánh đồng điện gió Bạc Liêu, Nhà công tử Bạc Liêu, Chùa Âng, Ao Bà Om, Chùa Vĩnh Tràng, Cù lao Giêng, Hồ Tà Pạ',
'Núi Tô, Núi Két, Lò gạch Mang Thít, Cồn Chim, Làng nổi Tân Lập, Biển Ba Động, Đảo Bà Lụa, Mũi Nai, Chùa Hang Hà Tiên, Thác Mơ Hà Tiên, Bãi biển Khai Long']},
{id:'r-dd-tay-nguyen',c:'Du lịch',q:'Kể tên một điểm du lịch ở Tây Nguyên',s:['diadiem'],k:'Hồ T\'Nưng',t:[
'Buôn Đôn, Măng Đen, Biển Hồ Pleiku|Biển Hồ',
'Thác Dray Nur, Hồ Lắk, Nhà thờ gỗ Kon Tum, Núi lửa Chư Đăng Ya, Bảo tàng Cà phê|Bảo tàng Thế giới Cà phê, Thác Dray Sáp',
'Vườn quốc gia Yok Đôn, Vườn quốc gia Kon Ka Kinh, Làng Kon K\'Tu, Cầu treo Kon Klor, Thác Phú Cường, Hồ Ea Kao, Buôn Akô Dhông, Ngã ba Đông Dương, Đồi chè Biển Hồ, Thác Gia Long, Hang Dơi Gia Lai',
'Thác Pa Sỹ, Hồ Đăk Ke, Chùa Khánh Lâm, Ngục Kon Tum, Rừng thông Măng Đen, Vườn quốc gia Chư Yang Sin, Thác Krông Kmar, Thác Đray Sáp, Buôn Trí A, Biển Hồ chè, Nhà rông Kon Klor, Công viên địa chất Đắk Nông, Thác Đắk G\'Lun, Thác Trinh Nữ',
'Hồ Tà Đùng, Thác Liêng Nung, Thác Ba Tầng, Hang động núi lửa Krông Nô, Núi Hàm Rồng Pleiku, Chùa Minh Thành, Làng Plei Ơi, Thác Ia Nhí, Hồ Yaly']},
{id:'r-dd-binh-dinh',c:'Du lịch',q:'Kể tên một điểm du lịch ở Quy Nhơn hoặc Bình Định',s:['diadiem'],k:'Hầm Hô',t:[
'Eo Gió, Kỳ Co',
'Ghềnh Ráng Tiên Sa|Ghềnh Ráng, Tháp Đôi, Bảo tàng Quang Trung, Cù Lao Xanh, Hòn Khô',
'Bãi Xép, Tháp Bánh Ít, Đồi cát Phương Mai, Chùa Thiên Hưng, Mộ Hàn Mặc Tử, Biển Quy Nhơn, Nhơn Lý, Nhơn Hải, Trung Lương',
'Tháp Dương Long, Thành Hoàng Đế, Tháp Cánh Tiên, Tháp Bình Lâm, Đầm Thị Nại, Cầu Thị Nại, Hồ Núi Một, Chùa Ông Núi, Bãi Kỳ Co, Làng nón Phú Gia, Làng rượu Bàu Đá, Làng võ Tây Sơn',
'Suối khoáng nóng Hội Vân, Tháp Thủ Thiện, Tháp Phú Lốc, Đồi Ghềnh Ráng, Bãi Bàng, Bãi Rạng, Hòn Sẹo, Mũi Vi Rồng, Gành Yến']},
{id:'r-dd-vung-tau',c:'Du lịch',q:'Kể tên một điểm du lịch ở Vũng Tàu hoặc Bà Rịa - Vũng Tàu',s:['diadiem'],k:'Đình Thắng Tam',t:[
'Tượng Chúa Kitô Vua|Tượng Chúa dang tay, Bãi Sau, Bãi Trước',
'Ngọn hải đăng Vũng Tàu|Hải đăng Vũng Tàu, Hòn Bà, Côn Đảo, Bạch Dinh, Mũi Nghinh Phong, Hồ Tràm',
'Bãi Dâu, Bãi Dứa, Long Hải, Hồ Cốc, Núi Minh Đạm, Thích Ca Phật Đài, Hồ Mây Park, Suối nước nóng Bình Châu, Dinh Cô, Đồi Con Heo',
'Niết Bàn Tịnh Xá, Pháo đài Phước Thắng, Chùa Phật Quang, Rừng phòng hộ, Bảo tàng Vũ khí cổ, Nhà tù Côn Đảo, Hòn Bảy Cạnh, Bãi Đầm Trầu, Nghĩa trang Hàng Dương, Mũi Kỳ Vân, Khu du lịch Thùy Dương',
'Hải đăng Cấp, Đền thờ Võ Thị Sáu, Bãi Nhát, Hòn Cau, Bãi Ông Đụng, Khu dự trữ sinh quyển Bình Châu - Phước Bửu, Thắng Tam, Lăng Cá Ông']},
{id:'r-dd-cao-bang',c:'Du lịch',q:'Kể tên một điểm du lịch ở Cao Bằng hoặc Lạng Sơn',s:['diadiem'],k:'Mắt Thần Núi',t:[
'Thác Bản Giốc, Pác Bó',
'Động Ngườm Ngao, Mẫu Sơn, Chợ Kỳ Lừa, Động Tam Thanh',
'Suối Lê Nin, Hang Cốc Bó, Núi Các Mác, Chùa Phật Tích Trúc Lâm Bản Giốc, Đèo Mã Phục, Thác Thăng Hen|Hồ Thăng Hen, Thành nhà Mạc, Đền Bắc Lệ, Ải Chi Lăng, Cửa khẩu Hữu Nghị, Đồng Đăng',
'Làng đá Khuổi Ky, Làng hương Phja Thắp, Kim Đồng|Khu di tích Kim Đồng, Đèo Khau Cốc Chà, Đèo Mẻ Pia, Hồ Khuổi Lái, Thung lũng Bắc Sơn, Núi Tô Thị|Nàng Tô Thị, Chùa Thành, Động Nhị Thanh, Đền Kỳ Cùng, Chợ Đông Kinh, Ruộng bậc thang Bắc Sơn',
'Rừng trúc Phia Oắc, Núi Phia Oắc, Phja Oắc - Phja Đén, Làng giấy bản Phja Chang, Thác Ngườm Ngao, Bản Thang, Ba Quẻ, Khuổi Ky, Đền Mẫu Đồng Đăng']},
{id:'r-dd-mui-ne',c:'Du lịch',q:'Kể tên một điểm du lịch ở Phan Thiết hoặc Bình Thuận',s:['diadiem'],k:'Mũi Điện|Mũi Điện Kê Gà',t:[
'Mũi Né, Đồi cát bay|Đồi cát Mũi Né',
'Bàu Trắng|Đồi cát trắng, Suối Tiên Mũi Né|Suối Tiên, Hải đăng Kê Gà, Làng chài Mũi Né, Tháp Chàm Poshanư, Núi Tà Cú',
'Đảo Phú Quý, Hòn Rơm, Lầu Ông Hoàng, Bãi đá Cổ Thạch, Bãi Rạng, Đồi Hồng, Dinh Vạn Thủy Tú, Trường Dục Thanh, Novaworld Phan Thiết, Đồi cát đỏ',
'Mũi Kê Gà, Hòn Bà Lagi, Bãi biển Đồi Dương, Chùa Cổ Thạch, Bàu Sen, Bãi Đá Ông Địa, Thác Bà, Đảo Cù Lao Câu, Biển Cam Bình, Tượng Phật nằm Tà Cú',
'Hồ Biển Lạc, Suối khoáng nóng Vĩnh Hảo, Vĩnh Hảo, Bãi biển Tuy Phong, Gành Son, Chùa Hang Tuy Phong, Vườn thanh long Hàm Thuận']},
{id:'r-dd-con-dao',c:'Du lịch',q:'Kể tên một điểm du lịch nổi tiếng ở Côn Đảo',s:['diadiem'],k:'Hòn Bảy Cạnh',t:[
'Nhà tù Côn Đảo|Nhà tù Côn Sơn, Nghĩa trang Hàng Dương',
'Chuồng cọp|Chuồng cọp Côn Đảo, Mộ cô Sáu|Mộ chị Võ Thị Sáu, Bãi Đầm Trầu, Chùa Núi Một',
'Hòn Cau, Bãi Nhát, Dinh Chúa Đảo, Cầu tàu 914, Miếu bà Phi Yến|An Sơn Miếu, Bãi Ông Đụng, Hòn Tre Lớn, Vườn quốc gia Côn Đảo',
'Bãi Đất Dốc, Mũi Chim Chim, Hòn Tài, Hòn Trứng, Bãi Lò Vôi, Cảng Bến Đầm, Sân bay Cỏ Ống, Bãi Suối Ớt, Hòn Bà',
'Đỉnh Thánh Giá, Đỉnh Tình Yêu, Trại Phú Hải, Trại Phú Sơn, Trại Phú Tường, Chuồng bò, Cầu Ma Thiên Lãnh, Hồ Quang Trung']},
];
