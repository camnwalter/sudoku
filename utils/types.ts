import { Difficulty as SudokuDifficulty } from "sudoku-gen/dist/types/difficulty.type";

export type BoardNumber = number | null;

export interface CellData {
  number: BoardNumber;
  corners: number[];
  centers: number[];
  locked: boolean;
}

export type Difficulty = SudokuDifficulty | "unknown";

export interface Game {
  board: BoardNumber[];
  difficulty: Difficulty;
}
