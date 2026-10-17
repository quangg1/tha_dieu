// The thickening pass (Krillion depth): more entries for each lexicon, appended to the first edition in ../index.ts.
import dongvat from './dongvat.js';
import thucvat from './thucvat.js';
import monan from './monan.js';
import khainiem from './khainiem.js';
import thethao from './thethao.js';
import nghe from './nghe.js';

export const MORE_LEX: Record<string, string> = {
  dongvat,
  thucvat,
  monan,
  khainiem,
  thethao,
  nghe,
};
