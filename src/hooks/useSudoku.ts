import { SIZE } from "../utils/utils";
import type { CellData } from "../utils/types";

export const useSudoku = (board: CellData[], selected: number) => {
  const isLocked = (index: number) => board[index].locked;

  const isSelected = (index: number) => index === selected;

  const isAdjacent = (index: number) => {
    return (
      index % SIZE === selected % SIZE ||
      Math.floor(index / SIZE) === Math.floor(selected / SIZE)
    );
  };

  const inSame3x3 = (row: number, col: number) => {
    const selectedX = Math.floor(selected / SIZE);
    const selectedY = Math.floor(selected % SIZE);
    return (
      Math.floor(row / 3) === Math.floor(selectedX / 3) &&
      Math.floor(col / 3) === Math.floor(selectedY / 3)
    );
  };

  const isSameNumber = (index: number) =>
    selected >= 0 &&
    board[index].number !== null &&
    board[index].number === board[selected].number;

  return { isLocked, isAdjacent, isSelected, inSame3x3, isSameNumber };
};
