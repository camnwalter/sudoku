export type BoardNumber = number | null;

export interface CellData {
  number: BoardNumber;
  solution: number;
  corners: number[];
  centers: number[];
  locked: boolean;
}
