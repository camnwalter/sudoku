import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { MoveTypes, SIZE } from "../utils/utils";
import { Row } from "./Row";

export const Buttons = () => {
  const {
    board,
    setBoard,
    setSelected,
    setTime,
    setWon,
    moveType,
    setMoveType,
  } = useSudoku();

  const { resetMoves, undoMove, redoMove } = useUndoRedo();

  const generateBoard = (difficulty: Difficulty) => () => {
    clearBoard();

    const { puzzle, solution } = getSudoku(difficulty);

    [...puzzle].forEach((char, i) => {
      setBoard((prev) => {
        prev[i].solution = parseInt(solution[i]);
        return prev;
      });
      if (char === "-") return;

      setBoard((prev) => {
        prev[i].number = parseInt(char);
        prev[i].locked = true;
        return prev;
      });
    });
  };

  const clearBoard = () => {
    setBoard(
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
    resetMoves();
    setSelected([]);
    setTime(0);
    setWon(false);
    setMoveType({ current: MoveTypes.Number, previous: MoveTypes.Number });
  };

  const checkBoard = () => {
    const solved = board.every(({ number, solution }) => number === solution);

    if (solved) {
      alert("Congrats! You solved it!");
      setWon(true);
    } else {
      alert("Sorry... You messed up somewhere.");
    }
  };

  return (
    <div className="buttons">
      <Row>
        <button onClick={clearBoard}>Reset</button>
        <button onClick={checkBoard}>Check</button>
        <button onClick={undoMove}>Undo</button>
        <button onClick={redoMove}>Redo</button>
      </Row>
      <Row>
        <button onClick={generateBoard("easy")}>Easy</button>
        <button onClick={generateBoard("medium")}>Medium</button>
        <button onClick={generateBoard("hard")}>Hard</button>
        <button onClick={generateBoard("expert")}>Expert</button>
      </Row>
      <Row>
        <button
          onClick={() =>
            setMoveType(() => ({
              previous: MoveTypes.Number,
              current: MoveTypes.Number,
            }))
          }
          disabled={moveType.current === MoveTypes.Number}
        >
          Normal
        </button>
        <button
          onClick={() =>
            setMoveType(() => ({
              previous: MoveTypes.Corner,
              current: MoveTypes.Corner,
            }))
          }
          disabled={moveType.current === MoveTypes.Corner}
        >
          Corner
        </button>
        <button
          onClick={() =>
            setMoveType(() => ({
              previous: MoveTypes.Center,
              current: MoveTypes.Center,
            }))
          }
          disabled={moveType.current === MoveTypes.Center}
        >
          Center
        </button>
      </Row>
    </div>
  );
};
