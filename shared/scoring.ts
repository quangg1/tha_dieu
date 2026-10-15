export type TierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Tier {
  index: TierIndex;
  name: string;
  points: number;
  /** Order by rarity; Khôn lỏi sits between Là là and Lưng chừng. */
  rank: number;
  /** Number of flutes that sing when this tier is struck. */
  flutes: number;
  /** Seconds of wind added in Thả đêm. */
  wind: number;
  css: string;
  emoji: string;
  meaning: string;
  /** One short line said when the answer lands. */
  line: string;
}

/** Indices are stored in the database, so a new tier gets a new index rather than shifting the others. */
export const TIERS: readonly Tier[] = [
  { index: 0, name: 'Là là', points: 10, rank: 0, flutes: 1, wind: 3, css: 'sao-don', emoji: '🌾', meaning: 'ai cũng nghĩ ra', line: 'Câu ai cũng buột miệng.' },
  { index: 1, name: 'Lưng chừng', points: 25, rank: 2, flutes: 2, wind: 4, css: 'sao-doi', emoji: '🎋', meaning: 'khá phổ biến', line: 'Ổn. Bay cùng cả làng.' },
  { index: 2, name: 'Bay bổng', points: 45, rank: 3, flutes: 3, wind: 6, css: 'sao-ba', emoji: '🕊️', meaning: 'ít người nghĩ tới', line: 'Ít ai nghĩ tới. Gió đẹp.' },
  { index: 3, name: 'Chót vót', points: 65, rank: 4, flutes: 7, wind: 8, css: 'sao-bay', emoji: '⛰️', meaning: 'hiếm', line: 'Hiếm thật. Cả xóm ngước nhìn.' },
  { index: 4, name: 'Tít mây xanh', points: 80, rank: 5, flutes: 9, wind: 10, css: 'sao-chin', emoji: '☁️', meaning: 'rất hiếm', line: 'Hiếm có khó tìm. Ít ai bay tới đây.' },
  { index: 5, name: 'Cung Trăng', points: 100, rank: 6, flutes: 9, wind: 14, css: 'cung-trang', emoji: '🌕', meaning: 'đáp án làng giấu', line: 'Đáp án làng giấu kỹ. Đỉnh trời.' },
  { index: 6, name: 'Khôn lỏi', points: 15, rank: 1, flutes: 1, wind: 3, css: 'khon-loi', emoji: '🤡', meaning: 'tưởng độc, ai cũng nghĩ', line: 'Tưởng độc, ai dè cả làng cùng nghĩ.' },
];

/** Tiers from most common to rarest, for legends and menus. */
export const TIERS_BY_RANK: readonly Tier[] = [...TIERS].sort((a, b) => a.rank - b.rank);

export const KHON_LOI: TierIndex = 6;
export const CUNG_TRANG: TierIndex = 5;

/** Rarity order of a stored tier (-1 for a miss). */
export function rankOf(tier: number | null | undefined): number {
  return tier == null || tier < 0 ? -1 : TIERS[tier]?.rank ?? -1;
}

/** Bay bổng or rarer: counts toward the rare streak and lifts the kite's flutes. */
export function isRare(tier: number | null | undefined): boolean {
  return rankOf(tier) >= TIERS[2].rank;
}

export interface DayBand {
  min: number;
  tier: TierIndex;
  verdict: string;
}

/** The day's title, by total score. */
export const DAY_BANDS: readonly DayBand[] = [
  { min: 0, tier: 0, verdict: 'Là là. Trời còn rộng lắm.' },
  { min: 150, tier: 1, verdict: 'Lưng chừng. Bay cùng cả làng.' },
  { min: 260, tier: 2, verdict: 'Bay bổng. Qua khỏi lũy tre. Khá đấy.' },
  { min: 370, tier: 3, verdict: 'Chót vót. Cả xóm ngước nhìn.' },
  { min: 470, tier: 4, verdict: 'Tít mây xanh. Bỏ cả làng phía sau.' },
  { min: 570, tier: 5, verdict: 'Cung Trăng. Hết trời để bay. Không tưởng.' },
];

export function bandFor(score: number): DayBand {
  return [...DAY_BANDS].reverse().find((b) => score >= b.min) ?? DAY_BANDS[0];
}

export const QUESTION_SECONDS = 25;
export const NIGHT_START_SECONDS = 45;
export const NIGHT_MAX_SECONDS = 60;
export const POINTS_PER_DECADE = 65;

