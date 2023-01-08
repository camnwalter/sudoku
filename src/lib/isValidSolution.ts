import type { Cell } from "./store";

const parsePuzzle = (puzzle: string): Cell[] => {
  return [...puzzle].map<Cell>((char) => {
    const num = parseInt(char);
    return {
      number: num || 0,
      locked: !Number.isNaN(num),
      corners: [],
      centers: [],
    };
  });
};

const arrayUnique = <T>(arr: T[]): boolean => {
  return arr.every((element, i) => arr.indexOf(element) === i);
};

const rowsValid = (board: Cell[]): boolean => {
  for (let r = 0; r < 9; r++) {
    const row: number[] = [];
    for (let c = 0; c < 9; c++) {
      row.push(board[r * 9 + c].number);
    }

    if (!arrayUnique(row)) {
      return false;
    }
  }

  return true;
};

const colsValid = (board: Cell[]): boolean => {
  for (let c = 0; c < 9; c++) {
    const column: number[] = [];
    for (let r = 0; r < 9; r++) {
      column.push(board[r * 9 + c].number);
    }

    if (!arrayUnique(column)) {
      return false;
    }
  }

  return true;
};

const boxesValid = (board: Cell[]): boolean => {
  for (let r = 0; r <= 6; r += 3) {
    for (let c = 0; c <= 6; c += 3) {
      const box: number[] = [];
      const startIndex = r * 9 + c;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          box.push(board[startIndex + i * 9 + j].number);
        }
      }

      if (!arrayUnique(box)) {
        return false;
      }
    }
  }

  return true;
};

export const isValidSolution = (puzzle: string): boolean => {
  const board = parsePuzzle(puzzle);

  return rowsValid(board) && colsValid(board) && boxesValid(board);
};
