// Release set, part 15: what is on now (timely prompts carry `until`), music, film and sport.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE15: ReleaseQuestion[] = [
{id:'r-em-xinh',c:'Nhạc Việt',q:'Kể tên một "em xinh" tham gia chương trình Em xinh "say hi" (2025)',s:['emxinh'],k:'Yeolan',until:'2027-06-30',t:[
'Phương Mỹ Chi, Bích Phương, Miu Lê',
'Bảo Anh, Phương Ly, Orange, Lyhan, Châu Bùi, Hoàng Duyên, Tiên Tiên',
'Juky San, Ngô Lan Hương, MaiQuinn, Pháo, Lamoon, 52Hz, Lâm Bảo Ngọc, Mỹ Mỹ, Quỳnh Anh Shyn, Liu Grace',
'Saabirose, Vũ Thảo My, Han Sara, Chi Xê, Muộii, LyLy',
'Tao Yi A1J, Ánh Sáng AZA, Danmy']},
{id:'r-zootopia',c:'Giải trí',q:'Kể tên một nhân vật trong phim Zootopia (Phi vụ động trời), phần 1 hoặc phần 2',s:[],k:'Manchas',until:'2027-06-30',t:[
'Judy Hopps|Judy|Thỏ Judy, Nick Wilde|Nick|Cáo Nick, Flash|Con lười Flash',
'Chief Bogo|Bogo|Cảnh sát trưởng Bogo, Clawhauser|Benjamin Clawhauser, Mr. Big|Ông Trùm, Gazelle, Bellwether|Phó thị trưởng Bellwether, Finnick, Gary De\'Snake|Gary|Rắn Gary',
'Yax, Fru Fru, Duke Weaselton|Weaselton, Thị trưởng Lionheart|Lionheart, Bonnie Hopps, Stu Hopps, Gideon Grey, Priscilla, Nibbles|Nibbles Maplestick, Pawbert|Pawbert Lynxley',
'Bà Otterton|Mrs. Otterton, Emmitt Otterton|Otterton, Jerry Jumbeaux|Jerry Jumbeaux Jr., Doug',
'Bucky, Pronk']},
{id:'r-giai-thuong',c:'Văn hóa',q:'Kể tên một giải thưởng nổi tiếng (trong nước hoặc quốc tế)',s:['giai','giaithuong'],k:'Crafoord|Giải Crafoord',t:[
'Oscar|Giải Oscar, Nobel|Giải Nobel, Grammy',
'Quả bóng vàng|Ballon d\'Or, Cành cọ vàng|Cannes, Emmy, Quả cầu vàng|Golden Globe, Mai Vàng, Cống hiến|Giải Cống hiến, Làn Sóng Xanh, Pulitzer',
'Bông sen vàng, Cánh diều vàng, Fields|Huy chương Fields, Turing|Giải Turing, Booker|Giải Booker, BAFTA, VMA|MTV Video Music Awards, Billboard Music Awards, Tony, Laureus, Pritzker, Abel|Giải Abel, VinFuture, Ramon Magsaysay, Giải thưởng Hồ Chí Minh, MAMA|Mnet Asian Music Awards, Mâm xôi vàng|Razzie, Sư tử vàng|Venice, Gấu vàng|Berlin, Giải thưởng Nhà nước',
'Golden Disc, Teen Choice, Kids\' Choice, Hugo, Nebula, Goncourt, Cervantes, Kalinga, Templeton, Kyoto Prize|Giải Kyoto, Shaw|Giải Shaw, Breakthrough, Lasker, Wolf|Giải Wolf, Tạ Quang Bửu|Giải Tạ Quang Bửu, Kovalevskaya|Giải Kovalevskaya, Gotham, Annie',
'Japan Prize, Gairdner, Holberg, Kluge, Polar Music, Praemium Imperiale, Sakharov, Right Livelihood, Copley Medal|Huy chương Copley']},
{id:'r-the-loai-nhac',c:'Âm nhạc',q:'Kể tên một thể loại âm nhạc',s:['nhac','theloai','dongnhac'],k:'Zydeco',t:[
'Pop, Rock, Rap|Hip hop, Bolero',
'Jazz, Ballad, EDM, R&B, K-pop, Nhạc cổ điển|Cổ điển, Nhạc đỏ|Nhạc cách mạng, Blues, Country|Đồng quê, Metal|Heavy metal, Indie, Lo-fi, Cải lương, Vinahouse',
'Dance, Disco, Reggae, Punk, Latin, Funk, Soul, Opera, Trap, House, Gospel, Techno, Trance, Dubstep, Drum and bass, Grunge, Ska, Bossa nova, J-pop, C-pop, V-pop, City pop, Alternative, Emo, Hard rock, Dân ca|Folk, Chèo, Quan họ, Ca trù, Xẩm, Hát văn|Chầu văn, Nhã nhạc, Đờn ca tài tử, Ví giặm, Bài chòi, Nhạc vàng, Nhạc Trịnh, Acoustic, Rock and roll',
'Shoegaze, Post-rock, Math rock, Vaporwave, Synthwave, Bluegrass, Fado, Enka, Klezmer, Polka, Gamelan, Dancehall, Grime, Drill, Phonk, Hyperpop, Afrobeats, Reggaeton, Ambient, Chiptune, Tango, Flamenco',
'Qawwali, Krautrock, Gqom, Cumbia, Bachata, Highlife, Soca, Calypso, Mbalax']},
{id:'r-clb-phap',c:'Thể thao',q:'Kể tên một câu lạc bộ bóng đá Pháp',s:['clb','caulacbo','fc'],k:'Gueugnon',t:[
'PSG|Paris Saint-Germain, Marseille|Olympique Marseille, Lyon|Olympique Lyonnais, Monaco|AS Monaco',
'Lille, Nice, Bordeaux, Lens, Rennes, Nantes, Saint-Étienne',
'Montpellier, Toulouse, Strasbourg, Brest, Reims, Lorient, Auxerre, Le Havre, Metz, Angers, Nancy, Sochaux, Guingamp, Caen, Bastia, Ajaccio, Dijon, Troyes, Clermont, Paris FC',
'Valenciennes, Le Mans, Grenoble, Évian, Istres, Laval, Red Star, Niort, Châteauroux, Sedan, Amiens, Nîmes',
'Rodez, Annecy, Dunkerque, Pau, Créteil, Quevilly, Arles-Avignon, Gazélec Ajaccio, Bourg-Péronnas, Tours']},
{id:'r-doi-nba',c:'Thể thao',q:'Kể tên một đội bóng rổ NBA (hiện tại hoặc đã giải thể, đổi tên)',s:['doi'],k:'Providence Steamrollers',t:[
'Lakers|Los Angeles Lakers, Bulls|Chicago Bulls, Warriors|Golden State Warriors, Celtics|Boston Celtics',
'Heat|Miami Heat, Spurs|San Antonio Spurs, Knicks|New York Knicks, Rockets|Houston Rockets, Cavaliers|Cavs, Nets|Brooklyn Nets, Clippers, Mavericks|Mavs|Dallas Mavericks',
'Thunder|Oklahoma City Thunder, Raptors|Toronto Raptors, Bucks|Milwaukee Bucks, Nuggets|Denver Nuggets, 76ers|Sixers, Suns|Phoenix Suns, Jazz|Utah Jazz, Trail Blazers|Blazers, Kings|Sacramento Kings, Timberwolves|Wolves, Pistons|Detroit Pistons, Pacers|Indiana Pacers, Hawks|Atlanta Hawks',
'Hornets|Charlotte Hornets, Magic|Orlando Magic, Pelicans|New Orleans Pelicans, Grizzlies|Memphis Grizzlies, Wizards|Washington Wizards, SuperSonics|Seattle SuperSonics, Bobcats|Charlotte Bobcats, New Jersey Nets',
'Washington Bullets|Bullets, Buffalo Braves, Kansas City Kings, Minneapolis Lakers, Syracuse Nationals, Rochester Royals, Fort Wayne Pistons, St. Louis Hawks, San Diego Rockets, Vancouver Grizzlies, New Orleans Hornets']},
];