/** Typical share of players for an answer known to sit in each tier, used before real counts exist. */
export const PRIOR_SHARE = [0.12, 0.05, 0.02, 0.008, 0.003] as const;
/** How many imaginary players the prior is worth. */
export const PRIOR_WEIGHT = 15;

/** Tier from crowd counts blended with the editorial prior. */
export function tierFromCounts(priorTier: number, count: number, total: number): TierIndex {
  const prior = PRIOR_SHARE[Math.max(0, Math.min(4, priorTier))];
  const share = (count + prior * PRIOR_WEIGHT) / (total + PRIOR_WEIGHT);
  if (share >= 0.08) return 0;
  if (share >= 0.035) return 1;
  if (share >= 0.013) return 2;
  if (share >= 0.005) return 3;
  return 4;
}

/** Bonus for consecutive rare answers (Bay bổng or rarer). */
export function streakBonus(streak: number): number {
  return Math.min(20, Math.max(0, 5 * (streak - 1)));
}

/** Altitude in metres for a score: ten times higher every 65 points. */
export function altitudeFor(points: number): number {
  if (points <= 0) return 0;
  return Math.pow(10, points / POINTS_PER_DECADE);
}

export interface Milestone {
  alt: number;
  name: string;
  note?: string;
  kind: 'ground' | 'bamboo' | 'stork' | 'cloud' | 'mountain' | 'plane' | 'strato' | 'edge' | 'station' | 'satellite' | 'moon' | 'planet' | 'cloud-oort' | 'river';
}

const LY = 9.4607e15;
export const MILESTONES: readonly Milestone[] = [
  { alt: 0, name: 'Bãi cỏ', note: 'nơi bắt đầu', kind: 'ground' },
  { alt: 15, name: 'Ngọn tre đầu làng', kind: 'bamboo' },
  { alt: 120, name: 'Đàn cò trắng', kind: 'stork' },
  { alt: 1000, name: 'Tầng mây', kind: 'cloud' },
  { alt: 3143, name: 'Đỉnh Fansipan', kind: 'mountain' },
  { alt: 10000, name: 'Máy bay chở khách', kind: 'plane' },
  { alt: 30000, name: 'Tầng bình lưu', kind: 'strato' },
  { alt: 100000, name: 'Đường Kármán', note: 'bờ vũ trụ', kind: 'edge' },
  { alt: 400000, name: 'Trạm vũ trụ quốc tế', kind: 'station' },
  { alt: 35786000, name: 'Vệ tinh Vinasat', note: 'quỹ đạo địa tĩnh', kind: 'satellite' },
  { alt: 384400000, name: 'Cung Trăng', note: 'chú Cuội, chị Hằng, cây đa', kind: 'moon' },
  { alt: 2.25e11, name: 'Sao Hỏa', kind: 'planet' },
  { alt: 7.8e11, name: 'Sao Mộc', kind: 'planet' },
  { alt: 4.5e12, name: 'Sao Hải Vương', kind: 'planet' },
  { alt: LY, name: 'Đám mây Oort', kind: 'cloud-oort' },
  { alt: 26000 * LY, name: 'Sông Ngân', note: 'nơi Ngưu Lang gặp Chức Nữ', kind: 'river' },
];

export function lastMilestone(alt: number): Milestone {
  let m = MILESTONES[0];
  for (const x of MILESTONES) if (alt >= x.alt) m = x;
  return m;
}

export function nextMilestone(alt: number): Milestone | null {
  return MILESTONES.find((x) => x.alt > alt) ?? null;
}

/** Highest milestone crossed when going from one altitude to another, if any. */
export function crossed(from: number, to: number): Milestone | null {
  let hit: Milestone | null = null;
  for (const x of MILESTONES) if (x.alt > from && x.alt <= to && x.alt > 0) hit = x;
  return hit;
}

/** Vietnamese-formatted altitude: metres under 10 km, then km, then triệu/tỷ km, then năm ánh sáng. */
export function formatAlt(alt: number): string {
  const vi = (n: number, d = 0) => n.toLocaleString('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  if (alt < 1) return '0 m';
  if (alt < 10000) return `${vi(Math.round(alt))} m`;
  const km = alt / 1000;
  if (km < 1e6) return `${vi(Math.round(km))} km`;
  if (km < 1e9) return `${vi(km / 1e6, km < 1e7 ? 1 : 0)} triệu km`;
  if (alt < 0.1 * LY) return `${vi(km / 1e9, km < 1e10 ? 1 : 0)} tỷ km`;
  return `${vi(alt / LY, alt < 10 * LY ? 1 : 0)} năm ánh sáng`;
}

export const MAX_DAILY_POINTS = TIERS[5].points * 7 + 20 * 6;
