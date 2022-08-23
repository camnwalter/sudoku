import { ReactNode } from "react";
import { useSudoku } from "../hooks/sudokuContext";
import styles from "../styles/Cell.module.css";

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

const Cell = ({
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
  const { board } = useSudoku();
  return (
    <div
      className={[
        styles.cell,
        selected ? styles.selected : adjacent ? styles.adjacent : "",
        sameNumber ? styles.sameNumber : "",
        locked ? styles.locked : "",
      ].join(" ")}
      id={index.toString()}
      tabIndex={-1}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onMouseOver={onMouseOver}
    >
      <span>{board[index].number}</span>
      {children}
    </div>
  );
};

export default Cell;
