import card1 from "../assets/card1.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import card4 from "../assets/card4.png";
import card5 from "../assets/card5.png";

export interface CardFortuneItem {
  id: number;
  image: string;
  description: string;
}

export const CARD_FORTUNE_MOCK: CardFortuneItem[] = [
  {
    id: 1,
    image: card1,
    description:
      "오늘 사자에게는 행운이 가득한 날입니다!\n여러 사람을 만나면서 행운을 충전하세요!",
  },
  {
    id: 2,
    image: card2,
    description:
      "오늘 사자에게는 매력이 가득합니다!\n주변 여러 사람들이 좋은 기운을 주고 갑니다!",
  },
  {
    id: 3,
    image: card3,
    description:
      "오늘 사자에게는 위험이 있습니다!\n열심히 달리는 것도 좋지만\n때로는 주변을 살펴보세요!",
  },
  {
    id: 4,
    image: card4,
    description:
      "오늘 사자에게는 기운 충전이 필요합니다!\n외부 활동을 잠시 멈추고 에너지를\n충전해주세요!",
  },
  {
    id: 5,
    image: card5,
    description:
      "오늘 사자에게는 사랑이 가득한 날입니다!\n어디서 나타날지 모르는 운명의 사람을\n잘 찾아보세요!",
  },
];
