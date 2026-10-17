// Turns question specs over the village book into playable questions.
import { norm, soft } from '../normalize.js';
import type { AnswerEntry, QuestionDef } from '../match.js';
import type { Entry } from './parse.js';

export interface Source {
  lex: string;
  /** The entry must carry every one of these labels. */
  all?: string[];
  /** …and at least one of these. */
  any?: string[];
  /** …and none of these. */
  not?: string[];
}

export interface Spec {
  id: string;
  c: string;
  q: string;
  n?: string;
  from: Source[];
  /** Only names starting with this letter count (Vietnamese letters: "đ" is not "d"). */
  start?: string;
  /** Only names whose first word is this word ("thợ", "nước"…). */
  head?: string;
  /** Only names with exactly this many Vietnamese syllables. */
  syllables?: number;
  strip?: string[];
  vague?: string[];
  min?: number;
  level?: number;
  /** Names of entries that should never be the hidden answer. */
  noKrill?: string[];
  /** Names of answers that feel clever but that everyone gives: they land as Khôn lỏi. */
  traps?: string[];
}

/** Classifier words that may be typed in front of an answer, per lexicon. */
export const STRIP: Record<string, string[]> = {
  dongvat: ['con', 'loai', 'loaicon', 'convat'],
  thucvat: ['cay', 'qua', 'trai', 'hoa', 'bong', 'rau', 'cu', 'hat', 'la', 'nam', 'loai', 'caycon'],
  monan: ['mon', 'monan', 'mot'],
  douong: ['nuoc', 'ly', 'coc', 'mon', 'thucuong'],
  diaphuong: ['tinh', 'thanhpho', 'tp', 'thanh'],
  quocgia: ['nuoc', 'quocgia', 'xu'],
  thudo: ['thudo', 'thanhpho', 'tp'],
  nhanvat: ['vua', 'tuong', 'danhtuong', 'nhatho', 'nhavan', 'nhacsi', 'hoasi', 'cauthu', 'anhhung', 'chutich', 'daituong', 'ong', 'nhakhoahoc'],
  nghe: ['nghe', 'nguoi', 'nghelam'],
  thethao: ['mon', 'mondanh', 'choi'],
  nhaccu: ['dan', 'cay', 'chiec', 'cai'],
  dovat: ['cai', 'chiec', 'cay', 'qua', 'tam', 'bo', 'doi', 'con'],
  quanao: ['cai', 'chiec', 'doi', 'bo'],
  xe: ['xe', 'chiec', 'tau', 'con'],
  cothe: ['cai', 'bo', 'doi', 'con', 'la', 'qua'],
  mausac: ['mau', 'mausac'],
  vanhoa: ['le', 'hoi', 'ngay', 'tro', 'trochoi', 'lang', 'nghe'],
  cotich: ['truyen', 'chuyen', 'su', 'nhanvat'],
  dantoc: ['dantoc', 'nguoi', 'toc'],
  diadanh: ['chua', 'den', 'thanhpho', 'tp', 'dao', 'nui', 'song', 'ho', 'deo', 'hang', 'dong', 'thac', 'cau', 'cho', 'bai', 'baibien', 'bien'],
  thegioi: ['thanhpho', 'tp', 'song', 'nui', 'ho', 'bien', 'dao', 'samac', 'thap'],
  hoahoc: ['nguyento', 'kimloai', 'khi', 'chat'],
  thienvan: ['sao', 'chomsao', 'hanhtinh', 'tau', 'cung'],
  ngonngu: ['tieng', 'ngonngu', 'ngonngulaptrinh'],
  tungu: [],
  khainiem: ['mon', 'nganh', 'hinh', 'don', 'dongtien', 'tien', 'da', 'hang', 'app', 'ungdung', 'vai'],
};

