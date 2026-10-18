import { editDistance, fuzzyLimit, norm, soft } from './normalize.js';
import type { RawQuestion } from './bank.js';

export interface AnswerEntry {
  /** Tone-preserving key of the main name: "dê" and "dế" are different answers. */
  key: string;
  display: string;
  /** 0–4 starting rarity, 5 = the hidden Cung Trăng answer. */
  priorTier: number;
  /** Every name a player may type for this answer, the display name first. */
  aliases: string[];
}

export interface QuestionDef {
  id: string;
  category: string;
  prompt: string;
  note?: string;
  /** Leading words that can be dropped from an answer ("con", "hoa", "tỉnh"…), written without tones or spaces. */
  strip: string[];
  krillKey: string;
  answers: AnswerEntry[];
  /** Generic words that are too vague to count (e.g. "chim" for "a bird"); the player is asked to be more specific. */
  vague?: string[];
  /** 1 easy · 2 medium · 3 hard. */
  level?: number;
  /** Lexicons the question draws from, used to keep a day's set varied. */
  family?: string;
  /** Keys of "famously obscure" answers that everyone reaches for: they land as Khôn lỏi. */
  traps?: string[];
}

/** Turns a compact handcrafted bank entry into a structured question. The first name in each group is the display name. */
export function parseRaw(raw: RawQuestion): QuestionDef {
  const answers: AnswerEntry[] = [];
  const seen = new Set<string>();
  const add = (group: string, priorTier: number) => {
    const names = group.split('|').map((x) => x.trim()).filter(Boolean);
    if (!names.length) return;
    const key = soft(names[0]);
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
    krillKey: soft(raw.k.split('|')[0]),
    answers,
  };
}

/** Drops leading classifier words ("con mèo" → "mèo", "thành phố Huế" → "Huế"); prefixes are toneless and joined, e.g. "thanhpho". */
export function stripWords(input: string, prefixes: readonly string[]): string | null {
  if (!prefixes.length) return null;
  const words = input.normalize('NFC').trim().split(/[\s\-–]+/).filter(Boolean);
  for (let k = Math.min(3, words.length - 1); k >= 1; k--) {
    const head = norm(words.slice(0, k).join(''));
    if (prefixes.includes(head)) return words.slice(k).join(' ');
  }
  return null;
}

export interface MatchResult {
  key: string;
  /** false when the input only resembles the answer (a typo, or missing tones that fit several answers): the player confirms first. */
  exact: boolean;
}

interface Cand {
  key: string;
  /** Lower is preferred when several answers share a toneless spelling: the more common answer. */
  rank: number;
}

/**
 * Finds which known answer a typed input refers to.
 * 1. Exact name with tones (after dropping case, spaces and punctuation), with or without a classifier word.
 * 2. Without tones, when only one answer is spelled that way. If several are ("de" = dê or dế), the most common is offered for confirmation.
 * 3. A small typo budget on longer words, offered for confirmation.
 */
/**
 * Words that name the kind of thing rather than the thing: a shop, an app, a bank, a club. People drop them
 * ("TikTok" for TikTok Shop) or add them ("ngân hàng MB", "app Shopee"), and either way mean the same answer.
 */
const GENERIC_PHRASES = [
  'ngân hàng', 'ứng dụng', 'câu lạc bộ', 'hãng hàng không', 'trang web', 'cửa hàng', 'siêu thị', 'tập đoàn', 'công ty',
  'ngan hang', 'ung dung', 'cau lac bo', 'trang web', 'cua hang', 'sieu thi', 'tap doan', 'cong ty',
];
// Tones are kept while matching these, so "hãng" (a brand) never swallows "hàng", "hang" or "Hằng".
// Kind words only say what sort of thing it is: dropping one still names the same answer.
const KIND_WORDS = new Set(['shop', 'mall', 'app', 'apps', 'online', 'mobile', 'bank', 'airlines', 'airline', 'airways', 'hãng', 'fc', 'clb', 'store', 'official', 'web', 'website', 'group', 'inc']);
// Product words tell one service of a brand from another (Apple Music, Apple TV, ShopeeFood): without one, ask.
const PRODUCT_WORDS = new Set(['mart', 'food', 'express', 'music', 'tv', 'play', 'plus']);

