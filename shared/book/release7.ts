// Release set, part 7: science and technology.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE7: ReleaseQuestion[] = [
{id:'r-ai-chatbot',c:'Công nghệ',q:'Kể tên một chatbot hoặc công cụ trí tuệ nhân tạo (AI)',s:['app','ungdung'],k:'NotebookLM',until:'2027-12-31',t:[
'ChatGPT, Gemini, Claude',
'Copilot|Microsoft Copilot, Grok, DeepSeek, Meta AI, Siri, Google Assistant, Midjourney',
'Perplexity, Llama, Mistral, Sora, DALL-E, Bard, Alexa, Character.AI, Canva AI, Gauth, Qwen, Kimi, Doubao, Bing Chat, CapCut AI, Zalo AI',
'Stable Diffusion, Runway, Suno, ElevenLabs, Cursor, GitHub Copilot, Veo, Imagen, Flux, Pi, Poe, Jasper, Notion AI, Grammarly, Leonardo AI, Ideogram, HeyGen, Synthesia, Ernie Bot, Kling, Hailuo, Manus, Lovable, Replit',
'Claude Code, Codex, Windsurf, v0, Bolt, Pika, Luma, Udio, Whisper, Gemma, Phi, Falcon, Command R, Jan, Ollama, LM Studio, Hugging Face']},
{id:'r-popmart',c:'Giải trí',q:'Kể tên một nhân vật hoặc dòng đồ chơi Pop Mart',s:[],k:'Hacipupu',until:'2027-06-30',t:[
'Labubu, Baby Three',
'Molly, Skullpanda, CryBaby, Dimoo',
'Hirono, Zimomo, Pucky, Kubo, The Monsters, Twinkle Twinkle',
'Nyota, Pino Jelly, Zsiga, Inosoul, Sweet Bean, Bunny, Satyr Rory, Peach Riot, Duckoo, Mokoko, Yuki, Tycoco',
'Azura, Lilith, Bobo and Coco, Vita, Spooky, Viya, Spy, Labubu Zimomo']},
{id:'r-kpop-dh',c:'Giải trí',q:'Kể tên một bài hát hoặc nhân vật trong phim KPop Demon Hunters',s:[],k:'Sussie',until:'2027-06-30',t:[
'Golden, Rumi, HUNTR/X|Huntrix',
'Soda Pop, Your Idol, Saja Boys, Jinu, Mira, Zoey',
'Derpy|Hổ Derpy, Takedown, How It\'s Done, What It Sounds Like, Free, Gwi-Ma, Celine, Abby, Mystery, Romance, Baby Saja',
'Strategy, Love',
'']},
{id:'r-vinfast',c:'Giao thông',q:'Kể tên một mẫu xe của VinFast',s:['xe','vinfast'],k:'Lux A2.0',until:'2028-12-31',t:[
'VF 3, VF 8, Fadil',
'VF 5, VF 6, VF 7, VF 9, VF e34, Limo Green',
'Lux SA2.0, President, Klara, Evo, Feliz, Vento, Theon, Minio Green, Herio Green, Nerio Green, EC Van',
'Evo200, Feliz S, Klara S, Theon S, Vento S',
'']},
{id:'r-iphone',c:'Công nghệ',q:'Kể tên một mẫu iPhone',s:['iphone','dienthoai'],k:'iPhone 3G',t:[
'iPhone 17|iPhone 17 Pro Max|iPhone 17 Pro, iPhone 16|iPhone 16 Pro Max|iPhone 16 Pro, iPhone 15|iPhone 15 Pro Max|iPhone 15 Pro',
'iPhone X, iPhone 11, iPhone 12, iPhone 13, iPhone 14, iPhone Air|iPhone 17 Air',
'iPhone 7, iPhone 8, iPhone 6, iPhone 6s, iPhone SE, iPhone XS, iPhone XR, iPhone 16e',
'iPhone 5, iPhone 5s, iPhone 4, iPhone 4s, iPhone 5c, iPhone 7 Plus, iPhone 8 Plus, iPhone 6 Plus, iPhone XS Max, iPhone 12 mini, iPhone 13 mini',
'iPhone 2G|iPhone đời đầu, iPhone 3GS']},
{id:'r-may-tinh',c:'Công nghệ',q:'Kể tên một bộ phận hoặc linh kiện của máy tính',s:['bo','linhkien'],k:'Bo mạch chủ',t:[
'Chuột, Bàn phím, Màn hình',
'CPU|Chip, RAM, Ổ cứng, Card màn hình|VGA|GPU, Mainboard',
'Nguồn|Bộ nguồn|PSU, SSD, Quạt tản nhiệt, Case|Thùng máy, Loa, Webcam, Tai nghe, USB, Ổ đĩa quang|Ổ CD',
'Card mạng, Card âm thanh, Keo tản nhiệt, Tản nhiệt nước, Pin CMOS, BIOS, Cổng HDMI, Cổng USB, Bàn di chuột|Touchpad, Micro, Máy in, Máy quét|Scanner, Ổ HDD, Bộ nhớ đệm|Cache',
'Chipset, Khe PCIe, Bus, ROM, VRM, Thanh RAM, Ổ đĩa mềm, Card Wi-Fi, Bộ chuyển đổi, Đế tản nhiệt, Hub USB']},
{id:'r-he-dieu-hanh',c:'Công nghệ',q:'Kể tên một hệ điều hành',s:['hedieuhanh'],k:'Symbian',t:[
'Windows, Android, iOS',
'macOS, Linux, Ubuntu',
'HarmonyOS, Chrome OS, iPadOS, watchOS, Windows XP, Windows 7, Windows 10, Windows 11, MS-DOS|DOS',
'BlackBerry OS, Windows Phone, Debian, Fedora, Red Hat, CentOS, Linux Mint, Arch Linux, Kali Linux, FreeBSD, Unix, Tizen, visionOS, tvOS, Wear OS, Windows Vista, Windows 8',
'Solaris, OS/2, Haiku, ReactOS, Plan 9, BeOS, Palm OS, webOS, KaiOS, Fuchsia, Sailfish, MeeGo, Bada, AmigaOS, OpenBSD, NetBSD']},
{id:'r-benh-virus',c:'Khoa học',q:'Kể tên một bệnh do virus gây ra',s:['benh'],k:'Bệnh Chikungunya',t:[
'Cúm, COVID-19|Covid, Sốt xuất huyết',
'Thủy đậu, Sởi, Quai bị, HIV|AIDS, Viêm gan B, Dại|Bệnh dại',
'Tay chân miệng, Zika, Ebola, Viêm não Nhật Bản, Bại liệt, Viêm gan C, Đậu mùa, Đậu mùa khỉ|Mpox, Cảm lạnh, Rubella|Sởi Đức, Cúm gia cầm, SARS, Herpes, Sùi mào gà|HPV, Viêm gan A',
'MERS, Sốt vàng da, Sốt Tây sông Nile, Virus Marburg, Virus Nipah, Viêm não ngựa, Rota|Tiêu chảy do Rotavirus, Zona thần kinh|Zona, Viêm kết mạc do adenovirus, Sốt Lassa, Hantavirus, Viêm gan E, Norovirus',
'Sốt Hanta, Sốt Crimean-Congo, Sốt thung lũng Rift, Kuru, Viêm gan D, Virus Hendra, Sốt Dengue']},
{id:'r-xuong',c:'Khoa học',q:'Kể tên một chiếc xương trong cơ thể người',s:['xuong'],k:'Xương bướm',t:[
'Xương sườn, Xương sống|Cột sống, Xương sọ',
'Xương đùi, Xương chậu, Xương đòn, Xương bánh chè, Xương cụt',
'Xương ức, Xương bả vai, Xương cánh tay, Xương hàm, Xương gót, Xương ống chân|Xương chày, Xương quai xanh, Đốt sống',
'Xương mác, Xương quay, Xương trụ, Xương cổ tay, Xương bàn tay, Xương ngón tay, Xương bàn chân, Xương sên, Xương thái dương, Xương trán, Xương đỉnh, Xương chẩm, Xương mũi, Xương gò má, Xương móng',
'Xương búa, Xương đe, Xương bàn đạp, Xương sàng, Xương lá mía, Xương lệ, Xương khẩu cái, Xương thuyền, Xương nguyệt, Xương đậu, Xương móc, Xương hộp, Xương chêm']},
{id:'r-nha-phat-minh',c:'Khoa học',q:'Kể tên một nhà phát minh nổi tiếng',s:[],k:'Guglielmo Marconi',t:[
'Thomas Edison|Edison, Nikola Tesla|Tesla, Anh em nhà Wright',
'Alexander Graham Bell|Graham Bell, James Watt, Benjamin Franklin, Leonardo da Vinci, Steve Jobs',
'Johannes Gutenberg|Gutenberg, Alfred Nobel, Karl Benz, Henry Ford, Archimedes, Galileo, Louis Pasteur, Bill Gates, Tim Berners-Lee',
'Samuel Morse, Alessandro Volta, Michael Faraday, Rudolf Diesel, George Stephenson, Eli Whitney, Louis Braille, Alexander Fleming, Wilhelm Röntgen, Anh em Lumière, Elon Musk, Hedy Lamarr, Charles Babbage, Ada Lovelace, Thái Luân',
'Nicéphore Niépce, Louis Daguerre, John Logie Baird, Philo Farnsworth, Elisha Otis, Isaac Singer, Charles Goodyear, James Dyson, Martin Cooper, Willis Carrier, Percy Spencer, Chester Carlson, Gottlieb Daimler']},
{id:'r-nha-khoa-hoc-nu',c:'Khoa học',q:'Kể tên một nhà khoa học nữ nổi tiếng',s:[],k:'Lise Meitner',t:[
'Marie Curie',
'Ada Lovelace, Rosalind Franklin, Jane Goodall, Tu Youyou|Đồ U U',
'Hedy Lamarr, Valentina Tereshkova, Katherine Johnson, Rachel Carson, Florence Nightingale, Grace Hopper, Irène Joliot-Curie',
'Barbara McClintock, Dorothy Hodgkin, Emmy Noether, Hypatia, Sofia Kovalevskaya, Jennifer Doudna, Emmanuelle Charpentier, Donna Strickland, Andrea Ghez, Vera Rubin, Jocelyn Bell Burnell, Dian Fossey, Mae Jemison, Sally Ride, Chien-Shiung Wu|Ngô Kiện Hùng, Maryam Mirzakhani',
'Caroline Herschel, Henrietta Leavitt, Cecilia Payne, Rita Levi-Montalcini, Gertrude Elion, Katalin Karikó, Françoise Barré-Sinoussi, Ada Yonath, Elizabeth Blackburn, May-Britt Moser, Nguyễn Thị Lê, Hoàng Xuân Sính']},
{id:'r-thien-van',c:'Khoa học',q:'Kể tên một thiên thể hoặc hiện tượng thiên văn',s:[],k:'Pulsar|Sao xung',t:[
'Mặt Trời, Mặt Trăng, Sao Hỏa',
'Sao Kim, Sao Mộc, Sao Thổ, Sao chổi, Nhật thực, Nguyệt thực, Mưa sao băng, Dải Ngân Hà',
'Sao Thủy, Sao Thiên Vương, Sao Hải Vương, Sao Diêm Vương, Lỗ đen, Thiên thạch, Tiểu hành tinh, Siêu trăng, Trăng máu, Cực quang, Sao Bắc Đẩu, Sao Hôm, Sao Mai',
'Sao chổi Halley, Thiên hà Tiên Nữ, Tinh vân, Sao lùn trắng, Siêu tân tinh, Sao neutron, Chòm sao Orion|Lạp Hộ, Vành đai Kuiper, Đám mây Oort, Vành đai tiểu hành tinh, Sao Sirius|Thiên Lang, Sao Vega|Chức Nữ, Sao Altair|Ngưu Lang',
'Quasar, Sao Betelgeuse, Sao Rigel, Sao Polaris, Cụm sao Thất Tinh|Pleiades, Ceres, Eris, Makemake, Haumea, Sao lùn nâu, Sao biến quang, Thấu kính hấp dẫn, Sóng hấp dẫn, Bức xạ phông vi sóng']},
{id:'r-tau-vu-tru',c:'Khoa học',q:'Kể tên một tàu vũ trụ, tên lửa hoặc sứ mệnh không gian nổi tiếng',s:['tau'],k:'New Horizons',t:[
'Apollo 11|Apollo, Trạm vũ trụ quốc tế|ISS, Sputnik',
'Tàu con thoi, Kính viễn vọng Hubble|Hubble, Kính James Webb|James Webb, Starship, Falcon 9, Voyager',
'Vostok 1|Vostok, Soyuz, Thường Nga|Hằng Nga, Thần Châu, Curiosity, Perseverance, Artemis, Chandrayaan, Mir|Trạm Mir, Challenger, Columbia, Discovery',
'Voyager 1, Voyager 2, Cassini, Juno, Rosetta, Pioneer, Viking, Spirit, Opportunity, Ingenuity, Thiên Cung|Tiangong, Dragon|Crew Dragon, Saturn V, Gemini, Mercury, Luna 2, Lunokhod, Hayabusa, Parker Solar Probe, Kepler',
'Galileo, Magellan, Mariner, Ulysses, Dawn, OSIRIS-REx, Psyche, Europa Clipper, BepiColombo, Mangalyaan, Tianwen-1, Zhurong, Blue Origin, New Shepard, Vinasat, Vinasat-1, NanoDragon, PicoDragon']},
{id:'r-hien-tuong-tn',c:'Khoa học',q:'Kể tên một hiện tượng thời tiết cực đoan hoặc thiên tai',s:[],k:'Sét hòn',t:[
'Bão, Lũ lụt|Lũ, Động đất',
'Sóng thần, Hạn hán, Lốc xoáy, Núi lửa phun trào|Núi lửa, Sạt lở đất',
'Mưa đá, Siêu bão, Lũ quét, Sét, Rét đậm rét hại, Nắng nóng, Cháy rừng, Xâm nhập mặn, El Nino, La Nina, Áp thấp nhiệt đới, Vòi rồng, Bão tuyết, Băng tuyết, Sương muối',
'Gió Lào|Gió phơn, Triều cường, Mưa axit, Bão cát, Tuyết lở, Sương mù, Sóng nhiệt, Băng giá, Sương giá, Nước dâng do bão, Hố sụt, Lũ ống, Lốc, Giông, Dông sét',
'Mưa băng, Mưa máu, Microburst, Derecho, Bão lửa, Lũ băng, Haboob, Thủy triều đỏ']},
{id:'r-don-vi-tien',c:'Thế giới',q:'Kể tên một đơn vị tiền tệ của một quốc gia',s:['dong','tien'],k:'Kíp',t:[
'Đô la Mỹ|Đô la|USD, Đồng|Việt Nam đồng|VND, Euro',
'Yên Nhật|Yên, Nhân dân tệ|Tệ, Won|Won Hàn Quốc, Bảng Anh|Bảng, Baht|Bạt',
'Rúp|Rúp Nga, Rupee|Rupi Ấn Độ, Đô la Úc, Đô la Canada, Đô la Singapore, Ringgit, Franc Thụy Sĩ|Franc, Đô la Hồng Kông, Đài tệ, Riel',
'Peso, Real|Real Brazil, Rupiah, Lira|Lira Thổ Nhĩ Kỳ, Dirham, Riyal, Rand, Krone|Krona, Zloty, Forint, Shekel, Dinar, Peso Philippines, Taka, Kyat, Tugrik, Kwacha, Naira, Shilling',
'Leu, Lev, Lari, Dram, Manat, Tenge, Som, Somoni, Afghani, Rufiyaa, Ngultrum, Pula, Cedi, Birr, Dalasi, Ariary, Quetzal, Lempira, Córdoba, Colón, Bolívar, Guaraní, Sol']},
{id:'r-chat-hoa-hoc',c:'Khoa học',q:'Kể tên một chất hóa học quen thuộc trong đời sống',s:[],k:'Natri bicarbonat|Baking soda|Muối nở',t:[
'Nước, Muối ăn|Muối, Đường',
'Cồn|Rượu etylic, Xăng, Giấm|Axit axetic, Oxi|Oxy, CO2|Khí cacbonic',
'Axit sulfuric|Axit sunfuric, Nước Javel|Thuốc tẩy, Vôi|Vôi tôi, Xút|NaOH, Amoniac, Phèn chua, Nước oxy già|Oxy già, Khí gas|Gas, Bột ngọt|Mì chính',
'Axit clohidric|HCl, Thạch cao, Đá vôi, Long não, Ozon, Metan, Ure|Phân ure, Clo, Iot, Thủy ngân, Formalin|Formol, Cồn y tế, Paraffin, Nhựa PVC, Xà phòng, Glycerin, Vitamin C',
'Kali permanganat|Thuốc tím, Natri benzoat, Hàn the|Borax, Diêm sinh|Lưu huỳnh, Phenol, Aspirin, Caffeine|Cafein, Nicotine, Nitơ lỏng, Đá khô, Silicon, Carbon monoxide|CO']},
{id:'r-ngon-ngu-lt',c:'Công nghệ',q:'Kể tên một ngôn ngữ lập trình',s:['ngonngu'],k:'Haskell',t:[
'Python, Java, C++',
'JavaScript, C, C#, PHP, HTML',
'Swift, Kotlin, Go|Golang, Ruby, TypeScript, SQL, Pascal, Scratch, Visual Basic|VB, R, Rust, Dart',
'Assembly|Hợp ngữ, Perl, Scala, MATLAB, Lua, Objective-C, Fortran, COBOL, Julia, Bash, Delphi, Prolog, Lisp, Elixir, Erlang, Groovy',
'Clojure, F#, OCaml, Zig, Nim, Crystal, Ada, Smalltalk, Scheme, Racket, Solidity, Mojo, Carbon, Elm, APL, Brainfuck, Logo, Simula, ALGOL']},
{id:'r-mang-xh-cu',c:'Công nghệ',q:'Kể tên một ứng dụng, trang web hay trò chơi từng rất phổ biến ở Việt Nam nhưng nay ít ai dùng',s:['app'],k:'Tamtay',t:[
'Yahoo Messenger|Yahoo, Zing Me, Võ Lâm Truyền Kỳ',
'Audition, MSN, Skype, Nokia Snake|Rắn săn mồi, Gunny, Blog 360|Yahoo 360',
'Flappy Bird, MySpace, Kiếm Thế, Mu Online, Boom Online, Gunbound, Đột Kích|CrossFire, Thiện Nữ U Hồn, Phong Thần, Opera Mini, Winamp, Nhạc Số',
'Clip.vn, Chacha, Go.vn, Cyworld, Friendster, Hi5, Ola, Vine, Google+, ICQ, Paltalk, Mig33, Diễn đàn Ttvnol, 5giay',
'Nimbuzz, eBuddy, Mxit, Sopcast, Mp3.zing, Vatgia, Rongbay, Enbac, Socbay, Baamboo']},
];
