import React from "react";
import "./App.css";
import { Game } from "./components/Game";
import { SudokuProvider } from "./hooks/sudokuContext";
import { TimeProvider } from "./hooks/timerContext";

export const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <SudokuProvider>
          <TimeProvider>
            <Game />
          </TimeProvider>
        </SudokuProvider>
      </React.StrictMode>
    </div>
  );
};
