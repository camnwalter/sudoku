import { useRouter } from "next/router";
import { useSudoku } from "../../hooks/sudokuContext";
import { useTime } from "../../hooks/timeContext";
import { useUndoRedo } from "../../hooks/undoRedoContext";
import { Environment, MoveTypes } from "../../utils/utils";
import BasicButtons from "./Basic";
import CreateButtons from "./Create";
import PlayButtons from "./Play";

interface ButtonsProps {
  environment: Environment;
}

const Buttons = ({ environment }: ButtonsProps) => {
  const { emptyBoard, setBoard, setSelected, setWon, setMoveType, resetBoard } =
    useSudoku();
  const { setTime } = useTime();
  const { resetMoves } = useUndoRedo();

  const router = useRouter();

  const reset = (clearBoard: boolean) => () => {
    if (clearBoard) {
      setBoard(emptyBoard);
    } else {
      resetBoard();
    }
    resetMoves();
    setSelected([]);
    setTime(0);
    setWon(false);
    setMoveType({ current: MoveTypes.Number, previous: MoveTypes.Number });
  };

  return (
    <div>
      {environment === Environment.Create ? (
        <CreateButtons reset={reset} router={router} />
      ) : environment === Environment.Basic ? (
        <BasicButtons reset={reset} router={router} />
      ) : (
        <PlayButtons reset={reset} />
      )}
    </div>
  );
};

export default Buttons;
