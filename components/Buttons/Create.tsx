import { NextRouter } from "next/router";
import { useSudoku } from "../../hooks/sudokuContext";
import { CellData } from "../../utils/types";
import { createBoard, deepClone } from "../../utils/utils";
import Row from "../Row";

interface CreateButtonsProps {
  reset: (clearBoard: boolean) => () => void;
  router: NextRouter;
}

const CreateButtons = ({ reset, router }: CreateButtonsProps) => {
  const { board, selected, setNumber, setCorners, setCenters } = useSudoku();

  return (
    <>
      <Row>
        <button
          onPointerDown={(e) => {
            e.preventDefault();

            selected.forEach((i) => {
              setNumber(i, null);
              setCorners(i, []);
              setCenters(i, []);
            });
          }}
        >
          Delete
        </button>
        <button onPointerDown={reset(false)}>Reset</button>
      </Row>
      <Row>
        <button
          onPointerDown={() => {
            const copy = deepClone(board) as CellData[];
            createBoard(copy, router);
          }}
        >
          {"Save Board"}
        </button>
      </Row>
    </>
  );
};

export default CreateButtons;
