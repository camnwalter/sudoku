import { useState } from "react";
import "./App.css";
import { Board } from "./components/Board";

const BOARD = Array(9)
  .fill(null)
  .map((arr) => Array(9).fill(null));

function App() {
  return (
    <div className="App">
      <Board elements={BOARD}></Board>
    </div>
  );
}

export default App;
