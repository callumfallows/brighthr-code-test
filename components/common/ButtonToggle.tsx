import { Button } from "./Button";

interface ButtonToggleProps {
  isToggled: boolean;
  toggleText1: string;
  toggleText2: string;
  onClick: () => void;
  buttonText: string;
}

export const ButtonToggle = ({
  isToggled,
  toggleText1,
  toggleText2,
  onClick,
  buttonText
}: ButtonToggleProps) => {
  return (
    <Button onClick={onClick}>
      {buttonText} {isToggled ? toggleText1 : toggleText2}
    </Button>
  );
};
