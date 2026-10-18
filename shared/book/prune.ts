// Tidying the village book. Some answers are the same thing as another answer with a colour or a material tacked on
// ("Hoa sen trắng" next to "Hoa sen", "Nhẫn vàng" next to "Nhẫn"). They are folded into the plain answer: the longer
// name still scores, as that answer. Colours that name a different species or product stay apart ("Cá voi xanh",
// "Tiêu đen", "Phượng tím", "Rượu vang đỏ"), and so do colour questions, where "Xanh lam" is the answer itself.
import type { QuestionDef } from '../match.js';

const COLOURS = new Set(['đỏ', 'vàng', 'xanh', 'trắng', 'đen', 'tím', 'hồng', 'cam', 'nâu', 'xám', 'bạc', 'lục', 'lam']);

/** Main names folded into the same name without the trailing colour words, wherever that shorter answer exists. */
export const FOLD_COLOUR = new Set(
  `Áo blouse trắng|Bánh chưng xanh|Bọ cạp vàng|Bọ rùa vàng|Bọ xít đỏ|Bọ xít nâu|Bọ xít xanh|Bói cá xanh|Bồ câu nâu|Bông tai bạc|
Bướm phượng đen|Bướm phượng xanh|Bướm trắng|Bướm vàng|Cá chẽm vàng|Cá đù bạc|Cá đục bạc|Cá đục vàng|Cá đuôi gai vàng|
Cá đuôi gai xanh|Cá he vàng|Cá hề đen|Cá hề hồng|Cá hố bạc|Cá hồng bạc|Cá hồng đỏ|Cá lăng vàng|Cá lượng đỏ|Cá lượng vàng|
Cá ngựa đen|Cá ngựa vàng|Cá phèn hồng|Cá phèn vàng|Cá rô phi xanh|Cá thia xanh|Cá thiên thần xanh|Cá trác đỏ|Cá tráp đỏ|
Cá tráp vàng|Cá trê đen|Cá trê trắng|Cá trê vàng|Cào cào xanh|Cháo kê vàng|Chào mào vàng|Chao đỏ|Chao trắng|Chè cam|
Chim gõ kiến nâu|Chim gõ kiến vàng|Chim gõ kiến xanh|Chim hút mật đỏ|Chim thiên đường đỏ|Chuối đỏ|Cò đen|Cò xanh|Cóc vàng|
Cua xanh|Dâu tằm đỏ|Dây chuyền bạc|Dây chuyền vàng|Diệc xanh|Diều hâu đen|Dơi nâu|Ghẹ đỏ|Ghẹ xanh|Ghế nhựa đỏ|Ghế nhựa xanh|
Gỗ hương đỏ|Gỗ trắc đen|Gỗ trắc đỏ|Hải đường đỏ|Hoa ban đỏ|Hoa ban hồng|Hoa bằng lăng tím|Hoa bằng lăng trắng|Hoa cà tím|
Hoa cẩm chướng đỏ|Hoa chuông tím|Hoa chuông vàng|Hoa cúc kim tiền cam|Hoa cúc tím|Hoa cúc trắng|Hoa cúc vàng|
Hoa dạ yến thảo tím|Hoa dâm bụt trắng|Hoa dâm bụt vàng|Hoa diên vĩ tím|Hoa diên vĩ vàng|Hoa đậu biếc trắng|Hoa đậu đỏ|
Hoa đồng tiền đỏ|Hoa gạo trắng|Hoa gạo vàng|Hoa giấy cam|Hoa giấy tím|Hoa giấy trắng|Hoa hải đường đỏ|Hoa hồng cam|
Hoa hồng đen|Hoa hồng môn đỏ|Hoa hồng tím|Hoa hồng vàng|Hoa hồng xanh|Hoa huệ đỏ|Hoa huệ trắng|Hoa lan hài đỏ|Hoa lan hài hồng|
Hoa lan hài vàng|Hoa lan ý trắng|Hoa lay ơn đỏ|Hoa lục bình tím|Hoa lựu đỏ|Hoa ly hồng|Hoa ly vàng|Hoa mai chiếu thủy trắng|
Hoa mai đỏ|Hoa mai trắng|Hoa mai tứ quý vàng|Hoa mai vàng|Hoa mào gà đỏ|Hoa mào gà vàng|Hoa mắc cỡ hồng|Hoa mộc lan tím|
Hoa mộc lan trắng|Hoa mơ trắng|Hoa mua tím|Hoa mua trắng|Hoa păng xê vàng|Hoa phấn đỏ|Hoa phù dung trắng|Hoa sen hồng|
Hoa sen trắng|Hoa sen vàng|Hoa sen xanh|Hoa sim tím|Hoa súng đỏ|Hoa súng tím|Hoa súng trắng|Hoa súng vàng|Hoa sứ đỏ|Hoa sứ hồng|
Hoa sứ trắng|Hoa tầm xuân trắng|Hoa thiên điểu cam|Hoa thủy tiên trắng|Hoa thủy tiên vàng|Hoa thược dược đỏ|Hoa thược dược vàng|
Hoa tóc tiên trắng|Hoa trang đỏ|Hoa trang trắng|Hoa trang vàng|Hoa tulip đỏ|Hoa tulip tím|Hoa tulip trắng|Hoa tulip vàng|
Hoa xác pháo đỏ|Hồng cam|Hồng đen|Hồng đỏ|Hồng tím|Hồng vàng|Hồng xanh|Huệ đỏ|Húng quế tím|Kền kền đen|Khoai tây tím|
Kiến đen|Kiềng bạc|Kim cương đen|Kim cương hồng|Kim cương xanh|Kiwi vàng|Kỳ nhông xanh|Lắc chân bạc|Lắc chân vàng|Lựu đỏ|
Me xanh|Mơ vàng|Muối đen|Nấm mối đen|Nấm mối trắng|Nấm mỡ nâu|Nấm rơm đen|Nấm sò hồng|Nấm sò tím|Nấm sò vàng|
Nấm thủy tiên nâu|Nghệ vàng|Ngọc trai đen|Nhẫn bạc|Nhẫn vàng|Nhện bạc|Nhện đen|Nhện đỏ|Nhím biển đen|Nhím biển đỏ|Nho xanh|
Ong bắp cày vàng|Ong ruồi đen|Ong ruồi đỏ|Ong vàng|Ốc đỏ|Ốc gai đỏ|Ốc móng tay đen|Ốc vú nàng đen|Quả hồng xiêm vàng|Quạ đen|
Rau dền đỏ|Rau đay đỏ|Rau lang tím|Sao biển đỏ|Sao biển xanh|Sò điệp đỏ|Sò điệp nâu|Sóc đen|Su hào tím|Sư tử trắng|Sứa lửa đỏ|
Sứa vàng|Táo xanh|Thạch anh trắng|Thạch anh xanh|Thanh long vàng|Thiên nga trắng|Tôm bạc|Tôm càng đỏ|Tôm mũ ni đỏ|
Tôm mũ ni trắng|Tôm sú đen|Vạc xám|Vải bạt xanh cam|Vẹt mào đen|Việt quất đen|Vòng tay bạc|Xà tích bạc|Cây gạo đỏ|Cây gạo trắng|
Cây trắc đen|Cây trắc đỏ|Cây mun đen|Cây sến xanh|Cây si đỏ|Cây sưa trắng|Cây kim tiền vàng|Cây vạn lộc đỏ|Cây dây nhện xanh|
Canh rau dền đỏ|Cá rô phi đỏ`
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean),
);

