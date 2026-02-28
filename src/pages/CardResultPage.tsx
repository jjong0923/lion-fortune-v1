import Button from "@/components/Button";
import FortuneCard from "@/components/FortuneCard";
import { CARD_FORTUNE_MOCK } from "@/mocks/cardFortuneMock";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

function CardResultPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isReadyToOpenInstagram, setIsReadyToOpenInstagram] = useState(false);
  const selectedCardId = Number(cardId);

  const selectedFortune =
    CARD_FORTUNE_MOCK.find((item) => item.id === selectedCardId) ??
    CARD_FORTUNE_MOCK[0];

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = src;
    });

  const drawRoundedRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  };

  const splitLinesByWidth = (
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
  ) => {
    const lines: string[] = [];

    for (const paragraph of text.split("\n")) {
      let line = "";

      for (const char of paragraph) {
        const nextLine = line + char;

        if (context.measureText(nextLine).width > maxWidth && line) {
          lines.push(line);
          line = char;

          if (lines.length >= maxLines) {
            return lines;
          }
        } else {
          line = nextLine;
        }
      }

      if (line) {
        lines.push(line);
      }

      if (lines.length >= maxLines) {
        return lines;
      }
    }

    return lines;
  };

  const createInstagramShareImage = async () => {
    if (!selectedFortune) {
      throw new Error("No selected fortune");
    }

    const image = await loadImage(selectedFortune.image);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to create canvas context");
    }

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1F3175");
    gradient.addColorStop(1, "#0A1136");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255, 255, 255, 0.95)";
    context.font = '700 54px "Jalnan 2", sans-serif';
    context.textAlign = "center";
    context.fillText("사자의 운세", canvas.width / 2, 110);

    const maxImageWidth = 360;
    const maxImageHeight = 520;
    const imageRatio = image.width / image.height;
    let drawWidth = maxImageWidth;
    let drawHeight = drawWidth / imageRatio;

    if (drawHeight > maxImageHeight) {
      drawHeight = maxImageHeight;
      drawWidth = drawHeight * imageRatio;
    }

    const imageX = (canvas.width - drawWidth) / 2;
    const imageY = 160;

    context.shadowColor = "rgba(0, 0, 0, 0.35)";
    context.shadowBlur = 24;
    context.drawImage(image, imageX, imageY, drawWidth, drawHeight);
    context.shadowBlur = 0;

    const cardX = 120;
    const cardY = 710;
    const cardWidth = 840;
    const cardHeight = 270;

    drawRoundedRect(context, cardX, cardY, cardWidth, cardHeight, 24);
    context.fillStyle = "#d1d1d1";
    context.fill();

    context.fillStyle = "#3d67c2";
    context.font = '400 42px "Jalnan 2", sans-serif';
    context.fillText("오늘의 사자 운세", canvas.width / 2, cardY + 70);

    context.fillStyle = "#1f2937";
    context.font = "600 30px Pretendard, sans-serif";

    const description = selectedFortune.description.replace(/\r/g, "");
    const lines = splitLinesByWidth(context, description, 720, 4);
    const lineHeight = 42;
    const textStartY = cardY + 130;

    lines.forEach((line, index) => {
      context.fillText(line, canvas.width / 2, textStartY + lineHeight * index);
    });

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to generate image blob"));
          return;
        }

        resolve(blob);
      }, "image/png");
    });
  };

  const blobToDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Failed to convert blob to data URL"));
      };
      reader.onerror = () => reject(new Error("Failed to read blob"));
      reader.readAsDataURL(blob);
    });

  const downloadImage = async (blob: Blob) => {
    const filename = `lion-fortune-${selectedFortune?.id ?? "result"}.png`;
    const file = new File([blob], filename, { type: "image/png" });
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "사자의 운세",
        text: "이미지를 저장하거나 인스타그램으로 공유해보세요.",
      });
      return;
    }

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      const dataUrl = await blobToDataUrl(blob);
      const popup = window.open(dataUrl, "_blank", "noopener,noreferrer");

      if (!popup) {
        window.location.href = dataUrl;
      }

      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1500);
  };

  const openInstagram = () => {
    const appUrl = "instagram://";
    const webUrl = "https://www.instagram.com/";

    window.location.href = appUrl;

    window.setTimeout(() => {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 900);
  };

  const handleShareToInstagram = async () => {
    if (!selectedFortune || isPreparingImage) {
      return;
    }

    if (isReadyToOpenInstagram) {
      openInstagram();
      return;
    }

    setIsPreparingImage(true);

    try {
      const blob = await createInstagramShareImage();
      await downloadImage(blob);
      setIsReadyToOpenInstagram(true);
    } catch {
      setIsReadyToOpenInstagram(false);
    } finally {
      setIsPreparingImage(false);
    }
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

      <FortuneCard title="사자의 운세" description={selectedFortune.description} />

      <div className="mt-4 flex max-w-65.5 gap-4">
        <Button onNavigate={() => navigate("/")}>메인으로</Button>
        <Button onNavigate={() => (window.location.href = "https://www.likelionknu.com")}>
          멋사 지원하러가기
        </Button>
      </div>

      <button
        type="button"
        onClick={handleShareToInstagram}
        disabled={isPreparingImage}
        className="tracking-25 mt-4 h-8 w-full max-w-65.5 rounded-[10px] bg-[#ffbb00] text-[13px]/[12px] text-[#1f3175] md:hidden disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPreparingImage
          ? "이미지 준비 중..."
          : isReadyToOpenInstagram
            ? "인스타그램 열기"
            : "이미지 저장하기"}
      </button>

      <p className="mt-2 text-[11px] text-white/70 md:hidden">
        1회 클릭: 이미지 저장, 2회 클릭: 인스타그램 열기
      </p>
    </section>
  );
}

export default CardResultPage;
