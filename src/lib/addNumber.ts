import { get } from "svelte/store";
import {
  board,
  resetCellIfPossible,
  selectedCells,
  selectedNumbers,
} from "./store";

const addOrRemoveExisting = (arr: number[], num: number) => {
  if (arr.includes(num)) {
    arr.splice(arr.indexOf(num), 1);
  } else {
    arr.push(num);
  }

  return arr;
};

export const addNumber = (
  event: KeyboardEvent | MouseEvent,
  num: number,
  isShiftDown: boolean = event.shiftKey
) => {
  event.preventDefault();

  if (event.ctrlKey) {
    board.update((cells) => {
      get(selectedCells).forEach((cell, i) => {
        if (!cell || cells[i].locked) return;

        cells[i] = {
          ...cells[i],
          corners: addOrRemoveExisting(cells[i].corners, num).sort(),
        };
      });

      return cells;
    });
  } else if (isShiftDown) {
    board.update((cells) => {
      get(selectedCells).forEach((cell, i) => {
        if (!cell || cells[i].locked) return;

        cells[i] = {
          ...cells[i],
          centers: addOrRemoveExisting(cells[i].centers, num).sort(),
        };
      });

      return cells;
    });
  } else {
    board.update((cells) => {
      get(selectedCells).forEach((cell, i) => {
        if (!cell || cells[i].locked) return;

        cells[i] = {
          ...resetCellIfPossible(cells[i]),
          number: num,
        };
      });

      return cells;
    });
    selectedNumbers.set([num]);
  }
};