/** Answers that are not answers to their question at all, found when tidying (by main name). */
export const DROP: Record<string, string[]> = {
  'tv-hoa-chu-h': ['Hoa hoa giấy', 'Hoàng hậu', 'Hải quỳ hoa', 'Hoa hậu', 'Hoàng nữ'],
  'phuong-tien': ['Trạm vũ trụ'],
};

/** Answers merged into another answer of the same question (main name → target main name). */
export const MERGE: Record<string, Record<string, string>> = {
  'tv-hoa-chu-h': { 'Hồng ngoại Pháp': 'Hồng ngoại', 'Hồng môn trắng': 'Hồng môn đỏ' },
};

const lower = (s: string) => s.normalize('NFC').toLowerCase();

/** Folds colour variants into their plain answer. The day's hidden answer is never folded away. */
export function foldColours(q: QuestionDef): QuestionDef {
  q = dropAndMerge(q);
  if (q.id.startsWith('ms-') || q.id.startsWith('mau-') || q.family === 'mausac' || q.category === 'Màu sắc') return q;
  const byName = new Map<string, number>();
  q.answers.forEach((a, i) => byName.set(lower(a.aliases[0] ?? a.display), i));
  const gone = new Set<number>();
  const extra = new Map<number, string[]>();
  q.answers.forEach((a, i) => {
    const name = a.aliases[0] ?? a.display;
    if (!FOLD_COLOUR.has(name) || a.key === q.krillKey) return;
    const w = name.split(/\s+/);
    let k = w.length;
    while (k > 1 && COLOURS.has(lower(w[k - 1]))) k--;
    const target = byName.get(lower(w.slice(0, k).join(' ')));
    if (target == null || target === i || gone.has(target)) return;
    gone.add(i);
    extra.set(target, [...(extra.get(target) ?? []), ...a.aliases]);
  });
  if (!gone.size) return q;
  const answers = q.answers
    .map((a, i) => (extra.has(i) ? { ...a, aliases: [...a.aliases, ...extra.get(i)!.filter((x) => !a.aliases.includes(x))] } : a))
    .filter((_, i) => !gone.has(i));
  return { ...q, answers, traps: q.traps?.filter((t) => answers.some((a) => a.key === t)) };
}

function dropAndMerge(q: QuestionDef): QuestionDef {
  const drop = new Set((DROP[q.id] ?? []).map(lower));
  const merge = MERGE[q.id] ?? {};
  if (!drop.size && !Object.keys(merge).length) return q;
  const main = (a: QuestionDef['answers'][number]) => lower(a.aliases[0] ?? a.display);
  let answers = q.answers.filter((a) => a.key === q.krillKey || !drop.has(main(a)));
  for (const [from, to] of Object.entries(merge)) {
    const src = answers.find((a) => main(a) === lower(from));
    const dst = answers.find((a) => main(a) === lower(to));
    if (!src || !dst || src === dst || src.key === q.krillKey) continue;
    answers = answers.filter((a) => a !== src).map((a) => (a === dst ? { ...a, aliases: [...a.aliases, ...src.aliases.filter((x) => !a.aliases.includes(x))] } : a));
  }
  return { ...q, answers, traps: q.traps?.filter((t) => answers.some((a) => a.key === t)) };
}
