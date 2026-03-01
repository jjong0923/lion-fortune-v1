import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import cardBack from "../assets/card.png";

const CARD_COUNT = 5;

interface RenderedCard {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

function CardCanvas3DTestPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderedCardsRef = useRef<RenderedCard[]>([]);
  const selectedCardIdRef = useRef<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useEffect(() => {
    selectedCardIdRef.current = selectedCardId;
  }, [selectedCardId]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let animationFrameId = 0;
    let cancelled = false;

    const resize = () => {
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const render = (images: HTMLImageElement[], timeMs: number) => {
      if (cancelled) {
        return;
      }

      resize();

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const now = timeMs * 0.001;
      const centerX = width * 0.5;
      const centerY = height * 0.54;
      const orbitRadius = Math.min(width, height) * 0.27;
      const cameraDistance = orbitRadius * 3.5;
      const baseCardHeight = Math.min(width, height) * 0.38;
      const baseCardWidth = baseCardHeight * 0.64;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const cards = images
        .map((image, index) => {
          const phase = now * 0.62 + (index / images.length) * Math.PI * 2;
          const x3d = Math.cos(phase) * orbitRadius * 1.1;
          const z3d = Math.sin(phase) * orbitRadius;
          const perspective = cameraDistance / (cameraDistance - z3d);
          const drawHeight = baseCardHeight * perspective;
          const drawWidth = baseCardWidth * perspective;

          return {
            id: index + 1,
            image,
            z3d,
            x: centerX + x3d * perspective,
            y: centerY,
            width: drawWidth,
            height: drawHeight,
            yaw: Math.sin(phase) * 0.5,
            opacity: 0.4 + ((z3d + orbitRadius) / (2 * orbitRadius)) * 0.6,
            perspective,
          };
        })
        .sort((a, b) => a.z3d - b.z3d);

      const selectedId = selectedCardIdRef.current;
      const hasSelection = selectedId !== null;

      if (selectedId !== null) {
        cards.sort((a, b) => {
          if (a.id === selectedId) {
            return 1;
          }

          if (b.id === selectedId) {
            return -1;
          }

          return a.z3d - b.z3d;
        });
      }

      const renderedCards: RenderedCard[] = [];

      for (const card of cards) {
        const isSelected = card.id === selectedId;
        const baseScaleX = Math.max(0.56, 1 - Math.abs(card.yaw) * 0.45);
        const scaleX = isSelected
          ? 1
          : hasSelection
            ? baseScaleX * 0.9
            : baseScaleX;
        const drawWidth = isSelected ? baseCardWidth * 1.28 : card.width;
        const drawHeight = isSelected ? baseCardHeight * 1.28 : card.height;
        const drawX = isSelected ? centerX : card.x;
        const drawY = isSelected ? centerY : card.y;
        const alpha = isSelected
          ? 1
          : hasSelection
            ? card.opacity * 0.2
            : card.opacity;

        context.save();
        context.translate(drawX, drawY);
        context.rotate(isSelected ? 0 : card.yaw * 0.12);
        context.scale(scaleX, 1);
        context.globalAlpha = alpha;
        context.shadowColor = isSelected
          ? "rgba(0, 0, 0, 0.48)"
          : "rgba(0, 0, 0, 0.32)";
        context.shadowBlur = isSelected ? 34 : 18 * card.perspective;
        context.shadowOffsetY = isSelected ? 16 : 9 * card.perspective;

        context.drawImage(
          card.image,
          -drawWidth * 0.5,
          -drawHeight * 0.5,
          drawWidth,
          drawHeight,
        );

        context.restore();

        renderedCards.push({
          id: card.id,
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight,
          scaleX,
        });
      }

      renderedCardsRef.current = renderedCards;

      animationFrameId = window.requestAnimationFrame((nextTime) =>
        render(images, nextTime),
      );
    };

    window.addEventListener("resize", resize);

    void Promise.all(
      Array.from({ length: CARD_COUNT }, () => loadImage(cardBack)),
    )
      .then((images) => {
        if (cancelled || images.length === 0) {
          return;
        }

        render(images, performance.now());
      })
      .catch(() => {
        // Test page: if image loading fails, just stop rendering.
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const cards = renderedCardsRef.current;

    for (let index = cards.length - 1; index >= 0; index -= 1) {
      const card = cards[index];

      if (!card) {
        continue;
      }

      const halfWidth = (card.width * card.scaleX) / 2;
      const halfHeight = card.height / 2;
      const isInsideX =
        clickX >= card.x - halfWidth && clickX <= card.x + halfWidth;
      const isInsideY =
        clickY >= card.y - halfHeight && clickY <= card.y + halfHeight;

      if (isInsideX && isInsideY) {
        handleCardClick(card.id);
        return;
      }
    }

    setSelectedCardId(null);
  };

  const handleCardClick = (cardId: number) => {
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handleSelect = () => {
    const randomCardId = Math.floor(Math.random() * CARD_COUNT) + 1;
    const targetCardId = selectedCardId ?? randomCardId;
    navigate(`/result/${targetCardId}`);
  };

  return (
    <section className="relative flex min-h-dvh w-full max-w-105 flex-col px-4">
      <div className="relative h-130 w-full overflow-hidden rounded-3xl">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="h-full w-full cursor-pointer"
        />
      </div>

      <div className="relative z-30 flex justify-center">
        <Button onNavigate={handleSelect}>선택하기</Button>
      </div>
    </section>
  );
}

export default CardCanvas3DTestPage;
