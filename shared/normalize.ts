/** Vietnamese-aware answer normalization: strips tones/diacritics, đ→d, case, spaces and punctuation. */
export function norm(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/♯/g, '#')
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, '');
}

/** Lowercase with tones kept, used to tell "cắt" from "cát" before falling back to the toneless key. */
export function soft(input: string): string {
  return input
    .normalize('NFC')
    .replace(/♯/g, '#')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#]+/gu, '');
}

/** Removes a leading classifier word ("hoa", "bánh", "tiếng"…) when something meaningful remains. */
export function stripPrefix(key: string, prefixes: readonly string[]): string | null {
  for (const p of prefixes) {
    if (p && key.startsWith(p) && key.length - p.length >= 2) return key.slice(p.length);
  }
  return null;
}

/** Optimal-string-alignment distance (a swapped pair of letters costs 1); returns max+1 once it must exceed max. */
export function editDistance(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = [Array.from({ length: b.length + 1 }, (_, j) => j)];
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(rows[i - 1][j] + 1, cur[j - 1] + 1, rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, rows[i - 2][j - 2] + 1);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    rows.push(cur);
  }
  return rows[a.length][b.length];
}

/** Allowed typo distance for a normalized key of this length. Short words must match exactly. */
export function fuzzyLimit(len: number): number {
  if (len < 6) return 0;
  if (len < 10) return 1;
  return 2;
}
