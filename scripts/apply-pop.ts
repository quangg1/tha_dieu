/**
 * Áp một bản chấm độ quen vào kho: chỉ sửa các mục mà bản chấm và kho lệch ≥ 2 mức
 * (tính trên mức thô của bản chấm), và đặt về mức sau khi chuyển thang.
 * Chỗ lệch 1 mức để nguyên — trong tầm nhiễu của một người chấm.
 *
 *   npx tsx scripts/apply-pop.ts <ket-qua.tsv> <lexicon> [--map 1,3,4,4,5] [--up-only] [--write]
 *
 * `--map` là bảng chuyển thang cho mức 1→5 của bản chấm, học từ bộ từ chồng khi bản chấm
 * nằm trên thang khác thang đồng thuận (xem decisions.md ngày 2026-10-23).
 * Chỉ tính dòng tên chính: `pop` thuộc về cả mục nên tên khác không áp được.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { LEXICONS } from '../shared/book/index.js';

const argv = process.argv.slice(2);
const [file, lex] = argv.filter((a) => !a.startsWith('--'));
if (!file || !lex) throw new Error('cần <ket-qua.tsv> <lexicon>');
const write = argv.includes('--write');
// Chỉ kéo lên: dùng khi bản chấm có chiều kéo xuống đáng ngờ (xem decisions.md).
const upOnly = argv.includes('--up-only');
const mapArg = argv[argv.indexOf('--map') + 1];
const table = argv.includes('--map')
  ? new Map(mapArg.split(',').map((v, i) => [i + 1, Number(v)] as const))
  : new Map([1, 2, 3, 4, 5].map((p) => [p, p] as const));
if ([...table.values()].some((v) => !(v >= 1 && v <= 5))) throw new Error('--map phải là 5 số trong 1–5');

const entries = LEXICONS[lex];
if (!entries) throw new Error(`không có kho "${lex}"`);

const want = new Map<string, { kho: number; moi: number }>();
let alias = 0;
for (const l of readFileSync(file, 'utf8').replace(/\r/g, '').trim().split('\n').slice(1)) {
  const c = l.split('\t');
  const e = entries.find((x) => x.names.includes(c[1]));
  if (!e) continue;
  if (e.names[0] !== c[1]) { alias++; continue; }
  // Cổng là mức **thô** của bản chấm: chỉ sửa chỗ hai bên thực sự bất đồng, không để
  // bảng chuyển thang tự đẻ ra ca lệch. Mức đặt vào thì lấy sau khi chuyển thang.
  const tho = Number(c[2]);
  if (Math.abs(tho - e.pop) >= 2 && !(upOnly && tho < e.pop)) want.set(c[1], { kho: e.pop, moi: table.get(tho)! });
}
console.log(`bảng chuyển thang: ${[1, 2, 3, 4, 5].map((p) => `${p}→${table.get(p)}`).join(' ')}`);
console.log(`${want.size} mục lệch ≥ 2 mức cần sửa (bỏ qua ${alias} dòng tên khác)`);

/** Tên đầu tiên của một dòng kho, hoặc null nếu dòng không phải một mục. */
const firstName = (line: string): string | null => {
  const t = line.replace(/\/\/.*$/, '').trim();
  const m = /^[1-5]\s+/.exec(t);
  if (!m) return null;
  let rest = t.slice(m[0].length);
  for (const sep of ['#', '^']) {
    const i = rest.indexOf(sep);
    if (i >= 0) rest = rest.slice(0, i);
  }
  return rest.split('|')[0].trim() || null;
};

const hit = new Map<string, number>();
for (const f of [`shared/book/lex/${lex}.ts`, `shared/book/lex2/${lex}.ts`]) {
  let lines: string[];
  try { lines = readFileSync(f, 'utf8').split('\n'); } catch { continue; }
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    const name = firstName(lines[i]);
    const w = name && want.get(name);
    if (!w) continue;
    hit.set(name, (hit.get(name) ?? 0) + 1);
    lines[i] = lines[i].replace(/^(\s*)[1-5]/, `$1${w.moi}`);
    n++;
  }
  if (write && n) writeFileSync(f, lines.join('\n'));
  console.log(`${f}: ${n} dòng${write && n ? ' — đã ghi' : ''}`);
}

const miss = [...want.keys()].filter((w) => !hit.has(w));
const multi = [...hit].filter(([, n]) => n > 1);
if (miss.length) console.log(`\nKHÔNG TÌM THẤY DÒNG (${miss.length}): ${miss.slice(0, 20).join(' · ')}`);
if (multi.length) console.log(`\nNHIỀU DÒNG (${multi.length}): ${multi.map(([w, n]) => `${w}×${n}`).join(' · ')}`);
if (!miss.length && !multi.length) console.log('\nMỗi mục khớp đúng một dòng.');
if (!write) console.log('(chạy lại với --write để ghi)');
