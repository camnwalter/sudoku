import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { isShiftDown, locationToIndex, SIZE } from "../utils/utils";
import { Cell } from "./Cell";
import { OverlayText } from "./OverlayText";
import { Row } from "./Row";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface BoardProps {
  onKeyDown: (
    e: React.KeyboardEvent,
    index: number,
    key: number,
    shift: boolean
  ) => void;
}

export const Board = ({ onKeyDown }: BoardProps) => {
  const {
    board,
    selected,
    setSelected,
    isSelected,
    isSameNumber,
    isAdjacent,
    inSame3x3,
    isLocked,
    setNumber,
    setCorners,
    setCenters,
  } = useSudoku();

  const { undoMove, redoMove } = useUndoRedo();

  const handleArrowMovements = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const index = selected % SIZE;

    switch (e.code) {
      case "ArrowLeft":
        if (selected % SIZE > 0) {
          setSelected((prev) => prev - 1);
          (e.target.previousSibling as HTMLDivElement)?.focus();
        }
        break;
      case "ArrowRight":
        if (selected % SIZE < 8) {
          setSelected((prev) => prev + 1);
          (e.target.nextSibling as HTMLDivElement)?.focus();
        }
        break;
      case "ArrowUp":
        if (Math.floor(selected / SIZE) > 0) {
          setSelected((prev) => prev - SIZE);
          (
            e.target.parentElement?.previousSibling?.childNodes[
              index
            ] as HTMLDivElement
          )?.focus();
        }
        break;
      case "ArrowDown":
        if (Math.floor(selected / SIZE) < 8) {
          setSelected((prev) => prev + SIZE);
          (
            e.target.parentElement?.nextSibling?.childNodes[
              index
            ] as HTMLDivElement
          )?.focus();
        }
        break;
      default:
        break;
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
                selected={isSelected(index) || isSameNumber(index)}
                adjacent={isAdjacent(index) || inSame3x3(row, col)}
                locked={isLocked(index)}
                onClick={() => setSelected(index)}
                onKeyDown={(e) => {
                  e.preventDefault();
                  handleArrowMovements(e);

                  if (isLocked(index)) return;

                  const key = parseInt(e.code.slice(-1));

                  if (key >= 1 && key <= 9) {
                    onKeyDown(e, index, key, isShiftDown(e));
                  } else if (e.key === "Backspace" || e.key === "Delete") {
                    setNumber(index, null);
                    setCorners(index, []);
                    setCenters(index, []);
                  } else if (e.ctrlKey) {
                    if (e.code === "KeyZ") undoMove();
                    if (e.code === "KeyY") redoMove();
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
        </Row>
      ))}
    </div>
  );
};
