import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { isShiftDown, locationToIndex, SIZE } from "../utils/utils";
import { Cell } from "./Cell";
import { OverlayText } from "./OverlayText";
import { Row } from "./Row";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface BoardProps {
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    key: number,
    shift: boolean
  ) => void;
}

export const Board = ({ onKeyDown }: BoardProps) => {
  const {
    board,
    selected,
    setSelected,
    mouseDown,

    isSelected,
    isSameNumber,
    isAdjacent,
    inSame3x3,
    isLocked,
    setNumber,
    setCorners,
    setCenters,
  } = useSudoku();

  const { undo, redo } = useUndoRedo();

  const handleArrowMovements = (e: React.KeyboardEvent<HTMLDivElement>) => {
    selected.forEach((actualSelected, index) => {
      const boardIndex = actualSelected % SIZE;

      switch (e.code) {
        case "ArrowLeft":
          if (actualSelected % SIZE > 0) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell - 1 : cell))
            );
            (e.target.previousSibling as HTMLDivElement)?.focus();
          }
          break;
        case "ArrowRight":
          if (actualSelected % SIZE < 8) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell + 1 : cell))
            );
            (e.target.nextSibling as HTMLDivElement)?.focus();
          }
          break;
        case "ArrowUp":
          if (Math.floor(actualSelected / SIZE) > 0) {
            setSelected((prev) =>
              prev.map((cell, i) => (i === index ? cell - SIZE : cell))
            );
            (
              e.target.parentElement?.previousSibling?.childNodes[
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
              e.target.parentElement?.nextSibling?.childNodes[
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
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.ctrlKey) {
      setSelected((prev) => [...new Set(prev.concat(index))]);
    } else {
      setSelected(() => [index]);
    }
  };

  return (
    <div className="board">
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
                onMouseDown={(e) => handleCellClicked(e, index)}
                onKeyDown={(e) => {
                  e.preventDefault();
                  handleArrowMovements(e);

                  if (isLocked(index)) return;

                  const key = parseInt(e.code.slice(-1));

                  if (key >= 1 && key <= 9) {
                    onKeyDown(e, key, isShiftDown(e));
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
                onMouseOver={() =>
                  mouseDown &&
                  setSelected((prev) => [...new Set(prev.concat(index))])
                }
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
        </Row>
      ))}
    </div>
  );
};
