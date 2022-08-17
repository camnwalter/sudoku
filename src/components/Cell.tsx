import { ReactNode } from "react";

interface CellProps {
  index: number;
  children: ReactNode;
  selected: boolean;
  adjacent: boolean;
  sameNumber: boolean;
  locked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const Cell = ({
  index,
  children,
  selected,
  adjacent,
  sameNumber,
  locked,
  onClick,
  onKeyDown,
}: CellProps) => {
  return (
    <div
      className={
        (selected ? "selected " : adjacent ? "adjacent " : "") +
        (sameNumber ? "sameNumber " : "") +
        (locked ? "locked " : " ")
      }
      id={index.toString()}
      tabIndex={-1}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};
