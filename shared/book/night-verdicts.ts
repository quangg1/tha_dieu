// Written by the night shift: its verdicts on new answers players typed. The nightly cron applies the batch once
// (by its day) to the database. Each run replaces the whole object.

export interface NightVerdict {
  /** Question id. */
  q: string;
  /** The answer as stored (pending answers: its key; submissions: the input key). */
  key: string;
  valid: boolean;
  /** Proper Vietnamese name when valid; for a misspelling of a book answer, that answer's name. */
  canonical: string;
  /** One short Vietnamese sentence, shown to players when an answer is refused. */
  reason: string;
}

export const NIGHT_VERDICTS: { day: string; pending: NightVerdict[]; submissions: NightVerdict[] } = {
  day: '',
  pending: [],
  submissions: [],
};
