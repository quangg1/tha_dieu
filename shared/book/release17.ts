// Release set, part 17 (October 2026): replaces four timely prompts that were removed for being too small, and adds
// hard (lv:3) questions where the book is thinnest. Each prompt is finite with a real rare tail, per docs/cau-da-go.md.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE17: ReleaseQuestion[] = [
// ---------------------------------------------------------------- A. bản mở rộng của câu thời sự đã gỡ
// thay r-dt-wc2026: mở rộng từ "đội dự World Cup 2026" sang mọi đội từng dự vòng chung kết World Cup nam (80+ đội, kể cả đã giải thể)
{id:'r-wc-tung-du',c:'Thể thao',q:'Kể tên một đội tuyển từng dự vòng chung kết World Cup bóng đá nam',n:'Mọi kỳ World Cup từ 1930, tính cả các nước nay đã giải thể.',s:['doi','doutuyen','dt'],k:'Haiti',until:'2027-06-30',t:[
'Brazil, Argentina, Đức|Tây Đức, Pháp, Anh',
'Ý|Italia, Tây Ban Nha, Hà Lan, Bồ Đào Nha, Bỉ, Croatia, Uruguay, Mexico, Nhật Bản, Hàn Quốc, Mỹ',
'Thụy Sĩ, Thụy Điển, Đan Mạch, Ba Lan, Nga|Liên Xô, Serbia|Nam Tư, Nigeria, Cameroon, Ghana, Senegal, Úc, Costa Rica, Colombia, Chile, Paraguay, Ecuador, Ả Rập Xê Út, Iran, Morocco|Ma-rốc',
'Áo, Scotland, Cộng hòa Ireland, Bắc Ireland, Wales, CH Séc|Tiệp Khắc, Hungary, Hy Lạp, Thổ Nhĩ Kỳ, Ukraine, Slovakia, Slovenia, Bulgaria, Romania, Na Uy, Peru, Bolivia, Tunisia, Algeria, Ai Cập, Bờ Biển Ngà, Nam Phi, Honduras, Panama, Canada, Jamaica, Trinidad và Tobago, Trung Quốc, Triều Tiên, Ả Rập Thống nhất|UAE',
'Đông Đức, Zaire, Cuba, El Salvador, Iraq, Kuwait, Indonesia|Đông Ấn Hà Lan, Togo, Angola, New Zealand, Qatar, Israel']},
// thay r-tp-wc2026: thành phố từng đăng cai trận World Cup, mọi kỳ giải
{id:'r-wc-tp-dang-cai',c:'Thể thao',q:'Kể tên một thành phố từng đăng cai trận đấu World Cup bóng đá nam',n:'Mọi kỳ World Cup, tính cả các thành phố chủ nhà xa xưa.',s:['thanhpho','tp'],k:'Cordoba',until:'2027-06-30',t:[
'Paris, London|Luân Đôn, Berlin, Rio de Janeiro|Rio, Tokyo',
'Madrid, Barcelona, Roma|Rome, Munich, Moscow|Mát-xcơ-va, Seoul, Mexico City, Buenos Aires, Doha, Los Angeles, New York',
'Milan, Turin|Torino, Napoli, Sevilla, Marseille, Lyon, Hamburg, Stuttgart, Dortmund, Johannesburg, Cape Town, Durban, Sao Paulo, Belo Horizonte, Nizhny Novgorod, Saint Petersburg, Kazan, Guadalajara, Monterrey, Dallas, Houston, Miami, Atlanta, Toronto, Vancouver',
'Montevideo, Bern|Berne, Zurich, Basel, Geneva, Lausanne, Stockholm, Gothenburg, Malmo, Montpellier, Toulouse, Nantes, Bordeaux, Saint-Etienne, Lens, Gelsenkirchen, Leipzig, Hannover, Nuremberg, Kaiserslautern, Frankfurt, Cologne|Koln, Bari, Bologna, Florence|Firenze, Genoa|Genova, Verona, Udine, Palermo, Cagliari',
'Rosario, Mendoza, Mar del Plata, Vina del Mar, Antofagasta, Arica, Guayaquil, Ciudad Juarez, Puebla, Leon, Toluca, Queretaro, Yokohama, Saitama, Osaka, Sapporo, Niigata, Daegu, Busan, Incheon, Ulsan, Jeonju, Suwon, Volgograd, Samara, Rostov, Sochi, Yekaterinburg, Saransk, Kaliningrad']},
// thay r-phim-viet-moi: phim điện ảnh Việt chiếu rạp 2023+
{id:'r-phim-viet-23',c:'Điện ảnh',q:'Kể tên một phim điện ảnh Việt Nam chiếu rạp từ năm 2023 đến nay',s:['phim'],k:'Trên Bàn Nhậu Dưới Bàn Mưu',until:'2027-06-30',t:[
'Mai, Nhà Bà Nữ, Lật Mặt 6|Lật Mặt 6 Tấm Vé Định Mệnh, Đất Rừng Phương Nam',
'Lật Mặt 7|Lật Mặt 7 Một Điều Ước, Cái Giá Của Hạnh Phúc, Quỷ Cẩu, Gặp Lại Chị Bầu, Làm Giàu Với Ma, Móng Vuốt, Cám',
'Đào Phở Và Piano, Kẻ Ăn Hồn, Người Vợ Cuối Cùng, Fanti, Hồng Hà Nữ Sĩ, B4S Trước Giờ Yêu, Chị Chị Em Em 2, Siêu Lừa Gặp Siêu Lầy, Live Sống Trọn Từng Giây, Mến Gái Miền Tây',
'Bên Trong Vỏ Kén Vàng, Tro Tàn Rực Rỡ, Culi Không Bao Giờ Khóc, Mùa Hè Đẹp Nhất, Kẻ Ẩn Danh, Công Tử Bạc Liêu, Linh Miêu|Linh Miêu Quỷ Nhập Tràng, Hai Muối',
'Biệt Đội Hót Girl, Người Mặt Trời, Quỷ Môn Quan, Domino Lối Thoát Cuối Cùng, Thám Tử Kiên|Thám Tử Kiên Kỳ Án Không Đầu']},
// thay r-thanh-pho-asiad: thành phố đăng cai ASIAD hoặc SEA Games
{id:'r-tp-asiad-seagames',c:'Thể thao',q:'Kể tên một thành phố từng đăng cai Đại hội Thể thao châu Á (ASIAD) hoặc SEA Games',s:['thanhpho','tp'],k:'Nakhon Ratchasima',until:'2027-10-31',t:[
'Bangkok, Jakarta, Hà Nội, Singapore',
'Quảng Châu, Bắc Kinh, Seoul, Hàng Châu, Kuala Lumpur, Manila, Hồ Chí Minh|Sài Gòn',
'Tokyo, Hiroshima, Busan, Doha, Incheon, Tehran, New Delhi, Chiang Mai, Naypyidaw, Vientiane, Phnom Penh, Bandar Seri Begawan, Palembang',
'Nagoya, Aichi, Jakarta-Palembang, Pattaya, Korat, Songkhla, Legazpi, Bacolod, Clark, Subic, Fukuoka, Chonburi',
'Pochentong, Bandung, Medan, Chiang Rai, Bukit Jalil, Rizal, Los Banos, Tagaytay, New Clark City']},
// ---------------------------------------------------------------- B. câu khó (lv:3): đầu phổ biến, đuôi cần hiểu biết sâu
{id:'r-nhac-si-co-dien',lv:3,c:'Âm nhạc',q:'Kể tên một nhà soạn nhạc cổ điển',s:[],k:'Erik Satie|Satie',t:[
'Beethoven, Mozart, Bach|Johann Sebastian Bach, Chopin|Sô-panh',
'Tchaikovsky|Trai-cốp-xki, Vivaldi, Schubert, Handel, Haydn, Brahms',
'Liszt, Wagner, Verdi, Debussy, Rachmaninoff|Rachmaninov, Mendelssohn, Schumann, Dvořák|Dvorak, Grieg, Ravel',
'Mahler, Sibelius, Puccini, Rossini, Bizet, Shostakovich|Sô-xta-cô-vích, Prokofiev, Stravinsky, Saint-Saëns, Berlioz, Bruckner, Elgar',
'Palestrina, Monteverdi, Scarlatti, Telemann, Gluck, Hindemith, Bartók|Bartok, Janáček|Janacek, Smetana, Fauré|Faure, Poulenc, Messiaen']},
{id:'r-than-la-ma',lv:3,c:'Văn hóa',q:'Kể tên một vị thần trong thần thoại La Mã',s:['than','thanthoai'],k:'Janus|Thần Janus',t:[
'Jupiter|Zeus La Mã, Venus|Nữ thần tình yêu, Mars|Thần chiến tranh, Neptune|Thần biển',
'Pluto|Diêm vương, Mercury|Thần đưa tin, Apollo, Diana|Nữ thần săn bắn, Minerva|Nữ thần trí tuệ, Juno',
'Vulcan|Thần lửa, Bacchus|Thần rượu nho, Ceres|Nữ thần mùa màng, Saturn|Thần nông nghiệp, Cupid|Thần tình ái, Vesta, Proserpina',
'Fortuna|Nữ thần may mắn, Bellona|Nữ thần chiến tranh, Faunus, Terminus, Aurora|Nữ thần bình minh, Sol|Thần mặt trời, Luna|Nữ thần mặt trăng',
'Quirinus, Pomona, Flora|Nữ thần hoa, Feronia, Portunus, Consus, Vertumnus, Picus']},
{id:'r-nobel-hoa-binh',lv:3,c:'Lịch sử',q:'Kể tên một người hoặc tổ chức từng đoạt giải Nobel Hòa bình',s:[],k:'Ralph Bunche',t:[
'Nelson Mandela|Mandela, Barack Obama|Obama, Mẹ Teresa|Mother Teresa, Martin Luther King',
'Malala Yousafzai|Malala, Dalai Lama|Đạt Lai Lạt Ma, Mikhail Gorbachev|Gorbachev, Jimmy Carter, Liên Hợp Quốc|UN, Chữ thập đỏ|Hội Chữ thập đỏ quốc tế',
'Lê Đức Thọ, Henry Kissinger|Kissinger, Yasser Arafat|Arafat, Yitzhak Rabin, Woodrow Wilson, Theodore Roosevelt, Albert Schweitzer, Aung San Suu Kyi, Kofi Annan, Al Gore',
'Willy Brandt, Desmond Tutu, Shimon Peres, Wangari Maathai, Liu Xiaobo|Lưu Hiểu Ba, Shirin Ebadi, Muhammad Yunus, Juan Manuel Santos, Denis Mukwege, Abiy Ahmed',
'Dag Hammarskjöld, Norman Borlaug, Betty Williams, Carlos Belo, Ellen Johnson Sirleaf, Leymah Gbowee, Nadia Murad, Maria Ressa, Narges Mohammadi']},
{id:'r-nha-vat-ly',lv:3,c:'Khoa học',q:'Kể tên một nhà vật lý nổi tiếng trong lịch sử',s:[],k:'Paul Dirac|Dirac',t:[
'Albert Einstein|Einstein, Isaac Newton|Newton, Stephen Hawking|Hawking, Galileo',
'Nikola Tesla|Tesla, Niels Bohr|Bohr, Marie Curie|Curie, Max Planck|Planck, Richard Feynman|Feynman, Enrico Fermi|Fermi',
'Erwin Schrödinger|Schrodinger, Werner Heisenberg|Heisenberg, James Clerk Maxwell|Maxwell, Michael Faraday|Faraday, Ernest Rutherford|Rutherford, Wolfgang Pauli|Pauli, Louis de Broglie, Robert Oppenheimer|Oppenheimer',
'Max Born, Arnold Sommerfeld, Hendrik Lorentz|Lorentz, Ludwig Boltzmann|Boltzmann, Satyendra Bose|Bose, Lise Meitner|Meitner, Chien-Shiung Wu|Ngô Kiện Hùng, Freeman Dyson, Murray Gell-Mann, John Bardeen',
'Paul Ehrenfest, Subrahmanyan Chandrasekhar|Chandrasekhar, Hideki Yukawa|Yukawa, Julian Schwinger, Sin-Itiro Tomonaga, George Gamow, Hans Bethe, Peter Higgs']},
{id:'r-khoang-vat',lv:3,c:'Khoa học',q:'Kể tên một loại khoáng vật',s:['khoang','da'],k:'Olivin|Peridot',t:[
'Thạch anh|Quartz, Kim cương, Vàng, Muối mỏ|Halit',
'Canxit|Calcite, Thạch cao|Gypsum, Mica, Fenspat|Feldspar, Graphit|Than chì, Pyrit|Vàng của kẻ ngốc',
'Hematit, Magnetit|Quặng từ, Bauxit, Malachit, Fluorit, Corundum|Corindon, Topaz|Hoàng ngọc, Beryl, Garnet|Ngọc hồng lựu, Turmalin',
'Apatit, Barit, Galen|Galena, Sphalerit, Chalcopyrit, Casiterit, Wolframit, Rutil, Zircon, Spinel, Azurit, Lưu huỳnh',
'Kyanit, Staurolit, Epidot, Diopside, Augit, Hornblend, Muscovit, Biotit, Dolomit, Siderit, Cinnabar|Chu sa']},
{id:'r-trieu-dai-chau-au',lv:3,c:'Lịch sử',q:'Kể tên một vương triều hoặc hoàng tộc ở châu Âu',s:['nha','trieu','vuongtrieu'],k:'Nhà Jagiellon',t:[
'Nhà Tudor, Nhà Habsburg, Nhà Bourbon, Nhà Windsor',
'Nhà Romanov, Nhà Valois, Nhà Stuart, Nhà Plantagenet, Nhà Hohenzollern, Nhà Medici',
'Nhà Capet, Nhà Carolingien, Nhà Merovingien, Nhà Savoy, Nhà Wittelsbach, Nhà Hannover, Nhà Welf, Nhà Hohenstaufen',
'Nhà Trastámara, Nhà Braganza, Nhà Oldenburg, Nhà Vasa, Nhà Piast, Nhà Árpád, Nhà Lancaster, Nhà York, Nhà Angevin',
'Nhà Przemyslid, Nhà Rurik, Nhà Nassau, Nhà Grimaldi, Nhà Obrenović, Nhà Karađorđević, Nhà Zähringen']},
{id:'r-dan-toc-the-gioi',lv:3,c:'Thế giới',q:'Kể tên một dân tộc hoặc tộc người trên thế giới (không phải quốc tịch)',s:['nguoi','toc'],k:'Người Sami',t:[
'Người Hán, Người Kurd, Người Do Thái|Người Jew, Người Digan|Người Roma',
'Người Maori, Người Aztec, Người Inca, Người Maya, Người Mông Cổ, Người Berber',
'Người Zulu, Người Maasai, Người Ainu, Người Tatar, Người Duy Ngô Nhĩ|Người Uyghur, Người Tây Tạng|Người Tạng, Người Pashtun, Người Bantu',
'Người Inuit, Người Aboriginal|Thổ dân Úc, Người Quechua, Người Guarani, Người Hmong, Người Tuareg, Người Yoruba, Người Igbo, Người Hausa',
'Người Chechnya, Người Basque, Người Catalan, Người Wolof, Người Fulani, Người Dinka, Người Oromo, Người Dayak, Người Papua, Người Nenets']},
{id:'r-hop-chat',lv:3,c:'Khoa học',q:'Kể tên một hợp chất hóa học',s:['chat','hopchat'],k:'Etylen glycol',t:[
'Nước|H2O, Muối ăn|Natri clorua|NaCl, Đường|Sucrose, Khí CO2|Carbon dioxide',
'Amoniac|NH3, Axit sulfuric|H2SO4, Axit clohydric|HCl, Baking soda|Natri bicarbonat, Vôi tôi|Canxi hidroxit, Cồn|Etanol',
'Axit axetic|Giấm, Glucose, Metan|CH4, Natri hidroxit|Xút|NaOH, Canxi cacbonat|CaCO3, Hydro peroxit|Oxy già, Axit nitric|HNO3, Amoni nitrat',
'Benzen, Toluen, Axeton, Formaldehyde, Axit citric, Axit lactic, Ure, Glycerol, Natri cacbonat|Soda, Kali nitrat|Diêm tiêu',
'Etylen, Phenol, Anilin, Axit oxalic, Axit boric, Magie sulfat|Muối Epsom, Natri thiosulfat, Canxi cacbua|Đất đèn, Silic dioxit, Natri hypoclorit']},
{id:'r-vua-anh',lv:3,c:'Lịch sử',q:'Kể tên một vị vua hoặc nữ hoàng của nước Anh',s:['vua','nuhoang'],k:'Æthelstan|Athelstan',t:[
'Elizabeth II, Henry VIII, Victoria|Nữ hoàng Victoria, Charles III',
'Elizabeth I, George VI, Edward VIII, James I, Richard I|Richard Sư Tử Tâm, William I|William Chinh phục',
'Henry V, Henry II, Edward I, Edward III, Richard III, Mary I|Bloody Mary, Anne|Nữ hoàng Anne, George III, George V, Charles I',
'Stephen, John|Vua John, Henry I, Henry III, Edward II, Edward IV, Henry IV, Henry VI, Henry VII, James II, William III, George I, George II, George IV, William IV, Edward VII',
'Æthelred|Ethelred, Edgar, Edmund, Eadred, Eadwig, Cnut|Canute, Harold II, Edward Xưng tội|Edward the Confessor, Matilda']},
{id:'r-ngon-ngu-co',lv:3,c:'Ngôn ngữ',q:'Kể tên một ngôn ngữ cổ hoặc ngôn ngữ đã mai một',s:['tieng','ngonngu'],k:'Tiếng Tocharia',t:[
'Tiếng Latinh|Latin, Tiếng Phạn|Sanskrit, Tiếng Hy Lạp cổ, Tiếng Hán cổ|Văn ngôn',
'Tiếng Ai Cập cổ, Tiếng Sumer, Tiếng Aramaic|A-ram, Tiếng Do Thái cổ|Hebrew cổ, Tiếng Gothic, Tiếng Nôm|Chữ Nôm',
'Tiếng Akkad, Tiếng Babylon, Tiếng Phoenicia, Tiếng Etruscan, Tiếng Celt cổ|Gaulish, Tiếng Bắc Âu cổ|Old Norse, Tiếng Anh cổ, Tiếng Ba Tư cổ, Tiếng Coptic',
'Tiếng Hittite, Tiếng Avesta, Tiếng Pali, Tiếng Prakrit, Tiếng Oscan, Tiếng Umbria, Tiếng Illyria, Tiếng Thracia, Tiếng Dalmatia',
'Tiếng Elam, Tiếng Hurria, Tiếng Urartu, Tiếng Lydia, Tiếng Lycia, Tiếng Phrygia, Tiếng Venetic, Tiếng Cornwall cổ, Tiếng Manx, Tiếng Ugaritic']},
];
