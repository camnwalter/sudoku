import { useMemo, useState } from "react";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import type { BoardNumber } from "../utils/types";
import { locationToIndex, SIZE } from "../utils/utils";
import { Board } from "./Board";
import { Body } from "./Body";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Timer } from "./Timer";

export const Game = () => {
  const [board, setBoard] = useState<BoardNumber[]>(
    Array(SIZE ** 2).fill(null)
  );
  const [lockedCells, setLockedCells] = useState<number[]>([]);
  const [corners, setCorners] = useState<number[][]>(Array(SIZE ** 2).fill([]));
  const [centers, setCenters] = useState<number[][]>(Array(SIZE ** 2).fill([]));

  const generateBoard = (difficulty: Difficulty) => {
    clearBoard();

    const sudoku = getSudoku(difficulty);

    [...sudoku.puzzle].forEach((char, i) => {
      if (char !== "-") {
        setBoard((prev) => {
          prev[i] = parseInt(char);
          return prev;
        });
        setLockedCells((prev) => [...prev, i]);
      }
    });
  };

  const clearBoard = () => {
    setBoard(Array(SIZE ** 2).fill(null));
    setLockedCells([]);
    setCorners(Array(SIZE ** 2).fill([]));
    setCenters(Array(SIZE ** 2).fill([]));
  };

  const checkBoard = () => {
    const isUnique = (arr: BoardNumber[]) =>
      arr.every((item, index) => arr.indexOf(item) === index);

    let solved = true;

    for (let i = 0; i < SIZE; i++) {
      const row = [];

      for (let j = 0; j < SIZE; j++) {
        const number = board[locationToIndex(i, j)];

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
        row.push(board[locationToIndex(j, i)]);
      }

      if (!isUnique(row)) {
        solved = false;
        break;
      }
    }

    if (solved) {
      alert("Congrats! You solved it!");
    } else {
      alert("Sorry... You messed up somewhere.");
    }
  };

  return (
    <>
      <Header>
        <Timer />
      </Header>
      <Body>
        <Board
          board={board}
          setBoard={setBoard}
          lockedCells={lockedCells}
          corners={corners}
          setCorners={setCorners}
          centers={centers}
          setCenters={setCenters}
        />
      </Body>
      <Sidebar>
        <button onClick={clearBoard}>Reset</button>
        <button onClick={checkBoard}>Check Board</button>
        <button onClick={() => generateBoard("easy")}>Easy puzzle</button>
        <button onClick={() => generateBoard("medium")}>Medium puzzle</button>
        <button onClick={() => generateBoard("hard")}>Hard puzzle</button>
        <button onClick={() => generateBoard("expert")}>Expert puzzle</button>
      </Sidebar>
    </>
  );
};
