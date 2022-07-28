import { useState } from "react";

export const Cell = ({ selected, adjacent, onClick }) => {
  const [number, setNumber] = useState(-1);

  const isValidNumber = (number) => number >= 1 && number <= 9;

  return (
    <div
      className="cell"
      id={selected ? "selected" : adjacent ? "adjacent" : ""}
      onClick={onClick}
    ></div>
  );
};
