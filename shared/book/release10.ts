// Release set, part 10: brands, shops, vehicles, instruments and the body.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE10: ReleaseQuestion[] = [
{id:'r-dong-ho',c:'Mua sắm',q:'Kể tên một thương hiệu đồng hồ đeo tay',s:['dongho','hang'],k:'Vacheron Constantin',t:[
'Rolex, Casio',
'Omega, Seiko, Citizen, Apple Watch, Orient',
'Patek Philippe, Audemars Piguet|AP, Hublot, Tissot, Longines, Daniel Wellington|DW, Garmin, Fossil, G-Shock, Tag Heuer, Cartier, Swatch, Richard Mille',
'Breitling, IWC, Panerai, Tudor, Frederique Constant, Hamilton, Movado, Bulova, Rado, Franck Muller, Zenith, Mido, Certina, Huawei Watch, Xiaomi Watch|Mi Band, Amazfit, Galaxy Watch|Samsung Galaxy Watch, Timex',
'A. Lange & Söhne, Blancpain, Breguet, Jaeger-LeCoultre, Ulysse Nardin, Chopard, Piaget, Girard-Perregaux, Glashütte Original, Oris, Nomos, Sinn, Raymond Weil, Edox, Victorinox, Grand Seiko']},
{id:'r-thoi-trang-nhanh',c:'Thời trang',q:'Kể tên một thương hiệu quần áo bình dân hoặc thời trang nhanh có cửa hàng ở Việt Nam',s:['hang','thuonghieu'],k:'Monki',t:[
'Zara, Uniqlo, H&M',
'Mango, Canifa, Routine, Owen, Ivy Moda, Yody, Shein',
'Pull&Bear, Bershka, Stradivarius, Massimo Dutti, Gap, Levi\'s, Cotton On, Muji, Elise, NEM, Aristino, Việt Tiến, Coolmate, Charles & Keith, Pedro, Forever 21, Topshop',
'Giordano, Padini, Bossini, Ninomaxx, Blue Exchange, PT2000, Hnoss, Totoday, 5S Fashion, An Phước, May 10, Adore Dress, Seven.AM, Marc Fashion, Oysho, Old Navy',
'Weekday, COS, Desigual, Esprit, Superdry, Jack & Jones, Vero Moda, Only, Lindex, Pimkie, Promod, Kiabi, Primark, Lefties']},
{id:'r-my-pham',c:'Mua sắm',q:'Kể tên một thương hiệu mỹ phẩm hoặc chăm sóc da',s:['hang','thuonghieu'],k:'Clé de Peau|Clé de Peau Beauté',t:[
'Maybelline, L\'Oréal, Innisfree',
'MAC, Laneige, The Ordinary, Cocoon, La Roche-Posay, Bioderma, 3CE, Black Rouge, Romand, Some By Mi',
'Estée Lauder, Shiseido, Sulwhasoo, Clinique, Lancôme, NYX, Revlon, Clio, Hada Labo, Senka, Garnier, Pond\'s, Cetaphil, CeraVe, Simple, Eucerin, Vichy, Avène, Paula\'s Choice, Klairs, Cosrx, Ohui, Whoo|The History of Whoo, Kiehl\'s, SK-II',
'La Mer, Tatcha, Drunk Elephant, Charlotte Tilbury, Benefit, Too Faced, Urban Decay, Nars, Tarte, Anastasia Beverly Hills, Etude House|Etude, Missha, Skinfood, Tony Moly, Nature Republic, Hera, Peripera, Merzy, Lemonade, Thorakao, Cỏ Mềm, Bobbi Brown, Fenty Beauty, Rare Beauty, Huda Beauty, Make Up For Ever, Shu Uemura',
'Sisley, La Prairie, Guerlain, Cosme Decorte|Decorté, Kosé, Kanebo, Albion, Pola, Ipsa, Bourjois, Rimmel, Essence, Catrice, Pat McGrath, Glow Recipe, Laura Mercier']},
{id:'r-dien-may',c:'Mua sắm',q:'Kể tên một chuỗi cửa hàng bán điện thoại, máy tính hoặc điện máy ở Việt Nam',s:['cuahang','chuoi'],k:'Viễn Thông A',t:[
'Thế Giới Di Động, Điện Máy Xanh, FPT Shop',
'CellphoneS, Hoàng Hà Mobile, Nguyễn Kim, Viettel Store, Di Động Việt, Phong Vũ',
'Pico, MediaMart, Điện Máy Chợ Lớn, Topzone, ShopDunk, An Phát, GearVN, Hacom, Trần Anh, Nhật Cường|Nhật Cường Mobile, HC|Điện máy HC',
'Phúc Anh, Hanoicomputer, Mai Nguyên, Minh Tuấn Mobile, Clickbuy, Bạch Long Mobile, Điện Máy Thiên Hòa, Thế Giới Số, Hnam Mobile, Điện Thoại Giá Kho',
'Memoryzone, Ben Computer, Kim Long Computer, Tin Học Ngôi Sao, Xuân Vinh, Duy Anh, Eco-Mart']},
{id:'r-toyota',c:'Giao thông',q:'Kể tên một mẫu xe của Toyota',s:['xe','toyota'],k:'Cressida',t:[
'Vios, Camry, Innova, Fortuner',
'Corolla Cross, Land Cruiser, Corolla Altis, Yaris, Wigo, Hilux, Raize, Veloz',
'Avanza, Prius, RAV4, Highlander, Alphard, Sienna, Hiace, Rush, Prado|Land Cruiser Prado, Supra, Zace, Yaris Cross, Corolla, Crown',
'Previa, Celica, Avalon, Sequoia, Tundra, Tacoma, 4Runner, Venza, C-HR, GR86, GR Yaris, bZ4X, Mirai, Century, Granvia, Coaster, Agya',
'MR2, AE86, Starlet, Tercel, Corona, Mark II, Soarer, Chaser, Harrier, Vellfire, Noah, Voxy, Sienta, Aqua, Passo']},
{id:'r-pt-cong-cong',c:'Giao thông',q:'Kể tên một loại phương tiện chở khách công cộng',s:['phuongtien'],k:'Funicular|Đường sắt leo núi|Tàu kéo cáp leo núi',t:[
'Xe buýt|Xe bus, Tàu điện ngầm|Metro, Taxi',
'Tàu hỏa|Tàu lửa, Máy bay, Xe khách, Phà, Xe ôm',
'Buýt nhanh|BRT, Tàu điện trên cao, Xích lô, Đò, Cáp treo, Xe điện du lịch, Tàu cao tốc|Đường sắt cao tốc, Ca nô, Xe lam, Tuk tuk, Buýt đường sông|Waterbus, Xe công nghệ|Grab',
'Tàu điện mặt đất|Tram, Monorail|Tàu một ray, Xe buýt điện, Xe buýt hai tầng, Trolleybus|Xe điện bánh hơi, Thủy phi cơ, Xe đạp công cộng, Tàu đệm từ|Maglev, Xe ngựa, Tàu cánh ngầm, Gondola',
'Jeepney, Songthaew, Matatu, Dolmuş, Marshrutka, Bajaj, Rickshaw, Vaporetto, Xe trâu, Xe bò']},
{id:'r-nhac-cu-giao-huong',c:'Âm nhạc',q:'Kể tên một nhạc cụ trong dàn nhạc giao hưởng',s:['dan','nhaccu','ken'],k:'Contrabassoon|Kèn contrabassoon|Kèn contrafagot',t:[
'Violin|Vĩ cầm, Piano|Dương cầm, Trống, Trumpet|Kèn trumpet',
'Cello|Đại hồ cầm|Violoncello, Flute|Sáo Tây|Sáo flute, Clarinet|Kèn clarinet, Viola, Contrabass|Double bass|Đàn contrabass, Harp|Đàn hạc',
'Trombone|Kèn trombone, Tuba|Kèn tuba, Oboe|Kèn oboe, Timpani|Trống định âm, Kèn cor|Horn|French horn, Triangle|Kẻng tam giác, Chũm chọe|Cymbal',
'Bassoon|Kèn bassoon|Kèn fagot, Piccolo|Sáo piccolo, Celesta, Xylophone, Glockenspiel, Chuông ống|Tubular bells, Organ|Đàn organ, Harpsichord|Đàn clavecin, Tam-tam|Gong, Trống snare|Trống lẫy, Marimba, Castanets',
'Cor anglais|English horn|Kèn cor anglais, Bass clarinet|Kèn bass clarinet, Wagner tuba, Euphonium, Cornet, Vibraphone, Tambourine, Woodblock']},
{id:'r-bo-phan-doi',c:'Khoa học',q:'Kể tên một bộ phận cơ thể người mà mỗi người có một đôi (hai cái, trái và phải)',s:['cai'],k:'Vòi Eustache|Vòi nhĩ',t:[
'Mắt, Tai, Tay, Chân',
'Thận, Phổi, Vai, Đầu gối, Lông mày, Má, Bàn tay, Bàn chân, Khuỷu tay, Mông',
'Cổ tay, Mắt cá chân|Cổ chân, Gót chân, Hông, Nách, Đùi, Bắp chân, Cánh tay, Mí mắt, Lỗ mũi, Xương đòn, Buồng trứng, Tinh hoàn, Ngực|Vú, Thái dương',
'Tuyến thượng thận, Ống dẫn trứng|Vòi trứng, Niệu quản, Amidan, Xương bả vai, Hốc mắt, Xương bánh chè, Gò má, Ống tai, Tuyến mang tai, Tuyến lệ, Bán cầu não, Tâm nhĩ, Tâm thất',
'Xương mác, Xương chày, Xương bàn đạp, Ốc tai, Tuyến dưới hàm, Mào tinh, Ống dẫn tinh, Phế quản gốc, Xương thái dương, Xương đỉnh']},
];
