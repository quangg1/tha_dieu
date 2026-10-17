import { parseLex, type Entry } from './parse.js';
import { soft } from '../normalize.js';
import dongvat from './lex/dongvat.js';
import thucvat from './lex/thucvat.js';
import monan from './lex/monan.js';
import douong from './lex/douong.js';
import diaphuong from './lex/diaphuong.js';
import quocgia from './lex/quocgia.js';
import nhanvat from './lex/nhanvat.js';
import nghe from './lex/nghe.js';
import thethao from './lex/thethao.js';
import nhaccu from './lex/nhaccu.js';
import dovat from './lex/dovat.js';
import quanao from './lex/quanao.js';
import xe from './lex/xe.js';
import cothe from './lex/cothe.js';
import mausac from './lex/mausac.js';
import vanhoa from './lex/vanhoa.js';
import cotich from './lex/cotich.js';
import dantoc from './lex/dantoc.js';
import diadanh from './lex/diadanh.js';
import thegioi from './lex/thegioi.js';
import hoahoc from './lex/hoahoc.js';
import thienvan from './lex/thienvan.js';
import ngonngu from './lex/ngonngu.js';
import tungu from './lex/tungu.js';
import khainiem from './lex/khainiem.js';
import { MORE_LEX } from './lex2/index.js';

export const SOURCES: Record<string, string> = {
  dongvat,
  thucvat,
  monan,
  douong,
  diaphuong,
  quocgia,
  nhanvat,
  nghe,
  thethao,
  nhaccu,
  dovat,
  quanao,
  xe,
  cothe,
  mausac,
  vanhoa,
  cotich,
  dantoc,
  diadanh,
  thegioi,
  hoahoc,
  thienvan,
  ngonngu,
  tungu,
  khainiem,
};

/** Every lexicon of the village book, parsed: the first edition, then the thickening pass (lex2) appended. */
export const LEXICONS: Record<string, Entry[]> = Object.fromEntries(Object.entries(SOURCES).map(([k, v]) => [k, parseLex(k, v + '\n@\n' + (MORE_LEX[k] ?? ''))]));

// Capitals, read from the countries lexicon (the text after "^"), carry their country's labels.
LEXICONS.thudo = LEXICONS.quocgia
  .filter((c) => c.extra?.length)
  .map((c, i) => ({ lex: 'thudo', key: c.extra![0], names: [...c.extra!], pop: c.pop, tags: new Set([...c.tags, 'thudo']), order: i }));

/**
 * A dish named after a place or marked "chay" ("Bún chả Hà Nội", "Bún bò Huế chay") is the same answer as the plain dish,
 * so typing a place name after a common answer cannot turn it into a rare one.
 */
function foldPlaceVariants(lexName: string) {
  const list = LEXICONS[lexName];
  const places = new Set<string>(['chay', 'nambo', 'mienbac', 'mientrung', 'miennam', 'mientay', 'xuthanh', 'xunghe', 'truyenthong', 'giadinh', 'dacbiet']);
  for (const l of ['diaphuong', 'diadanh']) for (const e of LEXICONS[l]) if (l === 'diaphuong' || e.tags.has('tp')) for (const n of e.names) places.add(soft(n));
  const primary = new Map(list.map((e) => [soft(e.names[0]), e]));
  const gone = new Set<Entry>();
  for (const e of list) {
    const words = e.names[0].split(/\s+/);
    for (let k = Math.min(3, words.length - 1); k >= 1; k--) {
      if (!places.has(soft(words.slice(words.length - k).join(' ')))) continue;
      const base = primary.get(soft(words.slice(0, words.length - k).join(' ')));
      if (!base || base === e) continue;
      for (const n of e.names) if (!base.names.includes(n)) base.names.push(n);
      for (const t of e.tags) base.tags.add(t);
      gone.add(e);
      break;
    }
  }
  LEXICONS[lexName] = list.filter((e) => !gone.has(e));
}
foldPlaceVariants('monan');
foldPlaceVariants('douong');
