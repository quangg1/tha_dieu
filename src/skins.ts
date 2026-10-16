// Kite skins, unlocked by how high the kite has flown, how many hidden answers the player has found, and streaks.
import { formatAlt, lapOf } from '../shared/scoring.js';

export interface Skin {
  id: string;
  name: string;
  body: string;
  inner: string;
  tail: string;
  /** Two-colour body, painted top to bottom. */
  gradient?: [string, string];
  /** A pattern printed on the sail. */
  pattern?: 'feather' | 'scale' | 'stars';
  /** A glow around the kite. */
  aura?: string;
  /** Shown as a prize: the kites earned by finishing a lap of the sky. */
  prize?: boolean;
  /** What unlocks it; null for the starter kite. */
  need: { alt?: number; krill?: number; streak?: number; lap?: number } | null;
}

export const SKINS: Skin[] = [
  { id: 'son', name: 'Diều sáo đỏ', body: '#c0392b', inner: '#e2a72e', tail: '#c0392b', need: null },
  { id: 'may', name: 'Diều mây', body: '#3a8fd8', inner: '#ffffff', tail: '#7cc4ff', need: { alt: 1000 } },
  { id: 'cau', name: 'Diều khinh khí cầu', body: '#e5533d', inner: '#f5c242', tail: '#f5c242', need: { alt: 3000 } },
  { id: 'chuoi', name: 'Diều lá tre', body: '#3f8f4f', inner: '#bfe27a', tail: '#7fae47', need: { streak: 3 } },
  { id: 'dem', name: 'Diều đêm', body: '#142640', inner: '#f3dc8a', tail: '#f3dc8a', need: { alt: 100000 } },
  { id: 'ongsao', name: 'Diều ông sao', body: '#d6402a', inner: '#ffd36b', tail: '#ffd36b', need: { krill: 1 } },
  { id: 'trang', name: 'Diều trăng', body: '#f2b630', inner: '#fff8dc', tail: '#fff3c4', need: { alt: 384400000 } },
  { id: 'ngan', name: 'Diều Ngân Hà', body: '#5b3fa0', inner: '#c8b6ff', tail: '#c8b6ff', need: { krill: 5 } },
  { id: 'tinhvan', name: 'Diều tinh vân', body: '#3b2c8f', inner: '#9fd8ff', tail: '#c8b6ff', gradient: ['#6a3fd0', '#1c2a7a'], pattern: 'stars', aura: '160,140,255', prize: true, need: { alt: 2.37e22 } },
  { id: 'phuong', name: 'Diều phượng hoàng', body: '#e5532d', inner: '#ffd36b', tail: '#ffb340', gradient: ['#ff8a3c', '#c0182a'], pattern: 'feather', aura: '255,150,70', prize: true, need: { lap: 2 } },
  { id: 'rong', name: 'Diều rồng ngọc', body: '#178a66', inner: '#f5c242', tail: '#f5c242', gradient: ['#2fbf8f', '#0b4f3e'], pattern: 'scale', aura: '90,230,190', prize: true, need: { lap: 3 } },
];

export function needLabel(s: Skin) {
  if (!s.need) return 'Có sẵn';
  if (s.need.alt) return `Bay tới ${formatAlt(s.need.alt)}`;
  if (s.need.krill) return `Tìm ${s.need.krill} đáp án độc nhất`;
  if (s.need.lap) return `Qua lỗ giun, tới vòng ${s.need.lap}`;
  return `Chuỗi ${s.need.streak} ngày`;
}

export function unlocked(s: Skin, p: { best: number; krill: number; streak: number }) {
  if (!s.need) return true;
  return (
    (s.need.alt ? p.best >= s.need.alt : true) &&
    (s.need.krill ? p.krill >= s.need.krill : true) &&
    (s.need.streak ? p.streak >= s.need.streak : true) &&
    (s.need.lap ? lapOf(p.best).lap >= s.need.lap : true)
  );
}

export function skinById(id: string) {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}
