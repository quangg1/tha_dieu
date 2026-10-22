// Hành trình: every daily flight's points add up to one long trip, from the bamboo to Sông Ngân. Only daily flights count
// (one a day), so the trip rewards playing often and playing well, never grinding Thả vô tận. It never goes backwards.
// Stops come thick at first (a new player passes two or three in the first week) and thin out as the trip gets long.

export interface Station {
  /** Points of daily flights, added up, that reach this stop. */
  at: number;
  name: string;
  icon: string;
  /** One line for the arrival moment. */
  line: string;
  /** A big stop: its own sky colours on the road and a bigger arrival. */
  major?: boolean;
}

export const STATIONS: readonly Station[] = [
  { at: 0, name: 'Bãi cỏ đầu làng', icon: '🌾', line: 'Nơi mọi con diều bắt đầu.' },
  { at: 100, name: 'Ngọn tre', icon: '🎋', line: 'Diều đã qua lũy tre làng.' },
  { at: 300, name: 'Đàn cò', icon: '🕊️', line: 'Bay ngang cánh cò trắng.' },
  { at: 600, name: 'Tầng mây', icon: '☁️', line: 'Chạm tới những đám mây đầu tiên.' },
  { at: 1_000, name: 'Đỉnh Fansipan', icon: '🏔️', line: 'Cao hơn nóc nhà Đông Dương.', major: true },
  { at: 1_600, name: 'Đường bay máy bay', icon: '✈️', line: 'Vẫy tay chào phi công.' },
  { at: 2_400, name: 'Bóng thám không', icon: '🎈', line: 'Nơi trời bắt đầu chuyển tím.' },
  { at: 3_400, name: 'Bờ vũ trụ', icon: '🌌', line: 'Qua vạch Kármán, 100 km. Bạn đã ra ngoài Trái Đất.', major: true },
  { at: 4_600, name: 'Trạm vũ trụ', icon: '🛰️', line: 'Ghé thăm các phi hành gia.' },
  { at: 6_000, name: 'Vệ tinh Vinasat', icon: '📡', line: 'Vệ tinh của Việt Nam, 36.000 km.' },
  { at: 7_500, name: 'Nửa đường tới Trăng', icon: '🌗', line: 'Trái Đất giờ chỉ bằng quả bóng.' },
  { at: 9_000, name: 'Cung Trăng', icon: '🌕', line: 'Chị Hằng, chú Cuội ra đón. Diều đã lên tới Mặt Trăng.', major: true },
  { at: 12_500, name: 'Sao Kim', icon: '✨', line: 'Ngôi sao Hôm sáng nhất bầu trời.' },
  { at: 17_000, name: 'Sao Hỏa', icon: '🔴', line: 'Hành tinh đỏ. Chưa ai từng tới đây.', major: true },
  { at: 23_000, name: 'Vành đai tiểu hành tinh', icon: '☄️', line: 'Lách qua hàng triệu tảng đá.' },
  { at: 30_000, name: 'Sao Mộc', icon: '🟠', line: 'Hành tinh khổng lồ, lớn nhất Hệ Mặt Trời.', major: true },
  { at: 40_000, name: 'Sao Thổ', icon: '🪐', line: 'Diều lượn quanh vành đai băng.' },
  { at: 52_000, name: 'Sao Thiên Vương', icon: '🔵', line: 'Hành tinh nằm nghiêng.' },
  { at: 66_000, name: 'Sao Hải Vương', icon: '🔷', line: 'Gió ở đây mạnh nhất Hệ Mặt Trời.' },
  { at: 82_000, name: 'Sao Diêm Vương', icon: '❄️', line: 'Thế giới băng xa xôi.' },
  { at: 100_000, name: 'Rìa Hệ Mặt Trời', icon: '🚀', line: 'Bạn đã theo kịp tàu Voyager.', major: true },
  { at: 130_000, name: 'Cận Tinh', icon: '⭐', line: 'Ngôi sao gần Mặt Trời nhất.' },
  { at: 170_000, name: 'Sông Ngân', icon: '🌠', line: 'Nơi Ngưu Lang gặp Chức Nữ. Cuối hành trình.', major: true },
];

export interface JourneyPlace {
  total: number;
  /** Index of the last stop reached. */
  index: number;
  here: Station;
  next: Station | null;
  /** 0..1 of the way from here to next. */
  progress: number;
  /** Points still to go to the next stop. */
  left: number;
}

export function journeyAt(total: number): JourneyPlace {
  const t = Math.max(0, Math.floor(total || 0));
  let index = 0;
  STATIONS.forEach((s, i) => { if (t >= s.at) index = i; });
  const here = STATIONS[index];
  const next = STATIONS[index + 1] ?? null;
  const progress = next ? (t - here.at) / (next.at - here.at) : 1;
  return { total: t, index, here, next, progress, left: next ? next.at - t : 0 };
}

/** Stops passed going from one total to another, in order. */
export function stopsBetween(before: number, after: number): Station[] {
  return STATIONS.filter((s) => s.at > before && s.at <= after);
}

/** Rough days to the next stop at this player's own pace (their average daily points), for "khoảng N ngày nữa". */
export function daysLeft(left: number, average: number): number | null {
  if (left <= 0 || !(average > 0)) return null;
  return Math.max(1, Math.ceil(left / average));
}
