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
  { at: 0, name: 'Mới cầm diều', line: 'Ai cũng bắt đầu từ một sợi dây và một cơn gió.' },
  { at: 100, name: 'Tập thả', line: 'Diều đã biết lên, tay đã biết giữ.' },
  { at: 300, name: 'Biết đón gió', line: 'Bạn bắt đầu nghe ra gió đến từ đâu.' },
  { at: 600, name: 'Thả có nghề', line: 'Đám trẻ trong ngõ bắt đầu hỏi bí quyết.' },
  { at: 1_000, name: 'Tay diều trong xóm', line: 'Cả xóm biết tên bạn rồi đấy.', major: true },
  { at: 1_600, name: 'Tay diều cả làng', line: 'Chiều nào bãi cỏ cũng có người chờ xem bạn thả.' },
  { at: 2_400, name: 'Thợ diều', line: 'Bạn không chỉ thả, bạn hiểu diều.' },
  { at: 3_400, name: 'Thợ diều lành nghề', line: 'Gió khó đến mấy bạn cũng tìm ra đường lên.', major: true },
  { at: 4_600, name: 'Nghệ nhân diều', line: 'Người làng mang diều đến nhờ bạn xem giúp.' },
  { at: 6_000, name: 'Nghệ nhân cả vùng', line: 'Tiếng sáo diều của bạn vang qua mấy làng bên.' },
  { at: 7_500, name: 'Người giữ gió', line: 'Gió như quen tay bạn.' },
  { at: 9_000, name: 'Bậc thầy gió', line: 'Hội diều mời bạn ngồi ghế giám khảo.', major: true },
  { at: 12_500, name: 'Lão làng', line: 'Chuyện bạn thả diều thành chuyện kể bên ấm trà.' },
  { at: 17_000, name: 'Danh thủ diều sáo', line: 'Ít ai thả được như bạn.', major: true },
  { at: 23_000, name: 'Cao thủ một vùng trời', line: 'Bạn biết đáp án mà cả làng không nghĩ tới.' },
  { at: 30_000, name: 'Truyền nhân diều sáo', line: 'Nghề diều có người nối rồi.', major: true },
  { at: 40_000, name: 'Thánh gió', line: 'Người ta nói gió đổi chiều theo ý bạn.' },
  { at: 55_000, name: 'Huyền thoại bãi cỏ', line: 'Tên bạn được khắc lên cột đình.', major: true },
  { at: 75_000, name: 'Huyền thoại diều Việt', line: 'Không còn ai để so nữa.' },
  { at: 100_000, name: 'Người thả diều của trăm năm', line: 'Bạn đã chơi đủ lâu và đủ giỏi để thành một phần của làng.', major: true },
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
