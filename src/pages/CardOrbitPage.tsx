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

  return (
    <div className="relative mt-40 flex flex-col gap-35">
      <img src={LogoImg} className="absolute opacity-80" />
      <div className="ml-12 flex min-h-30 items-center">
        <OrbitingCircles radius={130} iconSize={50} speed={3}>
          {outerOrbitCardIds.map((cardId) =>
            selectedCardId === cardId ? (
              <div key={cardId} className="size-full" />
            ) : (
              <Card key={cardId} onClick={() => handleCardClick(cardId)} />
            ),
          )}
        </OrbitingCircles>
        <OrbitingCircles radius={70} iconSize={35} reverse speed={3}>
          {innerOrbitCardIds.map((cardId) =>
            selectedCardId === cardId ? (
              <div key={cardId} className="size-full" />
            ) : (
              <Card key={cardId} onClick={() => handleCardClick(cardId)} />
            ),
          )}
        </OrbitingCircles>
      </div>
      <Button onNavigate={handleSelect}>선택하기</Button>
      {selectedCardId !== null && (
        <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Card selected onClick={() => setSelectedCardId(null)} />
        </div>
      )}
    </div>
  );
}

export default CardOrbitPage;
