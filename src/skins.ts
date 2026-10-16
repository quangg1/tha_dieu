// Kite skins, unlocked by how high the kite has flown, how many hidden answers the player has found, and streaks.
import { formatAlt } from '../shared/scoring.js';

export interface Skin {
  id: string;
  name: string;
  body: string;
  inner: string;
  tail: string;
  /** What unlocks it; null for the starter kite. */
  need: { alt?: number; krill?: number; streak?: number } | null;
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
];

export function needLabel(s: Skin) {
  if (!s.need) return 'Có sẵn';
  if (s.need.alt) return `Bay tới ${formatAlt(s.need.alt)}`;
  if (s.need.krill) return `Tìm ${s.need.krill} đáp án Cung Trăng`;
  return `Chuỗi ${s.need.streak} ngày`;
}

export function unlocked(s: Skin, p: { best: number; krill: number; streak: number }) {
  if (!s.need) return true;
  return (s.need.alt ? p.best >= s.need.alt : true) && (s.need.krill ? p.krill >= s.need.krill : true) && (s.need.streak ? p.streak >= s.need.streak : true);
}

export function skinById(id: string) {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}
