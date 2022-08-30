import { createContext, ReactNode, useContext, useState } from "react";
import { CellData } from "../utils/types";
import { deepClone, isEqual } from "../utils/utils";
import { useSudoku } from "./sudokuContext";

interface UndoRedoContextProps {
  resetMoves: () => void;
  undo: (e?: React.PointerEvent) => void;
  redo: (e?: React.PointerEvent) => void;
  setMoves: (value: CellData[]) => void;
}

const UndoRedoContext = createContext<UndoRedoContextProps>({
  resetMoves: () => undefined,
  undo: () => undefined,
  redo: () => undefined,
  setMoves: () => undefined,
});

interface UseUndoProviderProps {
  children: ReactNode;
}

export const UndoRedoProvider = ({ children }: UseUndoProviderProps) => {
  const { setBoard, initialBoard } = useSudoku();

  const [moves, setMoves] = useState<CellData[][]>([initialBoard]);
  const [index, setIndex] = useState(0);

  const setState = (value: CellData[]) => {
    if (isEqual(value, moves[index])) return;

    const copy = deepClone(moves.slice(0, index + 1)) as CellData[][];
    copy.push(value);

    setMoves(copy);
    setIndex(copy.length - 1);
  };

  const resetMoves = () => {
    setMoves([initialBoard]);
    setIndex(0);
  };

  const undo = (e?: React.PointerEvent) => {
    e?.preventDefault();

    if (index === 0) {
      alert("Cannot undo! No moves to undo.");
      return;
    }
    setBoard(moves[index - 1]);
    setIndex((prev) => prev - 1);
  };

  const redo = (e?: React.PointerEvent) => {
    e?.preventDefault();

    if (index >= moves.length - 1) {
      alert("Cannot redo! No moves to redo.");
      return;
    }
    setBoard(moves[index + 1]);
    setIndex((prev) => prev + 1);
  };

  return (
    <UndoRedoContext.Provider
      value={{
        resetMoves,
        undo,
        redo,
        setMoves: setState,
      }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => useContext(UndoRedoContext);
