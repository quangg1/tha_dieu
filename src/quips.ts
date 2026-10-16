// Cheeky one-liners: the surprising moments a player wants to screenshot and send to friends.
// Picked by a seed (day + score + slot) so a line stays put on re-render yet changes from day to day.
import { formatAlt } from '../shared/scoring.js';

export function seedOf(...parts: (string | number)[]): number {
  let h = 2166136261;
  for (const ch of parts.join('|')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

const pick = <T,>(list: readonly T[], seed: number): T => list[seed % list.length];

/** After each answer, by tier index (see TIERS). */
const ANSWER: Record<number, readonly string[]> = {
  0: [
    'Đúng rồi, nhưng nửa làng cũng gõ y chang.',
    'An toàn tuyệt đối. Hơi bị an toàn.',
    'Đầu óc hôm nay đang hòa nhịp chung với cả làng.',
    'Câu quốc dân. Diều bay theo đàn.',
  ],
  6: [
    'Tưởng độc chiêu, ai dè cả làng cũng biết chiêu này.',
    'Mẹo này lộ rồi, cả xóm xài chung.',
    'Khôn đấy, nhưng ai cũng khôn y vậy.',
  ],
  1: [
    'Lệch đám đông một chút, diều nhích lên rõ.',
    'Cũng có nghề đấy.',
    'Không phải ai cũng nghĩ ra đâu.',
  ],
  2: [
    'Sao nghĩ ra hay vậy?',
    'Cả làng đang gãi đầu, bạn thả xong rồi.',
    'Đầu óc này bắt đầu khác người rồi đó.',
  ],
  3: [
    'Không ngờ có người nghĩ ra câu này!',
    'Kể đáp án này cho bạn bè, chắc ai cũng bất ngờ.',
    'Diều vừa vượt mấy nóc nhà hàng xóm.',
  ],
  4: [
    'Câu dễ vậy mà gần như chẳng ai nghĩ ra, trừ bạn.',
    'Hiếm cỡ này nên chụp màn hình lại.',
    'Bạn đang nghĩ ở một tầng mây khác.',
  ],
  5: [
    'Cả làng không ai nghĩ ra. Trừ bạn.',
    'Đầu óc này không giống người thường.',
    'Đáp án làng giấu kỹ nhất. Khoe đi, đừng ngại.',
  ],
};

export const answerQuip = (tier: number, seed: number) => pick(ANSWER[tier] ?? ANSWER[0], seed);

/** A line for the result screen and the share card, by day band (0 low … 5 top). */
const BRAG: readonly (readonly string[])[] = [
  ['Hôm nay diều hơi nhớ đất. Mai bay tiếp.', 'Nghĩ giống cả làng quá, gió không chịu nâng.', 'Thả nhẹ cho vui, mai mới thả thật.'],
  ['Bay vừa đủ thấy mái nhà hàng xóm.', 'Đầu óc chuẩn người Việt, chuẩn luôn cả đáp án.', 'Không cao, không thấp, hợp phong thủy.'],
  ['Bắt đầu có người ngước nhìn rồi đó.', 'Ai thả cao hơn thì lên tiếng.', 'Nghĩ khác số đông một chút là diều lên ngay.'],
  ['Diều này bắt đầu khó với tới rồi.', 'Đầu óc này không giống người thường.', 'Ai nghĩ ra đáp án dị hơn thì vào đây.'],
  ['Diều này phải dùng ống nhòm mới thấy.', 'Cả làng nghĩ một đằng, mình nghĩ một nẻo.', 'Vào đây xem ai mới là người hiểu người Việt nhất.'],
  ['Hết trời để bay. Ai vượt được, mình mời trà đá.', 'Lên tới Cung Trăng rồi, chị Hằng ra chào.', 'Cả làng bó tay. Mình thì không.'],
];

export function bragLine(band: number, opts: { krills: number; beaten: number; players: number; seed: number }) {
  if (opts.krills >= 2) return `${opts.krills} đáp án độc nhất. Ai nghĩ ra được dị hơn không?`;
  if (opts.players >= 10 && opts.beaten >= 95) return `Cao hơn ${opts.beaten}% cả làng. Đầu óc này không giống người thường.`;
  return pick(BRAG[Math.max(0, Math.min(5, band))], opts.seed);
}

/** The message sent with a challenge link, by day band. */
const TAUNT: readonly (readonly string[])[] = [
  ['Diều mình mới tới {alt}, dễ vượt lắm. Thử không?', 'Mình thả được {alt}. Bạn chắc chắn làm tốt hơn, vào chứng minh đi.'],
  ['Mình thả tới {alt}. Bạn nghĩ bạn hiểu người Việt hơn mình à? Vào thử.', 'Diều mình ở {alt}. Thả cao hơn thì mình phục.'],
  ['Diều mình qua lũy tre, {alt}. Tới lượt bạn.', 'Mình nghĩ khác cả làng và bay tới {alt}. Bạn thì sao?'],
  ['Thách bạn vượt {alt}. Không vượt được thì ngước nhìn nhé.', 'Diều mình ở {alt}. Ai nghĩ ra đáp án dị hơn thì vào đây.'],
  ['Diều mình ở {alt}, phải dùng ống nhòm mới thấy. Bạn bay nổi không?', 'Mình thả tới {alt}. Thách bạn nghĩ khác người được như mình.'],
  ['Mình thả tới {alt}, hết trời để bay. Vượt được mình mời trà đá.', 'Diều mình chạm Cung Trăng ({alt}). Bạn dám thử không?'],
];

export function tauntLine(band: number, altitude: number, seed: number) {
  return pick(TAUNT[Math.max(0, Math.min(5, band))], seed).replace('{alt}', formatAlt(altitude));
}

/** The banner a friend sees when they open a challenge link. */
export function challengeBanner(seed: number) {
  return pick(
    [
      'đang chờ bạn vượt mặt.',
      'nói bạn không nghĩ khác người được như vậy đâu.',
      'thả xong rồi, đang ngồi chờ bạn thua.',
      'cá là bạn không bay cao hơn.',
    ],
    seed,
  );
}

/** A line for the player's rarest answer of the flight. */
export function momentLine(tier: number, seed: number) {
  if (tier === 5) return pick(['Cả làng không ai nghĩ ra, chỉ mình bạn.', 'Đáp án làng giấu kỹ nhất, bạn tìm ra rồi.'], seed);
  if (tier === 4) return pick(['Gần như chỉ mình bạn nghĩ tới.', 'Câu tưởng dễ mà gần như chẳng ai nghĩ ra.'], seed);
  return pick(['Rất ít người nghĩ ra câu này.', 'Câu này kéo diều lên cao nhất chuyến bay.'], seed);
}
