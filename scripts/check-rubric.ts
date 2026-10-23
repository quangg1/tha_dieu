// Kiểm mọi từ neo trong docs/rubric-do-quen.md: có trong đúng file kho, đúng mức đang gán.
import { readFileSync } from 'node:fs';
import { LEXICONS } from '../shared/book/index.js';

const doc = readFileSync('docs/rubric-do-quen.md', 'utf8');
let lex = '';
let bad = 0, total = 0;
const counts: Record<string, Record<number, number>> = {};

for (const line of doc.split('\n')) {
  const h = line.match(/^### (\w+)/);
  if (h) { lex = h[1]; counts[lex] = {}; continue; }
  const row = line.match(/^\|\s*(?:\*\*)?([1-5])(?:\*\*)?\s*\|(.+)\|\s*$/);
  if (!row || !lex) continue;
  const want = Number(row[1]);
  const words = row[2].split(',').map((w) => w.trim()).filter(Boolean);
  counts[lex][want] = words.length;
  for (const w of words) {
    total++;
    const hits = LEXICONS[lex]?.filter((e) => e.names.some((n) => n.toLowerCase() === w.toLowerCase())) ?? [];
    const pops = [...new Set(hits.map((e) => e.pop))].sort();
    if (!hits.length) { console.log(`THIẾU    ${lex} · ${w}`); bad++; }
    else if (!pops.includes(want)) { console.log(`LỆCH     ${lex} · ${w}: rubric ${want}, kho ${pops.join('/')}`); bad++; }
    else if (pops.length > 1) { console.log(`TRÙNG    ${lex} · ${w}: kho có ${pops.join(' và ')} (rubric ${want})`); }
    else if (hits[0].names[0] !== w) { console.log(`BIẾN THỂ ${lex} · ${w}: là tên khác của mục "${hits[0].names[0]}"`); }
  }
}
console.log('\nSố từ neo mỗi mức:');
for (const [k, v] of Object.entries(counts)) {
  const missing = [1, 2, 3, 4, 5].filter((p) => (v[p] ?? 0) < 3);
  console.log(`  ${k}: ${[1,2,3,4,5].map((p) => `${p}→${v[p] ?? 0}`).join(' ')}${missing.length ? `  ⚠ mức <3 từ: ${missing.join(',')}` : ''}`);
}
console.log(`\n${total} từ neo, ${bad} sai.`);

process.exit(bad ? 1 : 0);
