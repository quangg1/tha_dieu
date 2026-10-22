// Release set, part 13: drinks, cheese, sauces, dinosaurs, lost animals, plants and wild cats.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE13: ReleaseQuestion[] = [
{id:'r-bia',c:'Ăn uống',q:'Kể tên một nhãn hiệu bia',s:['bia'],k:'Westvleteren',t:[
'Heineken, Tiger, Bia Sài Gòn|Sài Gòn|Sabeco, 333|Ba ba ba',
'Bia Hà Nội|Habeco, Huda, Larue, Budweiser, Sapporo, Carlsberg, Trúc Bạch, Halida, Corona, Bia Việt, Sư Tử Trắng|White Lion',
'Hoegaarden, 1664|Blanc 1664|Kronenbourg 1664, Stella Artois, Guinness, Asahi, Kirin, San Miguel, Chang, Singha, Leo, Tsingtao|Thanh Đảo, Edelweiss, Erdinger, Paulaner, Hite, Cass, Bia hơi Hà Nội, Dung Quất, Harbin, Coors, Miller, Beck\'s, Strongbow',
'Chimay, Leffe, Duvel, Pilsner Urquell, Peroni, Moretti|Birra Moretti, Amstel, Grimbergen, Weihenstephaner, Krombacher, Warsteiner, Bitburger, Franziskaner, Löwenbräu, Pasteur Street, Heart of Darkness, Bến Thành, Saigon Special, Đại Việt',
'Orval, Rochefort, Delirium Tremens, Kwak, Lagunitas, BrewDog, Sierra Nevada, Kozel, Staropramen, Budvar, East West, Platinum']},
{id:'r-pho-mai',c:'Ẩm thực',q:'Kể tên một loại phô mai (pho mát)',s:['phomai','phomat'],k:'Brunost|Gjetost',t:[
'Mozzarella, Cheddar, Con Bò Cười|La Vache qui rit',
'Parmesan|Parmigiano, Camembert, Brie, Gouda, Cream cheese|Phô mai kem, Feta, Phô mai xanh|Blue cheese, Emmental, Ricotta, Mascarpone',
'Roquefort, Gorgonzola, Stilton, Gruyère, Edam, Manchego, Pecorino, Halloumi, Burrata, Provolone, Monterey Jack, Colby, Raclette, Comté, Havarti, Paneer, Cottage cheese, Philadelphia, Babybel, Belcube',
'Taleggio, Fontina, Reblochon, Munster, Époisses, Limburger, Asiago, Grana Padano, Jarlsberg, Leerdammer, Boursin, Cotija, Queso fresco, Wensleydale, Red Leicester, Phô mai dê|Chèvre, Tête de Moine, Morbier, Pont-l\'Évêque',
'Casu marzu, Mimolette, Vacherin, Lancashire, Caerphilly, Ossau-Iraty, Salers, Cantal, Oaxaca, Scamorza, Stracchino']},
{id:'r-sot',c:'Ẩm thực',q:'Kể tên một loại nước sốt hoặc tương dùng trong ăn uống',s:['sot','nuocsot'],k:'Gribiche',t:[
'Tương ớt, Mayonnaise|Sốt mayonnaise|Mayo, Tương cà|Sốt cà chua|Ketchup, Nước mắm',
'Xì dầu|Nước tương, Tương đen|Hoisin, Sa tế, Dầu hào, Sốt BBQ|Barbecue, Sốt mè rang, Mắm tôm, Mắm nêm, Mù tạt, Wasabi, Thousand Island',
'Pesto, Béchamel|Sốt trắng, Teriyaki, Tabasco, Sriracha, Worcestershire, Tartar, Caesar|Sốt Caesar, Ranch, Guacamole, Salsa, Hummus, Tzatziki, Gochujang|Tương ớt Hàn Quốc, Bolognese, Sốt kem nấm, Sốt tiêu đen, Sốt chua ngọt, Sốt me, Tương bần, Hollandaise, Chimichurri, Aioli, Alfredo, Tương hột, Sốt cà ri',
'Velouté, Espagnole, Demi-glace, Beurre blanc, Béarnaise, Romesco, Mole, Harissa, Ponzu, Tonkatsu|Sốt tonkatsu, Doubanjiang|Tương đậu Tứ Xuyên, Sốt XO|XO, Chutney, Raita, Gremolata, Miso, Sambal',
'Sauce Robert, Ravigote, Salsa verde, Muhammara, Skordalia, Zhug, Nam phrik, Bagna càuda, Mornay']},
{id:'r-khung-long',c:'Động vật',q:'Kể tên một loài khủng long hoặc bò sát thời tiền sử',s:['khunglong'],k:'Nigersaurus',t:[
'Khủng long bạo chúa|T-Rex|Tyrannosaurus, Velociraptor, Triceratops|Khủng long ba sừng',
'Brachiosaurus, Stegosaurus, Pterodactyl|Thằn lằn bay|Pterosaur, Spinosaurus, Diplodocus, Ankylosaurus, Brontosaurus, Parasaurolophus, Allosaurus, Mosasaurus|Thương long',
'Iguanodon, Pachycephalosaurus, Dilophosaurus, Carnotaurus, Giganotosaurus, Gallimimus, Compsognathus, Archaeopteryx|Chim thủy tổ, Plesiosaurus, Quetzalcoatlus, Argentinosaurus, Therizinosaurus, Oviraptor, Protoceratops, Baryonyx, Apatosaurus, Edmontosaurus, Deinonychus, Ichthyosaurus|Ngư long, Dimetrodon',
'Microraptor, Utahraptor, Troodon, Maiasaura, Styracosaurus, Kentrosaurus, Amargasaurus, Coelophysis, Herrerasaurus, Eoraptor, Mamenchisaurus, Sinosauropteryx, Yutyrannus, Psittacosaurus, Mapusaurus, Tarbosaurus, Albertosaurus, Ceratosaurus, Suchomimus, Corythosaurus, Lambeosaurus, Nodosaurus, Pentaceratops, Elasmosaurus, Pteranodon',
'Dracorex, Irritator, Mononykus, Deinocheirus, Patagotitan, Dreadnoughtus, Shunosaurus, Concavenator, Kosmoceratops, Sarcosuchus, Deinosuchus']},
{id:'r-tuyet-chung',c:'Động vật',q:'Kể tên một loài động vật đã tuyệt chủng',s:[],k:'Linh dương xanh|Bluebuck',t:[
'Khủng long, Voi ma mút|Ma mút, Chim dodo|Dodo',
'Hổ răng kiếm|Smilodon, Hổ Tasmania|Thylacine|Sói túi, Megalodon|Cá mập Megalodon, Tê giác lông|Tê giác lông mịn, Tê giác Java Việt Nam|Tê giác một sừng Việt Nam, Cá heo sông Dương Tử|Baiji, Bồ câu viễn khách',
'Chim moa|Moa, Bò rừng châu Âu|Aurochs, Bò xám|Kouprey, Lười đất khổng lồ|Megatherium, Chim voi|Elephant bird, Quagga|Ngựa vằn Quagga, Bò biển Steller|Hải ngưu Steller, Chim Auk lớn|Great auk, Hổ Bali, Hổ Java, Hổ Caspi, Tê giác đen Tây Phi, Bọ ba thùy|Trilobite, Titanoboa, Gấu hang|Gấu hang động',
'Cóc vàng|Golden toad, Ếch ấp trứng trong dạ dày, Ngựa hoang Tarpan|Tarpan, Sói Falkland|Warrah, Vẹt Carolina, Hươu sừng lớn Ireland|Irish elk|Megaloceros, Sư tử hang|Cave lion, Sư tử túi|Thylacoleo, Diprotodon, Glyptodon, Dunkleosteus, Anomalocaris, Gigantopithecus, Rùa khổng lồ Pinta|Lonesome George, Báo mây Đài Loan',
'Archelon, Chuột túi khổng lồ|Procoptodon, Haast\'s eagle|Đại bàng Haast, Schomburgk\'s deer|Hươu Schomburgk, Arsinoitherium, Macrauchenia, Paraceratherium|Indricotherium']},
{id:'r-cay-trong-nha',c:'Thực vật',q:'Kể tên một loại cây cảnh trồng trong nhà hoặc văn phòng',s:['cay'],k:'Hoya|Lan cẩm cù',t:[
'Lưỡi hổ|Lưỡi cọp, Kim tiền, Trầu bà',
'Lan ý|Bạch môn, Xương rồng, Sen đá, Thiết mộc lan|Phát tài, Bàng Singapore, Kim ngân, Vạn niên thanh, Lan hồ điệp, Phát lộc|Trúc phát lộc, Ngọc ngân, Hồng môn, Monstera|Trầu bà lá xẻ, Dương xỉ',
'Cau tiểu trâm, Thường xuân, Đa búp đỏ, Cỏ lan chi|Dây nhện, Tùng bồng lai, Hạnh phúc|Cây hạnh phúc, Vạn lộc, Ngũ gia bì, Cau Nhật, Sống đời, Lan quân tử, Huyết dụ, Bạch mã hoàng tử, Phú quý, Ngọc bích|Cây ngọc bích, Tùng la hán, Đa cao su|Cây cao su, Đuôi công|Calathea, Kim phát tài',
'Thài lài tía, Dứa cảnh, Tróc bạc, Cẩm nhung|Fittonia, Môn cảnh|Alocasia, Philodendron, Trường sinh|Peperomia, Thiên điểu|Chim thiên đường, Chuối rẻ quạt, Ráy, Lan chi, Cỏ đồng tiền, Ngũ sắc, Tai thỏ|Xương rồng tai thỏ',
'Lan hạt dưa, Ngọc trai|Chuỗi ngọc|String of pearls, Tổ chim|Dương xỉ tổ chim, Ráy rồng, Lá gấm']},
{id:'r-ran',c:'Động vật',q:'Kể tên một loài rắn hoặc trăn',s:['ran','tran'],k:'Boomslang',t:[
'Rắn hổ mang|Hổ mang, Trăn, Rắn lục',
'Hổ mang chúa, Cạp nong, Cạp nia, Rắn nước, Rắn ráo, Anaconda|Trăn Nam Mỹ, Rắn đuôi chuông, Rắn biển, Trăn gấm, Trăn đất',
'Rắn lục đuôi đỏ, Mamba|Mamba đen, Rắn san hô, Rắn hổ lửa, Rắn roi, Rắn sọc dưa, Rắn bông súng, Rắn hổ đất, Rắn lục mũi hếch, Rắn chàm quạp, Taipan, Rắn hổ mây, Rắn giun, Rắn ri voi, Rắn ri cá, Rắn lục sừng, Hổ trâu, Trăn Boa|Boa, Rắn vua|Kingsnake, Rắn sữa|Milk snake, Rắn ngô|Corn snake, Trăn hoàng gia|Ball python, Trăn lưới',
'Rắn cây bay|Rắn bay, Rắn mũi lá, Rắn ăn trứng, Rắn hổ mang mắt kính, Gaboon viper|Rắn hổ lục Gaboon, Rắn biển Belcher, Rắn lục gai, Trăn Miến Điện, Rắn bồng chì, Rắn cườm',
'Rắn hổ mang phun nọc, Bushmaster|Rắn lục Bushmaster, Fer-de-lance, Rắn sừng sa mạc|Horned viper, Rắn mũi heo|Hognose']},
{id:'r-meo-hoang',c:'Động vật',q:'Kể tên một loài thuộc họ mèo hoang dã (mèo lớn hoặc mèo rừng)',s:[],k:'Kodkod',t:[
'Hổ|Cọp, Sư tử, Báo|Báo hoa mai, Báo đen',
'Báo săn|Cheetah, Báo tuyết, Báo đốm|Jaguar, Linh miêu|Lynx, Báo sư tử|Puma|Sư tử núi|Cougar, Báo gấm|Báo mây',
'Mèo rừng, Mèo cá, Mèo báo, Linh miêu tai đen|Caracal, Mèo cát|Sand cat, Serval|Linh miêu đồng cỏ, Ocelot, Mèo Pallas|Manul, Báo lửa|Beo lửa|Mèo vàng châu Á, Báo Amur, Hổ Đông Dương, Hổ Bengal, Hổ Siberia|Hổ Amur, Sư tử trắng, Liger|Sư hổ, Linh miêu đuôi cộc|Bobcat',
'Margay, Oncilla, Mèo đầu dẹt, Mèo cẩm thạch|Marbled cat, Mèo Andes, Jaguarundi, Mèo chân đen, Mèo Geoffroy, Mèo đốm gỉ|Rusty-spotted cat, Linh miêu Iberia, Hổ Sumatra, Hổ Mã Lai, Sư tử châu Á',
'Mèo Borneo|Bay cat, Mèo Pampas, Mèo Guiña, Mèo vàng châu Phi|African golden cat, Báo Sri Lanka']},
{id:'r-cay-cong-nghiep',c:'Thực vật',q:'Kể tên một loại cây công nghiệp hoặc cây lấy gỗ được trồng nhiều ở Việt Nam',s:['cay'],k:'Trẩu|Cây trẩu',t:[
'Cà phê, Cao su, Chè|Trà, Hồ tiêu|Tiêu',
'Điều|Hạt điều, Mía, Dừa, Bông|Bông vải, Thuốc lá, Ca cao, Đậu tương|Đậu nành, Lạc|Đậu phộng, Keo|Cây keo, Bạch đàn',
'Đay, Cói|Lác, Dâu tằm|Dâu, Vừng|Mè, Sắn|Khoai mì, Cọ dầu, Quế, Hồi, Mắc ca|Macca, Sả, Thông, Tràm, Tre, Mây|Song mây',
'Gai, Lanh, Sơn ta|Cây sơn, Thảo quả, Sa nhân, Đinh hương, Vani, Lai|Cây lai, Xoan|Xoan ta, Lát hoa, Mỡ|Cây mỡ, Bồ đề, Trám, Dó bầu|Trầm hương',
'Sở|Cây sở, Thầu dầu, Bông gòn|Gòn, Chàm|Cây chàm']},
];
