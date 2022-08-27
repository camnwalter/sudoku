export type BoardNumber = number | null;

export interface CellData {
  number: BoardNumber;
  corners: number[];
  centers: number[];
  locked: boolean;
}
