import { PropsWithChildren } from "react";

interface ToggleButtonProps extends PropsWithChildren {
  onClick: () => void;
  onHover?: () => void;
  onMouseLeave?: () => void;
  isDisabled?: boolean;
  className?: string;
}

const defaultButtonClass =
  "text-sm p-2 px-4 rounded-lg font-bold transition-colors bg-[#e10178] text-white hover:bg-gray-200 hover:text-black";

export const Button = ({
  onClick,
  onHover,
  onMouseLeave,
  isDisabled,
  className = defaultButtonClass,
  children
}: ToggleButtonProps) => {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      onMouseOverCapture={onHover}
      onMouseOutCapture={onMouseLeave}
      className={className}>
      {children}
    </button>
  );
};
