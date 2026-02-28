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
    context.fillText("사자의 운세", canvas.width / 2, 120);

    const maxImageWidth = 420;
    const maxImageHeight = 620;
    const imageRatio = image.width / image.height;
    let drawWidth = maxImageWidth;
    let drawHeight = drawWidth / imageRatio;

    if (drawHeight > maxImageHeight) {
      drawHeight = maxImageHeight;
      drawWidth = drawHeight * imageRatio;
    }

    const imageX = (canvas.width - drawWidth) / 2;
    const imageY = 180;

    context.shadowColor = "rgba(0, 0, 0, 0.35)";
    context.shadowBlur = 24;
    context.drawImage(image, imageX, imageY, drawWidth, drawHeight);
    context.shadowBlur = 0;

    const maxLines = 3;
    const maxWidth = 820;
    const description = selectedFortune.description.replace(/\r/g, "");
    const lines: string[] = [];

    context.font = "500 34px Pretendard, sans-serif";
    context.fillStyle = "rgba(255, 255, 255, 0.94)";

    for (const paragraph of description.split("\n")) {
      let line = "";

      for (const char of paragraph) {
        const nextLine = line + char;

        if (context.measureText(nextLine).width > maxWidth && line) {
          lines.push(line);
          line = char;

          if (lines.length >= maxLines) {
            break;
          }
        } else {
          line = nextLine;
        }
      }

      if (lines.length >= maxLines) {
        break;
      }

      if (line) {
        lines.push(line);
      }

      if (lines.length >= maxLines) {
        break;
      }
    }

    const textStartY = 880;
    const lineHeight = 44;

    lines.slice(0, maxLines).forEach((line, index) => {
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
          ? "이미지 다운로드 중..."
          : isReadyToOpenInstagram
            ? "인스타그램 열기"
            : "이미지 다운로드하기"}
      </button>

      <p className="mt-2 text-[11px] text-white/70 md:hidden">
        1회 클릭: 이미지 다운로드, 2회 클릭: 인스타그램 열기
      </p>
    </section>
  );
}

export default CardResultPage;
