import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSudoku } from "../../hooks/sudokuContext";
import { useTime } from "../../hooks/timeContext";
import { useUndoRedo } from "../../hooks/undoRedoContext";
import { locationToIndex, MoveTypes, SIZE } from "../../utils/utils";
import Row from "../Row";

interface PlayButtonsProps {
  reset: (clearBoard: boolean) => () => void;
}

const PlayButtons = ({ reset }: PlayButtonsProps) => {
  const {
    board,
    selected,
    setNumber,
    setCorners,
    setCenters,
    won,
    setWon,
    moveType,
    setMoveType,
  } = useSudoku();
  const { undo, redo } = useUndoRedo();
  const { formatTime } = useTime();
  const router = useRouter();

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
      setWon(true);
      // TODO: Make this happen right after the board is updated somehow.
      alert("Congrats! You solved it!");
    }
  };

  useEffect(() => {
    if (!won) {
      checkBoard();
    }
  });

  const share = () => {
    navigator.clipboard.writeText(
      `I solved this Sudoku in ${formatTime()}. Played at https://sudoku.squagward.com${
        router.asPath
      }`
    );
  };

  return won ? (
    <Row>
      <button style={{ fontSize: "larger" }} onClick={share}>
        Share
      </button>
    </Row>
  ) : (
    <>
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
        <button onPointerDown={reset(false)}>Reset</button>
      </Row>
      <Row>
        <button onPointerDown={undo}>Undo</button>
        <button onPointerDown={redo}>Redo</button>
      </Row>
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
  );
};

export default PlayButtons;
