import React, { useState } from "react";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { useSudoku } from "../hooks/useSudoku";
import { useTimer } from "../hooks/useTimer";
import type { BoardNumber } from "../utils/types";
import { locationToIndex, SIZE } from "../utils/utils";
import { Board } from "./Board";
import { Body } from "./Body";
import { Buttons } from "./Buttons";
import { Cell } from "./Cell";
import { Header } from "./Header";
import { OverlayText } from "./OverlayText";
import { Timer } from "./Timer";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Game = () => {
  const [board, setBoard] = useState<BoardNumber[]>(
    Array(SIZE ** 2).fill(null)
  );
  const [corners, setCorners] = useState<number[][]>(Array(SIZE ** 2).fill([]));
  const [centers, setCenters] = useState<number[][]>(Array(SIZE ** 2).fill([]));
  const [selected, setSelected] = useState(-1);
  const [editing, setEditing] = useState(true);
  const [lockedCells, setLockedCells] = useState<boolean[]>(
    Array(SIZE ** 2).fill(false)
  );
  const [winner, setWinner] = useState(false);
  const [time, setTime] = useState(0);

  const ref = useOutsideDetector(() => setSelected(-1));

  useTimer(winner, () => setTime(time + 1000));

  const { isAdjacent, isLocked, isSameNumber, inSame3x3, isSelected } =
    useSudoku(board, lockedCells, selected);

  const generateBoard = (difficulty: Difficulty) => {
    clearBoard();

    const sudoku = getSudoku(difficulty);

    [...sudoku.puzzle].forEach((char, i) => {
      if (char === "-") return;
      setBoard((prev) => {
        prev[i] = parseInt(char);
        return prev;
      });
      setLockedCells((prev) => {
        prev[i] = true;
        return prev;
      });
    });

    setEditing(false);
  };

  const clearBoard = () => {
    setBoard(Array(SIZE ** 2).fill(null));
    setEditing(true);
    setLockedCells(Array(SIZE ** 2).fill(false));
    setCorners((prev) => prev.map(() => []));
    setCenters((prev) => prev.map(() => []));
    setSelected(-1);
    setTime(0);
  };

  const checkBoard = () => {
    const isUnique = (arr: BoardNumber[]) =>
      arr.every((item, index) => arr.indexOf(item) === index);

    let solved = true;

    for (let i = 0; i < SIZE; i++) {
      const row = [];

      for (let j = 0; j < SIZE; j++) {
        if (board[locationToIndex(i, j)] === null) {
          solved = false;
          break;
        }
        row.push(board[locationToIndex(i, j)]);
      }

      if (!isUnique(row)) {
        solved = false;
        break;
      }

      row.length = 0;
      for (let j = 0; j < SIZE; j++) {
        row.push(board[locationToIndex(j, i)]);
      }

      if (!isUnique(row)) {
        solved = false;
        break;
      }
    }

    if (solved) {
      alert("Congrats! You solved it!");
      setWinner(true);
    } else {
      alert("Sorry... You messed up somewhere.");
    }
  };

  const remainingNumbers = () => {
    const counts = Array<number>(SIZE).fill(9);
    board.forEach((num) => {
      if (num === null) return;
      counts[num - 1]--;
    });

    return counts.reduce<number[]>(
      (a, b, index) => (b > 0 ? [...a, index + 1] : a),
      []
    );
  };

  const setNumber = (index: number, value: BoardNumber) => {
    setBoard((prev) => {
      prev[index] = value;

      return prev;
    });
  };

  const handleArrowMovements = (
    e: React.KeyboardEvent<HTMLTableCellElement>
  ) => {
    const index = e.target.cellIndex;

    switch (e.key) {
      case "ArrowLeft":
        if (selected % SIZE > 0) {
          setSelected(selected - 1);
          (e.target.previousSibling as HTMLTableCellElement)?.focus();
        }
        break;
      case "ArrowRight":
        if (selected % SIZE < 8) setSelected(selected + 1);
        (e.target.nextSibling as HTMLTableCellElement)?.focus();
        break;
      case "ArrowUp":
        if (Math.floor(selected / SIZE) > 0) setSelected(selected - SIZE);
        (
          e.target.parentElement?.previousSibling?.childNodes[
            index
          ] as HTMLTableCellElement
        )?.focus();
        break;
      case "ArrowDown":
        if (Math.floor(selected / SIZE) < 8) setSelected(selected + SIZE);
        (
          e.target.parentElement?.nextSibling?.childNodes[
            index
          ] as HTMLTableCellElement
        )?.focus();
        break;
      default:
        break;
    }
  };

  const handleNumberPressed = (
    e: React.KeyboardEvent | React.MouseEvent,
    index: number,
    key: number
  ) => {
    if (e.ctrlKey) {
      if (board[index] !== null) return;

      setCorners((prev) =>
        prev.map((corners, i) => {
          if (i !== index) return corners;

          return corners.includes(key)
            ? corners.filter((num) => num !== key)
            : corners.concat(key).sort();
        })
      );
    } else if (e.shiftKey) {
      if (board[index] !== null) return;

      setCenters((prev) =>
        prev.map((centers, i) => {
          if (i !== index) return centers;

          return centers.includes(key)
            ? centers.filter((num) => num !== key)
            : centers.concat(key).sort();
        })
      );
    } else {
      setNumber(index, key);
      setCorners((prev) =>
        prev.map((corners, i) => (i !== index ? corners : []))
      );
      setCenters((prev) =>
        prev.map((centers, i) => (i !== index ? centers : []))
      );
    }
  };

  return (
    <>
      <Header>
        <Timer time={time} />
      </Header>
      <Body _ref={ref}>
        <Board>
          {rows.map((row) => (
            <tr key={row}>
              {rows.map((col) => {
                const index = locationToIndex(row, col);
                return (
                  <Cell
                    key={index}
                    index={index}
                    selected={isSelected(index) || isSameNumber(index)}
                    adjacent={isAdjacent(index) || inSame3x3(row, col)}
                    locked={isLocked(index)}
                    onClick={() => setSelected(index)}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      handleArrowMovements(e);
                      if (isLocked(index) && !editing) return;

                      const key = parseInt(e.code.substring(5));
                      if (key >= 1 && key <= 9) {
                        handleNumberPressed(e, index, key);
                      } else if (e.key === "Backspace" || e.key === "Delete") {
                        setNumber(index, null);
                        setCorners((prev) =>
                          prev.map((corners, i) => (i !== index ? corners : []))
                        );
                        setCenters((prev) =>
                          prev.map((centers, i) => (i !== index ? centers : []))
                        );
                      }
                    }}
                  >
                    {board[index]}
                    {corners[index].length > 0 && (
                      <OverlayText
                        text={corners[index].join(" ")}
                        type="corner"
                      />
                    )}
                    {centers[index].length > 0 && (
                      <OverlayText
                        text={centers[index].join("")}
                        type="center"
                      />
                    )}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </Board>
        {remainingNumbers().length > 0 && (
          <div className="remaining">
            {remainingNumbers().map((num) => (
              <div
                key={num}
                onMouseDown={(e) => {
                  e.preventDefault();

                  if (board[selected] !== null && board[selected] !== num) {
                    setSelected(() => {
                      const index = board.findIndex((cell) => cell === num);

                      const element = document.getElementById(index.toString());
                      element?.focus();

                      return index;
                    });

                    return;
                  }

                  if (isLocked(selected) && !editing) return;

                  handleNumberPressed(e, selected, num);
                }}
              >
                {num}
              </div>
            ))}
          </div>
        )}
        <Buttons>
          <button
            onClick={() => {
              clearBoard();
              setEditing(true);
            }}
          >
            Reset
          </button>
          <button onClick={checkBoard}>Check</button>
          <button onClick={() => generateBoard("easy")}>Easy</button>
          <button onClick={() => generateBoard("medium")}>Medium</button>
          <button onClick={() => generateBoard("hard")}>Hard</button>
          <button onClick={() => generateBoard("expert")}>Expert</button>
        </Buttons>
      </Body>
    </>
  );
};
