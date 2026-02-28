import Button from "@/components/Button";
import FortuneCard from "@/components/FortuneCard";
import { CARD_FORTUNE_MOCK } from "@/mocks/cardFortuneMock";
import { useNavigate, useParams } from "react-router";

function CardResultPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const selectedCardId = Number(cardId);

  const selectedFortune =
    CARD_FORTUNE_MOCK.find((item) => item.id === selectedCardId) ??
    CARD_FORTUNE_MOCK[0];

  if (!selectedFortune) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <img
        src={selectedFortune.image}
        alt={`fortune-card-${selectedFortune.id}`}
        className="w-36 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      />

      <FortuneCard
        title="사자의 운세"
        description={selectedFortune.description}
      />

      <div className="mt-2 flex max-w-65.5 gap-4">
        <Button onNavigate={() => navigate("/")}>메인으로</Button>
        <Button
          onNavigate={() =>
            (window.location.href = "https://www.likelionknu.com")
          }
        >
          멋사 지원하러가기
        </Button>
      </div>
    </div>
  );
}

export default CardResultPage;
