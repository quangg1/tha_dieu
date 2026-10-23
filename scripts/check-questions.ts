// Checks the question book before a commit: `npm run check:questions`.
// Errors (exit 1): duplicate ids, a hidden answer also listed in the tiers, the same name twice in one question,
// leftover "?" placeholders, a question without exactly five tier lines, a bad `until` date.
// Warnings: small questions, an overfull first tier, a prompt that does not start with "Kể tên", a prompt very close
// to another active one, a category not used anywhere else.
import { BOOK, RETIRED } from '../shared/book/questions.js';
import { RELEASE } from '../shared/book/release.js';
import { soft } from '../shared/normalize.js';

const errors: string[] = [];
const warnings: string[] = [];
const only = process.argv[2];

// Ids across the whole book.
const seen = new Set<string>();
for (const q of BOOK) {
  if (seen.has(q.id)) errors.push(`${q.id}: id dùng hai lần`);
  seen.add(q.id);
}

const active = BOOK.filter((q) => !RETIRED.has(q.id));
const words = (s: string) => new Set(soft(s.replace(/^Kể tên (một )?/i, '')).split(/\s+/).filter((w) => w.length > 1));
const categories = new Map<string, number>();
for (const q of active) categories.set(q.category, (categories.get(q.category) ?? 0) + 1);
const today = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);

for (const q of RELEASE) {
  if (only && !q.id.includes(only)) continue;
  const at = `${q.id} (${q.q})`;
  if (q.t.length !== 5) errors.push(`${at}: cần đúng 5 dòng bậc, đang có ${q.t.length}`);
  const all = [q.k, q.n ?? '', q.q, ...q.t].join(' ');
  if (all.includes('?') && !q.q.includes('?')) errors.push(`${at}: còn dấu "?" (đáp án chưa chắc)`);
  const krill = q.k.split('|').map((x) => soft(x.trim())).filter(Boolean);
  const names = new Map<string, number>();
  q.t.forEach((line, tier) => {
    for (const group of line.split(',')) {
      for (const n of group.split('|').map((x) => x.trim()).filter(Boolean)) {
        const s = soft(n);
        if (krill.includes(s)) errors.push(`${at}: đáp án giấu "${n}" lại nằm trong bậc ${tier + 1}`);
        if (names.has(s)) errors.push(`${at}: "${n}" xuất hiện hai lần (bậc ${names.get(s)! + 1} và ${tier + 1})`);
        else names.set(s, tier);
      }
    }
  });
  const sizes = q.t.map((l) => l.split(',').filter((x) => x.trim()).length);
  const total = sizes.reduce((a, b) => a + b, 0);
  if (total < 25 && !q.until) warnings.push(`${at}: chỉ có ${total} đáp án (nên từ 25)`);
  if (sizes[0] > 6) warnings.push(`${at}: bậc Thường có ${sizes[0]} đáp án, nên 2–5 đáp án ai cũng nghĩ ra`);
  if (sizes[4] === 0) warnings.push(`${at}: bậc Cực hiếm đang trống`);
  if (!/^Kể tên /.test(q.q)) warnings.push(`${at}: câu hỏi nên bắt đầu bằng "Kể tên"`);
  if (q.until) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(q.until)) errors.push(`${at}: until phải dạng YYYY-MM-DD`);
    else if (q.until < today) warnings.push(`${at}: đã hết hạn (until ${q.until})`);
  }
  if ((categories.get(q.c) ?? 0) <= 1) warnings.push(`${at}: chủ đề "${q.c}" chưa câu nào khác dùng, kiểm tra lại tên chủ đề`);
  // A prompt that asks nearly the same thing as another active one.
  const mine = words(q.q);
  for (const o of active) {
    if (o.id === q.id) continue;
    const theirs = words(o.prompt);
    const common = [...mine].filter((w) => theirs.has(w)).length;
    const score = common / Math.max(1, Math.min(mine.size, theirs.size));
    if (score >= 0.85 && mine.size >= 2) warnings.push(`${at}: gần giống câu ${o.id} (${o.prompt})`);
  }
}

for (const e of errors) console.log('LỖI   ' + e);
for (const w of warnings) console.log('CHÚ Ý ' + w);
console.log(`\n${active.length} câu đang dùng · ${errors.length} lỗi · ${warnings.length} chú ý`);
process.exit(errors.length ? 1 : 0);