/** Too-general answers, per lexicon: the player is asked to name something specific instead. */
export const VAGUE: Record<string, string[]> = {
  dongvat: ['con vật', 'động vật', 'con', 'thú', 'chim', 'cá', 'côn trùng', 'sâu', 'bọ', 'thú cưng', 'gia súc', 'gia cầm'],
  thucvat: ['cây', 'hoa', 'quả', 'trái cây', 'rau', 'củ', 'hạt', 'lá', 'nấm', 'cỏ', 'thực vật'],
  monan: ['món ăn', 'đồ ăn', 'thức ăn', 'bánh', 'bún', 'chè', 'cháo', 'lẩu', 'xôi', 'canh', 'cơm', 'mì', 'gỏi'],
  douong: ['nước uống', 'đồ uống', 'thức uống'],
  quocgia: ['quốc gia', 'nước', 'đất nước'],
  nhanvat: ['vua', 'tướng', 'nhà thơ', 'nhà văn', 'người'],
  nghe: ['nghề', 'thợ', 'người làm'],
  dovat: ['đồ', 'đồ vật', 'đồ dùng', 'cái'],
  xe: ['xe', 'tàu', 'phương tiện'],
  mausac: ['màu', 'màu sắc'],
  cotich: ['truyện', 'cổ tích', 'nhân vật'],
  diadanh: ['chùa', 'đền', 'biển', 'núi', 'sông', 'hồ', 'đảo', 'thành phố', 'chợ', 'cầu'],
  thegioi: ['thành phố', 'sông', 'núi', 'biển', 'đảo'],
  hoahoc: ['nguyên tố', 'kim loại', 'khí'],
  thienvan: ['sao', 'ngôi sao', 'hành tinh', 'chòm sao'],
  ngonngu: ['tiếng', 'ngôn ngữ'],
  khainiem: ['đơn vị', 'tiền', 'hình', 'môn', 'ngành'],
};

const PRIOR_FOR_POP = [4, 4, 3, 2, 1, 0]; // index by pop 1–5

