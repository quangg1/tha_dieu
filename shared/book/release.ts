// The release set (October 2026): prompts written to the rule that common answers come at once and rare ones take
// knowledge. Prompts with `until` are timely (news, new films, this year's songs): one comes round each day while it is
// fresh, and it stops being asked after that date.
import { RELEASE1, type ReleaseQuestion } from './release1.js';
import { RELEASE2 } from './release2.js';
import { RELEASE3 } from './release3.js';
import { RELEASE4 } from './release4.js';
import { RELEASE5 } from './release5.js';
import { RELEASE6 } from './release6.js';
import { RELEASE7 } from './release7.js';
import { RELEASE8 } from './release8.js';
import { RELEASE9 } from './release9.js';
import { RELEASE10 } from './release10.js';
import { RELEASE11 } from './release11.js';
import { RELEASE12 } from './release12.js';
import { RELEASE13 } from './release13.js';
import { RELEASE14 } from './release14.js';
import { RELEASE15 } from './release15.js';
import { RELEASE16 } from './release16.js';

export type { ReleaseQuestion };
export const RELEASE: ReleaseQuestion[] = [
  ...RELEASE1, ...RELEASE2, ...RELEASE3, ...RELEASE4, ...RELEASE5, ...RELEASE6, ...RELEASE7, ...RELEASE8, ...RELEASE9, ...RELEASE10, ...RELEASE11, ...RELEASE12, ...RELEASE13, ...RELEASE14, ...RELEASE15, ...RELEASE16,
];

/** Last day a timely prompt may be asked (YYYY-MM-DD), by question id. */
export const UNTIL: ReadonlyMap<string, string> = new Map(RELEASE.filter((q) => q.until).map((q) => [q.id, q.until!]));
