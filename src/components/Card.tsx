import CardImg from "../assets/card.png";

interface CardProps {
  selected?: boolean;
  onClick?: () => void;
}

function Card({ selected = false, onClick }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-2xl"
    >
      <img
        src={CardImg}
        alt="card"
        className={`opacity-90 shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-200 ${
          selected
            ? "-translate-y-3 scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.35)] brightness-110"
            : "translate-y-0 scale-100 brightness-100"
        }`}
      />
    </button>
  );
}

export default Card;
