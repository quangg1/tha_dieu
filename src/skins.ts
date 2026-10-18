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
  /** One line about where the kite comes from, shown in the collection. */
  story: string;
  /** The patch of sky behind it in the collection: top and bottom of the gradient. */
  sky: [string, string];
  /** What unlocks it; null for the starter kite. */
  need: { alt?: number; krill?: number; streak?: number; lap?: number } | null;
}

export const SKINS: Skin[] = [
  { id: 'son', name: 'Diều sáo', story: 'Cánh diều quen thuộc của làng quê, có ống sáo tre kêu vi vu trên đê.', sky: ['#ffe9d6', '#ffd2b8'], body: '#c0392b', inner: '#e2a72e', tail: '#c0392b', need: null },
  { id: 'may', name: 'Diều mây', story: 'Một khoảng trời xanh với những đám mây trắng.', sky: ['#e3f4ff', '#bfe2fb'], body: '#3a8fd8', inner: '#ffffff', tail: '#7cc4ff', need: { alt: 1000 } },
  { id: 'cau', name: 'Diều khinh khí cầu', story: 'Khinh khí cầu sọc màu, kèm chiếc giỏ mây nhỏ bên dưới.', sky: ['#fff3dc', '#ffdcc2'], body: '#e5533d', inner: '#f5c242', tail: '#f5c242', need: { alt: 3000 } },
  { id: 'chuoi', name: 'Diều lá tre', story: 'Chiếc lá tre xanh như lá trẻ con hay nhặt ngoài đồng.', sky: ['#ecf8dc', '#cfeab4'], body: '#3f8f4f', inner: '#bfe27a', tail: '#7fae47', need: { streak: 3 } },
  { id: 'dem', name: 'Diều sao đêm', story: 'Trời đêm có trăng khuyết và bảy ngôi sao Bắc Đẩu.', sky: ['#2a3d6e', '#121d3c'], body: '#142640', inner: '#f3dc8a', tail: '#f3dc8a', need: { alt: 100000 } },
  { id: 'ongsao', name: 'Diều ông sao', story: 'Hình chiếc đèn ông sao đỏ của đêm Trung thu.', sky: ['#fff0d6', '#ffd9a8'], body: '#d6402a', inner: '#ffd36b', tail: '#ffd36b', need: { krill: 1 } },
  { id: 'trang', name: 'Diều trăng rằm', story: 'Trăng tròn tháng Tám, có chú Cuội ngồi gốc cây đa.', sky: ['#28305e', '#151a3a'], body: '#f2b630', inner: '#fff8dc', tail: '#fff3c4', need: { alt: 384400000 } },
  { id: 'ngan', name: 'Diều chim én', story: 'Cánh én tím mang theo cả bầu trời sao.', sky: ['#3a2c7a', '#17123e'], body: '#5b3fa0', inner: '#c8b6ff', tail: '#c8b6ff', need: { krill: 5 } },
  { id: 'tinhvan', name: 'Diều bươm bướm', story: 'Cánh bướm lấp lánh như trời sao, dành cho ai bay ra ngoài vũ trụ.', sky: ['#2c2470', '#100c32'], body: '#3b2c8f', inner: '#9fd8ff', tail: '#c8b6ff', gradient: ['#6a3fd0', '#1c2a7a'], pattern: 'stars', aura: '160,140,255', prize: true, need: { alt: 2.37e22 } },
  { id: 'phuong', name: 'Diều phượng hoàng', story: 'Chim phượng đỏ cam, đuôi dài rực như lửa.', sky: ['#3a1838', '#1a0a1e'], body: '#e5532d', inner: '#ffd36b', tail: '#ffb340', gradient: ['#ff8a3c', '#c0182a'], pattern: 'feather', aura: '255,150,70', prize: true, need: { lap: 2 } },
  { id: 'rong', name: 'Diều rồng', story: 'Đầu rồng xanh có sừng vàng, thân dài uốn lượn theo gió.', sky: ['#0f3a3a', '#061a1e'], body: '#178a66', inner: '#f5c242', tail: '#f5c242', gradient: ['#2fbf8f', '#0b4f3e'], pattern: 'scale', aura: '90,230,190', prize: true, need: { lap: 3 } },
];

export function needLabel(s: Skin) {
  if (!s.need) return 'Có sẵn';
  if (s.need.alt) return `Bay tới ${formatAlt(s.need.alt)}`;
  if (s.need.krill) return `Tìm ${s.need.krill} đáp án độc nhất`;
  if (s.need.lap) return `Bay hết ${s.need.lap - 1} vòng trời`;
  return `Chuỗi ${s.need.streak} ngày`;
}

/** How far the player is towards a locked kite, for the progress bar. */
export function progress(s: Skin, p: { best: number; krill: number; streak: number }): { f: number; text: string } | null {
  if (!s.need) return null;
  const pair = (have: number, need: number, fmt: (n: number) => string) => ({ f: Math.max(0, Math.min(1, have / need)), text: `${fmt(Math.min(have, need))} / ${fmt(need)}` });
  const n = (v: number) => v.toLocaleString('vi-VN');
  if (s.need.alt) return pair(p.best, s.need.alt, formatAlt);
  if (s.need.krill) return pair(p.krill, s.need.krill, n);
  if (s.need.lap) return pair(lapOf(p.best).lap - 1, s.need.lap - 1, (v) => `${v} vòng`);
  return pair(p.streak, s.need.streak ?? 1, (v) => `${n(v)} ngày`);
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
