// Names on the public board. A playtest open to strangers gets rude names within the hour, so the obvious ones are
// refused where they are typed (the client says why) and again on the server. Whole words only, with tones kept where
// tones matter: "Nguyễn" is not "ngu", "đeo" is not "đéo", "các" is not "cặc".
import { norm, soft } from './normalize.js';

/** Rude words, matched as whole words with their tones. */
const TONED = new Set(
  'địt đjt đéo đếch lồn buồi cặc đụ đĩ đĩ điếm điếm đm đmm đcm đkm vcl vkl clgt cmm cc cl ngu đần phò cave'.split(' '),
);
/** Rude phrases, matched on the words with their tones. */
const TONED_PHRASES = ['óc chó', 'mẹ mày', 'má mày', 'bố mày', 'chó đẻ', 'súc vật', 'con đĩ', 'thằng ngu', 'con ngu', 'đồ ngu'];
/** The same written without tones, only where nothing innocent reads the same. */
const BARE = new Set('dit djt deo dm dmm dcm dkm vcl vkl clgt cmm loz lozz cak kac duma dume ditme cc cl'.split(' '));
const BARE_PHRASES = ['dit me', 'du me', 'du ma', 'dit con', 'con cac', 'cai lon', 'an lon', 'oc cho', 'me may', 'cho de', 'suc vat', 'thang ngu'];
/** Anywhere in the letters, spaces and dots removed: no Vietnamese name hides these. */
const LATIN = ['fuck', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'whore', 'porn', 'pussy', 'asshole', 'motherf'];

const words = (s: string, f: (w: string) => string) =>
  s
    .split(/[^\p{L}\p{N}]+/u)
    .map(f)
    .filter(Boolean);

/** True when a board name is rude. */
export function rudeName(name: string): boolean {
  const toned = words(name, soft);
  const bare = toned.map(norm);
  if (toned.some((w) => TONED.has(w)) || bare.some((w, i) => BARE.has(w) && toned[i] === w)) return true;
  const t = ` ${toned.join(' ')} `;
  const b = ` ${bare.join(' ')} `;
  if (TONED_PHRASES.some((p) => t.includes(` ${p} `))) return true;
  // A phrase typed without tones (every word of it bare) is caught; the same letters with tones are left alone.
  if (BARE_PHRASES.some((p) => b.includes(` ${p} `) && t.includes(` ${p} `))) return true;
  const letters = norm(name);
  return LATIN.some((w) => letters.includes(w));
}

/** The name as it goes on the board, or null when it is empty or rude. */
export function boardName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const n = name.replace(/\s+/g, ' ').trim().slice(0, 24);
  return n && !rudeName(n) ? n : null;
}
