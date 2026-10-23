/**
 * Emits blind scoring sheets for an outside grader: `lexicon  word`, one row per name.
 * Current pop is deliberately left out — the grader must not see the number being audited.
 *
 *   npx tsx scripts/emit-lex-tsv.ts <out-dir> <lexicon>...
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { LEXICONS } from '../shared/book/index.js';

const [outDir, ...rest] = process.argv.slice(2);
if (!outDir) throw new Error('cần out-dir');
mkdirSync(outDir, { recursive: true });

const rows = (lex: string) => {
  const entries = LEXICONS[lex];
  if (!entries) throw new Error(`không có kho "${lex}"`);
  return entries.flatMap((e) => e.names.map((n) => ({ lex, word: n, pop: e.pop })));
};
const write = (name: string, rs: { lex: string; word: string }[]) => {
  const path = join(outDir, name);
  writeFileSync(path, ['lexicon\tword', ...rs.map((r) => `${r.lex}\t${r.word}`)].join('\n') + '\n');
  console.log(`${path}: ${rs.length} dòng`);
};

for (const lex of rest) write(`tu_${lex}_can_cham.tsv`, rows(lex));
