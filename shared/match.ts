import { editDistance, fuzzyLimit, norm, stripPrefix } from './normalize.js';
import type { RawQuestion } from './bank.js';

export interface AnswerEntry {
  key: string;
  display: string;
  /** 0–4 editorial rarity, 5 = the hidden Cung Trăng answer. */
  priorTier: number;
  aliases: string[];
}

export interface QuestionDef {
  id: string;
  category: string;
  prompt: string;
  note?: string;
  strip: string[];
  krillKey: string;
  answers: AnswerEntry[];
}

/** Turns a compact bank entry into a structured question. The first name in each group is the display name. */
export function parseRaw(raw: RawQuestion): QuestionDef {
  const answers: AnswerEntry[] = [];
  const seen = new Set<string>();
  const add = (group: string, priorTier: number) => {
    const names = group.split('|').map((x) => x.trim()).filter(Boolean);
    if (!names.length) return;
    const key = norm(names[0]);
    if (!key || seen.has(key)) return;
    seen.add(key);
    answers.push({ key, display: names[0], priorTier, aliases: names });
  };
  add(raw.k, 5);
  raw.t.forEach((line, tier) => line.split(',').forEach((g) => add(g, tier)));
  return {
    id: raw.id,
    category: raw.c,
    prompt: raw.q,
    note: raw.n,
    strip: raw.s,
    krillKey: norm(raw.k.split('|')[0]),
    answers,
  };
}

export interface MatchResult {
  key: string;
  exact: boolean;
}

/** Finds which known answer a typed input refers to: exact after normalization, then without a classifier prefix, then a small typo budget. */
export class Matcher {
  private readonly map = new Map<string, string>();

  constructor(private readonly strip: string[], entries: { key: string; aliases: string[] }[]) {
    for (const e of entries) {
      for (const a of [e.key, ...e.aliases]) this.addAlias(a, e.key);
    }
  }

  addAlias(alias: string, key: string) {
    const n = norm(alias);
    if (!n) return;
    if (!this.map.has(n)) this.map.set(n, key);
    const s = stripPrefix(n, this.strip);
    if (s && !this.map.has(s)) this.map.set(s, key);
  }

  match(input: string): MatchResult | null {
    const n = norm(input);
    if (!n) return null;
    const forms = [n];
    const s = stripPrefix(n, this.strip);
    if (s) forms.push(s);
    for (const f of forms) {
      const k = this.map.get(f);
      if (k) return { key: k, exact: true };
    }
    let best: string | null = null;
    let bestD = Infinity;
    for (const f of forms) {
      const lim = fuzzyLimit(f.length);
      if (!lim) continue;
      for (const [alias, key] of this.map) {
        if (alias.length < 5) continue;
        const d = editDistance(f, alias, lim);
        if (d <= lim && d < bestD) {
          bestD = d;
          best = key;
        }
      }
    }
    return best ? { key: best, exact: false } : null;
  }
}
