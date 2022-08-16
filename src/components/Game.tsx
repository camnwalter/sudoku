import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { CellData } from "../utils/types";
import { deepClone, MoveTypes } from "../utils/utils";
import { Board } from "./Board";
import { Body } from "./Body";
import { Buttons } from "./Buttons";
import { RemainingNumbers } from "./RemainingNumbers";
import { Timer } from "./Timer";

export const Game = () => {
  const { board, setBoard, moveType, selected } = useSudoku();

  const { setMoves } = useUndoRedo();

  const handleNumberPressed = (
    e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    key: number,
    shift: boolean
  ) => {
    const tempBoard = deepClone(board) as CellData[];

    selected.forEach((index) => {
      const { centers, corners, number } = tempBoard[index];
      if (
        moveType.current === MoveTypes.Corner ||
        (e.ctrlKey && number === null)
      ) {
        tempBoard[index].corners = corners.includes(key)
          ? corners.filter((num) => num !== key)
          : corners.concat(key).sort();
      } else if (
        moveType.current === MoveTypes.Center ||
        (shift && number === null)
      ) {
        tempBoard[index].centers = centers.includes(key)
          ? centers.filter((num) => num !== key)
          : centers.concat(key).sort();
      } else {
        tempBoard[index].number = key;
        tempBoard[index].corners = [];
        tempBoard[index].centers = [];
      }
    });

    setMoves(tempBoard);
    setBoard(tempBoard);
  };

  return (
    <Body
      center={
        <>
          <Timer />
          <Board onKeyDown={handleNumberPressed} />
          <RemainingNumbers onMouseDown={handleNumberPressed} />
        </>
      }
      right={<Buttons />}
    />
  );
};
