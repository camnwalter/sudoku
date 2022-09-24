import { NextRouter } from "next/router";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useSudoku } from "../../hooks/sudokuContext";
import { CellData } from "../../utils/types";
import { createBoard, deepClone } from "../../utils/utils";
import Row from "../Row";

interface BasicButtonsProps {
  reset: (clearBoard: boolean) => () => void;
  router: NextRouter;
}

const BasicButtons = ({ reset, router }: BasicButtonsProps) => {
  const { board } = useSudoku();

  const generateBoard = (difficulty: Difficulty) => () => {
    reset(true)();

    const { puzzle } = getSudoku(difficulty);

    const copy = deepClone(board) as CellData[];

    [...puzzle].forEach((char, i) => {
      if (char === "-") return;

      copy[i].number = parseInt(char);
      copy[i].locked = true;
    });

    createBoard(copy, router);
  };

  return (
    <Row>
      <button onClick={generateBoard("easy")}>Easy</button>
      <button onClick={generateBoard("medium")}>Medium</button>
      <button onClick={generateBoard("hard")}>Hard</button>
      <button onClick={generateBoard("expert")}>Expert</button>
    </Row>
  );
};

export default BasicButtons;
