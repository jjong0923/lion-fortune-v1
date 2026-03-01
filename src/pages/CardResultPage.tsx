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

  const openInstagram = () => {
    const appUrl = "instagram://";
    const webUrl = "https://www.instagram.com/";

    window.location.href = appUrl;

    window.setTimeout(() => {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 900);
  };

  if (!selectedFortune) {
    return null;
  }

  return (
    <section className="animate-in fade-in zoom-in-95 flex w-full flex-col items-center duration-300">
      <img
        src={selectedFortune.image}
        loading="eager"
        decoding="async"
        draggable={false}
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

      <button
        type="button"
        onClick={openInstagram}
        className="tracking-25 mt-4 h-8 w-full max-w-65.5 cursor-pointer rounded-[10px] bg-[#ffbb00] text-[13px]/[12px] text-[#1f3175]"
      >
        인스타그램 공유하기
      </button>
    </section>
  );
}

export default CardResultPage;
