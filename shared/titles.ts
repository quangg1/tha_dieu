// Danh hiệu: the long game. Every daily flight's points add up, and the total earns the player a title, the way a
// village names its kite flyers. It is deliberately not a place: the sky (or the river, the sea, the stage in a theme
// pack) tells only today's flight, which always starts from the ground, so a long-time player is never told they are
// "at Mars" and then sent back to the grass the next morning. Only daily flights count (one a day), so the title
// rewards playing often and playing well, never grinding Thả vô tận. It never goes backwards.
// Titles come thick at first (a new player earns two or three in the first week) and thin out later.

export interface Title {
  /** Points of daily flights, added up, that earn this title. */
  at: number;
  name: string;
  /** One line for the moment the title is earned. */
  line: string;
  /** A big title: a bigger moment when it is earned. */
  major?: boolean;
}

export const TITLES: readonly Title[] = [
  { at: 0, name: 'Sợi Dây Đầu Tiên', line: 'Khởi đầu bình dị: một sợi dây và một giấc mộng vươn xa.' },
  { at: 100, name: 'Tập Nhập Môn', line: 'Tay đã quen nhịp chao của dây diều.' },
  { at: 300, name: 'Học Bắt Gió', line: 'Bạn đã cảm được luồng gió đầu tiên.' },
  { at: 600, name: 'Thành Thục Tay Dây', line: 'Diều lên xuống theo đúng ý bạn.' },
  { at: 1_000, name: 'Tay Diều Đầu Ngõ', line: 'Cả đầu ngõ biết tên bạn rồi đấy.', major: true },
  { at: 1_600, name: 'Tay Diều Nhất Làng', line: 'Kỹ năng của bạn nổi bật khắp cả vùng đồng quê.' },
  { at: 2_400, name: 'Thợ Diều Lành Nghề', line: 'Bạn hiểu từng nếp diều và sức nâng của gió.' },
  { at: 3_400, name: 'Thợ Diều Tinh Anh', line: 'Bạn đã làm chủ hoàn toàn chiếc diều trong tay.', major: true },
  { at: 4_600, name: 'Kẻ Đón Luồng Gió', line: 'Bạn bắt đầu nhạy bén với những ý tưởng hiếm.' },
  { at: 6_000, name: 'Bậc Thầy Tiếng Sáo', line: 'Tiếng sáo diều của bạn vang xa khắp xóm làng.' },
  { at: 7_500, name: 'Chủ Nhân Vùng Trời', line: 'Bạn đã xưng bá cả một khoảng không trung.' },
  { at: 9_000, name: 'Kẻ Dẫn Gió Tầng Mây', line: 'Bạn kéo cánh diều vượt qua khỏi mây xanh.', major: true },
  { at: 12_500, name: 'Kẻ Chinh Phục Khí Quyển', line: 'Bạn vượt qua giới hạn của Trái Đất.' },
  { at: 17_000, name: 'Sứ Giả Tinh Tú', line: 'Bạn mang suy nghĩ của mình đến tận các vì sao.', major: true },
  { at: 23_000, name: 'Bậc Thầy Tinh Không', line: 'Bạn đã làm chủ cả khoảng không vô tận.' },
  { at: 30_000, name: 'Kẻ Du Hành Ngân Hà', line: 'Suy nghĩ của bạn bay dọc dải Ngân Hà.', major: true },
  { at: 40_000, name: 'Phong Vương Vũ Trụ', line: 'Bạn thành vua của mọi luồng gió trong vũ trụ.' },
  { at: 55_000, name: 'Bá Chủ Tinh Vân', line: 'Bạn cai quản những chòm sao độc nhất vô nhị.', major: true },
  { at: 75_000, name: 'Huyền Thoại Bất Biến', line: 'Bạn đạt tới tầm cao mà ai cũng phải ngước nhìn.' },
  { at: 100_000, name: 'Thần Thoại Độc Bản', line: 'Có một không hai — một trên cả tỉ người.', major: true },
];

export interface TitlePlace {
  total: number;
  /** Index of the title held. */
  index: number;
  here: Title;
  next: Title | null;
  /** 0..1 of the way from here to next. */
  progress: number;
  /** Points still to go to the next title. */
  left: number;
}

export function titleAt(total: number): TitlePlace {
  const t = Math.max(0, Math.floor(total || 0));
  let index = 0;
  TITLES.forEach((s, i) => { if (t >= s.at) index = i; });
  const here = TITLES[index];
  const next = TITLES[index + 1] ?? null;
  const progress = next ? (t - here.at) / (next.at - here.at) : 1;
  return { total: t, index, here, next, progress, left: next ? next.at - t : 0 };
}

/** Titles earned going from one total to another, in order. */
export function titlesBetween(before: number, after: number): Title[] {
  return TITLES.filter((s) => s.at > before && s.at <= after);
}

/** Rough days to the next title at this player's own pace (their average daily points), for "khoảng N ngày nữa". */
export function daysLeft(left: number, average: number): number | null {
  if (left <= 0 || !(average > 0)) return null;
  return Math.max(1, Math.ceil(left / average));
}
