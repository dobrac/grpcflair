import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

export interface YesNoIconProps {
  value: boolean;
  className?: string;
}

export default function YesNoIcon({ value, className }: YesNoIconProps) {
  return (
    <span className={className}>
      {value ? (
        <FontAwesomeIcon icon={faCheck} />
      ) : (
        <FontAwesomeIcon icon={faXmark} />
      )}
    </span>
  );
}
