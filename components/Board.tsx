const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

import { useEffect } from "react";
import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/undoRedoContext";
import useOutsideDetector from "../hooks/useOutsideDetector";
import styles from "../styles/Board.module.css";
import { CellData } from "../utils/types";
import {
  deepClone,
  Environment,
  isShiftDown,
  locationToIndex,
  MoveTypes,
  SIZE,
} from "../utils/utils";
import Cell from "./Cell";
import OverlayText from "./OverlayText";
import RemainingNumbers from "./RemainingNumbers";
import Row from "./Row";

interface BoardProps {
  initial?: CellData[];
  environment: Environment;
}

const Board = ({ initial, environment }: BoardProps) => {
  const {
    board,
    setBoard,
    selected,
    setSelected,
    mouseDown,
    moveType,
    setInitialBoard,

    isSelected,
    isSameNumber,
    isAdjacent,
    inSame3x3,
    isLocked,
    setNumber,
    setCorners,
    setCenters,
  } = useSudoku();
  const { undo, redo, setMoves } = useUndoRedo();

  const ref = useOutsideDetector(() => setSelected([]));

  useEffect(() => {
    if (initial !== undefined) {
      setBoard(initial);
      setInitialBoard(initial);
    }
  }, [initial, setBoard, setInitialBoard]);

  const handleNumberPressed = (
    e: React.KeyboardEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>,
    key: number,
    shift: boolean
  ) => {
    const tempBoard = deepClone(board) as CellData[];

    selected.forEach((index) => {
      const { centers, corners, number } = tempBoard[index];

      if (
        environment === Environment.Create ||
        moveType.current === MoveTypes.Number
      ) {
        tempBoard[index].number = key;
        tempBoard[index].corners = [];
        tempBoard[index].centers = [];
      } else if (
        number === null &&
        (e.ctrlKey || moveType.current === MoveTypes.Corner)
      ) {
        tempBoard[index].corners = corners.includes(key)
          ? corners.filter((num) => num !== key)
          : corners.concat(key).sort();
      } else if (
        number === null &&
        (shift || moveType.current === MoveTypes.Center)
      ) {
        tempBoard[index].centers = centers.includes(key)
          ? centers.filter((num) => num !== key)
          : centers.concat(key).sort();
      }
    });

    setMoves(tempBoard);
    setBoard(tempBoard);
  };

  const handleArrowMovements = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as Element;

    selected.forEach((actualSelected, index) => {
      const boardIndex = actualSelected % SIZE;

      switch (e.code) {
        case "ArrowLeft":
          if (actualSelected % SIZE > 0) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell - 1 : cell))
            );
            (target.previousSibling as HTMLDivElement)?.focus();
          }
          break;
        case "ArrowRight":
          if (actualSelected % SIZE < 8) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell + 1 : cell))
            );
            (target.nextSibling as HTMLDivElement)?.focus();
          }
          break;
        case "ArrowUp":
          if (Math.floor(actualSelected / SIZE) > 0) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell - SIZE : cell))
            );
            (
              target.parentElement?.previousSibling?.childNodes[
                boardIndex
              ] as HTMLDivElement
            )?.focus();
          }
          break;
        case "ArrowDown":
          if (Math.floor(actualSelected / SIZE) < 8) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell + SIZE : cell))
            );
            (
              target.parentElement?.nextSibling?.childNodes[
                boardIndex
              ] as HTMLDivElement
            )?.focus();
          }
          break;
        default:
          break;
      }
    });
  };

  const handleCellClicked = (
    e: React.PointerEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.ctrlKey) {
      setSelected((prev) => [...new Set(prev.concat(index))]);
    } else {
      setSelected(() => [index]);
    }
  };

  return (
    <div className={styles.board} ref={ref}>
      <div className={styles.game}>
        {rows.map((row) => (
          <Row key={row}>
            {rows.map((col) => {
              const index = locationToIndex(row, col);
              return (
                <Cell
                  key={index}
                  index={index}
                  selected={isSelected(index)}
                  adjacent={isAdjacent(index) || inSame3x3(row, col)}
                  sameNumber={isSameNumber(index)}
                  locked={isLocked(index)}
                  onPointerDown={(e) => {
                    handleCellClicked(e, index);
                    (e.target as Element).releasePointerCapture(e.pointerId);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    handleArrowMovements(e);

                    if (isLocked(index)) return;

                    const key = parseInt(e.code.slice(-1));

                    if (key >= 1 && key <= 9) {
                      handleNumberPressed(e, key, isShiftDown(e));
                    } else if (e.key === "Backspace" || e.key === "Delete") {
                      selected.forEach((i) => {
                        setNumber(i, null);
                        setCorners(i, []);
                        setCenters(i, []);
                      });
                    } else if (e.ctrlKey) {
                      if (e.code === "KeyZ") undo();
                      if (e.code === "KeyY") redo();
                    }
                  }}
                  onPointerEnter={() =>
                    mouseDown &&
                    setSelected((prev) => [...new Set(prev.concat(index))])
                  }
                >
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
          </Row>
        ))}
      </div>
      <RemainingNumbers onPointerDown={handleNumberPressed} />
    </div>
  );
};

export default Board;
