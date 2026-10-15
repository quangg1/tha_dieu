import { soft } from '../normalize.js';

/** One thing in the village book: a display name, other names players may type, how familiar it is (1–5) and its labels. */
export interface Entry {
  lex: string;
  key: string;
  names: string[];
  pop: number;
  tags: Set<string>;
  /** Text after "^" on the line, e.g. a country's capital. */
  extra?: string[];
  /** Position in the source, used to break ties between equally familiar entries. */
  order: number;
}

/**
 * Parses a lexicon written one entry per line: `[pop] Name|alias|alias # tag tag ^ extra|extra`.
 * A line `@ tag tag` sets labels for the lines below it; a bare `@` clears them. `//` starts a comment.
 */
export function parseLex(lex: string, src: string, merged?: string[]): Entry[] {
  const out: Entry[] = [];
  const seen = new Map<string, Entry>();
  const byName = new Map<string, Entry>();
  let base: string[] = [];
  for (const raw of src.split('\n')) {
    const line = raw.replace(/\/\/.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('@')) {
      base = line.slice(1).trim().split(/\s+/).filter(Boolean);
      continue;
    }
    let rest = line;
    let pop = 2;
    const m = /^([1-5])\s+/.exec(rest);
    if (m) {
      pop = Number(m[1]);
      rest = rest.slice(m[0].length);
    }
    let extra: string[] | undefined;
    const caret = rest.indexOf('^');
    if (caret >= 0) {
      extra = rest.slice(caret + 1).split('|').map((x) => x.trim()).filter(Boolean);
      rest = rest.slice(0, caret);
    }
    let tags = [...base];
    const hash = rest.indexOf('#');
    if (hash >= 0) {
      tags = tags.concat(rest.slice(hash + 1).trim().split(/\s+/).filter(Boolean));
      rest = rest.slice(0, hash);
    }
    const names = rest.split('|').map((x) => x.trim()).filter(Boolean);
    if (!names.length) continue;
    // Keys keep their tone marks: "dê" (goat) and "dế" (cricket) are different answers.
    const key = soft(names[0]);
    if (!key) continue;
    // The same thing listed twice (a fruit that is also a tree, a dish in two sections): merge names and labels.
    // A later line whose main name is already a name of an earlier line is treated as that same thing.
    const prev = seen.get(key) ?? byName.get(key);
    if (prev) {
      for (const n of names) if (!prev.names.includes(n)) prev.names.push(n);
      for (const t of tags) prev.tags.add(t);
      prev.pop = Math.max(prev.pop, pop);
      if (extra && !prev.extra) prev.extra = extra;
      for (const n of names) if (!byName.has(soft(n))) byName.set(soft(n), prev);
      merged?.push(`${names[0]} → ${prev.names[0]}`);
      continue;
    }
    const e: Entry = { lex, key, names, pop, tags: new Set(tags), extra, order: out.length };
    seen.set(key, e);
    for (const n of names) if (!byName.has(soft(n))) byName.set(soft(n), e);
    out.push(e);
  }
  return out;
}
