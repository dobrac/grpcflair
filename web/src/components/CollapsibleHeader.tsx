import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

export interface CollapsibleHeaderProps {
  onClick: () => void;
  open: boolean;
  className?: string;
  children: ReactNode;
}

export default function CollapsibleHeader({
  onClick,
  children,
  className,
  open,
}: CollapsibleHeaderProps) {
  return (
    <button
      className={["p-0 text-start btn hover-bg-darken py-2", className].join(
        " ",
      )}
      onClick={onClick}
    >
      <div className="d-flex justify-content-between align-items-center">
        {children}
        <div>
          {open ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </div>
      </div>
    </button>
  );
}
