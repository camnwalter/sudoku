import { useState } from "react";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { useSudoku } from "../hooks/useSudoku";
import { useTimer } from "../hooks/useTimer";
import {
  generateNewBoard,
  locationToIndex,
  SIZE,
} from "../utils/generateBoard";
import { Board } from "./Board";
import { Body } from "./Body";
import { Cell } from "./Cell";
import { Header } from "./Header";
import { OverlayText } from "./OverlayText";
import { Sidebar } from "./Sidebar";
import { Timer } from "./Timer";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Game = () => {
  const [board, setBoard] = useState<(number | null)[]>(Array(81).fill(null));
  const [corners, setCorners] = useState<number[][]>(Array(81).fill([]));
  const [centers, setCenters] = useState<number[][]>(Array(81).fill([]));
  const [selected, setSelected] = useState(-1);
  const [editing, setEditing] = useState(true);
  const [lockedCells, setLockedCells] = useState<boolean[]>(
    Array(81).fill(false)
  );
  const [winner, setWinner] = useState(false);
  const [time, setTime] = useState(0);

  const ref = useOutsideDetector(() => setSelected(-1));

  useTimer(winner, () => setTime((time) => time + 1000));

  const { isAdjacent, isLocked, isSameNumber, inSame3x3, isSelected } =
    useSudoku(board, lockedCells, selected);

  const easy = () => {
    generateNewBoard(36, board, setNumber);

    setEditing(false);
    setLockedCells((prev) => {
      const temp = [...prev];
      board.forEach((cell, index) => {
        if (cell !== null) temp[index] = true;
      });
      return temp;
    });
  };

  const medium = () => {
    generateNewBoard(45, board, setNumber);

    setEditing(false);
    setLockedCells((prev) => {
      const temp = [...prev];
      board.forEach((cell, index) => {
        if (cell !== null) temp[index] = true;
      });
      return temp;
    });
  };

  const hard = () => {
    generateNewBoard(54, board, setNumber);

    setEditing(false);
    setLockedCells((prev) => {
      const temp = [...prev];
      board.forEach((cell, index) => {
        if (cell !== null) temp[index] = true;
      });
      return temp;
    });
  };

  const resetBoard = () => {
    setBoard((prev) => {
      const temp = [...prev];
      lockedCells.forEach((locked, index) => {
        if (locked) return;
        temp[index] = null;
      });
      return temp;
    });
    setCorners((prev) => prev.map(() => []));
    setCenters((prev) => prev.map(() => []));
    setSelected(-1);
    setEditing(true);
    setTime(0);
  };

  const checkBoard = () => {
    const isUnique = (arr: (number | null)[]) =>
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
    const counts = Array<number>(9).fill(9);
    board.forEach((num) => {
      if (num === null) return;
      counts[num - 1]--;
    });

    return counts.reduce<number[]>(
      (a, b, index) => (b > 0 ? [...a, index + 1] : a),
      []
    );
  };

  const setNumber = (index: number, value: number | null) => {
    setBoard((prev) => {
      const temp = [...prev];
      temp[index] = value;

      return temp;
    });
  };

  const handleArrowMovements = (
    e: React.KeyboardEvent<HTMLTableCellElement>
  ) => {
    const index = e.target.cellIndex;

    switch (e.key) {
      case "ArrowLeft":
        if (selected % 9 > 0) {
          setSelected(selected - 1);
          (e.target.previousSibling as HTMLTableCellElement)?.focus();
        }
        break;
      case "ArrowRight":
        if (selected % 9 < 8) setSelected(selected + 1);
        (e.target.nextSibling as HTMLTableCellElement)?.focus();
        break;
      case "ArrowUp":
        if (Math.floor(selected / 9) > 0) setSelected(selected - 9);
        (
          e.target.parentElement?.previousSibling?.childNodes[
            index
          ] as HTMLTableCellElement
        )?.focus();
        break;
      case "ArrowDown":
        if (Math.floor(selected / 9) < 8) setSelected(selected + 9);
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

  return (
    <>
      <Header>
        <Timer time={time} />
      </Header>
      <Body>
        <Board _ref={ref}>
          {rows.map((row) => (
            <tr key={row}>
              {rows.map((col) => {
                const index = locationToIndex(row, col);
                return (
                  <Cell
                    key={col}
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
                        if (e.ctrlKey) {
                          if (board[index] !== null) return;

                          setCorners((prev) => {
                            const temp = [...prev];
                            return temp.map((corners, i) => {
                              if (i !== index) return corners;

                              return corners.includes(key)
                                ? corners.filter((num) => num !== key)
                                : corners.concat(key).sort();
                            });
                          });
                        } else if (e.shiftKey) {
                          if (board[index] !== null) return;

                          setCenters((prev) => {
                            const temp = [...prev];
                            return temp.map((centers, i) => {
                              if (i !== index) return centers;

                              return centers.includes(key)
                                ? centers.filter((num) => num !== key)
                                : centers.concat(key).sort();
                            });
                          });
                        } else {
                          setNumber(index, key);
                          setCorners((prev) => {
                            const temp = [...prev];
                            return temp.map((corners, i) =>
                              i !== index ? corners : []
                            );
                          });
                          setCenters((prev) => {
                            const temp = [...prev];
                            return temp.map((centers, i) =>
                              i !== index ? centers : []
                            );
                          });
                        }
                      } else if (e.key === "Backspace") {
                        setNumber(index, null);
                      } else if (e.key === "Delete") {
                        setNumber(index, null);
                        setCorners((prev) => {
                          const temp = [...prev];
                          return temp.map((corners, i) =>
                            i !== index ? corners : []
                          );
                        });
                        setCenters((prev) => {
                          const temp = [...prev];
                          return temp.map((centers, i) =>
                            i !== index ? centers : []
                          );
                        });
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
              <div key={num}>{num}</div>
            ))}
          </div>
        )}
      </Body>
      <Sidebar>
        <button
          onClick={() => {
            if (editing) {
              setEditing(false);
              setLockedCells((prev) => {
                const temp = [...prev];
                board.forEach((cell, index) => {
                  if (cell !== null) temp[index] = true;
                });
                return temp;
              });
            } else {
              setEditing(true);
              setLockedCells(Array(SIZE ** 2).fill(false));
            }
          }}
        >
          {editing ? "Save Board" : "Edit Board"}
        </button>
        <button onClick={resetBoard}>Reset</button>
        <button onClick={checkBoard}>Check</button>
        <button onClick={easy}>Easy puzzle</button>
        <button onClick={medium}>Medium puzzle</button>
        <button onClick={hard}>Hard puzzle</button>
      </Sidebar>
    </>
  );
};
