// Release set, part 14: islands, parks, peninsulas and cities further afield.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE14: ReleaseQuestion[] = [
{id:'r-dao-vn',c:'Du lịch',q:'Kể tên một hòn đảo hoặc quần đảo của Việt Nam',s:['dao','hon','quandao'],k:'Cái Chiên|Đảo Cái Chiên',t:[
'Phú Quốc, Côn Đảo|Côn Sơn, Cát Bà, Lý Sơn|Cù Lao Ré',
'Hoàng Sa, Trường Sa, Cô Tô, Nam Du, Cù Lao Chàm, Bạch Long Vĩ, Phú Quý, Quan Lạn, Hòn Tre, Bình Ba, Hòn Mun',
'Cồn Cỏ, Hòn Sơn|Lại Sơn, Thổ Chu, Bình Hưng, Điệp Sơn, Hòn Khoai, Minh Châu, Ngọc Vừng, Hòn Thơm, Cù Lao Xanh, Hòn Tằm, Hòn Lao|Đảo Khỉ, Hòn Mê, Hòn Ngư, Thanh Lân, Song Tử Tây, Hòn Nghệ, Hòn Lớn, Vân Đồn|Cái Bầu, Hòn Gầm Ghì, Hòn Móng Tay, Hòn Mây Rút',
'Hòn Mắt, Cù Lao Câu, Hòn Bà, Hòn Chuối, Hòn Đá Bạc, Hòn Nội, Hòn Dừa, Trà Bản, Vĩnh Thực, Hòn Một, Hòn Rùa, Sinh Tồn, Nam Yết, Đá Tây',
'Hòn Trứng, Hòn Yến, Hòn Bảy Cạnh, Hòn Cau, Hòn Hải']},
{id:'r-vuon-quoc-gia',c:'Du lịch',q:'Kể tên một vườn quốc gia của Việt Nam',s:['vuonquocgia','vqg'],k:'Phước Bình',t:[
'Cúc Phương, Phong Nha - Kẻ Bàng|Phong Nha, Cát Tiên, Ba Vì',
'Bạch Mã, Tam Đảo, Cát Bà, Yok Đôn, Côn Đảo, Hoàng Liên, Ba Bể, Tràm Chim, U Minh Thượng',
'Bidoup - Núi Bà|Bidoup, Phú Quốc, U Minh Hạ, Núi Chúa, Bái Tử Long, Xuân Thủy, Pù Mát, Mũi Cà Mau, Chư Yang Sin, Bù Gia Mập, Vũ Quang, Bến En',
'Lò Gò - Xa Mát, Kon Ka Kinh, Chư Mom Ray, Xuân Sơn, Tà Đùng',
'Phia Oắc - Phia Đén|Phia Oắc, Du Già - Cao nguyên đá Đồng Văn|Du Già']},
{id:'r-cong-vien-tg',c:'Du lịch',q:'Kể tên một vườn quốc gia hoặc khu bảo tồn thiên nhiên nổi tiếng thế giới',s:['vuonquocgia','congvien','khubaoton'],k:'Sarek',t:[
'Yellowstone, Serengeti, Grand Canyon',
'Yosemite, Banff, Kruger, Galápagos|Quần đảo Galápagos, Masai Mara, Trương Gia Giới|Zhangjiajie, Cửu Trại Câu|Jiuzhaigou, Komodo',
'Torres del Paine, Plitvice, Zion, Arches, Everglades, Great Smoky Mountains, Kakadu, Uluru-Kata Tjuta|Uluru, Fiordland, Khao Yai, Ngorongoro, Lake District, Jasper, Denali, Sequoia, Redwood, Death Valley, Joshua Tree, Iguazú, Kinabalu, Glacier',
'Snowdonia|Eryri, Cairngorms, Olympic, Acadia, Rocky Mountain, Bryce Canyon, Los Glaciares, Tongariro, Sagarmatha, Jim Corbett|Corbett, Kaziranga, Ranthambore, Chitwan, Taman Negara, Gunung Mulu, Virunga, Bwindi, Etosha, Chobe, Vatnajökull, Thingvellir|Þingvellir, Seoraksan|Sorak, Shiretoko, Peak District',
'Triglav, Durmitor, Abisko, Berchtesgaden, Gran Paradiso, Tsingy de Bemaraha, Kaieteur, Canaima, Wood Buffalo, Nahanni']},
{id:'r-ban-dao',c:'Thế giới',q:'Kể tên một bán đảo',s:['bandao'],k:'Hòn Gốm|Bán đảo Hòn Gốm',t:[
'Đông Dương, Triều Tiên, Ả Rập, Iberia',
'Balkan, Scandinavia, Mã Lai|Malay, Ý|Apennine, Krym|Crimea, Sơn Trà, Alaska, Florida, Cà Mau',
'Yucatán, Kamchatka, Sinai, Jutland, Anatolia|Tiểu Á, Labrador, Baja California, Peloponnese, Lôi Châu, Sơn Đông, Liêu Đông, Cửu Long|Kowloon, Bán đảo Nam Cực|Nam Cực, Somali|Sừng châu Phi, Gallipoli, Cam Ranh, Phương Mai',
'Cape York, Kola, Taymyr, Yamal, Chukotka, Bretagne|Brittany, Cornwall, Istria, Chalkidiki, Cotentin, Nova Scotia, Gaspé, Bảo Ninh, Cap Bon, Kenai, Shandong',
'Delmarva, Avalon, Olympic, Valdés, Musandam, Qatar, Mount Athos|Athos']},
{id:'r-tp-my-latin',c:'Thế giới',q:'Kể tên một thành phố ở Mỹ Latinh (Trung Mỹ, Nam Mỹ, Mexico, Caribe)',s:['thanhpho','tp'],k:'Valledupar',t:[
'Rio de Janeiro|Rio, Mexico City|Thành phố Mexico, Buenos Aires, São Paulo',
'Lima, Bogotá, Santiago, Havana|La Habana, Brasília, Cancún, Caracas, Medellín, Quito, Montevideo, La Paz, Cusco',
'Guadalajara, Monterrey, Tijuana, Cartagena, Panama City|Thành phố Panama, San José, Salvador, Recife, Fortaleza, Manaus, Belo Horizonte, Curitiba, Porto Alegre, Florianópolis, Córdoba, Rosario, Mendoza, Ushuaia, Valparaíso, Asunción, Santa Cruz, Sucre, Guayaquil, Cali, Barranquilla, Maracaibo, Acapulco, Oaxaca, Puebla, Mérida, Tulum, Playa del Carmen, Puerto Vallarta, Cabo San Lucas|Los Cabos, Santo Domingo, San Juan, Kingston, Port-au-Prince',
'Arequipa, Trujillo, Iquitos, Cuenca, Antigua Guatemala|Antigua, Bariloche, Salta, Punta del Este, Colonia del Sacramento, Potosí, Ouro Preto, Paraty, Natal, Belém, Foz do Iguaçu, Mar del Plata, Iquique, Punta Arenas, Arica, Cochabamba, Guanajuato, San Miguel de Allende, Querétaro, Veracruz, Chihuahua, Ciudad Juárez, Guatemala City, San Salvador, Tegucigalpa, Managua',
'Paramaribo, Georgetown, Cayenne, Belmopan, Leticia, Puerto Natales, Chiclayo, Tarija, Riobamba, Encarnación, Santa Marta']},
{id:'r-tp-trung-dong',c:'Thế giới',q:'Kể tên một thành phố ở Trung Đông',s:['thanhpho','tp'],k:'Umm al-Quwain',t:[
'Dubai, Abu Dhabi, Mecca|Makkah',
'Doha, Riyadh, Tehran, Baghdad, Jerusalem, Tel Aviv, Damascus, Beirut, Amman, Thành phố Kuwait|Kuwait City, Muscat, Medina',
'Jeddah, Ankara, Manama, Sharjah, Aleppo, Mosul, Basra, Isfahan, Shiraz, Tabriz, Mashhad, Gaza, Haifa, Eilat, Sana\'a, Aden, Erbil, Bethlehem, Nazareth, Ramallah, Petra',
'Ajman, Ras al-Khaimah, Fujairah, Al Ain, Salalah, Nizwa, Dammam, Taif, Tabuk, AlUla, Homs, Palmyra, Byblos, Tyre, Sidon, Baalbek, Aqaba, Jericho, Hebron, Najaf, Karbala, Qom, Yazd, Kerman',
'Neom, Hofuf, Buraidah, Abha, Mukalla, Sohar, Khasab, Sulaymaniyah, Kirkuk, Kashan']},
{id:'r-tp-chau-phi',c:'Thế giới',q:'Kể tên một thành phố ở châu Phi',s:['thanhpho','tp'],k:'Chinguetti',t:[
'Cairo, Nairobi, Cape Town|Thành phố Cape, Johannesburg',
'Lagos, Casablanca, Marrakech, Addis Ababa, Accra, Dakar, Tunis, Alger|Algiers, Durban, Pretoria, Alexandria, Luxor, Zanzibar',
'Kinshasa, Abuja, Kampala, Kigali, Dar es Salaam, Mombasa, Luanda, Harare, Lusaka, Maputo, Antananarivo, Khartoum, Tripoli, Rabat, Fez, Tangier, Giza, Aswan, Timbuktu, Mogadishu, Djibouti, Windhoek, Gaborone, Abidjan, Bamako, Ouagadougou, Niamey, Port Louis',
'Conakry, Freetown, Monrovia, Lomé, Cotonou, Douala, Yaoundé, Libreville, Brazzaville, Juba, Asmara, Kano, Ibadan, Benghazi, Sharm el-Sheikh, Hurghada, Arusha, Stone Town, Agadir, Essaouira, Chefchaouen, Kairouan, Sousse, Lalibela, Gondar, Bulawayo, Kisumu, Gqeberha|Port Elizabeth, Bloemfontein, Stellenbosch, Swakopmund, Aksum',
'Nouakchott, Malabo, Bangui, N\'Djamena, Moroni, Praia, Maseru, Mbabane, Lilongwe, Bujumbura, Gitega, Dodoma, Mekele, Djenné, Ouidah, Kumasi, Ghardaïa']},
];