/** Vietnamese base letter of a name's first character, keeping đ apart from d (ă, â count as a; ê as e; ô, ơ as o; ư as u). */
export function firstLetter(name: string): string {
  const c = name.trim().normalize('NFC').charAt(0).toLowerCase();
  if (c === 'đ') return 'đ';
  return c.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const VN_SYLLABLE = /^(ngh|ng|nh|ch|gh|gi|kh|ph|qu|th|tr|[bcdđghklmnpqrstvx])?[aăâeêioôơuưy]{1,3}(ng|nh|ch|[cmnpt])?$/;

/** Syllable count of a name written in Vietnamese; null for foreign spellings ("Peru", "Mali"). */
export function syllables(name: string): number | null {
  const words = name.normalize('NFC').toLowerCase().split(/[\s-]+/).filter(Boolean);
  if (!words.length) return null;
  for (const w of words) {
    const nfd = w.normalize('NFD');
    const toned = /[\u0300\u0301\u0303\u0309\u0323]/.test(nfd);
    const base = nfd.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, '').normalize('NFC');
    if (!VN_SYLLABLE.test(base) || /(aa|ee|ii|uu|yy|ea|ae|ou)/.test(base)) return null;
    // A Vietnamese syllable ending in c, ch, p or t always carries a sắc or nặng tone: "bát", never "bat".
    if (!toned && /(c|ch|p|t)$/.test(base)) return null;
  }
  return words.length;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function pick(entry: Entry, src: Source) {
  if (src.all && !src.all.every((t) => entry.tags.has(t))) return false;
  if (src.any && !src.any.some((t) => entry.tags.has(t))) return false;
  if (src.not && src.not.some((t) => entry.tags.has(t))) return false;
  return true;
}

/** True when a name is written in Vietnamese (has Vietnamese letters or tones, or every word is a Vietnamese syllable). */
export function isVietnamese(name: string): boolean {
  if (/[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i.test(name)) return true;
  return syllables(name) !== null;
}

/** Names of an entry that satisfy the spec's word rules; empty when the entry does not fit. */
function fitting(entry: Entry, spec: Spec): string[] {
  const strip = STRIP[entry.lex] ?? [];
  return entry.names.filter((n) => {
    // Letter and syllable rules look at the Vietnamese name, without a leading classifier ("cây mít" counts as "mít").
    const bare = spec.start || spec.syllables ? stripLead(n, strip) : n;
    // Foreign spellings count only as the entry's main name ("Brazil", not "Germany" for Đức or "Bee" for ong).
    if ((spec.start || spec.syllables) && ((n !== entry.names[0] && !isVietnamese(bare)) || /^[A-Z0-9]{1,4}$/.test(bare))) return false;
    if (spec.start && firstLetter(bare) !== spec.start) return false;
    if (spec.syllables && syllables(bare) !== spec.syllables) return false;
    if (spec.head && soft(n.split(/\s+/)[0]) !== soft(spec.head)) return false;
    return true;
  });
}

function stripLead(name: string, prefixes: string[]) {
  const words = name.trim().split(/\s+/);
  if (words.length > 1 && prefixes.includes(norm(words[0]))) return words.slice(1).join(' ');
  return name;
}

export interface Built extends QuestionDef {
  level: number;
  family: string;
  pool: number;
}

/** Assigns starting rarity from familiarity (1–5) blended with rank inside this question's pool. */
function priors(list: { pop: number; order: number }[]): number[] {
  const idx = list.map((e, i) => ({ i, pop: e.pop, order: e.order }));
  idx.sort((a, b) => b.pop - a.pop || a.order - b.order);
  const cuts = [0.05, 0.15, 0.35, 0.62];
  const out = new Array<number>(list.length);
  idx.forEach((e, r) => {
    const q = (r + 0.5) / list.length;
    const rankTier = cuts.findIndex((c) => q < c);
    const rt = rankTier < 0 ? 4 : rankTier;
    out[e.i] = Math.floor((rt + PRIOR_FOR_POP[e.pop]) / 2);
  });
  return out;
}

export function buildSpec(spec: Spec, lex: Record<string, Entry[]>): Built | null {
  const seen = new Map<string, { names: string[]; pop: number; order: number }>();
  const nameIndex = new Map<string, string>();
  let order = 0;
  const vagueSet = new Set([...(spec.vague ?? []), ...spec.from.flatMap((f) => VAGUE[f.lex] ?? [])].map(soft));
  for (const src of spec.from) {
    const list = lex[src.lex];
    if (!list) throw new Error(`Unknown lexicon ${src.lex} in ${spec.id}`);
    for (const e of list) {
      order++;
      if (!pick(e, src)) continue;
      if (vagueSet.has(e.key)) continue;
      const names = fitting(e, spec);
      if (!names.length) continue;
      const k = soft(names[0]);
      // Two lexicons may list the same thing (a capital that is also a big city): keep one answer.
      const dupKey = names.map((n) => nameIndex.get(soft(n))).find(Boolean);
      if (dupKey) {
        const v = seen.get(dupKey)!;
        for (const n of names) if (!v.names.includes(n)) v.names.push(n);
        for (const n of names) if (!nameIndex.has(soft(n))) nameIndex.set(soft(n), dupKey);
        v.pop = Math.max(v.pop, e.pop);
        continue;
      }
      if (spec.start || spec.syllables) {
        const bare = stripLead(names[0], STRIP[e.lex] ?? []);
        if (bare !== names[0]) names.unshift(bare.charAt(0).toUpperCase() + bare.slice(1));
      }
      // An entry that fits only through a lesser-known name ("Thiên Trúc" for Ấn Độ) is a rarer answer.
      const pop = names.includes(e.names[0]) ? e.pop : Math.max(1, e.pop - 2);
      seen.set(k, { names: [...names], pop, order: order + e.order / 10000 });
      for (const n of names) if (!nameIndex.has(soft(n))) nameIndex.set(soft(n), k);
    }
  }
  const items = [...seen.entries()].map(([key, v]) => ({ key, ...v }));
  const min = spec.min ?? 12;
  if (items.length < min) return null;
  const pr = priors(items);
  const answers: AnswerEntry[] = items.map((it, i) => ({ key: it.key, display: it.names[0], priorTier: pr[i], aliases: it.names }));
  // The hidden Cung Trăng answer: a little-known but genuine answer, chosen once per question.
  const rare = answers.filter((a) => a.priorTier === 4 && !(spec.noKrill ?? []).some((n) => soft(n) === a.key));
  const pool = rare.length ? rare : answers.filter((a) => a.priorTier >= 3);
  const krill = (pool.length ? pool : answers)[hash(spec.id) % (pool.length || answers.length)];
  krill.priorTier = 5;
  const lexes = [...new Set(spec.from.map((s) => s.lex))];
  const strip = [...new Set([...(spec.strip ?? []), ...lexes.flatMap((l) => STRIP[l] ?? [])])];
  const vague = [...new Set([...(spec.vague ?? []), ...lexes.flatMap((l) => VAGUE[l] ?? [])])];
  const strong = items.filter((i) => i.pop >= 4).length;
  const level =
    spec.level ??
    (spec.start || spec.head || spec.syllables || items.length < 25 ? 3 : items.length >= 60 && strong >= 3 ? 1 : 2);
  return {
    traps: resolveTraps(answers, spec.traps),
    id: spec.id,
    category: spec.c,
    prompt: spec.q,
    note: spec.n,
    strip,
    vague,
    krillKey: krill.key,
    answers,
    level,
    family: lexes.join('+'),
    pool: answers.length,
  };
}

/** Keys of the answers named as traps; the hidden answer is never a trap. */
export function resolveTraps(answers: AnswerEntry[], names: string[] = []): string[] {
  const out: string[] = [];
  for (const n of names) {
    const a = answers.find((x) => x.aliases.some((al) => soft(al) === soft(n)));
    if (!a) throw new Error(`Trap "${n}" is not an answer`);
    if (a.priorTier !== 5) out.push(a.key);
  }
  return out;
}

/** Adds book entries to a handcrafted question, keeping its curated tiers and hidden answer. */
export function extendQuestion(q: QuestionDef, srcs: Source[], lex: Record<string, Entry[]>): QuestionDef {
  const byName = new Map<string, AnswerEntry>();
  for (const a of q.answers) for (const n of a.aliases) byName.set(soft(n), a);
  const added: { names: string[]; pop: number; order: number }[] = [];
  for (const src of srcs) {
    for (const e of lex[src.lex] ?? []) {
      if (!pick(e, src)) continue;
      const hit = e.names.map((n) => byName.get(soft(n))).find(Boolean);
      if (hit) {
        for (const n of e.names) if (!byName.has(soft(n))) {
          hit.aliases.push(n);
          byName.set(soft(n), hit);
        }
        continue;
      }
      const item = { names: [...e.names], pop: e.pop, order: e.order };
      added.push(item);
      for (const n of e.names) byName.set(soft(n), { key: '', display: '', priorTier: 0, aliases: [] });
    }
  }
  // Curated questions already hold the common answers, so book additions start rarer (tier 2–4).
  const extra: AnswerEntry[] = added.map((it) => ({
    key: soft(it.names[0]),
    display: it.names[0],
    priorTier: Math.max(2, PRIOR_FOR_POP[it.pop]),
    aliases: it.names,
  }));
  const lexes = srcs.map((s) => s.lex);
  return {
    ...q,
    answers: [...q.answers, ...extra],
    strip: [...new Set([...q.strip, ...lexes.flatMap((l) => STRIP[l] ?? [])])],
    vague: [...new Set([...(q.vague ?? []), ...lexes.flatMap((l) => VAGUE[l] ?? [])])],
    family: lexes.join('+'),
  };
}

/**
 * Adds hand-written answers to a question: five tier lines in the bank's format ("A|alias, B"). A name that already
 * belongs to an answer only adds its spellings to that answer; new names become answers at the line's tier.
 */
/**
 * `foldNamed`: a new name that is a known answer followed only by proper names ("Phở Bát Đàn", "Adidas Samba",
 * "Cam Cao Phong") is that answer under another name, so a shop, model or place cannot turn a common answer rare.
 */
export function addMore(q: QuestionDef, tiers: string[], foldNamed = false): QuestionDef {
  const answers = q.answers.map((a) => ({ ...a, aliases: [...a.aliases] }));
  const byName = new Map<string, AnswerEntry>();
  for (const a of answers) for (const n of a.aliases) byName.set(soft(n), a);
  tiers.forEach((line, tier) => {
    for (const group of line.split(',')) {
      const names = group.split('|').map((x) => x.trim()).filter(Boolean);
      if (!names.length) continue;
      const hit = names.map((n) => byName.get(soft(n))).find(Boolean) ?? (foldNamed ? namedVariantOf(names[0], byName) : undefined);
      if (hit) {
        for (const n of names) if (!byName.has(soft(n))) {
          hit.aliases.push(n);
          byName.set(soft(n), hit);
        }
        continue;
      }
      const entry: AnswerEntry = { key: soft(names[0]), display: names[0], priorTier: tier, aliases: names };
      if (!entry.key) continue;
      answers.push(entry);
      for (const n of names) byName.set(soft(n), entry);
    }
  });
  return { ...q, answers };
}

const isProper = (w: string) => /^\d/.test(w) || (w[0] !== w[0].toLowerCase() && w[0] === w[0].toUpperCase());

/** The known answer a name extends with proper names only ("Bún chả Hương Liên" → "Bún chả"), if any. */
function namedVariantOf(name: string, byName: Map<string, AnswerEntry>): AnswerEntry | undefined {
  const words = name.trim().split(/\s+/);
  for (let k = words.length - 1; k >= 1; k--) {
    if (!words.slice(k).every(isProper)) break;
    const base = byName.get(soft(words.slice(0, k).join(' ')));
    if (base) return base;
  }
  return undefined;
}
