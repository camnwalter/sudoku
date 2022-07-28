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

  return (
    <div className="App">
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
              ></Cell>
            );
          })}
        </div>
      ))}
    </div>
  );
};
