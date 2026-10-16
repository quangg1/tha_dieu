export type TierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Tier {
  index: TierIndex;
  name: string;
  points: number;
  /** Order by rarity; Khôn lỏi sits between Thường and Khá hiếm. */
  rank: number;
  /** Number of flutes that sing when this tier is struck. */
  flutes: number;
  /** Seconds of wind added in Thả vô tận. */
  wind: number;
  css: string;
  emoji: string;
  meaning: string;
  /** One short line said when the answer lands. */
  line: string;
}

/** Indices are stored in the database, so a new tier gets a new index rather than shifting the others. */
export const TIERS: readonly Tier[] = [
  { index: 0, name: 'Thường', points: 10, rank: 0, flutes: 1, wind: 3, css: 'sao-don', emoji: '⚪', meaning: 'ai cũng nghĩ ra', line: 'Câu ai cũng buột miệng.' },
  { index: 1, name: 'Khá hiếm', points: 25, rank: 2, flutes: 2, wind: 4, css: 'sao-doi', emoji: '🟢', meaning: 'khá nhiều người nghĩ ra', line: 'Ổn, nhưng nhiều người cũng nghĩ ra.' },
  { index: 2, name: 'Hiếm', points: 45, rank: 3, flutes: 3, wind: 6, css: 'sao-ba', emoji: '🔵', meaning: 'ít người nghĩ tới', line: 'Ít ai nghĩ tới. Hay đấy.' },
  { index: 3, name: 'Rất hiếm', points: 65, rank: 4, flutes: 7, wind: 8, css: 'sao-bay', emoji: '🟣', meaning: 'rất ít người nghĩ tới', line: 'Hiếm thật. Cả xóm phải nể.' },
  { index: 4, name: 'Cực hiếm', points: 80, rank: 5, flutes: 9, wind: 10, css: 'sao-chin', emoji: '🔴', meaning: 'gần như không ai nghĩ tới', line: 'Hiếm có khó tìm. Gần như không ai nghĩ tới.' },
  { index: 5, name: 'Độc nhất', points: 100, rank: 6, flutes: 9, wind: 14, css: 'cung-trang', emoji: '🟡', meaning: 'đáp án làng giấu', line: 'Đáp án làng giấu kỹ. Bạn tìm ra rồi.' },
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

/** Hiếm or rarer: counts toward the rare streak and lifts the kite's flutes. */
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
  { min: 0, tier: 0, verdict: 'Tà tà. Trời còn rộng lắm.' },
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
export function tierFromCounts(priorTier: number, count: number, total: number, priorShare?: number): TierIndex {
  // The expected share before today's players: what earlier days measured, else the book's estimate.
  const prior = priorShare ?? PRIOR_SHARE[Math.max(0, Math.min(4, priorTier))];
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

/** Thả vô tận climbs faster, so that a long night can pass the edge of the universe and start a new lap. */
export const NIGHT_POINTS_PER_DECADE = 30;

/** Altitude in metres for a score: ten times higher every 65 points (every 30 in Thả vô tận). */
export function altitudeFor(points: number, mode: 'daily' | 'night' = 'daily'): number {
  if (points <= 0) return 0;
  return Math.pow(10, points / (mode === 'night' ? NIGHT_POINTS_PER_DECADE : POINTS_PER_DECADE));
}

/** log10 of the edge of the observable universe (46,5 tỷ năm ánh sáng): the top of the sky. Past it, a wormhole leads back to the meadow. */
export const CEILING_L = Math.log10(4.4e26);

/** Which lap of the sky an altitude is on (1 = the first), and the height within that lap. */
export function lapOf(alt: number): { lap: number; inner: number } {
  const L = Math.log10(Math.max(1, alt));
  const lap = Math.floor(L / CEILING_L) + 1;
  return { lap, inner: Math.pow(10, L - (lap - 1) * CEILING_L) };
}

export interface Milestone {
  alt: number;
  name: string;
  note?: string;
  kind: 'ground' | 'bamboo' | 'stork' | 'cloud' | 'balloon' | 'plane' | 'strato' | 'edge' | 'station' | 'satellite' | 'moon' | 'planet' | 'cloud-oort' | 'river' | 'galaxy' | 'cluster' | 'web' | 'universe' | 'lap';
}

const LY = 9.4607e15;
export const MILESTONES: readonly Milestone[] = [
  { alt: 0, name: 'Bãi cỏ', note: 'nơi bắt đầu', kind: 'ground' },
  { alt: 15, name: 'Ngọn tre đầu làng', kind: 'bamboo' },
  { alt: 120, name: 'Đàn cò trắng', kind: 'stork' },
  { alt: 1000, name: 'Tầng mây', note: 'bên dưới là biển mây', kind: 'cloud' },
  { alt: 3000, name: 'Khinh khí cầu', note: 'trôi trên biển mây', kind: 'balloon' },
  { alt: 10000, name: 'Máy bay chở khách', kind: 'plane' },
  { alt: 30000, name: 'Bóng thám không', note: 'tầng bình lưu', kind: 'strato' },
  { alt: 100000, name: 'Bờ vũ trụ', note: 'cực quang, đường Kármán', kind: 'edge' },
  { alt: 400000, name: 'Trạm vũ trụ quốc tế', kind: 'station' },
  { alt: 35786000, name: 'Vệ tinh Vinasat', note: 'quỹ đạo địa tĩnh', kind: 'satellite' },
  { alt: 384400000, name: 'Cung Trăng', note: 'chú Cuội, chị Hằng, cây đa', kind: 'moon' },
  { alt: 4.2e10, name: 'Sao Kim', note: 'lúc gần Trái Đất nhất', kind: 'planet' },
  { alt: 2.25e11, name: 'Sao Hỏa', kind: 'planet' },
  { alt: 7.8e11, name: 'Sao Mộc', kind: 'planet' },
  { alt: 1.43e12, name: 'Sao Thổ', kind: 'planet' },
  { alt: 4.5e12, name: 'Sao Hải Vương', kind: 'planet' },
  { alt: LY, name: 'Sao chổi', note: 'đám mây Oort', kind: 'cloud-oort' },
  { alt: 26000 * LY, name: 'Sông Ngân', note: 'nơi Ngưu Lang gặp Chức Nữ', kind: 'river' },
  { alt: 2.5e6 * LY, name: 'Thiên hà Tiên Nữ', note: 'hàng xóm của Ngân Hà', kind: 'galaxy' },
  { alt: 5.4e7 * LY, name: 'Cụm thiên hà Xử Nữ', kind: 'cluster' },
  { alt: 5e8 * LY, name: 'Mạng vũ trụ', note: 'những sợi tơ thiên hà', kind: 'web' },
  { alt: 4.4e26, name: 'Rìa vũ trụ', note: 'lỗ giun về lại bãi cỏ', kind: 'universe' },
];

export function lastMilestone(alt: number): Milestone {
  const { inner } = lapOf(alt);
  let m = MILESTONES[0];
  for (const x of MILESTONES) if (inner >= x.alt) m = x;
  return m;
}

export function nextMilestone(alt: number): Milestone | null {
  const { inner } = lapOf(alt);
  return MILESTONES.find((x) => x.alt > inner) ?? null;
}

/** Highest milestone crossed when going from one altitude to another, if any; passing the edge of the universe is a new lap. */
export function crossed(from: number, to: number): Milestone | null {
  const a = lapOf(from);
  const b = lapOf(to);
  if (b.lap > a.lap) return { alt: 0, name: `Vòng ${b.lap}`, note: 'qua lỗ giun về lại bãi cỏ', kind: 'lap' };
  let hit: Milestone | null = null;
  for (const x of MILESTONES) if (x.alt > a.inner && x.alt <= b.inner && x.alt > 0) hit = x;
  return hit;
}

/** Vietnamese-formatted altitude: metres under 10 km, then km, then triệu/tỷ km, then năm ánh sáng. */
/** Height within the lap, split into number and unit, for displays that set the unit smaller. */
export function formatAltParts(alt: number): [string, string] {
  const s = formatInner(lapOf(alt).inner);
  const i = s.indexOf(' ');
  return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)];
}

