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
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPointerEnter: (e: React.PointerEvent) => void;
}

const Cell = ({
  index,
  children,
  selected,
  adjacent,
  sameNumber,
  locked,
  onPointerDown,
  onKeyDown,
  onPointerEnter,
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
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
    >
      <span>{board[index].number}</span>
      {children}
    </div>
  );
};

export default Cell;
