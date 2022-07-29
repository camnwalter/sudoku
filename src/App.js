import { useState } from "react";
import { Cell } from "./components/Cell";
import "./App.css";

const BOARD = Array(9)
  .fill(null)
  .map(() => Array(9).fill(null));

export const App = () => {
  const [selected, setSelected] = useState(-1);

  const isAdjacent = (id) => {
    return (
      id % 9 === selected % 9 || Math.floor(id / 9) === Math.floor(selected / 9)
    );
  };

  const inSame3x3 = (id) => {
    const x = Math.floor(id / 9);
    const y = Math.floor(id % 9);

    const selectedX = Math.floor(selected / 9);
    const selectedY = Math.floor(selected % 9);
    return (
      Math.floor(x / 3) === Math.floor(selectedX / 3) &&
      Math.floor(y / 3) === Math.floor(selectedY / 3)
    );
  };

  const moveByArrowKey = (e) => {
    e.preventDefault();

    switch (e.key) {
      case "ArrowLeft":
        if (Math.floor(selected / 9) > 0) setSelected(selected - 9);
        else setSelected(selected + 72); //movement wraps around
        break;
      case "ArrowRight":
        if (Math.floor(selected / 9) < 8) setSelected(selected + 9);
        else setSelected(selected - 72);
        break;
      case "ArrowUp":
        if (selected % 9 > 0) setSelected(selected - 1);
        else setSelected(selected + 8);
        break;
      case "ArrowDown":
        if (selected % 9 < 8) setSelected(selected + 1);
        else setSelected(selected - 8);
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className="board">
        {BOARD.map((column, col) => (
          <div id="col">
            {column.map((cell, row) => {
              const id = col * 9 + row;
              return (
                <Cell
                  id={id}
                  selected={id === selected}
                  adjacent={isAdjacent(id) || inSame3x3(id)}
                  onClick={(e) => {
                    setSelected(id);
                  }}
                  onKeyDown={moveByArrowKey}
                ></Cell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
