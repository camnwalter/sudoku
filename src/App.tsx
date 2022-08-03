import { Game } from "./components/Game";
import "./App.css";
import React from "react";

export const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <Game />
      </React.StrictMode>
    </div>
  );
};
