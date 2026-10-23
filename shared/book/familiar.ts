import { soft } from '../normalize.js';
import { LEXICONS } from './index.js';

// How familiar a word is anywhere in the village book (1–5, the highest of its entries), so an answer the book
// never listed for a prompt can still be judged by how well everyone knows the word.
let index: Map<string, number> | null = null;

export function wordFamiliarity(display: string): number {
  if (!index) {
    index = new Map();
    for (const list of Object.values(LEXICONS)) {
      for (const e of list) for (const n of e.names) {
        const k = soft(n);
        if (e.pop > (index.get(k) ?? 0)) index.set(k, e.pop);
      }
    }
  }
  return index.get(soft(display)) ?? 0;
}

/**
 * The tier a brand-new answer starts at (before real players measure it): a word everyone knows is not rare just
 * because this prompt's book missed it. Unknown words stay in the middle (Hiếm); they can still move with real counts.
 */
export function newAnswerPrior(display: string): number {
  const pop = wordFamiliarity(display);
  if (pop >= 5) return 0;
  if (pop >= 3) return 1;
  return 2;
}
