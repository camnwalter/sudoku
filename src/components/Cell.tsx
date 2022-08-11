import { ReactNode } from "react";

interface Props {
  index: number;
  children: ReactNode;
  selected: boolean;
  adjacent: boolean;
  locked: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTableCellElement>) => void;
}

export const Cell = ({
  index,
  children,
  selected,
  adjacent,
  locked,
  onClick,
  onKeyDown,
}: Props) => {
  return (
    <div
      className={
        (selected ? "selected " : adjacent ? "adjacent " : " ") +
        (locked ? "locked" : "")
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
