// Lists every question with its pool size, level and a sample of answers by starting tier.
import { BOOK, BOOK_VERSION, DROPPED } from '../shared/book/questions.js';

const only = process.argv[2];
let total = 0;
for (const q of BOOK) {
  if (only && !q.id.startsWith(only)) continue;
  total += q.answers.length;
  const by = [0, 1, 2, 3, 4, 5].map((t) => q.answers.filter((a) => a.priorTier === t));
  const sample = by.map((l, t) => `${t}:${l.length}${l.length ? ' ' + l.slice(0, t < 2 ? 5 : 3).map((a) => a.display).join(', ') : ''}`).join(' | ');
  console.log(`${q.id.padEnd(22)} L${q.level} ${String(q.answers.length).padStart(4)}  ${q.prompt}\n    ${sample}`);
}
console.log(`\n${BOOK.length} questions, ${total} answers, version ${BOOK_VERSION}`);
if (DROPPED.length) console.log('dropped (too few answers):', DROPPED.join(', '));
