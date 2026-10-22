// Release set, part 15: what is on now (timely prompts carry `until`), music, film and sport.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE15: ReleaseQuestion[] = [
{id:'r-em-xinh',c:'Nhạc Việt',q:'Kể tên một "em xinh" tham gia chương trình Em xinh "say hi" (2025)',s:['emxinh'],k:'Yeolan',until:'2027-06-30',t:[
'Phương Mỹ Chi, Bích Phương, Miu Lê',
'Bảo Anh, Phương Ly, Orange, Lyhan, Châu Bùi, Hoàng Duyên, Tiên Tiên',
'Juky San, Ngô Lan Hương, MaiQuinn, Pháo, Lamoon, 52Hz, Lâm Bảo Ngọc, Mỹ Mỹ, Quỳnh Anh Shyn, Liu Grace',
'Saabirose, Vũ Thảo My, Han Sara, Chi Xê, Muộii, LyLy',
'Tao Yi A1J, Ánh Sáng AZA, Danmy']},
{id:'r-phim-viet-moi',c:'Điện ảnh',q:'Kể tên một phim điện ảnh Việt Nam ra rạp trong năm 2025 hoặc dịp Tết 2026',s:['phim'],k:'Tìm xác - Ma không đầu|Tìm xác',until:'2027-03-31',t:[
'Mưa đỏ, Bộ tứ báo thủ, Thỏ ơi!!',
'Địa đạo|Địa đạo: Mặt trời trong bóng tối, Lật mặt 8|Lật mặt 8: Vòng tay nắng, Nụ hôn bạc tỷ, Thám tử Kiên|Thám tử Kiên: Kỳ án không đầu, Tử chiến trên không',
'Nhà gia tiên, Mang mẹ đi bỏ, Truy tìm long diên hương, Nhà ba tôi một phòng, Tài, Đèn âm hồn, Quỷ nhập tràng',
'Mùi phở, Báu vật trời cho, Yêu nhầm bạn thân',
'Âm dương lộ']},
{id:'r-zootopia',c:'Giải trí',q:'Kể tên một nhân vật trong phim Zootopia (Phi vụ động trời), phần 1 hoặc phần 2',s:[],k:'Manchas',until:'2027-06-30',t:[
'Judy Hopps|Judy|Thỏ Judy, Nick Wilde|Nick|Cáo Nick, Flash|Con lười Flash',
'Chief Bogo|Bogo|Cảnh sát trưởng Bogo, Clawhauser|Benjamin Clawhauser, Mr. Big|Ông Trùm, Gazelle, Bellwether|Phó thị trưởng Bellwether, Finnick, Gary De\'Snake|Gary|Rắn Gary',
'Yax, Fru Fru, Duke Weaselton|Weaselton, Thị trưởng Lionheart|Lionheart, Bonnie Hopps, Stu Hopps, Gideon Grey, Priscilla, Nibbles|Nibbles Maplestick, Pawbert|Pawbert Lynxley',
'Bà Otterton|Mrs. Otterton, Emmitt Otterton|Otterton, Jerry Jumbeaux|Jerry Jumbeaux Jr., Doug',
'Bucky, Pronk']},
{id:'r-kpop-group',c:'Âm nhạc',q:'Kể tên một nhóm nhạc K-pop',s:['nhom'],k:'Seo Taiji and Boys',t:[
'BTS, BLACKPINK, BigBang, Twice',
'EXO, Super Junior, Girls\' Generation|SNSD, NewJeans, Red Velvet, Seventeen, Stray Kids, aespa, IVE, LE SSERAFIM, 2NE1',
'TXT, NCT, ITZY, (G)I-DLE|i-dle, Wonder Girls, T-ara, Kara, SHINee, 2PM, Mamamoo, iKON, Winner, GOT7, Monsta X, ENHYPEN, ATEEZ, Apink, Sistar, Miss A, f(x), BTOB, TVXQ|DBSK, Babymonster, ILLIT',
'Oh My Girl, GFriend, Lovelyz, WJSN, Fromis_9, Kep1er, NMIXX, STAYC, KISS OF LIFE, RIIZE, ZEROBASEONE|ZB1, TWS, BOYNEXTDOOR, Treasure, The Boyz, SF9, Astro, Pentagon, Dreamcatcher, Everglow, Loona, CLC, AOA, 4Minute, After School, Brown Eyed Girls, Davichi, Infinite, Beast|Highlight, B.A.P',
'H.O.T., Sechs Kies, g.o.d, Shinhwa, S.E.S., Fin.K.L, Baby V.O.X, Cool, Turbo, Clon, Jewelry, Rainbow, Nine Muses, Hello Venus, Dal Shabet']},
{id:'r-rapper-vn',c:'Nhạc Việt',q:'Kể tên một rapper Việt Nam',s:['rapper'],k:'Hà Lê',t:[
'Đen|Đen Vâu, Binz, Karik, Suboi',
'Wowy, Rhymastic, JustaTee, HIEUTHUHAI, MCK|RPT MCK, tlinh, Low G, Andree|Andree Right Hand, B Ray',
'Kimese, Lăng LD, Dế Choắt, GDucky, Ricky Star, 16 Typh, Seachains, Obito, Wxrdie, Gill|RPT Gill, Pháp Kiều, Double2T, Tage, Liu Grace, Coldzy, Captain Boy, Negav, Robber|Hustlang Robber, Lil Wuyn, Blacka, Phúc Du, Datmaniac, Tez, Yuno Bigboi, Dangrangto, Mai Âm Nhạc, Sol7, VSoul',
'Lil Knight|LK, Lil Shady, Khói, Young H, Mikelodic, Nger, Táo, Thái VG, Yanbi, Big Daddy, Mr.A',
'Lee7, Kidz, Shadow P']},
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
{id:'r-dao-dien',c:'Điện ảnh',q:'Kể tên một đạo diễn điện ảnh nổi tiếng',s:['daodien'],k:'Béla Tarr',t:[
'Steven Spielberg|Spielberg, Christopher Nolan|Nolan, James Cameron, Trấn Thành',
'Quentin Tarantino|Tarantino, Martin Scorsese, Peter Jackson, Tim Burton, Ridley Scott, Bong Joon-ho, Hayao Miyazaki|Miyazaki, Victor Vũ, Lý Hải, Charlie Nguyễn, Đặng Thái Huyền, George Lucas, Châu Tinh Trì',
'Stanley Kubrick, Alfred Hitchcock, Francis Ford Coppola, Denis Villeneuve, Greta Gerwig, Wes Anderson, David Fincher, Guillermo del Toro, Lý An|Ang Lee, Trương Nghệ Mưu|Zhang Yimou, Vương Gia Vệ|Wong Kar-wai, Trần Anh Hùng, Akira Kurosawa|Kurosawa, Park Chan-wook, Michael Bay, Zack Snyder, Anh em nhà Russo|Russo, Taika Waititi, James Gunn, Jordan Peele, Clint Eastwood, Woody Allen, Makoto Shinkai, Ngô Thanh Vân, Bùi Thạc Chuyên, Đặng Nhật Minh, Thu Trang',
'Federico Fellini, Ingmar Bergman, Andrei Tarkovsky, Jean-Luc Godard, François Truffaut, Yasujirō Ozu|Ozu, Satyajit Ray, Pedro Almodóvar, Lars von Trier, Michael Haneke, Krzysztof Kieślowski, Wim Wenders, Werner Herzog, Terrence Malick, Paul Thomas Anderson, Anh em nhà Coen|Coen, David Lynch, Sofia Coppola, Hirokazu Kore-eda, Phạm Thiên Ân, Lê Văn Kiệt, Nguyễn Quang Dũng, Phan Đăng Di, Leon Lê|Leon Quang Lê',
'Apichatpong Weerasethakul, Abbas Kiarostami, Chantal Akerman, Agnès Varda, Robert Bresson, Carl Theodor Dreyer, Sergei Eisenstein, Hầu Hiếu Hiền|Hou Hsiao-hsien, Dương Đức Xương|Edward Yang, Thái Minh Lượng|Tsai Ming-liang, Giả Chương Kha|Jia Zhangke, Nuri Bilge Ceylan, Kenji Mizoguchi']},
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
