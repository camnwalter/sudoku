import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  selected: boolean;
  adjacent: boolean;
  locked: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTableDataCellElement>) => void;
}

export const Cell = ({
  children,
  selected,
  adjacent,
  locked,
  onClick,
  onKeyDown,
}: Props) => {
  return (
    <td
      className={
        (selected ? "selected " : adjacent ? "adjacent " : " ") +
        (locked ? "locked" : "")
      }
      tabIndex={-1}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </td>
  );
};
