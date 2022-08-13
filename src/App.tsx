import React from "react";
import "./App.css";
import { Game } from "./components/Game";
import { SudokuProvider } from "./hooks/sudokuContext";

export const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <SudokuProvider>
          <Game />
        </SudokuProvider>
      </React.StrictMode>
    </div>
  );
};
