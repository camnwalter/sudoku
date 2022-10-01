import { Button, ButtonGroup, Stack } from "@mui/material";
import { NextRouter } from "next/router";
import { useSudoku } from "../../hooks/sudokuContext";
import { CellData } from "../../utils/types";
import { createBoard, deepClone } from "../../utils/utils";

interface CreateButtonsProps {
  reset: (clearBoard: boolean) => () => void;
  router: NextRouter;
}

const CreateButtons = ({ reset, router }: CreateButtonsProps) => {
  const { board, selected, setNumber, setCorners, setCenters } = useSudoku();

  return (
    <Stack spacing={1}>
      <ButtonGroup sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
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
        </Button>
        <Button variant="contained" onPointerDown={reset(false)}>
          Reset
        </Button>
      </ButtonGroup>
      <ButtonGroup sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          onPointerDown={() => {
            const copy = deepClone(board) as CellData[];
            createBoard(copy, "unknown", router);
          }}
        >
          Save Board
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default CreateButtons;
