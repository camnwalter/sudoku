import { ReactNode } from "react";

interface CellProps {
  index: number;
  children: ReactNode;
  selected: boolean;
  adjacent: boolean;
  sameNumber: boolean;
  locked: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Cell = ({
  index,
  children,
  selected,
  adjacent,
  sameNumber,
  locked,
  onMouseDown,
  onKeyDown,
  onMouseOver,
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
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onMouseOver={onMouseOver}
    >
      {children}
    </div>
  );
};
