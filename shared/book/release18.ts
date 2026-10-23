// Release set, part 18 (October 2026): a batch of hard (lv:3) questions to fill the thin level-3 pool. Each is finite
// with a popular head and a rare tail that takes real knowledge, per docs/cau-da-go.md.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE18: ReleaseQuestion[] = [
{id:'r-hoang-de-la-ma',lv:3,c:'Lịch sử',q:'Kể tên một hoàng đế La Mã',s:[],k:'Diocletianus|Diocletian',t:[
'Julius Caesar|Caesar, Augustus, Nero, Constantine|Constantinus',
'Caligula, Marcus Aurelius, Trajan|Trajanus, Hadrian|Hadrianus, Tiberius, Claudius',
'Vespasianus, Titus, Domitianus, Nerva, Antoninus Pius, Commodus, Septimius Severus, Caracalla, Pertinax',
'Galba, Otho, Vitellius, Vespasian, Valerianus, Aurelianus, Maximian, Theodosius, Honorius, Justinianus',
'Elagabalus, Macrinus, Pupienus, Balbinus, Gordianus, Philippus Arabs, Decius, Gallienus, Numerianus, Carinus']},
{id:'r-triet-gia',lv:3,c:'Khoa học',q:'Kể tên một nhà triết học phương Tây',s:['nha'],k:'Spinoza|Baruch Spinoza',t:[
'Socrates|Xô-crát, Plato|Platon, Aristotle|Aristốt, Nietzsche',
'Descartes|Đề-các, Kant|Immanuel Kant, Marx|Karl Marx, Hegel, Locke|John Locke, Hume|David Hume',
'Rousseau, Voltaire, Leibniz, Schopenhauer, Sartre|Jean-Paul Sartre, Camus, Heidegger, Wittgenstein, Russell|Bertrand Russell, Foucault',
'Epicurus|Epicure, Pythagoras|Pitago, Heraclitus, Parmenides, Democritus, Diogenes, Thomas Aquinas|Aquinas, Augustine|Thánh Augustine, Machiavelli, Bacon|Francis Bacon',
'Thales, Anaximander, Zeno, Plotinus, Boethius, Occam|William xứ Ockham, Kierkegaard, Husserl, Derrida, Habermas, Rawls|John Rawls']},
{id:'r-giao-hoang',lv:3,c:'Văn hóa',q:'Kể tên một vị Giáo hoàng của Giáo hội Công giáo',s:['giaohoang'],k:'Giáo hoàng Urban II',t:[
'Phanxicô|Francis, Benedict XVI|Biển Đức XVI, Gioan Phaolô II|John Paul II, Leo XIV',
'Gioan Phaolô I|John Paul I, Phaolô VI|Paul VI, Gioan XXIII|John XXIII, Piô XII|Pius XII, Phêrô|Thánh Phêrô|Peter',
'Grêgôriô I|Gregory Cả, Leo I|Lêô Cả, Innôcentê III|Innocent III, Urban II, Alexander VI, Julius II, Clement VII, Pius IX',
'Sylvester I, Gelasius I, Nicholas I, Boniface VIII, Celestine V, Sixtus IV, Leo X, Paul III, Pius V, Benedict XIV',
'Hormisdas, Vigilius, Honorius I, Formosus, Stephen VI, Sergius III, Benedict IX, Gregory VII, Callixtus II, Adrian IV']},
{id:'r-eo-bien',lv:3,c:'Thế giới',q:'Kể tên một eo biển trên thế giới',s:['eo','eobien'],k:'Eo biển Hormuz|Hormuz',t:[
'Eo biển Malacca|Malacca, Eo biển Gibraltar|Gibraltar, Eo biển Manche|Eo biển Anh|English Channel, Eo biển Bering',
'Eo biển Bosphorus|Bosporus, Eo biển Đài Loan, Eo biển Dardanelles, Eo biển Magellan, Eo biển Sunda',
'Eo biển Messina, Eo biển Dover, Eo biển Ba Sĩ|Luzon, Eo biển Johor, Eo biển Palk, Eo biển Davis, Eo biển Cook, Eo biển Torres',
'Eo biển Skagerrak, Eo biển Kattegat, Eo biển Øresund, Eo biển Kerch, Eo biển Tsugaru, Eo biển Soya|La Pérouse, Eo biển Makassar, Eo biển Lombok, Eo biển Bab-el-Mandeb',
'Eo biển Drake, Eo biển Denmark, Eo biển Fram, Eo biển Juan de Fuca, Eo biển Cabot, Eo biển Foveaux, Eo biển Bass, Eo biển Yucatan, Eo biển Otranto, Eo biển Kerkennah']},
{id:'r-xuong-nguoi',lv:3,c:'Khoa học',q:'Kể tên một chiếc xương trong cơ thể người',s:['xuong'],k:'Xương chũm',t:[
'Xương sọ, Xương sườn, Xương sống|Cột sống, Xương đùi',
'Xương bả vai, Xương quai xanh|Xương đòn, Xương chậu, Xương bánh chè, Xương ống chân|Xương chày, Xương cánh tay',
'Xương cẳng tay|Xương quay, Xương trụ, Xương mác, Xương gót, Xương cổ tay, Xương bàn tay, Xương ngón tay, Xương ức, Xương hàm',
'Xương thái dương, Xương chẩm, Xương gò má, Xương mũi, Xương móng, Xương cùng, Xương cụt, Xương đốt sống cổ, Xương sên, Xương thuyền',
'Xương bướm, Xương sàng, Xương lá mía, Xương lệ, Xương búa, Xương đe, Xương bàn đạp, Xương mu, Xương ngồi, Xương đậu']},
{id:'r-ve-tinh-mocthe',lv:3,c:'Vũ trụ',q:'Kể tên một vệ tinh tự nhiên của Sao Mộc hoặc Sao Thổ',s:['vetinh','mattrang'],k:'Mimas',t:[
'Mặt Trăng Europa|Europa, Io, Ganymede, Titan',
'Callisto, Enceladus, Rhea, Iapetus, Dione, Tethys',
'Amalthea, Thebe, Metis, Adrastea, Himalia, Hyperion, Phoebe, Pan, Prometheus',
'Pandora, Janus, Epimetheus, Atlas, Telesto, Calypso, Helene, Elara, Carme',
'Pasiphae, Sinope, Lysithea, Ananke, Leda, Daphnis, Methone, Pallene, Aegaeon, Ymir']},
{id:'r-ho-thuc-vat',lv:3,c:'Thực vật',q:'Kể tên một họ thực vật',s:['ho'],k:'Họ Dâu tằm',t:[
'Họ Hoa hồng, Họ Lúa, Họ Đậu, Họ Cúc',
'Họ Cà, Họ Bầu bí, Họ Cam quýt, Họ Hoa môi|Họ Bạc hà, Họ Cải, Họ Hoa tán',
'Họ Long não, Họ Sim, Họ Bông, Họ Thầu dầu, Họ Trúc đào, Họ Rau dền, Họ Bìm bìm, Họ Cói, Họ Gừng',
'Họ Mộc lan, Họ Na, Họ Trôm, Họ Côm, Họ Dầu, Họ Xoan, Họ Bồ hòn, Họ Măng cụt, Họ Ngũ gia bì, Họ Tiết dê',
'Họ Hồ đào, Họ Dẻ, Họ Du, Họ Thủy tiên, Họ Lan, Họ Gai, Họ Rau răm, Họ Bông tai, Họ Nắp ấm, Họ Lạc tiên']},
{id:'r-linh-truong',lv:3,c:'Động vật',q:'Kể tên một loài linh trưởng (khỉ, vượn, vượn người)',s:['con','loai'],k:'Khỉ Vervet',t:[
'Khỉ, Tinh tinh|Chimpanzee, Khỉ đột|Gorilla, Đười ươi|Orangutan',
'Vượn|Gibbon, Vượn cáo|Lemur, Khỉ đầu chó|Baboon, Khỉ sóc, Bonobo, Voọc',
'Khỉ nhện, Khỉ rú, Khỉ mũi dài, Khỉ Nhật Bản, Khỉ Rhesus, Cu li, Khỉ mặt chó|Mandrill, Tarsier|Khỉ lùn, Marmoset, Tamarin',
'Vượn cáo đuôi vòng, Indri, Sifaka, Aye-aye, Khỉ Capuchin, Khỉ Colobus, Khỉ Langur, Khỉ Patas, Galago|Khỉ bụi, Khỉ Gelada',
'Voọc chà vá chân nâu, Voọc mũi hếch, Voọc Cát Bà, Khỉ Uakari, Khỉ Titi, Khỉ Saki, Khỉ Douc, Potto, Loris mảnh, Tamarin sư tử vàng']},
{id:'r-nguyen-to-kim-loai',lv:3,c:'Khoa học',q:'Kể tên một kim loại trong bảng tuần hoàn',n:'Chỉ tính nguyên tố kim loại, không tính hợp kim như thép hay đồng thau.',s:['kimloai'],k:'Vanadi|Vanadium',t:[
'Sắt|Fe, Vàng|Au, Bạc|Ag, Đồng|Cu, Nhôm|Al',
'Kẽm|Zn, Chì|Pb, Thiếc|Sn, Niken|Ni, Thủy ngân|Hg, Platin|Bạch kim|Pt, Titan|Ti',
'Crom|Cr, Mangan|Mn, Coban|Co, Wolfram|Vonfram|W, Natri|Na, Kali|K, Canxi|Ca, Magie|Mg, Liti|Li, Urani|U',
'Bari|Ba, Stronti|Sr, Rubidi|Rb, Cesi|Cs, Zirconi|Zr, Niobi|Nb, Molypden|Mo, Paladi|Pd, Iridi|Ir, Osmi|Os, Rheni|Re',
'Gali|Ga, Indi|In, Tali|Tl, Berili|Be, Scandi|Sc, Yttri|Y, Hafni|Hf, Tantali|Ta, Rutheni|Ru, Rhodi|Rh, Techneti|Tc']},
{id:'r-dinh-ly-toan',lv:3,c:'Khoa học',q:'Kể tên một định lý hoặc bổ đề toán học',s:['dinhly'],k:'Định lý Desargues',t:[
'Định lý Pythagoras|Pytago, Định lý Thales|Ta-lét, Định lý Vi-ét|Viète, Định lý Fermat lớn',
'Định lý Euclid, Định lý Euler, Định lý Lagrange, Định lý Rolle, Định lý Bezout, Định lý nhị thức',
'Định lý Ceva, Định lý Menelaus, Định lý Ptolemy, Định lý cosin, Định lý sin, Định lý Bayes, Định lý giới hạn trung tâm, Định lý Bolzano, Định lý Cauchy, Định lý Stokes',
'Định lý Gauss, Định lý Green, Định lý Wilson, Định lý số nguyên tố, Định lý Cantor, Định lý Gödel, Định lý điểm bất động Brouwer, Định lý Zorn, Bổ đề Zorn, Định lý Pick',
'Định lý Ramsey, Định lý Sylow, Định lý Fubini, Định lý Hahn-Banach, Định lý Stone-Weierstrass, Định lý Baire, Định lý Noether, Định lý Riemann-Roch, Bổ đề Itô, Định lý Arzelà-Ascoli']},
{id:'r-chom-sao-hoang-dao',lv:3,c:'Vũ trụ',q:'Kể tên một chòm sao trên bầu trời',n:'Cả 88 chòm sao hiện đại, không chỉ 12 cung hoàng đạo.',s:['chomsao','chom'],k:'Chòm Thiên Hậu Toà|Reticulum',t:[
'Thiên Yết|Bọ Cạp|Scorpius, Sư Tử|Leo, Song Tử|Gemini, Bạch Dương|Aries',
'Đại Hùng|Gấu Lớn|Ursa Major, Tiểu Hùng|Gấu Nhỏ|Ursa Minor, Lạp Hộ|Thợ Săn|Orion, Thiên Bình|Libra, Kim Ngưu|Taurus, Xử Nữ|Virgo',
'Nhân Mã|Sagittarius, Ma Kết|Capricornus, Bảo Bình|Aquarius, Song Ngư|Pisces, Cự Giải|Cancer, Tiên Nữ|Andromeda, Phi Mã|Pegasus, Thiên Nga|Cygnus, Đại Khuyển|Canis Major',
'Tiên Hậu|Cassiopeia, Anh Tiên|Perseus, Thiên Ưng|Aquila, Thiên Cầm|Lyra, Trường Xà|Hydra, Cự Xà|Serpens, Vũ Tiên|Hercules, Ngự Phu|Auriga, Mục Phu|Boötes, Thiên Long|Draco',
'Hội Giá|Carina, Thuyền Để|Puppis, Thuyền Phàm|Vela, Nam Thập Tự|Crux, Ba Giang|Eridanus, Thiên Thố|Lepus, Độc Giác|Monoceros, Kỳ Lân, Hồ Ly|Vulpecula, Thiên Miêu|Lynx']},
{id:'r-nhac-cu-hoi',lv:3,c:'Âm nhạc',q:'Kể tên một nhạc cụ bộ hơi (thổi)',s:['dan','nhaccu','ken'],k:'Kèn Nadaswaram',t:[
'Sáo|Flute, Kèn saxophone|Saxophone, Kèn trumpet|Trumpet, Harmonica|Khẩu cầm',
'Clarinet|Kèn clarinet, Kèn trombone, Kèn tuba, Kèn cor|French horn, Sáo recorder, Kèn túi|Bagpipe',
'Oboe|Kèn ô-boa, Bassoon|Kèn fagot, Piccolo|Sáo piccolo, Cornet, Flugelhorn, Euphonium, Kèn sừng, Didgeridoo, Khèn, Sáo trúc',
'Cor anglais|English horn, Bass clarinet, Contrabassoon, Sousaphone, Ocarina, Pan flute|Sáo Pan, Shakuhachi, Dizi, Bansuri, Duduk',
'Heckelphone, Basset horn, Wagner tuba, Serpent, Ophicleide, Crumhorn, Shawm, Zurna, Sheng, Suona']},
{id:'r-benh-than-kinh',lv:3,c:'Khoa học',q:'Kể tên một bệnh về thần kinh hoặc não bộ',s:['benh'],k:'Hội chứng Capgras',t:[
'Đột quỵ|Tai biến, Động kinh, Alzheimer|Bệnh Alzheimer, Parkinson|Bệnh Parkinson',
'Trầm cảm, Tự kỷ|Rối loạn phổ tự kỷ, Sa sút trí tuệ|Mất trí nhớ, Viêm màng não, Đau nửa đầu|Migraine, Rối loạn lưỡng cực',
'Đa xơ cứng|Xơ cứng rải rác, Bại não, Thoái hóa thần kinh, Mất ngủ kinh niên, Rối loạn ám ảnh cưỡng chế|OCD, U não, Viêm não, Tâm thần phân liệt, Liệt mặt, Hội chứng Tourette',
'Bệnh Huntington, Xơ cứng teo cơ|ALS, Hội chứng Guillain-Barré, Bệnh nhược cơ, Loạn dưỡng cơ, Chứng ngủ rũ|Narcolepsy, Hội chứng chân không yên, Mất ngôn ngữ, Chứng mất nhận thức, Động kinh thùy thái dương',
'Bệnh Creutzfeldt-Jakob, Hội chứng Korsakoff, Bệnh Pick, Chứng múa giật, Loạn trương lực cơ, Hội chứng Rett, Bệnh Niemann-Pick, Hội chứng locked-in, Ataxia Friedreich, Bệnh Kuru']},
{id:'r-hiep-uoc',lv:3,c:'Lịch sử',q:'Kể tên một hiệp ước hoặc hòa ước nổi tiếng trong lịch sử',s:['hiepuoc','hoauoc'],k:'Hiệp ước Zaragoza',t:[
'Hiệp ước Versailles|Hòa ước Versailles, Hiệp định Genève|Hiệp định Giơ-ne-vơ, Hiệp định Paris, Hiệp ước Nguyên tử|Hiệp ước cấm thử hạt nhân',
'Hòa ước Westphalia, Hiệp ước Maastricht, Hiệp ước Kyoto|Nghị định thư Kyoto, Hiệp định Paris về khí hậu, Hiệp ước Schengen, Hiệp ước Rome',
'Hiệp ước Tordesillas, Hòa ước Utrecht, Hiệp ước Tilsit, Hiệp ước Nam Kinh, Hiệp ước Portsmouth, Hiệp ước Brest-Litovsk, Hiệp ước Lausanne, Hiệp ước Trianon, Hiệp ước Saint-Germain, Hiệp ước Nhâm Tuất',
'Hòa ước Augsburg, Hiệp ước Nerchinsk, Hiệp ước Aix-la-Chapelle, Hiệp ước Paris 1783, Hiệp ước Ghent, Hiệp ước Guadalupe Hidalgo, Hiệp ước Shimonoseki, Hiệp ước Rapallo, Hiệp ước Locarno, Hiệp ước München',
'Hòa ước Passarowitz, Hiệp ước Karlowitz, Hiệp ước Küçük Kaynarca, Hiệp ước Adrianople, Hiệp ước San Stefano, Hiệp ước Giáp Thân, Hiệp ước Patenôtre, Hiệp ước Bắc Kinh, Hiệp ước Thiên Tân, Hiệp ước Waitangi']},
{id:'r-to-chuc-quoc-te',lv:3,c:'Thế giới',q:'Kể tên một tổ chức quốc tế',s:['tochuc'],k:'UNIDO',t:[
'Liên Hợp Quốc|UN, WHO|Tổ chức Y tế Thế giới, UNICEF, NATO',
'ASEAN, EU|Liên minh châu Âu, WTO|Tổ chức Thương mại Thế giới, IMF|Quỹ Tiền tệ Quốc tế, UNESCO, World Bank|Ngân hàng Thế giới',
'OPEC, G7, G20, APEC, Interpol, FIFA, IOC|Ủy ban Olympic Quốc tế, Hội Chữ thập đỏ, FAO, ILO',
'WIPO, IAEA|Cơ quan Năng lượng Nguyên tử, OECD, ICRC, UNHCR, IFC, ICAO, IMO, ITU, UNDP',
'BRICS, Khối Thịnh vượng chung, Liên đoàn Ả Rập, Liên minh châu Phi, MERCOSUR, EFTA, Tổ chức Pháp ngữ, SCO, Phong trào Không liên kết, Câu lạc bộ Paris']},
{id:'r-vuong-quoc-co',lv:3,c:'Lịch sử',q:'Kể tên một vương quốc hoặc nhà nước cổ ở Đông Nam Á',s:['vuongquoc'],k:'Vương quốc Gangga Negara',t:[
'Chăm Pa|Champa, Phù Nam, Angkor|Đế quốc Khmer, Âu Lạc',
'Văn Lang, Đại Việt, Sukhothai, Ayutthaya, Majapahit, Srivijaya',
'Chân Lạp, Lan Xang|Vạn Tượng, Pagan|Bagan, Dvaravati, Langkasuka, Tambralinga, Kedah, Pattani, Mataram',
'Singhasari, Kediri, Melayu, Taruma, Kalingga, Butuan, Tondo, Champassak, Lavo, Haripunjaya',
'Pyu, Hanthawaddy, Taungoo, Arakan|Rakhine, Ngoenyang, Hariphunchai, Nakhon Si Thammarat, Brunei cổ, Sailendra, Funan']},
{id:'r-nha-hoa-hoc',lv:3,c:'Khoa học',q:'Kể tên một nhà hóa học nổi tiếng trong lịch sử',s:['nha'],k:"Jacobus van 't Hoff",t:[
'Marie Curie|Curie, Mendeleev|Men-đê-lê-ép, Lavoisier|La-voa-di-ê, Nobel|Alfred Nobel',
'Dalton|John Dalton, Avogadro, Boyle|Robert Boyle, Faraday|Michael Faraday, Pasteur|Louis Pasteur, Linus Pauling|Pauling',
'Berzelius, Fritz Haber|Haber, Robert Bunsen|Bunsen, Humphry Davy|Davy, Joseph Priestley|Priestley, Gay-Lussac, Kekulé, Wöhler, Liebig, Svante Arrhenius',
'Nernst, Ostwald, Le Chatelier, Cavendish, Scheele, Berthollet, Dumas, Werner|Alfred Werner, Soddy',
'Rutherford, Hahn|Otto Hahn, Seaborg|Glenn Seaborg, Dorothy Hodgkin, Rosalind Franklin, Gilbert Lewis, Henry Moseley, Stanislao Cannizzaro, Ernest Lawrence, Marie Curie con|Irène Joliot-Curie']},
{id:'r-nha-tho-tg',lv:3,c:'Văn học',q:'Kể tên một nhà thơ nổi tiếng thế giới (không phải người Việt)',s:['nha','nhatho'],k:'Konstantin Kavafis|Cavafy',t:[
'Shakespeare, Pushkin, Tagore|Ta-go, Lý Bạch',
'Đỗ Phủ, Homer|Hô-me, Dante, Goethe, Byron|Lord Byron, Baudelaire',
'Rimbaud, Verlaine, Rilke, Walt Whitman|Whitman, Emily Dickinson|Dickinson, Edgar Allan Poe|Poe, T.S. Eliot|Eliot, Neruda, Bạch Cư Dị, Vương Duy',
'Petrarch, Virgil|Virgile, Ovid|Ovidius, Horace, Milton|John Milton, William Blake|Blake, Keats|John Keats, Shelley, Wordsworth, Coleridge, Mallarmé',
'Hölderlin, Novalis, Heine, Lorca|Federico García Lorca, Akhmatova, Mayakovsky, Tố Như|Basho|Matsuo Basho, Sappho, Omar Khayyam, Rumi']},
{id:'r-cao-nguyen',lv:3,c:'Thế giới',q:'Kể tên một cao nguyên trên thế giới',s:['caonguyen'],k:'Cao nguyên Barkly',t:[
'Cao nguyên Tây Tạng, Cao nguyên Mông Cổ, Cao nguyên Iran, Cao nguyên Trung Bộ|Tây Nguyên',
'Cao nguyên Deccan, Cao nguyên Colorado, Cao nguyên Anatolia, Cao nguyên Ethiopia, Cao nguyên Pamir, Cao nguyên Thổ Nhĩ Kỳ',
'Cao nguyên Hoàng Thổ, Cao nguyên Vân Quý, Cao nguyên Patagonia, Cao nguyên Guiana, Cao nguyên Brazil, Cao nguyên Đông Phi, Cao nguyên Kimberley, Cao nguyên Scotland, Cao nguyên Thụy Sĩ, Cao nguyên Mexico',
'Cao nguyên Ozark, Cao nguyên Cumberland, Cao nguyên Allegheny, Cao nguyên Bolivia|Altiplano, Cao nguyên Loess, Cao nguyên Ustyurt, Cao nguyên Golan, Cao nguyên Nullarbor, Cao nguyên Shillong, Cao nguyên Chota Nagpur',
'Cao nguyên Putorana, Cao nguyên Laurentian, Cao nguyên Bié, Cao nguyên Jos, Cao nguyên Fouta Djallon, Cao nguyên Bandiagara, Cao nguyên Kukenan, Cao nguyên Roraima, Cao nguyên Ordos, Cao nguyên Tân Cương']},
{id:'r-trang-thai-my',lv:3,c:'Thế giới',q:'Kể tên một tiểu bang của nước Mỹ',s:['bang','tieubang'],k:'Rhode Island',t:[
'California, Texas, New York, Florida',
'Hawaii, Alaska, Nevada, Washington, Georgia, Virginia, Ohio, Michigan',
'Pennsylvania, Illinois, Arizona, Colorado, Oregon, Massachusetts, New Jersey, Louisiana, Tennessee, Kentucky, Utah, Maryland',
'Wisconsin, Minnesota, Missouri, Indiana, Alabama, South Carolina, North Carolina, Oklahoma, Connecticut, Iowa, Kansas, Arkansas, Mississippi, Nebraska',
'Delaware, Montana, Wyoming, Idaho, Maine, New Hampshire, Vermont, West Virginia, North Dakota, South Dakota, New Mexico']},
{id:'r-ngon-ngu-lap-trinh-cu',lv:3,c:'Công nghệ',q:'Kể tên một ngôn ngữ lập trình',s:['ngonngu'],k:'Eiffel',t:[
'Python, Java, JavaScript|JS, C',
'C++, C#, PHP, Ruby, Go|Golang, Swift, Kotlin, TypeScript|TS, Rust',
'SQL, R, MATLAB, Perl, Scala, Dart, Objective-C, Lua, Assembly|Hợp ngữ, Visual Basic, Pascal, Fortran',
'Cobol, Lisp, Haskell, Erlang, Elixir, Clojure, F#, Julia, Groovy, Prolog, Ada, Scheme, Smalltalk, Delphi',
'OCaml, Zig, Nim, Crystal, Solidity, Mojo, Carbon, APL, Forth, Brainfuck, Simula, ALGOL, PL/I, Tcl, Racket']},
{id:'r-nha-tam-ly',lv:3,c:'Khoa học',q:'Kể tên một nhà tâm lý học nổi tiếng',s:['nha'],k:'Lawrence Kohlberg',t:[
'Sigmund Freud|Freud, Carl Jung|Jung, Ivan Pavlov|Pavlov, Abraham Maslow|Maslow',
'B.F. Skinner|Skinner, Jean Piaget|Piaget, Alfred Adler|Adler, Erik Erikson|Erikson, John Watson|Watson, Carl Rogers|Rogers',
'Albert Bandura|Bandura, Lev Vygotsky, Daniel Kahneman|Kahneman, Stanley Milgram|Milgram, Philip Zimbardo|Zimbardo, Wilhelm Wundt|Wundt, William James, Edward Thorndike|Thorndike, Harry Harlow, Mary Ainsworth',
'Hermann Ebbinghaus, Gordon Allport, Raymond Cattell, Hans Eysenck, Rollo May, Viktor Frankl|Frankl, Elizabeth Loftus, Martin Seligman|Seligman, Aaron Beck, Noam Chomsky',
'Kurt Lewin, Solomon Asch, Leon Festinger, Gustav Fechner, G. Stanley Hall, Karen Horney, Anna Freud, Melanie Klein, Donald Winnicott, Jerome Bruner']},
{id:'r-vinh-bien',lv:3,c:'Thế giới',q:'Kể tên một vịnh biển trên thế giới',s:['vinh'],k:'Vịnh Kara',t:[
'Vịnh Bắc Bộ, Vịnh Thái Lan, Vịnh Mexico, Vịnh Ba Tư|Vịnh Péc-xích',
'Vịnh Bengal, Vịnh Hudson, Vịnh Aden, Vịnh Oman, Vịnh Guinea, Vịnh California',
'Vịnh Biscay, Vịnh Alaska, Vịnh Bothnia, Vịnh Phần Lan, Vịnh Riga, Vịnh Carpentaria, Vịnh Great Australian, Vịnh Fundy, Vịnh Panama',
'Vịnh Sidra, Vịnh Gabès, Vịnh Chesapeake, Vịnh Saint Lawrence, Vịnh Campeche, Vịnh Honduras, Vịnh Darién, Vịnh Venezuela, Vịnh Paria, Vịnh Khambhat',
'Vịnh Kutch, Vịnh Mannar, Vịnh Martaban, Vịnh Liêu Đông, Vịnh Bột Hải, Vịnh Anadyr, Vịnh Sakhalin, Vịnh Shelikhov, Vịnh Bristol, Vịnh Buzzards']},
{id:'r-enzyme-protein',lv:3,c:'Khoa học',q:'Kể tên một loại vitamin, hormone hoặc enzyme trong cơ thể',s:[],k:'Elastin',t:[
'Vitamin C, Insulin, Vitamin D, Adrenaline|Epinephrine',
'Vitamin A, Vitamin B12, Estrogen, Testosterone, Cortisol, Melatonin',
'Vitamin E, Vitamin K, Progesterone, Dopamine, Serotonin, Oxytocin, Thyroxine|Hormone tuyến giáp, Glucagon, Amylase, Lipase',
'Pepsin, Trypsin, Lactase, Keratin, Collagen, Hemoglobin, Catalase, Cholesterol, Prolactin, Histamine',
'Renin, Aldosterone, Somatostatin, Ghrelin, Leptin, Vasopressin, Bradykinin, Lysozyme, Protease, Ligase']},
{id:'r-trat-dau-tg',lv:3,c:'Lịch sử',q:'Kể tên một trận đánh nổi tiếng trong lịch sử thế giới',s:['tran','trandanh'],k:'Trận Pharsalus',t:[
'Trận Waterloo, Trận Stalingrad, Trận Normandy|D-Day, Trận Trân Châu Cảng|Pearl Harbor',
'Trận Hastings, Trận Marathon, Trận Thermopylae, Trận Gettysburg, Trận Verdun, Trận Somme',
'Trận Cannae, Trận Zama, Trận Actium, Trận Agincourt, Trận Crécy, Trận Austerlitz, Trận Borodino, Trận Leipzig, Trận Midway, Trận El Alamein',
'Trận Issus, Trận Gaugamela, Trận Salamis, Trận Trafalgar, Trận Jutland, Trận Kursk, Trận Ardennes|Bulge, Trận Iwo Jima, Trận Okinawa, Trận Marne',
'Trận Teutoburg, Trận Adrianople, Trận Tours, Trận Lepanto, Trận Vienna, Trận Blenheim, Trận Poltava, Trận Plassey, Trận Isandlwana, Trận Tsushima']},
{id:'r-dau-hieu-benh',lv:3,c:'Khoa học',q:'Kể tên một bệnh truyền nhiễm',n:'Bệnh do vi khuẩn, virus hoặc ký sinh trùng gây ra và lây được.',s:['benh'],k:'Bệnh ghẻ cóc|Yaws',t:[
'HIV/AIDS|HIV|AIDS, Giang mai, Lậu, Lao',
'Viêm gan B, Viêm gan C, Sốt rét, Dịch hạch, Ebola, Dại',
'Sùi mào gà|HPV, Herpes, Chlamydia, Thương hàn, Tả, Bạch hầu, Uốn ván, Sốt vàng, Than|Bệnh than, Viêm não Nhật Bản',
'Bệnh Lyme, Sốt xuất huyết Marburg, Sốt Lassa, Leptospira, Melioidosis, Brucella, Leishmania, Trypanosoma|Bệnh ngủ, Sán máng, Giun chỉ',
'Sốt Q, Tularemia, Nipah, Hanta, Chikungunya, Zika, Rickettsia, Bejel, Hạ cam, U hạt bẹn']},
];
