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
{id:'r-dt-wc-vo-dich',c:'Thể thao',q:'Kể tên một đội tuyển từng vô địch World Cup bóng đá nam',s:['doi','doituyen'],k:'Uruguay',t:[
'Brazil, Argentina, Đức',
'Pháp, Ý, Tây Ban Nha',
'Anh',
'',
'']},
{id:'r-tay-vot',c:'Thể thao',q:'Kể tên một tay vợt quần vợt nổi tiếng',s:[],k:'Stan Wawrinka',t:[
'Roger Federer, Rafael Nadal, Novak Djokovic',
'Serena Williams, Carlos Alcaraz, Jannik Sinner, Andy Murray, Maria Sharapova',
'Venus Williams, Pete Sampras, Andre Agassi, Daniil Medvedev, Iga Swiatek, Naomi Osaka, Steffi Graf, Aryna Sabalenka, Coco Gauff, Lý Hoàng Nam',
'Alexander Zverev, Stefanos Tsitsipas, Dominic Thiem, Juan Martín del Potro, Kei Nishikori, Nick Kyrgios, Martina Navratilova, Martina Hingis, Bjorn Borg, John McEnroe, Ivan Lendl, Boris Becker, Lý Na|Li Na, Kim Clijsters, Justine Henin, Caroline Wozniacki, Elena Rybakina',
'Rod Laver, Jimmy Connors, Stefan Edberg, Marat Safin, Lleyton Hewitt, Andy Roddick, Gustavo Kuerten, Ash Barty, Simona Halep, Petra Kvitova, Taylor Fritz, Holger Rune, Casper Ruud, Daniel Nestor']},
{id:'r-nba',c:'Thể thao',q:'Kể tên một cầu thủ bóng rổ NBA nổi tiếng',s:[],k:'Hakeem Olajuwon',t:[
'Michael Jordan, LeBron James, Kobe Bryant',
'Stephen Curry, Shaquille O\'Neal, Kevin Durant, Yao Ming|Diêu Minh, Magic Johnson',
'Kareem Abdul-Jabbar, Larry Bird, Tim Duncan, Dirk Nowitzki, Giannis Antetokounmpo, Nikola Jokić, Luka Dončić, James Harden, Dwyane Wade, Allen Iverson, Victor Wembanyama',
'Kevin Garnett, Paul Pierce, Chris Paul, Russell Westbrook, Kawhi Leonard, Anthony Davis, Damian Lillard, Kyrie Irving, Carmelo Anthony, Dennis Rodman, Scottie Pippen, Charles Barkley, Karl Malone, Bill Russell, Wilt Chamberlain, Jayson Tatum, Joel Embiid, Shai Gilgeous-Alexander',
'Isiah Thomas, Patrick Ewing, David Robinson, Steve Nash, Jason Kidd, Tony Parker, Manu Ginóbili, Ray Allen, Reggie Miller, Vince Carter, Tracy McGrady, Pau Gasol, Klay Thompson, Draymond Green, Ja Morant, Zion Williamson']},
{id:'r-f1',c:'Thể thao',q:'Kể tên một tay đua hoặc đội đua Công thức 1 (F1)',s:[],k:'Niki Lauda',t:[
'Ferrari, Lewis Hamilton, Michael Schumacher',
'Max Verstappen, Red Bull, Mercedes, McLaren, Ayrton Senna, Fernando Alonso',
'Lando Norris, Charles Leclerc, Sebastian Vettel, Kimi Räikkönen, Oscar Piastri, George Russell, Carlos Sainz, Aston Martin, Williams, Alpine, Renault',
'Sergio Pérez, Valtteri Bottas, Nico Rosberg, Daniel Ricciardo, Alain Prost, Mika Häkkinen, Jenson Button, Damon Hill, Lotus, Haas, Sauber, Audi, Racing Bulls|Toro Rosso, Andrea Kimi Antonelli, Lance Stroll, Pierre Gasly, Esteban Ocon',
'Juan Manuel Fangio, Jackie Stewart, Jim Clark, Nelson Piquet, Nigel Mansell, Emerson Fittipaldi, Jochen Rindt, Gilles Villeneuve, Jacques Villeneuve, Rubens Barrichello, Felipe Massa, Mark Webber, Yuki Tsunoda, Nico Hülkenberg, Alex Albon, Oliver Bearman, Cadillac, Brabham, Tyrrell, Jordan, Minardi']},
{id:'r-vdv-vn',c:'Thể thao',q:'Kể tên một vận động viên Việt Nam nổi tiếng (không phải cầu thủ bóng đá)',s:['vdv'],k:'Trần Hiếu Ngân',t:[
'Nguyễn Thị Ánh Viên|Ánh Viên, Hoàng Xuân Vinh',
'Nguyễn Tiến Minh, Lý Hoàng Nam, Nguyễn Thùy Linh, Hoàng Nguyên Thanh, Vũ Thị Hương',
'Quách Thị Lan, Nguyễn Thị Oanh, Nguyễn Huy Hoàng, Trần Đức Phấn|Phấn, Thạch Kim Tuấn, Nguyễn Thị Huyền, Lê Quang Liêm, Nguyễn Ngọc Trường Sơn, Hoàng Thị Loan, Đinh Phương Thành, Phạm Thị Huệ',
'Nguyễn Văn Hùng, Lê Bích Phương, Trần Văn Vũ, Nguyễn Thị Lụa, Nguyễn Thị Thật, Trần Quyết Chiến, Phạm Như Phương, Nguyễn Thị Hằng, Lê Văn Công, Hoàng Thị Duyên, Đỗ Thị Ngân Thương, Nguyễn Thị Hương, Dương Thúy Vi, Lò Thị Hoàng, Bùi Thị Thu Thảo, Phạm Thị Thu Hiền, Trần Quốc Cường',
'Nguyễn Hoàng Ngân, Châu Tuyết Vân, Nguyễn Văn Đức, Phạm Văn Mách, Văn Ngọc Tú, Nguyễn Thị Phương Thúy, Ngô Đức Mạnh, Đỗ Thị Thu Hoài, Hoàng Thị Thanh Nhàn, Nguyễn Thị Kim Ngân']},
{id:'r-cauthu-vn',c:'Thể thao',q:'Kể tên một cầu thủ bóng đá Việt Nam',s:['cauthu'],k:'Nguyễn Hồng Sơn',t:[
'Nguyễn Quang Hải|Quang Hải, Nguyễn Công Phượng|Công Phượng, Đặng Văn Lâm|Văn Lâm',
'Lê Công Vinh|Công Vinh, Nguyễn Tiến Linh|Tiến Linh, Đỗ Hùng Dũng|Hùng Dũng, Đoàn Văn Hậu|Văn Hậu, Nguyễn Văn Quyết|Văn Quyết, Lương Xuân Trường|Xuân Trường, Bùi Tiến Dũng, Nguyễn Xuân Son|Xuân Son',
'Nguyễn Hoàng Đức|Hoàng Đức, Quế Ngọc Hải, Phạm Tuấn Hải, Đỗ Duy Mạnh, Nguyễn Văn Toàn|Văn Toàn, Nguyễn Thành Chung, Bùi Hoàng Việt Anh, Nguyễn Filip, Lê Huỳnh Đức|Huỳnh Đức, Phạm Thành Lương, Nguyễn Trọng Hoàng, Nguyễn Văn Thanh',
'Lê Văn Xuân, Nguyễn Hồng Duy, Hồ Tấn Tài, Nguyễn Thái Sơn, Khuất Văn Khang, Vũ Văn Thanh, Trần Đình Trọng, Nguyễn Phong Hồng Duy, Phan Văn Đức, Châu Ngọc Quang, Nguyễn Văn Vĩ, Nguyễn Tuấn Anh, Đặng Văn Tới, Nguyễn Minh Phương, Phạm Văn Quyến, Nguyễn Anh Đức',
'Lê Tấn Tài, Trần Minh Chiến, Nguyễn Văn Sỹ, Huỳnh Kesley Alves, Dương Hồng Sơn, Nguyễn Minh Chuyên, Phan Thanh Bình, Nguyễn Vũ Phong, Trần Văn Kiên, Đinh Thanh Bình']},
{id:'r-cauthu-tg',c:'Thể thao',q:'Kể tên một cầu thủ bóng đá đang thi đấu hoặc vừa giải nghệ',s:['cauthu'],k:'Florian Wirtz',t:[
'Cristiano Ronaldo|Ronaldo, Lionel Messi|Messi, Neymar',
'Kylian Mbappé|Mbappé, Erling Haaland|Haaland, Lamine Yamal|Yamal, Mohamed Salah|Salah, Harry Kane, Vinícius Júnior|Vinícius, Kevin De Bruyne, Luka Modrić|Modrić',
'Jude Bellingham, Robert Lewandowski, Son Heung-min|Son, Bukayo Saka, Rodri, Pedri, Bruno Fernandes, Virgil van Dijk, Antoine Griezmann, Karim Benzema, Marcus Rashford, Phil Foden, Cole Palmer, Martin Ødegaard, Declan Rice, Rafael Leão',
'Federico Valverde, Toni Kroos, Thomas Müller, Manuel Neuer, Thibaut Courtois, Alisson, Ederson, Trent Alexander-Arnold, Joshua Kimmich, Jamal Musiala, Victor Osimhen, Lautaro Martínez, Julián Álvarez, Ousmane Dembélé, Achraf Hakimi, Kvicha Kvaratskhelia, Bernardo Silva, Gavi, Nico Williams, Raphinha',
'Michael Olise, Pau Cubarsí, Rodrygo, Dani Olmo, Alexander Isak, Viktor Gyökeres, Khvicha, João Neves, Vitinha, Nuno Mendes, William Saliba, Alessandro Bastoni, Nicolò Barella, Granit Xhaka, Martin Zubimendi, Dean Huijsen, Ferran Torres, Unai Simón']},
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
{id:'r-dt-wc2026',until:'2027-06-30',c:'Thể thao',q:'Kể tên một đội tuyển dự vòng chung kết World Cup 2026',s:['doi','doituyen'],k:'Curaçao',t:[
'Brazil, Argentina, Tây Ban Nha',
'Pháp, Đức, Anh, Bồ Đào Nha, Mỹ, Nhật Bản, Hàn Quốc',
'Hà Lan, Bỉ, Croatia, Mexico, Canada, Uruguay, Colombia, Maroc, Úc, Ả Rập Xê Út, Iran, Qatar, Senegal',
'Thụy Sĩ, Na Uy, Thụy Điển, Áo, Scotland, Séc|Cộng hòa Séc, Thổ Nhĩ Kỳ, Bosnia và Herzegovina, Ecuador, Paraguay, Ai Cập, Algeria, Tunisia, Bờ Biển Ngà, Ghana, Nam Phi, Uzbekistan, Jordan, Iraq, New Zealand',
'Cape Verde|Cabo Verde, Haiti, Panama, CHDC Congo|Congo']},
{id:'r-tp-wc2026',until:'2027-06-30',c:'Thể thao',q:'Kể tên một thành phố đăng cai trận đấu tại World Cup 2026',s:['thanhpho','tp'],k:'Guadalajara',t:[
'New York|New Jersey, Los Angeles, Miami',
'Toronto, Vancouver, Mexico City, Dallas, Boston',
'Atlanta, Houston, Seattle, San Francisco, Philadelphia',
'Kansas City, Monterrey',
'']},
{id:'r-olympic-dong',c:'Thể thao',q:'Kể tên một môn thi đấu ở Thế vận hội mùa đông',s:['mon'],k:'Skeleton',t:[
'Trượt tuyết, Trượt băng',
'Trượt băng nghệ thuật, Khúc côn cầu trên băng, Trượt ván tuyết|Snowboard',
'Trượt tuyết đổ đèo, Trượt tuyết băng đồng, Nhảy cầu trượt tuyết, Bobsleigh|Xe trượt lòng máng, Curling, Trượt băng tốc độ',
'Luge, Hai môn phối hợp|Biathlon, Trượt tuyết tự do, Trượt băng tốc độ cự ly ngắn, Kết hợp Bắc Âu, Trượt tuyết leo núi',
'']},
{id:'r-thanh-pho-asiad',until:'2027-10-31',c:'Thể thao',q:'Kể tên một thành phố từng đăng cai Đại hội Thể thao châu Á (ASIAD)',s:['thanhpho','tp'],k:'Hiroshima',t:[
'Bắc Kinh, Hàng Châu, Tokyo',
'Bangkok, Jakarta, Quảng Châu, Incheon, Busan, Seoul, Doha, Nagoya|Aichi-Nagoya',
'New Delhi, Manila, Tehran, Palembang',
'',
'']},
];
