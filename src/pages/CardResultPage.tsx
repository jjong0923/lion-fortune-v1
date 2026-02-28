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
    <section className="animate-in fade-in zoom-in-95 flex w-full flex-col items-center duration-300">
      <img
        src={selectedFortune.image}
        alt={`fortune-card-${selectedFortune.id}`}
        className="animate-in zoom-in-90 mb-7 w-36 shadow-[0_12px_30px_rgba(0,0,0,0.35)] duration-300"
      />

      <FortuneCard
        title="사자의 운세"
        description={selectedFortune.description}
      />

      <div className="mt-4 flex max-w-65.5 gap-4">
        <Button onNavigate={() => navigate("/")}>메인으로</Button>
        <Button
          onNavigate={() =>
            (window.location.href = "https://www.likelionknu.com")
          }
        >
          멋사 지원하러가기
        </Button>
      </div>
    </section>
  );
}

export default CardResultPage;
