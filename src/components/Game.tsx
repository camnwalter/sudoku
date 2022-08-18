import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { CellData } from "../utils/types";
import { deepClone, Environment, MoveTypes } from "../utils/utils";
import { Board } from "./Board";
import { Body } from "./Body";
import { Buttons } from "./Buttons";
import { RemainingNumbers } from "./RemainingNumbers";
import { Timer } from "./Timer";

interface GameProps {
  environment: Environment;
}

export const Game = ({ environment }: GameProps) => {
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
        environment === Environment.Sandbox ||
        moveType.current === MoveTypes.Number
      ) {
        tempBoard[index].number = key;
        tempBoard[index].corners = [];
        tempBoard[index].centers = [];
        if (environment === Environment.Sandbox) {
          tempBoard[index].locked = true;
        }
      } else if (
        number === null &&
        (e.ctrlKey || moveType.current === MoveTypes.Corner)
      ) {
        tempBoard[index].corners = corners.includes(key)
          ? corners.filter((num) => num !== key)
          : corners.concat(key).sort();
      } else if (
        number === null &&
        (shift || moveType.current === MoveTypes.Center)
      ) {
        tempBoard[index].centers = centers.includes(key)
          ? centers.filter((num) => num !== key)
          : centers.concat(key).sort();
      }
    });

    setMoves(tempBoard);
    setBoard(tempBoard);
  };

  return (
    <Body
      center={
        <>
          {environment !== Environment.Sandbox && <Timer />}
          <Board onKeyDown={handleNumberPressed} environment={environment} />
          <RemainingNumbers onMouseDown={handleNumberPressed} />
        </>
      }
      right={<Buttons environment={environment} />}
    />
  );
};
