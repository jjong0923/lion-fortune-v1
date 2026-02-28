import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { useState } from "react";
import { useNavigate } from "react-router";
import LogoImg from "../assets/logo.png";
import Button from "../components/Button";
import Card from "../components/Card";

function CardOrbitPage() {
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const outerOrbitCardIds = [0, 1];
  const innerOrbitCardIds = [2, 3, 4];
  const allCardIds = [...outerOrbitCardIds, ...innerOrbitCardIds];

  const handleCardClick = (cardId: number) => {
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handleSelect = () => {
    const randomCardId =
      allCardIds[Math.floor(Math.random() * allCardIds.length)] ?? 0;
    const targetCardId = selectedCardId ?? randomCardId;

    navigate(`/result/${targetCardId + 1}`);
  };

  const orbitVisualClassName = `transition-all duration-300 ${
    selectedCardId !== null ? "opacity-35 blur-[0.8px]" : "opacity-100 blur-0"
  }`;

  return (
    <section className="relative mt-35 flex flex-col gap-40">
      <img src={LogoImg} className="absolute opacity-80" />
      <div className="ml-10 flex min-h-30 items-center">
        <OrbitingCircles
          radius={135}
          iconSize={55}
          speed={3}
          className={orbitVisualClassName}
        >
          {outerOrbitCardIds.map((cardId) => (
            <div
              key={cardId}
              className={`transition-all duration-300 ${
                selectedCardId === cardId
                  ? "pointer-events-none scale-90 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              <Card onClick={() => handleCardClick(cardId)} />
            </div>
          ))}
        </OrbitingCircles>
        <OrbitingCircles
          radius={75}
          iconSize={40}
          reverse
          speed={3}
          className={orbitVisualClassName}
        >
          {innerOrbitCardIds.map((cardId) => (
            <div
              key={cardId}
              className={`transition-all duration-300 ${
                selectedCardId === cardId
                  ? "pointer-events-none scale-90 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              <Card onClick={() => handleCardClick(cardId)} />
            </div>
          ))}
        </OrbitingCircles>
      </div>
      <Button onNavigate={handleSelect}>선택하기</Button>
      {selectedCardId !== null && (
        <>
          <div className="animate-in fade-in absolute inset-0 z-10 rounded-3xl duration-300" />
          <div className="animate-in fade-in zoom-in-90 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 duration-300">
            <Card selected onClick={() => setSelectedCardId(null)} />
          </div>
        </>
      )}
    </section>
  );
}

export default CardOrbitPage;
