import { useEffect } from "react";
import { useNavigate } from "react-router";
import card1 from "../assets/card1.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import card4 from "../assets/card4.png";
import card5 from "../assets/card5.png";
import cardBack from "../assets/card.png";
import LogoImg from "../assets/logo.png";
import Button from "../components/Button";
import { warmImageCache } from "../lib/preloadImages";

function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    warmImageCache([LogoImg, cardBack, card1, card2, card3, card4, card5]);
  }, []);

  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="tracking-25 text-[15px] leading-120 font-normal text-white">
          멋쟁이사자처럼이 알려주는
        </span>
        <span className="text-[18px] font-normal text-[#ffbb00]">사자의 운세</span>
      </div>
      <img src={LogoImg} alt="로고" className="rotate-358" decoding="async" />
      <Button onNavigate={() => navigate("/card")}>시작하기</Button>
    </section>
  );
}

export default MainPage;
