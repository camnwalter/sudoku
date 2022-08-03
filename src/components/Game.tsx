import { useState, useEffect } from "react";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { Header } from "./Header";
import { OverlayText } from "./OverlayText";
import { Timer } from "./Timer";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Game = () => {
  const SIZE = 9;
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

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (!winner) {
      interval = setInterval(() => {
        setTime((time) => time + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [winner]);

  const isLocked = (index: number) => lockedCells[index];

  const isSelected = (index: number) => index === selected;

  const isAdjacent = (index: number) => {
    return (
      index % 9 === selected % 9 ||
      Math.floor(index / 9) === Math.floor(selected / 9)
    );
  };

  const inSame3x3 = (row: number, col: number) => {
    const selectedX = Math.floor(selected / 9);
    const selectedY = Math.floor(selected % 9);
    return (
      Math.floor(row / 3) === Math.floor(selectedX / 3) &&
      Math.floor(col / 3) === Math.floor(selectedY / 3)
    );
  };

  const isSameNumber = (index: number) =>
    board[index] !== null && board[index] === board[selected];

  const shuffle = (array:number[]) => {
    let newArray = [...array]
    for ( let i = newArray.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ newArray[ i ], newArray[ j ] ] = [ newArray[ j ], newArray[ i ] ];
    }
    return newArray;
  }

  const randomNum = (num: number) => {
    return Math.floor(Math.random() * num + 1);
  }

  const generateNewBoard = () => {
    fillTheDiagonals();
  }

  const fillTheDiagonals = () => {
    fillDiagonal();
    
    for(let i = 0; i < SIZE; i += 4){
      fillBox(i);
    }
  }
  const fillDiagonal = () => {
    let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for(let a = 0; a < SIZE; a++){
      let randomNumber = nums[a];
      board[a*SIZE + a] = randomNumber;
    }
  }
  const fillBox = (i:number) => {
    let boxNum = 0;
    for(let a = 0; a < 9; a++){
      boxNum = Math.floor(a/3) * 9 + Math.floor(i/3) * 27 + a%3 + (3 * (i%3));
      if(board[boxNum] !== null) continue; 
      let num = null;
      while(!checkValidBox(i, num)){
        num = randomNum(SIZE);
      }
      board[boxNum] = num;
    }
  }

  // const findNextEmptyCell = () => {
  //   const nextEmptyCell = board.indexOf(null);
  //   if (nextEmptyCell === -1) return null;
  //   const row = Math.floor(nextEmptyCell/SIZE);
  //   const col = nextEmptyCell%SIZE;
  //   const box = 3 * (Math.floor(row/3)) + Math.floor(col/3);
  //   return [row, col, box, nextEmptyCell];
  // }

  // const checkValidRow = (row: number, val: number) => {
  //   let nums = new Set<number|null>();
  //   for(let i = 0; i < SIZE; i++){
  //     let curr = row * SIZE + i;
  //     nums.add(board[curr]);
  //   }
  //   return (!nums.has(val));
  // }

  // const checkValidCol = (col: number, val: number) => {
  //   let nums = new Set<number|null>();
  //   for(let i = 0; i < SIZE; i++){
  //     let curr = i * SIZE + col;
  //     nums.add(board[curr]);
  //   }
  //   return (!nums.has(val));
  // }

  /* boxes: 
  0 1 2
  3 4 5
  6 7 8 */
  const checkValidBox = (box: number, val: number|null) => {
    if(val == null) return false;
    let nums = new Set<number|null>();
    const start = 27 * Math.floor(box/3) + 3 * (box%3);
    for(let i = 0; i < 9; i++){
      let curr = start + i%3 + 9 * Math.floor(i/3);
      nums.add(board[curr]);
    }
    return (!nums.has(val));
  }

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
                          if (lockedCells[index] && !editing) return;

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
                              setBoard((prev) => {
                                const temp = [...prev];
                                temp[index] = key;
                                return temp;
                              });
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
                            setBoard((prev) => {
                              const temp = [...prev];
                              temp[index] = null;
                              return temp;
                            });
                          } else if (e.key === "Delete") {
                            setBoard((prev) => {
                              const temp = [...prev];
                              temp[index] = null;
                              return temp;
                            });
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
              {remainingNumbers().map((row) => (
                <div key={row}>{row}</div>
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
              <button onClick={generateNewBoard}>Solve Diagonals</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
