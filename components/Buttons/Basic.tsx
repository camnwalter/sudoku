import { Button, ButtonGroup } from "@mui/material";
import { NextRouter } from "next/router";
import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { useSudoku } from "../../hooks/sudokuContext";
import { CellData } from "../../utils/types";
import { createBoard, deepClone } from "../../utils/utils";

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

    createBoard(copy, difficulty, router);
  };

  return (
    <ButtonGroup>
      <Button variant="contained" onClick={generateBoard("easy")}>
        Easy
      </Button>
      <Button variant="contained" onClick={generateBoard("medium")}>
        Medium
      </Button>
      <Button variant="contained" onClick={generateBoard("hard")}>
        Hard
      </Button>
      <Button variant="contained" onClick={generateBoard("expert")}>
        Expert
      </Button>
    </ButtonGroup>
  );
};

export default BasicButtons;
