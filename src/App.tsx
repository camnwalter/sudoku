import React from "react";
import "./App.css";
import { Game } from "./components/Game";
import { SudokuProvider } from "./hooks/sudokuContext";
import { TimeProvider } from "./hooks/timerContext";
import { UndoRedoProvider } from "./hooks/useUndoRedo";

export const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <SudokuProvider>
          <TimeProvider>
            <UndoRedoProvider>
              <Game />
            </UndoRedoProvider>
          </TimeProvider>
        </SudokuProvider>
      </React.StrictMode>
    </div>
  );
};