function formatInner(alt: number): string {
  const vi = (n: number, d = 0) => n.toLocaleString('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  if (alt < 1) return '0 m';
  if (alt < 10000) return `${vi(Math.round(alt))} m`;
  const km = alt / 1000;
  if (km < 1e6) return `${vi(Math.round(km))} km`;
  if (km < 1e9) return `${vi(km / 1e6, km < 1e7 ? 1 : 0)} triệu km`;
  if (alt < 0.1 * LY) return `${vi(km / 1e9, km < 1e10 ? 1 : 0)} tỷ km`;
  const ly = alt / LY;
  if (ly < 1e6) return `${vi(ly, ly < 10 ? 1 : 0)} năm ánh sáng`;
  if (ly < 1e9) return `${vi(ly / 1e6, ly < 1e7 ? 1 : 0)} triệu năm ánh sáng`;
  return `${vi(ly / 1e9, 1)} tỷ năm ánh sáng`;
}

/** Vietnamese-formatted altitude: metres, km, triệu/tỷ km, năm ánh sáng; past the first lap, "Vòng 2 · 3 km". */
export function formatAlt(alt: number): string {
  const { lap, inner } = lapOf(alt);
  return lap > 1 ? `Vòng ${lap} · ${formatInner(inner)}` : formatInner(inner);
}

export const MAX_DAILY_POINTS = TIERS[5].points * 7 + 20 * 6;