/** A name with its generic words removed, compared without tones; '' when too little is left to be sure. */
function coreOf(name: string, min = 3, product = false) {
  let t = ' ' + name.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}+#&]+/gu, ' ') + ' ';
  for (const p of GENERIC_PHRASES) t = t.split(` ${p} `).join(' ');
  const kept = t.split(' ').filter((w) => w && !KIND_WORDS.has(w) && !(product && PRODUCT_WORDS.has(w)));
  const core = norm(kept.join(''));
  return core.length >= min ? core : '';
}

/** Questions about brands, shops, apps and clubs, where a generic word on a name changes nothing. */
const BRAND_QUESTIONS = new Set([
  'pop-mua-sam-online', 'pop-goi-xe', 'pop-ngan-hang', 'pop-hang-bay', 'pop-clb-bong-da', 'pop-ngoai-hang-anh', 'pop-sieu-thi',
  'pop-do-an-nhanh', 'pop-chuoi-do-uong', 'pop-app-xem-phim', 'pop-app-hoc', 'pop-mang-xa-hoi', 'pop-game', 'pop-dien-thoai',
  'pop-nha-mang', 'pop-thoi-trang', 'pop-my-pham', 'pop-my-pham-han', 'pop-hang-xa-xi', 'pop-mi-goi', 'pop-banh-keo',
  'pop-nuoc-giai-khat', 'pop-hang-sua', 'pop-xe-may', 'kn-hangxe', 'kn-hangcn', 'kn-app', 'n-giay-hieu',
]);
export function namesBrands(questionId: string) {
  return BRAND_QUESTIONS.has(questionId);
}

/** Whether the player typed Vietnamese tone or vowel marks (or đ). */
function marked(s: string) {
  return /[\u00c0-\u1ef9]/.test(s.normalize('NFC'));
}

export class Matcher {
  private readonly exactMap = new Map<string, Cand>();
  private readonly strippedMap = new Map<string, Cand>();
  private readonly loose = new Map<string, Cand[]>();
  /** Names with their generic words taken off ("TikTok Shop" → "tiktok", "Ngân hàng MB" → "mb"). */
  private readonly core = new Map<string, Cand[]>();
  /** The same with product words off too ("Apple Music" → "apple"): a match here is offered, not taken. */
  private readonly productCore = new Map<string, Cand[]>();

  constructor(
    private readonly strip: string[],
    entries: { key: string; aliases: string[]; priorTier?: number }[],
    private readonly brands = false,
  ) {
    // Main names first, so an alias never takes a word that is another answer's own name.
    const sorted = [...entries];
    for (const e of sorted) this.put(e.aliases[0] ?? e.key, e.key, e.priorTier ?? 2, 0);
    for (const e of sorted) for (const a of e.aliases.slice(1)) this.put(a, e.key, e.priorTier ?? 2, 1);
    for (const e of sorted) if (!e.aliases.length) this.put(e.key, e.key, e.priorTier ?? 2, 0);
  }

  /** Teaches the matcher another name for an answer (from the review queue or the referee). */
  addAlias(alias: string, key: string, priorTier = 3) {
    this.put(alias, key, priorTier, 1);
  }

