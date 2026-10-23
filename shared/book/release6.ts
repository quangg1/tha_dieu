// Release set, part 6: sport.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE6: ReleaseQuestion[] = [
{id:'r-clb-laliga',c:'Thể thao',q:'Kể tên một câu lạc bộ bóng đá Tây Ban Nha',s:['clb','caulacbo','doi'],k:'Real Oviedo',t:[
'Real Madrid, Barcelona',
'Atlético Madrid, Sevilla, Valencia, Villarreal',
'Real Sociedad, Athletic Bilbao, Real Betis, Celta Vigo, Espanyol, Deportivo La Coruña, Getafe, Osasuna',
'Málaga, Rayo Vallecano, Mallorca, Girona, Granada, Alavés, Las Palmas, Cádiz, Levante, Valladolid, Elche, Almería, Real Zaragoza, Sporting Gijón, Racing Santander, Leganés',
'Eibar, Huesca, Tenerife, Numancia, Córdoba, Recreativo Huelva, Hércules, Xerez, Albacete, Mirandés, Burgos, Castellón']},
{id:'r-clb-seriea',c:'Thể thao',q:'Kể tên một câu lạc bộ bóng đá Ý',s:['clb','caulacbo','doi'],k:'Chievo',t:[
'Juventus, AC Milan, Inter Milan',
'AS Roma, Napoli, Lazio',
'Fiorentina, Atalanta, Parma, Sampdoria, Torino, Bologna, Udinese, Genoa',
'Cagliari, Lecce, Sassuolo, Empoli, Verona|Hellas Verona, Monza, Salernitana, Spezia, Venezia, Cremonese, Frosinone, Palermo, Bari, Brescia, Como',
'Pescara, Perugia, Ascoli, Avellino, Catania, Livorno, Reggina, Piacenza, Siena, Ternana, Pisa, Modena']},
{id:'r-clb-bundes',c:'Thể thao',q:'Kể tên một câu lạc bộ bóng đá Đức',s:['clb','caulacbo','doi'],k:'St. Pauli',t:[
'Bayern Munich|Bayern München, Borussia Dortmund|Dortmund',
'Bayer Leverkusen|Leverkusen, Schalke 04|Schalke, RB Leipzig|Leipzig, Hamburg',
'Werder Bremen, Wolfsburg, Eintracht Frankfurt, Borussia Mönchengladbach|Gladbach, Stuttgart, Köln',
'Hertha Berlin, Union Berlin, Freiburg, Hoffenheim, Mainz, Augsburg, Hannover 96, Nürnberg, Kaiserslautern, Bochum, Heidenheim, Darmstadt, Fortuna Düsseldorf',
'Arminia Bielefeld, Karlsruher, 1860 München, Paderborn, Greuther Fürth, Energie Cottbus, Holstein Kiel, Hansa Rostock, Dynamo Dresden']},
{id:'r-clb-vleague',c:'Thể thao',q:'Kể tên một câu lạc bộ bóng đá Việt Nam',s:['clb','caulacbo','doi'],k:'Đồng Tâm Long An',t:[
'Hà Nội FC|CLB Hà Nội, Hoàng Anh Gia Lai|HAGL, Viettel|Thể Công Viettel',
'Công an Hà Nội, Sông Lam Nghệ An|SLNA, Becamex Bình Dương|Bình Dương, Nam Định|Thép Xanh Nam Định, Hải Phòng',
'Thanh Hóa|Đông Á Thanh Hóa, Hà Nội T&T, SHB Đà Nẵng|Đà Nẵng, Khánh Hòa, Quảng Nam, Hồng Lĩnh Hà Tĩnh, TP.HCM|CLB TP.HCM, Bình Định, Than Quảng Ninh',
'Long An, Đồng Tháp, Cần Thơ, Sài Gòn FC, XSKT Cần Thơ, Ninh Bình, PVF, Phố Hiến, Bà Rịa Vũng Tàu, Đồng Nai, Khatoco Khánh Hòa',
'Thể Công, Cảng Sài Gòn, Hải Quan, Công an TP.HCM, Navibank Sài Gòn, Xuân Thành Sài Gòn, Kienlongbank Kiên Giang, Vissai Ninh Bình, Mitsustar Haier Hải Phòng']},
{id:'r-giai-dau',c:'Thể thao',q:'Kể tên một giải đấu thể thao lớn',s:['giai','giaidau'],k:'Tour de France',t:[
'World Cup, Olympic|Thế vận hội, SEA Games',
'Euro|Euro bóng đá, Champions League|Cúp C1, Ngoại hạng Anh|Premier League, AFF Cup|ASEAN Cup, ASIAD|Asian Games, V-League',
'Wimbledon, NBA, Copa América, Asian Cup, La Liga, Serie A, Bundesliga, F1, Roland Garros|Pháp mở rộng, Mỹ mở rộng|US Open, Úc mở rộng|Australian Open, Paralympic',
'Super Bowl, Europa League|Cúp C2, Club World Cup, World Series, Ryder Cup, The Masters, Thomas Cup, Sudirman Cup, Davis Cup, Giro d\'Italia, Vuelta, MotoGP, Dakar Rally, Six Nations, Rugby World Cup, Cricket World Cup, Liên Quân AWC, LMHT CKTG',
'Le Mans 24 giờ, Indy 500, Stanley Cup, America\'s Cup, Boston Marathon, Uber Cup, Hopman Cup, Commonwealth Games, Gold Cup, Africa Cup of Nations']},
{id:'r-mon-sea',c:'Thể thao',q:'Kể tên một môn thể thao đối kháng hoặc võ thuật',s:['mon','vo'],k:'Kurash',t:[
'Boxing|Quyền Anh, Karate, Taekwondo',
'Vovinam, Judo, Võ cổ truyền, Muay Thái, Vật, Kungfu',
'MMA, Kickboxing, Đấu kiếm, Pencak silat, Wushu, Aikido, Sumo, Jujitsu, Thái cực quyền, Vịnh Xuân quyền|Vịnh Xuân',
'Kendo, Capoeira, Hapkido, Sambo, Krav Maga, Nhu thuật Brazil, Võ Bình Định, Thiếu Lâm, Côn Luân, Savate, Lethwei, Bokator, Kalaripayattu, Kudo',
'Sanda, Silambam, Shorinji Kempo, Ssireum, Taekkyon, Vật Mông Cổ, Vật dầu, Systema, Arnis, Iaido, Naginata, Bajiquan']},
];
