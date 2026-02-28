interface ButtonProps {
  children: React.ReactNode;
  onNavigate?: () => void;
}

function Button({ children, onNavigate }: ButtonProps) {
  return (
    <button
      type="button"
      className="tracking-25 h-8 min-w-31 cursor-pointer rounded-[10px] bg-[#c9dbf2] px-2 py-2.25 text-[13px]/[12px]"
      onClick={onNavigate}
    >
      {children}
    </button>
  );
}

export default Button;
