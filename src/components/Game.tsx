import React, { useState } from "react";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useInterval } from "../hooks/useInterval";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { useSudoku } from "../hooks/useSudoku";
import { MoveTypes, useUndoRedo } from "../hooks/useUndoRedo";
import type { BoardNumber, CellData } from "../utils/types";
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
  const [hasWon, setHasWon] = useState(false);
  const [time, setTime] = useState(0);
  const ref = useOutsideDetector(() => setSelected(-1));

  useInterval(!hasWon && !board.every((cell) => cell.number === null), () =>
    setTime((prev) => prev + 1000)
  );

  const { isAdjacent, isLocked, isSameNumber, inSame3x3, isSelected } =
    useSudoku(board, selected);

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

  const { resetMoves, undoMove, redoMove, setMoves, moves } = useUndoRedo(
    {
      type: MoveTypes.Invalid,
      index: -1,
      value: -1,
    },
    board,
    setNumber,
    setCorners,
    setCenters
  );

  const generateBoard = (difficulty: Difficulty) => {
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
    setSelected(-1);
    setTime(0);
    setHasWon(false);
  };

  const checkBoard = () => {
    const solved = board.every(({ number, solution }) => number === solution);

    if (solved) {
      alert("Congrats! You solved it!");
      setHasWon(true);
    } else {
      alert("Sorry... You messed up somewhere.");
    }
  };

  const remainingNumbers = () => {
    const counts = Array<number>(SIZE).fill(9);
    board.forEach(({ number }) => {
      if (number === null) return;
      counts[number - 1]--;
    });

    return counts.reduce<number[]>(
      (a, b, index) => (b > 0 ? [...a, index + 1] : a),
      []
    );
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
    const { centers, corners, number } = board[index];
    if (e.ctrlKey && number === null) {
      const value = corners.includes(key) ? -key : key;

      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Corner, index, value }, ...moves]
          : [{ type: MoveTypes.Corner, index, value }]
      );

      setCorners(
        index,
        corners.includes(key)
          ? corners.filter((num) => num !== key)
          : corners.concat(key).sort()
      );
    } else if (e.shiftKey && number === null) {
      const value = centers.includes(key) ? -key : key;

      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Center, index, value }, ...moves]
          : [{ type: MoveTypes.Center, index, value }]
      );
      setCenters(
        index,
        centers.includes(key)
          ? centers.filter((num) => num !== key)
          : centers.concat(key).sort()
      );
    } else {
      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Number, index, value: key }, ...moves]
          : [{ type: MoveTypes.Number, index, value: key }]
      );
      setNumber(index, key);
      setCorners(index, []);
      setCenters(index, []);
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

                      if (isLocked(index)) return;

                      const key = parseInt(e.code.substring(5));
                      if (key >= 1 && key <= 9) {
                        handleNumberPressed(e, index, key);
                      } else if (e.key === "Backspace" || e.key === "Delete") {
                        setNumber(index, null);
                        setCorners(index, []);
                        setCenters(index, []);
                      }
                    }}
                  >
                    {board[index].number}
                    {board[index].corners.length > 0 && (
                      <OverlayText
                        text={board[index].corners.join(" ")}
                        type="corner"
                      />
                    )}
                    {board[index].centers.length > 0 && (
                      <OverlayText
                        text={board[index].centers.join("")}
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

                  if (selected === -1 || isLocked(selected)) {
                    setSelected(() => {
                      const index = board.findIndex(
                        ({ number }) => number === num
                      );

                      const element = document.getElementById(index.toString());
                      element?.focus();

                      return index;
                    });

                    return;
                  }

                  if (isLocked(selected)) return;

                  handleNumberPressed(e, selected, num);
                }}
              >
                {num}
              </div>
            ))}
          </div>
        )}
        <Buttons>
          <button onClick={clearBoard}>Reset</button>
          <button onClick={checkBoard}>Check</button>
          <button onClick={() => generateBoard("easy")}>Easy</button>
          <button onClick={() => generateBoard("medium")}>Medium</button>
          <button onClick={() => generateBoard("hard")}>Hard</button>
          <button onClick={() => generateBoard("expert")}>Expert</button>
          <button onClick={() => undoMove()}>Undo</button>
          <button onClick={() => redoMove()}>Redo</button>
        </Buttons>
      </Body>
    </>
  );
};
