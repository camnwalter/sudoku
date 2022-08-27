import { useRouter } from "next/router";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useSudoku } from "../hooks/sudokuContext";
import { useTime } from "../hooks/timeContext";
import { useUndoRedo } from "../hooks/undoRedoContext";
import styles from "../styles/Buttons.module.css";
import { CellData } from "../utils/types";
import {
  createBoard,
  deepClone,
  Environment,
  locationToIndex,
  MoveTypes,
  SIZE,
} from "../utils/utils";
import Row from "./Row";

interface ButtonsProps {
  environment: Environment;
}

// TODO: Clear the state when switching tabs, but not when redirected.
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

  const generateBoard = (difficulty: Difficulty) => async () => {
    reset(true);

    const { puzzle } = getSudoku(difficulty);

    const copy = deepClone(board) as CellData[];

    [...puzzle].forEach((char, i) => {
      if (char === "-") return;

      copy[i].number = parseInt(char);
      copy[i].locked = true;
    });

    await createBoard(copy, router);
  };

  const reset = (clearBoard: boolean) => {
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

  const checkBoard = () => {
    const isUnique = (arr: number[]) =>
      arr.every((item, index) => arr.indexOf(item) === index);

    let solved = true;
    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        const { number } = board[locationToIndex(i, j)];
        if (number === null) {
          solved = false;
          break;
        }
        row.push(number);
      }
      if (!isUnique(row)) {
        solved = false;
        break;
      }

      row.length = 0;
      for (let j = 0; j < SIZE; j++) {
        const { number } = board[locationToIndex(j, i)];
        if (number === null) {
          solved = false;
          break;
        }
        row.push(number);
      }
      if (!isUnique(row)) {
        solved = false;
        break;
      }
    }

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
            onClick={async () => {
              const copy = deepClone(board) as CellData[];
              await createBoard(copy, router);
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
