import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Modal,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSudoku } from "../../hooks/sudokuContext";
import { useTime } from "../../hooks/timeContext";
import { useUndoRedo } from "../../hooks/undoRedoContext";
import { locationToIndex, MoveTypes, SIZE } from "../../utils/utils";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface PlayButtonsProps {
  reset: (clearBoard: boolean) => () => void;
}

const PlayButtons = ({ reset }: PlayButtonsProps) => {
  const {
    board,
    selected,
    setNumber,
    setCorners,
    setCenters,
    won,
    setWon,
    moveType,
    setMoveType,
  } = useSudoku();
  const { undo, redo } = useUndoRedo();
  const { formatTime } = useTime();
  const router = useRouter();
  const [shareTextOpen, setShareTextOpen] = useState(false);
  const [winTextOpen, setWinTextOpen] = useState(false);

  const checkBoard = () => {
    const isUnique = (arr: number[]) =>
      arr.every((item, index) => arr.indexOf(item) === index);

    let solved = true;
    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        const { number } = board[locationToIndex(i, j)];
        if (number === null) {
          solved = false;
          break;
        }
        row.push(number);
      }
      if (!isUnique(row)) {
        solved = false;
        break;
      }

      row.length = 0;
      for (let j = 0; j < SIZE; j++) {
        const { number } = board[locationToIndex(j, i)];
        if (number === null) {
          solved = false;
          break;
        }
        row.push(number);
      }
      if (!isUnique(row)) {
        solved = false;
        break;
      }
    }

    if (solved) {
      setWon(true);
      setWinTextOpen(true);
    }
  };

  useEffect(() => {
    if (!won) {
      checkBoard();
    }
  });

  const copyRouteToClipboard = () => {
    setShareTextOpen(true);
    navigator.clipboard.writeText(
      `I solved this Sudoku in ${formatTime()}. Played at https://sudoku.squagward.com${
        router.asPath
      }`
    );
  };

  const onTextClose =
    (callback: () => void) =>
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      callback();
    };

  return won ? (
    <>
      <Modal
        open={winTextOpen}
        onClose={() => setWinTextOpen(false)}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Congratulations, you won!
          </Typography>
        </Box>
      </Modal>

      <Button variant="contained" onClick={copyRouteToClipboard}>
        Share
      </Button>
      <Snackbar
        open={shareTextOpen}
        autoHideDuration={4000}
        onClose={onTextClose(() => setShareTextOpen(false))}
      >
        <Alert
          onClose={onTextClose(() => setShareTextOpen(false))}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied text to clipboard
        </Alert>
      </Snackbar>
    </>
  ) : (
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
        <Button variant="contained" onPointerDown={undo}>
          Undo
        </Button>
        <Button variant="contained" onPointerDown={redo}>
          Redo
        </Button>
      </ButtonGroup>
      <ButtonGroup sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          onPointerDown={(e) => {
            e.preventDefault();

            setMoveType(() => ({
              previous: MoveTypes.Number,
              current: MoveTypes.Number,
            }));
          }}
          disabled={moveType.current === MoveTypes.Number}
        >
          Normal
        </Button>
        <Button
          variant="contained"
          onPointerDown={(e) => {
            e.preventDefault();

            setMoveType(() => ({
              previous: MoveTypes.Corner,
              current: MoveTypes.Corner,
            }));
          }}
          disabled={moveType.current === MoveTypes.Corner}
        >
          Corner
        </Button>
        <Button
          variant="contained"
          onPointerDown={(e) => {
            e.preventDefault();

            setMoveType(() => ({
              previous: MoveTypes.Center,
              current: MoveTypes.Center,
            }));
          }}
          disabled={moveType.current === MoveTypes.Center}
        >
          Center
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default PlayButtons;
