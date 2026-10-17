// Whether a word can be a Vietnamese syllable: an onset, a vowel group and an optional final, by the spelling rules.
// Used to tell a real (if unknown) Vietnamese name from keyboard noise like "abcxyz", without any AI.
import { norm } from './normalize.js';

const ONSETS = ['ngh', 'ng', 'nh', 'ch', 'gh', 'gi', 'kh', 'ph', 'qu', 'th', 'tr', 'b', 'c', 'd', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x', ''];

// Vowel groups once tones and hats are stripped (ươ → uo, iê → ie...), longest first.
const NUCLEI = [
  'uye', 'uya', 'uyu', 'ieu', 'yeu', 'oai', 'oay', 'oeo', 'uay', 'uoi', 'uou', 'uau',
  'ai', 'ao', 'au', 'ay', 'eo', 'eu', 'ia', 'ie', 'iu', 'oa', 'oe', 'oi', 'oo', 'ua', 'ue', 'ui', 'uo', 'uy', 'uu', 'ye', 'ya',
  'a', 'e', 'i', 'o', 'u', 'y',
];
// "k" closes highland names (Đắk Lắk, Krông Buk).
const FINALS = ['ng', 'nh', 'ch', 'c', 'm', 'n', 'p', 't', 'k', ''];

/** Letters that only appear in Vietnamese words (tones and hats); a word with one must parse as a syllable. */
const VN_MARKS = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

export function isVnSyllable(word: string): boolean {
  const w = norm(word);
  if (!w || w.length > 7) return false;
  for (const on of ONSETS) {
    if (!w.startsWith(on)) continue;
    const rest = w.slice(on.length);
    // "gi" and "qu" may also be read as g + i / q + u when nothing follows ("gì", "quy").
    if (!rest && (on === 'gi' || on === 'qu')) return true;
    for (const nu of NUCLEI) {
      if (!rest.startsWith(nu)) continue;
      const fin = rest.slice(nu.length);
      if (FINALS.includes(fin)) return true;
    }
  }
  return false;
}

/** Every word is a Vietnamese syllable (numbers allowed, as in "Bia 333"). */
export function looksVietnamese(input: string): boolean {
  const words = input.trim().split(/[\s\-'’]+/).filter(Boolean);
  return words.length > 0 && words.every((w) => /^\d+$/.test(w) || isVnSyllable(w));
}

/** Some word carries Vietnamese marks, so the answer is meant as Vietnamese. */
export const hasVnMarks = (input: string) => VN_MARKS.test(input);
