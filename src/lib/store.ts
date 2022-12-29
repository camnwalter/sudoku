import { writable } from "svelte/store";
import { writable as localWritable } from "svelte-local-storage-store";

export const mouseState = writable(false);

export const selectedNumbers = writable<number[]>([]);
export const selectedCells = writable<boolean[]>(Array(81).fill(false));

interface Cell {
  number: number;
  locked: boolean;
}

export const board = localWritable<Cell[]>(
  "board",
  Array(81)
    .fill(0)
    .map(() => ({ number: 0, locked: false }))
);
