/**
 * So một bản chấm độ quen với kho, hoặc so hai bản chấm với nhau.
 *
 *   npx tsx scripts/compare-pop.ts <ket-qua.tsv> <lexicon>     # so với pop trong kho
 *   npx tsx scripts/compare-pop.ts <a.tsv> <b.tsv>             # so hai bản chấm
 *
 * File vào: 4 cột `lexicon  word  pop  ghi_chu`, có dòng tiêu đề.
 * Khi so với kho, chỉ tính dòng **tên chính** của mục: `pop` thuộc về cả mục nên
 * tên khác (`Water spinach` của `Rau muống`) không so được — xem decisions.md.
 */
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { LEXICONS } from '../shared/book/index.js';

type Row = { word: string; pop: number; note: string };
const read = (f: string): Row[] =>
  readFileSync(f, 'utf8').replace(/\r/g, '').trim().split('\n').slice(1).map((l) => {
    const c = l.split('\t');
    return { word: c[1], pop: Number(c[2]), note: c[3] ?? '' };
  });

const report = (pairs: [string, number, number][], aName: string, bName: string) => {
  const d = (n: number) => pairs.filter((p) => p[2] - p[1] === n).length;
  const far = pairs.filter((p) => Math.abs(p[2] - p[1]) >= 2);
  const bias = pairs.reduce((s, p) => s + (p[2] - p[1]), 0) / pairs.length;
  const pct = (n: number) => `${((n / pairs.length) * 100).toFixed(0)}%`;
  console.log(`\n${aName} vs ${bName} — ${pairs.length} từ so được`);
  console.log(`  khớp ${d(0)} (${pct(d(0))}) · lệch ≤1 ${d(-1) + d(0) + d(1)} (${pct(d(-1) + d(0) + d(1))}) · lệch ≥2 ${far.length} (${pct(far.length)})`);
  console.log(`  lệch trung bình ${bias >= 0 ? '+' : ''}${bias.toFixed(2)} (dương = ${bName} chấm quen hơn)`);
  const up = far.filter((p) => p[2] > p[1]).sort((a, b) => b[2] - b[1] - (a[2] - a[1]));
  const dn = far.filter((p) => p[2] < p[1]).sort((a, b) => a[2] - a[1] - (b[2] - b[1]));
  const line = (ps: typeof far) => ps.slice(0, 20).map((p) => `${p[0]} ${p[1]}→${p[2]}`).join(' · ');
  console.log(`  ${bName} kéo LÊN (${up.length}): ${line(up)}`);
  console.log(`  ${bName} kéo XUỐNG (${dn.length}): ${line(dn)}`);
};

const [fileA, second] = process.argv.slice(2);
if (!fileA || !second) throw new Error('cần <ket-qua.tsv> và <lexicon> hoặc <b.tsv>');
const a = read(fileA);

if (existsSync(second)) {
  const bMap = new Map(read(second).map((r) => [r.word, r.pop]));
  report(a.filter((r) => bMap.has(r.word)).map((r) => [r.word, r.pop, bMap.get(r.word)!]), basename(fileA), basename(second));
} else {
  const entries = LEXICONS[second];
  if (!entries) throw new Error(`không có kho "${second}"`);
  const main: [string, number, number][] = [];
  let alias = 0;
  for (const r of a) {
    const e = entries.find((x) => x.names.includes(r.word));
    if (!e) continue;
    if (e.names[0] === r.word) main.push([r.word, e.pop, r.pop]);
    else alias++;
  }
  report(main, `kho ${second}`, basename(fileA));
  if (alias) console.log(`  (bỏ qua ${alias} dòng tên khác — pop thuộc về cả mục)`);
  // Cùng một chuỗi chữ phải có cùng một pop trong một bản chấm.
  const seen = new Map<string, Set<number>>();
  for (const r of a) (seen.get(r.word) ?? seen.set(r.word, new Set()).get(r.word)!).add(r.pop);
  const clash = [...seen].filter(([, v]) => v.size > 1);
  if (clash.length) console.log(`\n  ${clash.length} từ trùng chấm khác mức: ${clash.map(([w, v]) => `${w} ${[...v].join('/')}`).join(' · ')}`);
}
