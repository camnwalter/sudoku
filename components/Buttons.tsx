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
    selected,
    setSelected,
    setWon,
    moveType,
    setMoveType,
    resetBoard,
    setNumber,
    setCorners,
    setCenters,
  } = useSudoku();
  const { setTime } = useTime();
  const { resetMoves, undo, redo } = useUndoRedo();

  const router = useRouter();

  const generateBoard = (difficulty: Difficulty) => () => {
    reset(true);

    const { puzzle } = getSudoku(difficulty);

    const copy = deepClone(board) as CellData[];

    [...puzzle].forEach((char, i) => {
      if (char === "-") return;

      copy[i].number = parseInt(char);
      copy[i].locked = true;
    });

    createBoard(copy, router);
  };

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

  const checkBoard = (e: React.PointerEvent) => {
    e.preventDefault();

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
        <button
          onPointerDown={(e) => {
            e.preventDefault();

            selected.forEach((i) => {
              setNumber(i, null);
              setCorners(i, []);
              setCenters(i, []);
            });
          }}
        >
          Delete
        </button>
      </Row>
      <Row>
        <button onPointerDown={reset(false)}>Reset</button>
        {environment !== Environment.Create && (
          <>
            <button onPointerDown={checkBoard}>Check</button>
            <button onPointerDown={undo}>Undo</button>
            <button onPointerDown={redo}>Redo</button>
          </>
        )}
      </Row>
      {environment === Environment.Create ? (
        <Row>
          <button
            onPointerDown={() => {
              const copy = deepClone(board) as CellData[];
              createBoard(copy, router);
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
              onPointerDown={(e) => {
                e.preventDefault();

                setMoveType(() => ({
                  previous: MoveTypes.Number,
                  current: MoveTypes.Number,
                }));
              }}
              disabled={moveType.current === MoveTypes.Number}
            >
              Normal
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();

                setMoveType(() => ({
                  previous: MoveTypes.Corner,
                  current: MoveTypes.Corner,
                }));
              }}
              disabled={moveType.current === MoveTypes.Corner}
            >
              Corner
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();

                setMoveType(() => ({
                  previous: MoveTypes.Center,
                  current: MoveTypes.Center,
                }));
              }}
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
