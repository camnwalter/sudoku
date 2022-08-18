import React from "react";
import "./App.css";
import { Game } from "./components/Game";
import { SudokuProvider } from "./hooks/sudokuContext";
import { TimeProvider } from "./hooks/timerContext";
import { UndoRedoProvider } from "./hooks/useUndoRedo";
import { Environment } from "./utils/utils";

interface AppProps {
  environment: Environment;
}

export const App = ({ environment }: AppProps) => {
  return (
    <div className="App">
      <React.StrictMode>
        <SudokuProvider>
          <TimeProvider>
            <UndoRedoProvider>
              <Game environment={environment} />
            </UndoRedoProvider>
          </TimeProvider>
        </SudokuProvider>
      </React.StrictMode>
    </div>
  );
};
