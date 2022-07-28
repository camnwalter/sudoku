import { useState } from "react";
import { Cell } from "./Cell";

export const Board = ({ elements }) => {
  const [selectedCell, setSelectedCell] = useState({ x: -1, y: -1 });

  const isSelected = (x, y) => selectedCell.x === x && selectedCell.y === y;

  const isAdjacent = (x, y) => {
    return (
      (x === selectedCell.x && y !== selectedCell.y) ||
      (x !== selectedCell.x && y === selectedCell.y) ||
      isIn3x3(x, y)
    );
  };

  const isIn3x3 = (x, y) => {
    return (
      !isSelected(x, y) &&
      Math.floor(x / 3) === Math.floor(selectedCell.x / 3) &&
      Math.floor(y / 3) === Math.floor(selectedCell.y / 3)
    );
  };

  return elements.map((col, x) => {
    return (
      <div key={x}>
        {col.map((node, y) => {
          return (
            <Cell
              key={y}
              onClick={() => {
                if (!isSelected(x, y)) setSelectedCell({ x, y });
              }}
              selected={isSelected(x, y)}
              adjacent={isAdjacent(x, y)}
            ></Cell>
          );
        })}
      </div>
    );
  });
};
