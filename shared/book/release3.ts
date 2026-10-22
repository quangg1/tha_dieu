// Release set, part 3: animals and plants.
import type { ReleaseQuestion } from './release1.js';

export const RELEASE3: ReleaseQuestion[] = [
{id:'r-dv-van',c:'Động vật',q:'Kể tên một con vật có sọc vằn trên mình',s:['con'],k:'Okapi',t:[
'Ngựa vằn, Hổ',
'Cá hề, Ong, Mèo mướp, Sóc chuột',
'Rắn cạp nong, Cá ngựa vằn, Linh dương Kudu, Chồn hôi, Cá mú, Lợn rừng con, Cầy vằn, Thỏ vằn, Kỳ đà, Bọ cánh cứng',
'Rắn biển, Cá thiên thần, Cá mó, Cá sư tử, Sói Tasmania, Ong vò vẽ, Ruồi giả ong, Cá bướm, Tôm tít, Rắn san hô, Cá hổ, Linh dương Bongo, Lửng, Gấu mèo, Mèo rừng',
'Numbat, Hươu đùi vằn, Cá rô phi vằn, Sáo sậu, Cá trê vằn, Thằn lằn đuôi roi, Bò sát vằn, Cầy mangut sọc, Linh cẩu vằn, Ếch vằn']},
{id:'r-dv-dom',c:'Động vật',q:'Kể tên một con vật có đốm trên mình',s:['con'],k:'Cầy gấm',t:[
'Báo, Hươu cao cổ, Bò sữa',
'Báo đốm, Chó đốm|Chó Dalmatian, Bọ rùa, Hươu sao, Báo săn',
'Linh cẩu, Cá đuối, Cá nóc, Ếch, Rắn, Cá mập voi, Báo tuyết, Ngựa đốm, Gà mái mơ, Cá Koi, Mèo báo, Báo hoa mai',
'Linh miêu, Cá mú chấm, Kỳ nhông lửa, Cá heo đốm, Hải cẩu báo, Chó săn Dalmatian, Cá tầm, Bướm, Cú mèo, Trĩ sao, Rùa sao, Báo mây, Gà lôi',
'Mèo cá, Cầy hương, Chim gõ kiến đốm, Ếch phi tiêu, Cá đuối xanh chấm, Lươn đốm, Cá mập beo, Ngựa Appaloosa']},
{id:'r-dv-tui',c:'Động vật',q:'Kể tên một loài thú có túi',s:['con'],k:'Numbat',t:[
'Chuột túi|Kangaroo, Gấu túi|Koala',
'Wallaby|Chuột túi Wallaby, Quỷ Tasmania, Gấu túi mũi trần|Wombat',
'Thú có túi Opossum|Opossum, Sóc bay đường|Sugar glider, Chuột túi cây, Quokka',
'Sói Tasmania, Bandicoot, Bilby, Cuscus, Dunnart, Potoroo, Bettong, Quoll|Mèo túi, Chuột túi đỏ, Chuột túi xám, Wallaroo',
'Pademelon, Antechinus, Kowari, Mulgara, Possum đuôi chổi, Possum lùn, Thú túi chuột chũi, Monito del monte']},
{id:'r-chim-khong-bay',c:'Động vật',q:'Kể tên một loài chim không biết bay',s:['chim','con'],k:'Takahe',t:[
'Đà điểu, Chim cánh cụt',
'Chim Kiwi, Gà, Chim Dodo, Đà điểu Emu',
'Đà điểu đầu mào|Cassowary, Đà điểu Nam Mỹ|Rhea, Vẹt Kakapo, Chim Moa, Gà tây, Công',
'Chim voi, Chim cánh cụt hoàng đế, Chim cánh cụt lớn, Gà nước đảo Inaccessible, Vịt hơi nước, Cốc Galapagos, Kagu, Weka',
'Chim Elephant bird, Chim Haast, Aepyornis, Dromornis, Chim Terror, Phorusrhacos, Gà nước Lord Howe']},
{id:'r-dv-ngu-dong',c:'Động vật',q:'Kể tên một con vật ngủ đông',s:['con'],k:'Chuột sóc',t:[
'Gấu, Ếch',
'Rùa, Rắn, Sóc, Dơi, Nhím',
'Gấu nâu, Gấu xám, Cóc, Thằn lằn, Ong, Ốc sên, Chuột đồng, Lửng',
'Macmot, Sóc đất, Kỳ nhông, Chuột nhảy, Chim cú muỗi Bắc Mỹ, Cá chép, Bướm vua, Bọ rùa, Ong nghệ, Chồn, Gấu đen',
'Lemur lùn đuôi béo, Hamster châu Âu, Chim Poorwill, Rùa hộp, Ếch gỗ, Cá phổi']},
{id:'r-dv-doi-mau',c:'Động vật',q:'Kể tên một con vật có thể đổi màu',s:['con'],k:'Cá bơn',t:[
'Tắc kè hoa, Bạch tuộc',
'Mực, Kỳ nhông, Thằn lằn',
'Cá ngựa, Tắc kè, Nhện cua, Cáo Bắc Cực, Thỏ tuyết, Ếch cây, Cá mập, Cua',
'Mực nang, Cá đá, Cá thu, Bạch tuộc bắt chước|Bạch tuộc mimic, Chồn Ermine, Gà gô trắng, Bọ cánh cứng rùa, Bọ ngựa',
'Cá chình, Cá mặt trời, Cá hoàng đế, Bướm Kallima, Cá rô biển, Nhện hoa, Ếch Pacific']},
{id:'r-dv-phat-sang',c:'Động vật',q:'Kể tên một sinh vật có thể tự phát sáng',s:['con'],k:'Mực đom đóm',t:[
'Đom đóm, Sứa',
'Cá lồng đèn, Cá mặt quỷ, Tảo biển phát sáng',
'Mực, Giun phát sáng, Nấm phát sáng, San hô, Tôm phát sáng, Sứa lược',
'Cá đèn lồng, Ấu trùng muỗi nấm, Bạch tuộc phát sáng, Sao biển giòn, Cá mập lồng đèn, Rết phát sáng, Ốc sên phát sáng, Krill, Mực ma cà rồng',
'Cá rìu, Cá răng nanh, Mực đom đóm Nhật, Giun tơ phát sáng, Cá mập cắt bánh quy, Dinoflagellate']},
{id:'r-dv-bac-cuc',c:'Động vật',q:'Kể tên một con vật sống ở vùng Bắc Cực hoặc Nam Cực',s:['con'],k:'Chim Skua',t:[
'Gấu Bắc Cực, Chim cánh cụt',
'Hải cẩu, Cáo Bắc Cực, Tuần lộc, Cá voi',
'Hải mã, Sói Bắc Cực, Cú tuyết, Thỏ Bắc Cực, Kỳ lân biển, Cá voi trắng|Beluga, Bò xạ hương, Chim cánh cụt hoàng đế',
'Hải cẩu báo, Hải cẩu Weddell, Cá voi đầu cong, Krill, Chim nhàn Bắc Cực, Chim hải âu lớn, Cá voi xanh, Cá voi sát thủ, Chồn Ermine, Gà gô trắng, Lemming|Chuột Lemming, Chim cánh cụt Adelie',
'Cá băng, Cá mập Greenland, Puffin, Chim cánh cụt quai mũ, Chim cánh cụt Gentoo, Hải cẩu Ross, Hải cẩu cua, Nhện biển Nam Cực, Gấu nước']},
{id:'r-dv-bieu-tuong',c:'Động vật',q:'Kể tên một con vật là biểu tượng của một quốc gia',s:['con'],k:'Chim Kiwi',t:[
'Trâu, Gấu trúc, Chuột túi|Kangaroo',
'Đại bàng đầu trắng, Rồng, Sư tử, Gà trống, Voi, Hổ',
'Gấu nâu, Gấu túi, Hải ly, Đại bàng, Chim hạc, Sếu đầu đỏ, Bò tót, Chim công, Lạc đà, Kỳ lân',
'Hổ Bengal, Hổ Mã Lai, Rồng Komodo, Chim thiên đường, Sư tử Singapore, Ngựa Ả Rập, Chim Quetzal, Thần ưng Andes|Condor, Chim cánh cụt, Bò rừng bison, Cá chép Koi',
'Chim Dodo, Linh dương Springbok, Hồng hạc, Chim Toucan, Báo đốm Jaguar, Tê giác một sừng, Chim Garuda, Chim trĩ xanh, Đại bàng Philippines, Hổ Amur']},
{id:'r-dv-vot',c:'Động vật',q:'Kể tên một con vật có vòi',s:['con'],k:'Linh dương Saiga',t:[
'Voi',
'Heo vòi|Lợn vòi, Muỗi, Bướm',
'Khỉ vòi, Hải tượng|Hải cẩu voi, Voi ma mút, Chuột chù voi, Ruồi, Ong',
'Chuột chù, Cá voi, Thú ăn kiến, Bọ vòi voi|Mọt vòi voi, Ngài, Ve sầu, Rệp, Bọ xít',
'Cá vòi voi, Chuột chù vòi, Giun vòi, Ruồi hút mật']},
{id:'r-dv-disney',c:'Giải trí',q:'Kể tên một con vật là nhân vật nổi tiếng trong phim hoạt hình',s:[],k:'Hei Hei',t:[
'Chuột Mickey, Vịt Donald, Simba',
'Nemo, Dory, Dumbo, Bambi, Tom và Jerry|Mèo Tom|Chuột Jerry, Pikachu, Doraemon',
'Pumbaa, Timon, Nala, Mufasa, Scar, Thumper, Goofy, Pluto, Daisy, Minnie, Stitch, Baloo, Bagheera, Kaa, Shere Khan, Rafiki, Abu, Flounder, Sebastian',
'Zazu, Pascal, Maximus, Sven, Rajah, Meeko, Mushu, Pua, Judy Hopps, Nick Wiles|Nick Wilde, Po, Hổ Tigress, Gấu Pooh|Winnie the Pooh, Piglet, Tigger, Eeyore, Bugs Bunny|Thỏ Bugs, Garfield, Scooby-Doo, Snoopy',
'Abu, Iago, Marie, Figaro, Sergeant Tibbs, Gus, Jaq, Lucifer, Copper, Tod, Duchess, Bernard, Bianca, Roquefort, Rex, Hamm, Bullseye, Remy, Dug, Kevin, Sid, Manny, Diego, Scrat']},
{id:'r-dv-co-tich',c:'Văn học',q:'Kể tên một con vật trong truyện cổ tích hoặc ngụ ngôn Việt Nam',s:['con'],k:'Chim Phượng Hoàng|Phượng hoàng',t:[
'Rùa Vàng, Trăn tinh, Chim đại bàng',
'Cáo, Cóc|Cậu Cóc, Thỏ, Rùa, Quạ, Trâu, Hổ',
'Chim thần, Đại bàng tinh, Cá bống, Gà trống, Ếch ngồi đáy giếng|Ếch, Dê, Sói, Gấu, Chó, Mèo, Voi',
'Ngựa sắt, Chim lạc, Rồng, Rùa thần Kim Quy, Thần Kim Quy, Mèo và Chuột, Kiến và Châu chấu, Ve sầu, Cò, Cua, Sư tử, Ngựa, Chim sẻ, Khỉ',
'Chuột, Lợn, Rắn, Cá chép, Hươu, Nai, Chim én, Cú, Dế mèn, Kiến']},
{id:'r-cay-gai',c:'Thực vật',q:'Kể tên một loài cây hoặc hoa có gai',s:['cay'],k:'Cây bồ kết',t:[
'Xương rồng, Hoa hồng',
'Sầu riêng, Mít, Bưởi, Chanh, Hoa giấy, Cây mây',
'Cây keo, Cây gai, Cây trinh nữ|Cây xấu hổ|Mắc cỡ, Dứa, Cây táo, Cây hoàng nam, Cây cúc gai, Cây bông ổi, Cây sim',
'Cây gáo, Cây me keo, Cây tầm ma, Cây ké, Cây kim ngân, Cây sung, Cây vông, Cây hoa sứ gai, Cây xương rồng bát tiên, Cây lưỡi hổ, Cây cam, Cây quýt, Cây gạo',
'Cây keo gai, Cây tầm xuân, Cây dứa dại, Cây cà gai leo, Cây bồ hòn, Cây dương xỉ gai, Cây cơm cháy, Cây mâm xôi, Cây táo gai, Cây keo Acacia']},
{id:'r-hoa-dem',c:'Thực vật',q:'Kể tên một loài hoa nở về đêm',s:['hoa'],k:'Hoa bìm bìm trắng',t:[
'Hoa quỳnh, Hoa dạ hương',
'Hoa sữa, Hoa nhài|Hoa lài, Hoa dạ lý hương',
'Hoa ngọc lan, Hoa dạ yến thảo, Hoa thanh long, Hoa súng, Hoa huệ, Hoa phấn|Hoa bông phấn',
'Hoa thiên lý, Hoa trúc đào, Hoa mộc, Hoa lan dạ hương, Hoa hoàng lan, Hoa dành dành, Hoa bìm bìm, Hoa cẩm chướng đêm',
'Hoa nguyệt quế, Hoa mặt trăng, Hoa anh thảo chiều, Hoa xác chết, Hoa dạ hợp, Hoa ngọc trâm']},
{id:'r-cay-pho',c:'Thực vật',q:'Kể tên một loại cây thường trồng làm bóng mát trên đường phố',s:['cay'],k:'Cây long não',t:[
'Cây bàng, Cây phượng|Phượng vĩ, Cây xà cừ',
'Cây sấu, Cây me, Cây dầu, Cây bằng lăng, Cây sao, Cây sữa|Hoa sữa',
'Cây lim, Cây sưa, Cây muồng, Cây osaka|Muồng hoàng yến, Cây sao đen, Cây keo, Cây bạch đàn, Cây gạo, Cây đa, Cây si, Cây lộc vừng, Cây giáng hương',
'Cây vông, Cây ban, Cây chẹo, Cây ngọc lan, Cây sò đo cam, Cây phi lao, Cây thông, Cây dầu rái, Cây sanh, Cây đề, Cây xoài, Cây vú sữa, Cây lát hoa',
'Cây muồng đen, Cây chò, Cây sưa đỏ, Cây giáng hương Ấn, Cây hoa ban tím, Cây kèn hồng, Cây điệp vàng, Cây móng bò, Cây lim xẹt']},
{id:'r-cay-dau-an',c:'Thực vật',q:'Kể tên một loại cây cho dầu ăn',s:['cay','dau'],k:'Cây trẩu',t:[
'Đậu nành, Lạc|Đậu phộng, Dừa',
'Vừng|Mè, Hướng dương, Ô liu, Cọ dầu|Dầu cọ',
'Cải dầu|Hạt cải, Ngô|Bắp, Gấc, Bông|Hạt bông, Lanh, Sachi, Óc chó, Hạnh nhân',
'Mắc ca, Điều, Bơ, Lúa|Cám gạo, Rum|Hoa rum, Thầu dầu, Trà|Hạt trà, Hạt nho, Hạt bí',
'Sở, Jojoba, Argan, Shea|Hạt mỡ, Dầu mè đen, Hạt gai dầu, Hạt tía tô, Lạc tiên']},
{id:'r-cay-thuoc',c:'Thực vật',q:'Kể tên một cây thuốc nam quen thuộc',s:['cay','la'],k:'Cây xạ đen',t:[
'Gừng, Ngải cứu, Tía tô',
'Diếp cá, Rau má, Nghệ, Sả, Lá lốt, Kinh giới, Bạc hà',
'Cam thảo, Hoài sơn, Đinh lăng, Lá ổi, Lá tre, Lá sen, Rau sam, Cỏ mực, Mã đề, Lá vối, Trinh nữ hoàng cung, Atiso',
'Cà gai leo, Diệp hạ châu|Chó đẻ răng cưa, Nhân trần, Ích mẫu, Hà thủ ô, Bồ công anh, Kim tiền thảo, Râu mèo, Lá khôi, Xuyên tâm liên, Hương nhu, Lá bỏng, Sâm đại hành, Nhọ nồi',
'Cây xáo tam phân, Cây an xoa, Cây chè dây, Cây giảo cổ lam, Cây mật nhân, Cây cỏ ngọt, Cây thìa canh, Cây lá đắng, Cây mướp đắng rừng']},
{id:'r-cay-co-thu',c:'Thực vật',q:'Kể tên một loại cây gỗ quý của Việt Nam',s:['go','cay'],k:'Gỗ Sa mu dầu',t:[
'Gỗ lim, Gỗ hương, Gỗ trắc',
'Gỗ gụ, Gỗ mun, Gỗ sưa, Gỗ cẩm lai, Gỗ pơ mu, Gỗ xoan',
'Gỗ đinh, Gỗ nghiến, Gỗ táu, Gỗ sến, Gỗ dáng hương, Gỗ thông, Gỗ căm xe, Gỗ me tây, Gỗ mít, Gỗ xà cừ',
'Gỗ kiền kiền, Gỗ chò chỉ, Gỗ trầm hương|Trầm hương, Gỗ thủy tùng, Gỗ bách xanh, Gỗ hoàng đàn, Gỗ muồng đen, Gỗ cà te, Gỗ giổi, Gỗ de, Gỗ vàng tâm, Gỗ re',
'Gỗ sa mộc, Gỗ dổi, Gỗ chua khét, Gỗ trai, Gỗ lát hoa, Gỗ cà chít, Gỗ huỳnh đường, Gỗ huỳnh đàn, Gỗ kim giao, Gỗ thông đỏ']},
{id:'r-thu-cung',c:'Động vật',q:'Kể tên một giống chó được nuôi làm cảnh',s:['cho','giongcho'],k:'Chó Xoloitzcuintli',t:[
'Chó Phốc|Chihuahua, Chó Poodle|Chó Poodle Tiny, Chó Husky',
'Chó Corgi, Chó Pug, Chó Golden|Golden Retriever, Chó Becgie|Chó Béc giê|German Shepherd, Chó Alaska, Chó Shiba, Chó Phú Quốc, Chó Pom|Pomeranian',
'Chó Labrador, Chó Samoyed, Chó Bulldog, Chó Chow Chow, Chó Dalmatian, Chó Rottweiler, Chó Pitbull, Chó Doberman, Chó Beagle, Chó Shih Tzu, Chó Akita, Chó Bắc Hà, Chó H\'Mông cộc đuôi, Chó Lạp xưởng|Dachshund',
'Chó Border Collie, Chó Maltese, Chó Yorkshire|Chó Yorkshire Terrier, Chó Bichon, Chó Cocker, Chó Dobermann, Chó Great Dane, Chó Saint Bernard, Chó Ngao Tây Tạng, Chó Boxer, Chó Bắc Kinh|Chó Pekingese, Chó Schnauzer, Chó Lhasa Apso, Chó Mông Cổ, Chó Greyhound',
'Chó Basenji, Chó Afghan, Chó Borzoi, Chó Whippet, Chó Weimaraner, Chó Vizsla, Chó Newfoundland, Chó Bernese, Chó Akita Mỹ, Chó Cane Corso, Chó Shar Pei, Chó Papillon, Chó Bedlington']},
{id:'r-ca-canh',c:'Động vật',q:'Kể tên một loài cá cảnh',s:['ca'],k:'Cá phượng hoàng',t:[
'Cá vàng, Cá bảy màu, Cá Koi',
'Cá rồng, Cá la hán, Cá chọi|Cá betta, Cá dĩa, Cá neon',
'Cá thần tiên|Cá ông tiên, Cá hồng két, Cá molly, Cá tai tượng, Cá lau kiếng, Cá mún, Cá hoàng đế, Cá ngựa, Cá hề, Cá đuôi kiếm',
'Cá phát tài, Cá ali, Cá tetra, Cá chuột, Cá sặc gấm, Cá kim long, Cá Oscar, Cá ngân long, Cá sóc đầu đỏ, Cá thủy tinh, Cá bống mắt tre, Cá hồng vĩ mỏ vịt, Cá tỳ bà, Cá trâm',
'Cá Discus, Cá Arowana, Cá Flowerhorn, Cá cầu vồng, Cá Corydoras, Cá Pleco, Cá Killifish, Cá Rasbora, Cá Danio, Cá Gourami, Cá trê bạch tạng']},
];
