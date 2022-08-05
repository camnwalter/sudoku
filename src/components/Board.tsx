import { useState } from "react";
import { useOutsideDetector } from "../hooks/useOutsideDetector";
import { useSudoku } from "../hooks/useSudoku";
import type { BoardNumber } from "../utils/types";
import { locationToIndex, SIZE } from "../utils/utils";
import { Cell } from "./Cell";
import { OverlayText } from "./OverlayText";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface Props {
  board: BoardNumber[];
  setBoard: (value: React.SetStateAction<BoardNumber[]>) => void;
  corners: number[][];
  setCorners: (value: React.SetStateAction<number[][]>) => void;
  centers: number[][];
  setCenters: (value: React.SetStateAction<number[][]>) => void;
  lockedCells: number[];
}

export const Board = ({
  board,
  setBoard,
  lockedCells,
  corners,
  setCorners,
  centers,
  setCenters,
}: Props) => {
  const [selected, setSelected] = useState(-1);

  const { isAdjacent, isLocked, isSameNumber, inSame3x3, isSelected } =
    useSudoku(board, lockedCells, selected);

  const ref = useOutsideDetector(() => setSelected(-1));

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

  return (
    <>
      <table className="board" ref={ref}>
        <tbody>
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
                      if (isLocked(index)) return;

                      const key = parseInt(e.code.substring(5));
                      if (key >= 1 && key <= 9) {
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
                            prev.map((corners, i) =>
                              i !== index ? corners : []
                            )
                          );
                          setCenters((prev) =>
                            prev.map((centers, i) =>
                              i !== index ? centers : []
                            )
                          );
                        }
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
        </tbody>
      </table>
      {remainingNumbers().length > 0 && (
        <div className="remaining">
          {remainingNumbers().map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
      )}
    </>
  );
};
