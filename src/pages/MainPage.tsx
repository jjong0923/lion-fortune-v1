import { useNavigate } from "react-router";
import LogoImg from "../assets/logo.png";
import Button from "../components/Button";

function MainPage() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="tracking-25 text-[15px] leading-120 font-normal text-white">
          멋쟁이사자처럼이 알려주는
        </span>
        <span className="text-[18px] font-normal text-[#ffbb00]">
          사자의 운세
        </span>
      </div>
      <img src={LogoImg} alt="로고" className="rotate-358" />
      <Button onNavigate={() => navigate("/card")}>시작하기</Button>
    </section>
  );
}

export default MainPage;