  private put(name: string, key: string, tier: number, level: number) {
    const s = soft(name);
    if (!s) return;
    const rank = tier * 10 + level;
    if (!this.exactMap.has(s)) this.exactMap.set(s, { key, rank });
    this.addLoose(norm(name), key, rank);
    if (this.brands) {
      const add = (map: Map<string, Cand[]>, c: string) => {
        if (!c) return;
        const list = map.get(c) ?? [];
        const prev = list.find((x) => x.key === key);
        if (prev) prev.rank = Math.min(prev.rank, rank);
        else list.push({ key, rank });
        map.set(c, list);
      };
      add(this.core, coreOf(name));
      add(this.productCore, coreOf(name, 3, true));
    }
    const st = stripWords(name, this.strip);
    if (st) {
      const ss = soft(st);
      if (ss.length >= 2 && !this.strippedMap.has(ss)) this.strippedMap.set(ss, { key, rank: rank + 5 });
      if (ss.length >= 2) this.addLoose(norm(st), key, rank + 5);
    }
  }

  private addLoose(n: string, key: string, rank: number) {
    if (!n) return;
    const list = this.loose.get(n) ?? [];
    const prev = list.find((c) => c.key === key);
    if (prev) prev.rank = Math.min(prev.rank, rank);
    else list.push({ key, rank });
    this.loose.set(n, list);
  }

  match(input: string): MatchResult | null {
    const raw = input.trim();
    if (!raw) return null;
    const st = stripWords(raw, this.strip);
    const softs = [soft(raw), st ? soft(st) : ''].filter(Boolean);
    for (const s of softs) {
      const hit = this.exactMap.get(s);
      if (hit) return { key: hit.key, exact: true };
    }
    for (const s of softs) {
      const hit = this.strippedMap.get(s);
      if (hit) return { key: hit.key, exact: true };
    }
    const looses = [norm(raw), st ? norm(st) : ''].filter(Boolean);
    for (const n of looses) {
      const list = this.loose.get(n);
      if (!list?.length) continue;
      const keys = new Set(list.map((c) => c.key));
      const best = [...list].sort((a, b) => a.rank - b.rank)[0];
      return { key: best.key, exact: keys.size === 1 };
    }
    // The same name with or without a generic word: "TikTok" for TikTok Shop, "app Shopee", "CLB Arsenal".
    const c = this.brands ? coreOf(raw) : '';
    const byCore = c ? this.core.get(c) : undefined;
    if (byCore?.length) {
      const keys = new Set(byCore.map((x) => x.key));
      const top = [...byCore].sort((a, b) => a.rank - b.rank)[0];
      return { key: top.key, exact: keys.size === 1 };
    }
    const byProduct = c ? this.productCore.get(c) : undefined;
    if (byProduct?.length) return { key: [...byProduct].sort((a, b) => a.rank - b.rank)[0].key, exact: false };
    // A short name once the generic word is off ("ngân hàng MB" → MB): only an exact known name counts.
    const short = this.brands ? coreOf(raw, 2) : '';
    if (short && short !== norm(raw)) {
      const list = this.loose.get(short);
      if (list?.length) {
        const keys = new Set(list.map((x) => x.key));
        return { key: [...list].sort((a, b) => a.rank - b.rank)[0].key, exact: keys.size === 1 };
      }
    }
    let best: Cand | null = null;
    let bestD = Infinity;
    const consider = (n: string, pool: Iterable<[string, Cand | Cand[]]>) => {
      const lim = fuzzyLimit(n.length);
      if (!lim) return;
      for (const [alias, v] of pool) {
        if (alias.length < 5) continue;
        const d = editDistance(n, alias, lim);
        if (d > lim) continue;
        const c = Array.isArray(v) ? [...v].sort((a, b) => a.rank - b.rank)[0] : v;
        if (d < bestD || (d === bestD && best && c.rank < best.rank)) {
          bestD = d;
          best = c;
        }
      }
    };
    if (marked(raw)) {
      // Typed with tones: a typo is measured with the tones kept. Otherwise "Hoàng Hà" (the Yellow River) would sit
      // one letter from "Hồng Hà" once the marks are gone, and be offered as the Red River.
      for (const s of softs) {
        consider(s, this.exactMap);
        consider(s, this.strippedMap);
      }
    } else {
      for (const n of looses) consider(n, this.loose);
    }
    const found = best as Cand | null;
    return found ? { key: found.key, exact: false } : null;
  }
}
