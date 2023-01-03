import { writable as localWritable } from "svelte-local-storage-store";
import { get, writable, type Updater, type Writable } from "svelte/store";

export const mouseState = writable(false);

export const selectedNumbers = writable<number[]>([]);
export const selectedCells = writable<boolean[]>(Array(81).fill(false));

export interface Cell {
  number: number;
  locked: boolean;
  corners: number[];
  centers: number[];
}

export const deepClone = <T>(object: T): T => {
  if (object === null || typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(deepClone) as T;
  }

  if (object instanceof Object) {
    return Object.fromEntries(
      Object.entries(object).map(([k, v]) => [k, deepClone(v)])
    ) as T;
  }

  throw new Error("Unsupported type to deep clone!");
};

const boardState = localWritable<Cell[]>(
  "board",
  Array(81)
    .fill(0)
    .map(() => ({
      number: 0,
      locked: false,
      corners: [],
      centers: [],
    }))
);

export const timer = localWritable("elapsed", 0);
export const started = localWritable("started", false);

const createUndoRedo = (store: Writable<Cell[]>) => {
  const history = [deepClone(get(store))];
  let index = 0;

  const updateStore = () => store.set(history[index]);

  return {
    subscribe: store.subscribe,
    set(newValue: Cell[]) {
      index++;
      history[index] = newValue;
      while (index < history.length - 1) {
        history.pop();
      }
      updateStore();
    },
    update(updater: Updater<Cell[]>) {
      this.set(updater(deepClone(get(store))));
    },
    undo() {
      // empty board is always first element
      if (index > 1) {
        index--;
        updateStore();
      }
    },
    redo() {
      if (index < history.length - 1) {
        index++;
        updateStore();
      }
    },
    reset() {
      const cleanBoard = history[history.length - 1].map(resetCellIfPossible);

      index = 0;
      this.set(cleanBoard);
    },
  };
};

export const board = createUndoRedo(boardState);

export const resetCellIfPossible = ({ number, locked }: Cell): Cell => {
  return {
    number: locked ? number : 0,
    locked,
    corners: [],
    centers: [],
  };
};
