interface FortuneCardProps {
  title: string;
  description: string;
}

function FortuneCard({ title, description }: FortuneCardProps) {
  return (
    <div className="flex max-w-65.5 flex-col items-center gap-3 rounded-[10px] bg-[#d1d1d1] px-7 py-4">
      <span className="tracking-25 text-[18px] leading-120 font-normal text-[#3D67C2]">
        {title}
      </span>
      <span
        className="max-w-50 text-center text-[13px] leading-120 font-semibold whitespace-pre-wrap"
        style={{ fontFamily: "Pretendard, sans-serif" }}
      >
        {description}
      </span>
    </div>
  );
}

export default FortuneCard;
