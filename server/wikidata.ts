// A second referee that needs no AI: for prompts that name a clear kind of thing ("a bird", "an insect",
// "a musical instrument"), look the answer up on Wikidata and check that it really is one.
import { norm, soft } from '../shared/normalize.js';

type Rule = {
  /** Wikidata class the answer must belong to. */
  cls: string[];
  /** How membership is checked: up the tree of life, or through "instance of / subclass of", or by occupation. */
  via: 'taxon' | 'kind' | 'job';
  /** Extra check on the typed name as typed, e.g. "starts with B". */
  test?: (raw: string) => boolean;
};

const starts = (c: string) => (raw: string) => norm(raw).startsWith(c);
const ANIMAL = 'Q729';

/** Prompts Wikidata can referee, by question id. Anything not listed falls through to the village. */
export const WIKI_RULES: Record<string, Rule> = {
  'loai-chim': { cls: ['Q5113'], via: 'taxon' },
  'con-trung': { cls: ['Q1390'], via: 'taxon' },
  'dv-thu': { cls: ['Q7377'], via: 'taxon' },
  'dv-bosat': { cls: ['Q10811', 'Q10908'], via: 'taxon' },
  'loai-ca': { cls: ['Q127282'], via: 'taxon' },
  'loai-hoa': { cls: ['Q25314'], via: 'taxon' },
  'dv-chu-b': { cls: [ANIMAL], via: 'taxon', test: starts('b') },
  'dv-chu-t': { cls: [ANIMAL], via: 'taxon', test: starts('t') },
  'dv-chu-h': { cls: [ANIMAL], via: 'taxon', test: starts('h') },
  'dv-chu-s': { cls: [ANIMAL], via: 'taxon', test: starts('s') },
  'dv-chu-n': { cls: [ANIMAL], via: 'taxon', test: starts('n') },
  'con-vat-chu-c': { cls: [ANIMAL], via: 'taxon', test: starts('c') },
  'dv-1tieng': { cls: [ANIMAL], via: 'taxon', test: (raw) => !/\s/.test(raw.trim()) },
  'ngon-ngu': { cls: ['Q34770'], via: 'kind' },
  'nhac-cu': { cls: ['Q34379'], via: 'kind' },
  'the-thao': { cls: ['Q349'], via: 'kind' },
  'nha-khoa-hoc': { cls: ['Q901'], via: 'job' },
};

/** Words people put in front of a name that the encyclopedia leaves out ("chim sáo" → "sáo"). */
const HEADS = ['con', 'loài', 'chim', 'cá', 'cây', 'hoa', 'nhàkhoahọc'];
function bare(s: string) {
  let k = soft(s);
  for (let i = 0; i < 2; i++) for (const h of HEADS) if (k.startsWith(h) && k.length > h.length + 1) k = k.slice(h.length);
  return k;
}
/** The typed words without a leading head word, for searching ("chim sáo sậu" → "sáo sậu"). */
function bareWords(s: string) {
  const words = s.trim().split(/\s+/);
  const heads = new Set(['con', 'loài', 'chim', 'cá', 'cây', 'hoa']);
  while (words.length > 1 && heads.has(words[0].toLowerCase())) words.shift();
  return words.join(' ');
}

const UA = 'Bilion/1.0 (word game referee; contact via site)';

async function getJson(url: string, ms: number, fetcher: typeof fetch) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetcher(url, { signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'application/sparql-results+json, application/json' } });
    if (!r.ok) return null;
    return (await r.json()) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface WikiHit {
  id: string;
  /** The Vietnamese name to show, as Wikidata writes it. */
  display: string;
}

/**
 * Looks the typed answer up in Vietnamese on Wikidata and returns the matching item when it belongs to the prompt's
 * class. Null when the prompt has no rule, nothing matches, or Wikidata is slow (the caller then asks the village).
 */
let defaultFetch: typeof fetch = (...a) => fetch(...a);
/** Tests swap the network out. */
export function setWikiFetch(f: typeof fetch) {
  defaultFetch = f;
}

export async function wikiCheck(questionId: string, input: string, fetcher: typeof fetch = defaultFetch): Promise<WikiHit | null> {
  const rule = WIKI_RULES[questionId];
  if (!rule) return null;
  const typed = soft(input);
  if (typed.length < 2 || typed.length > 50) return null;
  if (rule.test && !rule.test(input)) return null;
  const want = new Set([typed, bare(input)]);
  // Search the typed words, and the bare name too when the player added "chim", "cá", "con"...
  const terms = [...new Set([input.trim(), bareWords(input)])].filter((t) => t.length >= 2).slice(0, 2);
  const found = new Map<string, string>();
  for (const term of terms) {
    const url =
      'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&type=item&limit=7&language=vi&strictlanguage=1&uselang=vi&origin=*&search=' +
      encodeURIComponent(term);
    const j = (await getJson(url, 2000, fetcher)) as { search?: { id: string; label?: string; match?: { language?: string; text?: string } }[] } | null;
    for (const s of j?.search ?? []) {
      const text = s.match?.text ?? s.label ?? '';
      if (s.match?.language && s.match.language !== 'vi') continue;
      // Only an exact name, not a longer one that merely starts with the typed words.
      if (want.has(soft(text)) || want.has(bare(text))) found.set(s.id, s.label ?? text);
    }
    if (found.size) break;
  }
  if (!found.size) return null;
  const ids = [...found.keys()].slice(0, 6);
  const path =
    rule.via === 'taxon' ? 'wdt:P171*' : rule.via === 'job' ? 'wdt:P106/wdt:P279*' : '(wdt:P31|wdt:P279)/wdt:P279*';
  const sparql = `SELECT ?x WHERE { VALUES ?x { ${ids.map((i) => 'wd:' + i).join(' ')} } VALUES ?c { ${rule.cls.map((c) => 'wd:' + c).join(' ')} } ?x ${path} ?c . } LIMIT 1`;
  const r = (await getJson('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql), 2500, fetcher)) as {
    results?: { bindings?: { x?: { value?: string } }[] };
  } | null;
  const uri = r?.results?.bindings?.[0]?.x?.value;
  if (!uri) return null;
  const id = uri.slice(uri.lastIndexOf('/') + 1);
  const label = found.get(id) ?? input;
  // Wikidata's labels are often lower case; show them the way the book does.
  return { id, display: label.charAt(0).toUpperCase() + label.slice(1) };
}

/**
 * Whether the typed name is the exact name (or alias) of something on Wikidata, in Vietnamese or English.
 * Null when Wikidata could not be asked. Used to tell a real foreign name ("Pizza Hut") from keyboard noise.
 */
export async function wikiExists(input: string, fetcher: typeof fetch = defaultFetch): Promise<boolean | null> {
  const typed = soft(input);
  if (typed.length < 2) return false;
  let asked = false;
  for (const lang of ['vi', 'en']) {
    const url =
      'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&type=item&limit=7&origin=*&language=' +
      lang + '&uselang=' + lang + '&search=' + encodeURIComponent(input.trim());
    const j = (await getJson(url, 2000, fetcher)) as { search?: { label?: string; match?: { text?: string } }[] } | null;
    if (!j) continue;
    asked = true;
    if ((j.search ?? []).some((r) => soft(r.match?.text ?? r.label ?? '') === typed || soft(r.label ?? '') === typed)) return true;
  }
  return asked ? false : null;
}
