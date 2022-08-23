import { useRouter } from "next/router";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useSudoku } from "../hooks/sudokuContext";
import { useTime } from "../hooks/timeContext";
import { useUndoRedo } from "../hooks/undoRedoContext";
import styles from "../styles/Buttons.module.css";
import { Environment, MoveTypes } from "../utils/utils";
import Row from "./Row";

interface ButtonsProps {
  environment: Environment;
}

const Buttons = ({ environment }: ButtonsProps) => {
  const {
    emptyBoard,
    board,
    setBoard,
    setSelected,
    setWon,
    moveType,
    setMoveType,
    resetBoard,
  } = useSudoku();
  const { setTime } = useTime();
  const { resetMoves, undo, redo } = useUndoRedo();

  const router = useRouter();

  const generateBoard = (difficulty: Difficulty) => () => {
    reset(true);

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

  const reset = (clearBoard: boolean) => {
    if (clearBoard) {
      setBoard(() => emptyBoard);
    } else {
      resetBoard();
    }
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
    <div className={styles.buttons}>
      <Row>
        <button onClick={() => reset(false)}>Reset</button>
        {environment !== Environment.Create && (
          <>
            <button onClick={checkBoard}>Check</button>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
          </>
        )}
      </Row>
      {environment === Environment.Create ? (
        <Row>
          <button
            onClick={() => {
              fetch("api/games", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(board),
              })
                .then((res) => res.json())
                .then(({ uuid }) => {
                  router.push(`/play/${uuid}`);
                });
            }}
          >
            {"Save Board"}
          </button>
        </Row>
      ) : (
        <>
          {environment === Environment.Basic && (
            <Row>
              <button onClick={generateBoard("easy")}>Easy</button>
              <button onClick={generateBoard("medium")}>Medium</button>
              <button onClick={generateBoard("hard")}>Hard</button>
              <button onClick={generateBoard("expert")}>Expert</button>
            </Row>
          )}

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
        </>
      )}
    </div>
  );
};

export default Buttons;
