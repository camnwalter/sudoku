import { Board } from "./components/Board";
import "./App.css";
import React from "react";

export const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <Board />
      </React.StrictMode>
    </div>
  );
};
