import { useState } from "react";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { useSudoku } from "../hooks/useSudoku";
import { useTimer } from "../hooks/useTimer";
import { Header } from "./Header";
import { OverlayText } from "./OverlayText";
import { Timer } from "./Timer";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Game = () => {
  const SIZE = 9;
  const SQRT = Math.round(Math.sqrt(SIZE));
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

  const shuffle = (array: number[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const randomNum = (num: number) => {
    return Math.floor(Math.random() * num + 1);
  };

  const easy = () => {
    generateNewBoard(36);

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
    generateNewBoard(45);

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
    generateNewBoard(54);

    setEditing(false);
    setLockedCells((prev) => {
      const temp = [...prev];
      board.forEach((cell, index) => {
        if (cell !== null) temp[index] = true;
      });
      return temp;
    });
  };

  const generateNewBoard = (numsToRemove: number) => {
    // setBoard(Array(81).fill(null));

    fillTheDiagonals();
    fillRest(0, 3);
    removeSomeNumbers(numsToRemove);
  };

  const fillTheDiagonals = () => {
    fillDiagonal();

    for (let i = 0; i < SIZE; i += 4) {
      fillBox(i);
    }
  };

  const fillDiagonal = () => {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let a = 0; a < SIZE; a++) {
      let randomNumber = nums[a];
      setNumber(a * SIZE + a, randomNumber);
    }
  };

  const fillBox = (i: number) => {
    let boxNum = 0;
    for (let a = 0; a < 9; a++) {
      boxNum =
        Math.floor(a / 3) * 9 + Math.floor(i / 3) * 27 + (a % 3) + 3 * (i % 3);
      if (board[boxNum] !== null) continue;

      let num = null;
      while (!checkValidBox(i, num)) {
        num = randomNum(SIZE);
      }

      setNumber(boxNum, num);
    }
  };

  const checkValidRow = (row: number, val: number) => {
    const nums = new Set<number | null>();
    for (let i = 0; i < SIZE; i++) {
      let curr = row * SIZE + i;
      nums.add(board[curr]);
    }
    return !nums.has(val);
  };

  const checkValidCol = (col: number, val: number) => {
    const nums = new Set<number | null>();
    for (let i = 0; i < SIZE; i++) {
      let curr = i * SIZE + col;
      nums.add(board[curr]);
    }
    return !nums.has(val);
  };

  /*
    Boxes:
    0 1 2
    3 4 5
    6 7 8
  */
  const checkValidBox = (box: number, val: number | null) => {
    if (val == null) return false;

    const nums = new Set<number | null>();
    const start = 27 * Math.floor(box / 3) + 3 * (box % 3);
    for (let i = 0; i < 9; i++) {
      let curr = start + (i % 3) + 9 * Math.floor(i / 3);
      nums.add(board[curr]);
    }

    return !nums.has(val);
  };

  //use dfs to check for possible solutions
  const fillRest = (row: number, col: number) => {
    //the board is now filled
    if (row >= SIZE && col >= SIZE) {
      return true;
    }

    //you have reached the end of the row, go down
    if (col >= SIZE && row < SIZE - 1) {
      row++;
      col = 0;
    }

    //box 0
    if (row < SQRT && col < SQRT) col = SQRT;
    //box 4
    if (row >= SQRT && row < 2 * SQRT && col >= SQRT && col < 2 * SQRT) {
      col = 2 * SQRT;
    }
    //box 8
    if (row >= 2 * SQRT && col >= 2 * SQRT) {
      row++;
      col = 0;
      if (row >= SIZE) return true;
    }

    const index = row * SIZE + col;

    const box = SQRT * Math.floor(row / SQRT) + Math.floor(col / SQRT);

    for (let i = 1; i <= SIZE; i++) {
      if (
        checkValidRow(row, i) &&
        checkValidCol(col, i) &&
        checkValidBox(box, i)
      ) {
        setNumber(index, i);
        if (fillRest(row, col + 1)) return true; //this last state was fine! use this state again
        setNumber(index, null); //if it did not work, return to previous state
      }
    }

    return false;
  };

  const removeSomeNumbers = (numToRemove: number) => {
    while (numToRemove-- > 0) {
      let row = randomNum(SIZE);
      let col = randomNum(SIZE);
      if (board[row * SIZE + col] !== null) {
        setNumber(row * SIZE + col, null);
      } else numToRemove++;
    }
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
        row.push(board[i * SIZE + j]);
      }

      if (!isUnique(row)) {
        solved = false;
        break;
      }

      row.length = 0;
      for (let j = 0; j < SIZE; j++) {
        if (board[i * SIZE + j] === null) {
          solved = false;
          break;
        }
        row.push(board[i + SIZE * j]);
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
      <div className="wrapper">
        <div className="mainArea">
          <table className="board" ref={ref}>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  {rows.map((col) => {
                    const index = row * SIZE + col;
                    return (
                      <td
                        key={col}
                        className={
                          (isSelected(index) || isSameNumber(index)
                            ? "selected "
                            : isAdjacent(index) || inSame3x3(row, col)
                            ? "adjacent "
                            : " ") + (isLocked(index) ? "locked" : "")
                        }
                        tabIndex={-1}
                        onClick={() => setSelected(index)}
                        onKeyDown={(e) => {
                          e.preventDefault();
                          handleArrowMovements(e);
                          if (isLocked(index) && !editing) return;

                          const key = parseInt(e.code.substring(5));
                          if (key >= 1 && key <= 9) {
                            if (e.ctrlKey) {
                              setCorners((prev) => {
                                const temp = [...prev];
                                return temp.map((corners, i) => {
                                  if (i !== index) return corners;

                                  if (corners.includes(key)) {
                                    return corners.filter((num) => num !== key);
                                  }
                                  return corners.concat(key).sort();
                                });
                              });
                            } else if (e.shiftKey) {
                              setCenters((prev) => {
                                const temp = [...prev];
                                return temp.map((centers, i) => {
                                  if (i !== index) return centers;

                                  if (centers.includes(key)) {
                                    return centers.filter((num) => num !== key);
                                  }
                                  return centers.concat(key).sort();
                                });
                              });
                            } else {
                              setNumber(index, key);
                              setCorners((prev) => {
                                const temp = [...prev];
                                return temp.map((corners, i) => {
                                  if (i !== index) return corners;
                                  return [];
                                });
                              });
                              setCenters((prev) => {
                                const temp = [...prev];
                                return temp.map((centers, i) => {
                                  if (i !== index) return centers;
                                  return [];
                                });
                              });
                            }
                          } else if (e.key === "Backspace") {
                            setNumber(index, null);
                          } else if (e.key === "Delete") {
                            setNumber(index, null);
                            setCorners((prev) => {
                              const temp = [...prev];
                              return temp.map((corners, i) => {
                                if (i !== index) return corners;
                                return [];
                              });
                            });
                            setCenters((prev) => {
                              const temp = [...prev];
                              return temp.map((centers, i) => {
                                if (i !== index) return centers;
                                return [];
                              });
                            });
                          }
                        }}
                      >
                        {board[index]}
                        <OverlayText
                          text={corners[index].join(" ")}
                          type="corner"
                        />
                        <OverlayText
                          text={centers[index].join("")}
                          type="center"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {remainingNumbers().length > 0 && (
            <div className="remaining">
              {remainingNumbers().map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
          )}
          <div className="sidebarWrapper">
            <div className="sidebar">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
