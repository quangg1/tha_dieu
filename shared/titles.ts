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
  { at: 3_400, name: 'Nghệ Nhân Khơi Gió', line: 'Dưới tay bạn, thả diều thành một nghệ thuật.', major: true },
  { at: 4_600, name: 'Bậc Thầy Tiếng Sáo', line: 'Tiếng sáo diều của bạn vang xa khắp xóm làng.' },
  { at: 6_000, name: 'Nghệ Nhân Vùng Trời', line: 'Bạn đã làm chủ cả khoảng trời quê hương.' },
  { at: 7_500, name: 'Kẻ Đón Tầng Mây', line: 'Diều của bạn chạm tới những chỏm mây cao.' },
  { at: 9_000, name: 'Bách Phong Vương', line: 'Trăm luồng gió tầng cao đều chịu khuất phục.', major: true },
  { at: 12_500, name: 'Chạm Tầng Khí Quyển', line: 'Bạn vươn tới ranh giới cao nhất của bầu trời.' },
  { at: 17_000, name: 'Sứ Giả Tầng Cao', line: 'Cánh diều nối liền mặt đất với khoảng không.', major: true },
  { at: 23_000, name: 'Tọa Độ Tinh Không', line: 'Giấc mộng của bạn đã vượt khỏi trọng lực, đi vào tinh tú.' },
  { at: 30_000, name: 'Truyền Nhân Sóng Ngân Hà', line: 'Tiếng sáo diều hòa vào nhịp sóng Ngân Hà.', major: true },
  { at: 40_000, name: 'Phong Vương Vũ Trụ', line: 'Bạn thành chúa tể của những luồng gió vũ trụ.' },
  { at: 55_000, name: 'Kỳ Tích Tinh Vân', line: 'Cánh diều trao đổi ánh sáng với các tinh vân.', major: true },
  { at: 75_000, name: 'Huyền Thoại Vĩnh Hằng', line: 'Sợi dây diều nối liền các thiên hà.' },
  { at: 100_000, name: 'Bách Niên Vũ Trụ', line: 'Bạn thả diều giữa lòng vũ trụ, muôn đời.', major: true },
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
