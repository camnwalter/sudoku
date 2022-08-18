import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { BoardNumber, CellData } from "../utils/types";
import { MoveTypes, SIZE } from "../utils/utils";

interface SudokuContextProps {
  board: CellData[];
  setBoard: React.Dispatch<React.SetStateAction<CellData[]>>;
  initialBoard: CellData[];
  setInitialBoard: React.Dispatch<React.SetStateAction<CellData[]>>;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
  moveType: {
    current: MoveTypes;
    previous: MoveTypes;
  };
  setMoveType: React.Dispatch<
    React.SetStateAction<{
      current: MoveTypes;
      previous: MoveTypes;
    }>
  >;
  mouseDown: boolean;

  isLocked: (index: number) => boolean;
  isSelected: (index: number) => boolean;
  isAdjacent: (index: number) => boolean;
  inSame3x3: (row: number, col: number) => boolean;
  isSameNumber: (index: number) => boolean;
  setNumber: (index: number, number: BoardNumber) => void;
  setCorners: (index: number, corners: number[]) => void;
  setCenters: (index: number, centers: number[]) => void;
  resetBoard: () => void;
}

const SudokuContext = createContext<SudokuContextProps>({
  board: [],
  setBoard: () => undefined,
  initialBoard: [],
  setInitialBoard: () => undefined,
  selected: [],
  setSelected: () => undefined,
  won: false,
  setWon: () => undefined,
  moveType: { current: MoveTypes.Number, previous: MoveTypes.Number },
  setMoveType: () => undefined,
  mouseDown: false,

  isLocked: () => false,
  isSelected: () => false,
  isAdjacent: () => false,
  inSame3x3: () => false,
  isSameNumber: () => false,
  setNumber: () => undefined,
  setCorners: () => undefined,
  setCenters: () => undefined,
  resetBoard: () => undefined,
});

interface SudokuProviderProps {
  children: ReactNode;
}

export const SudokuProvider = ({ children }: SudokuProviderProps) => {
  const [initialBoard, setInitialBoard] = useState<CellData[]>(
    Array(SIZE ** 2)
      .fill(null)
      .map(() => ({
        number: null,
        solution: -1,
        centers: [],
        corners: [],
        locked: false,
      }))
  );
  const [board, setBoard] = useState<CellData[]>(initialBoard);
  const [selected, setSelected] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [moveType, setMoveType] = useState({
    current: MoveTypes.Number,
    previous: MoveTypes.Number,
  });
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setMoveType((prev) => {
          if (prev.current === MoveTypes.Corner) return prev;

          return {
            previous: prev.current,
            current: MoveTypes.Corner,
          };
        });
      } else if (e.shiftKey) {
        setMoveType((prev) => {
          if (prev.current === MoveTypes.Center) return prev;

          return {
            previous: prev.current,
            current: MoveTypes.Center,
          };
        });
      }
    };

    const resetMoveType = (e: KeyboardEvent) => {
      if (e.code.startsWith("Control") || e.code.startsWith("Shift"))
        setMoveType((prev) => ({
          previous: prev.previous,
          current: prev.previous,
        }));
    };

    const mouseDownHandler = () => setMouseDown(true);
    const mouseUpHandler = () => setMouseDown(false);

    document.addEventListener("keydown", cb);
    document.addEventListener("keyup", resetMoveType);
    document.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      document.removeEventListener("keydown", cb);
      document.removeEventListener("keyup", resetMoveType);
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  const isLocked = (index: number) => board[index]?.locked ?? false;

  const isSelected = (index: number) => selected.includes(index);

  const isAdjacent = (index: number) => {
    return selected.some(
      (cell) =>
        index % SIZE === cell % SIZE ||
        Math.floor(index / SIZE) === Math.floor(cell / SIZE)
    );
  };

  const inSame3x3 = (row: number, col: number) => {
    return selected.some((cell) => {
      const selectedX = Math.floor(cell / SIZE);
      const selectedY = Math.floor(cell % SIZE);
      return (
        Math.floor(row / 3) === Math.floor(selectedX / 3) &&
        Math.floor(col / 3) === Math.floor(selectedY / 3)
      );
    });
  };

  const isSameNumber = (index: number) =>
    selected.some(
      (cell) =>
        board[index].number !== null &&
        board[index].number === board[cell].number
    );

  const setNumber = (index: number, value: BoardNumber) => {
    if (index === -1) return;

    setBoard((prev) => {
      prev[index].number = value;

      return prev;
    });
  };

  const setCorners = (index: number, corners: number[]) => {
    if (index === -1) return;

    setBoard((prev) =>
      prev.map((cellData, i) => ({
        ...cellData,
        corners: i === index ? corners : cellData.corners,
      }))
    );
  };

  const setCenters = (index: number, centers: number[]) => {
    if (index === -1) return;

    setBoard((prev) =>
      prev.map((cellData, i) => ({
        ...cellData,
        centers: i === index ? centers : cellData.centers,
      }))
    );
  };

  const resetBoard = () => setBoard(initialBoard);

  return (
    <SudokuContext.Provider
      value={{
        board,
        setBoard,
        initialBoard,
        setInitialBoard,
        selected,
        setSelected,
        won,
        setWon,
        moveType,
        setMoveType,
        mouseDown,

        isLocked,
        isSelected,
        isAdjacent,
        inSame3x3,
        isSameNumber,
        setNumber,
        setCorners,
        setCenters,
        resetBoard,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudoku = () => useContext(SudokuContext);
