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
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
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
  isLocked: (index: number) => boolean;
  isSelected: (index: number) => boolean;
  isAdjacent: (index: number) => boolean;
  inSame3x3: (row: number, col: number) => boolean;
  isSameNumber: (index: number) => boolean;
  setNumber: (index: number, number: BoardNumber) => void;
  setCorners: (index: number, corners: number[]) => void;
  setCenters: (index: number, centers: number[]) => void;
}

const SudokuContext = createContext<SudokuContextProps>({
  board: [],
  setBoard: () => undefined,
  selected: -1,
  setSelected: () => undefined,
  won: false,
  setWon: () => undefined,
  time: 0,
  setTime: () => undefined,
  moveType: { current: MoveTypes.Number, previous: MoveTypes.Number },
  setMoveType: () => undefined,

  isLocked: () => false,
  isSelected: () => false,
  isAdjacent: () => false,
  inSame3x3: () => false,
  isSameNumber: () => false,
  setNumber: () => undefined,
  setCorners: () => undefined,
  setCenters: () => undefined,
});

interface SudokuProviderProps {
  children: ReactNode;
}

export const SudokuProvider = ({ children }: SudokuProviderProps) => {
  const [board, setBoard] = useState<CellData[]>(
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
  const [selected, setSelected] = useState(-1);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [moveType, setMoveType] = useState({
    current: MoveTypes.Number,
    previous: MoveTypes.Number,
  });

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

    document.addEventListener("keydown", cb);
    document.addEventListener("keyup", resetMoveType);

    return () => {
      document.removeEventListener("keydown", cb);
      document.removeEventListener("keyup", resetMoveType);
    };
  }, []);

  const isLocked = (index: number) => board[index]?.locked ?? false;

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

  return (
    <SudokuContext.Provider
      value={{
        board,
        setBoard,
        selected,
        setSelected,
        won,
        setWon,
        time,
        setTime,
        moveType,
        setMoveType,

        isLocked,
        isSelected,
        isAdjacent,
        inSame3x3,
        isSameNumber,
        setNumber,
        setCorners,
        setCenters,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudoku = () => useContext(SudokuContext);
