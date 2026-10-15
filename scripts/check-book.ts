// Prints problems in the village book: lines merged into an earlier one, and names shared by two entries.
import { parseLex } from '../shared/book/parse.js';
import { SOURCES } from '../shared/book/index.js';
import { soft } from '../shared/normalize.js';

const only = process.argv[2];
const verbose = process.argv.includes('-v');
let shared = 0;
for (const [name, src] of Object.entries(SOURCES)) {
  if (only && only !== '-v' && name !== only) continue;
  const merged: string[] = [];
  const entries = parseLex(name, src, merged);
  if (merged.length) console.log(`[${name}] merged: ${merged.join(' · ')}`);
  const owner = new Map<string, string>();
  for (const e of entries) {
    for (const n of e.names) {
      const k = soft(n);
      const o = owner.get(k);
      if (o && o !== e.key) {
        shared++;
        if (verbose) console.log(`[${name}] "${n}" names both ${o} and ${e.key}`);
      } else owner.set(k, e.key);
    }
  }
  const tags = new Map<string, number>();
  for (const e of entries) for (const t of e.tags) tags.set(t, (tags.get(t) ?? 0) + 1);
  const pops = [1, 2, 3, 4, 5].map((p) => entries.filter((e) => e.pop === p).length);
  console.log(`${name}: ${entries.length} entries · pop ${pops.join('/')} · ${[...tags].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join(' ')}`);
}
console.log(`${shared} shared names (resolved per question by priority; -v to list)`);
