import {
  AppBar,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSudoku } from "../hooks/sudokuContext";
import { useTime } from "../hooks/timeContext";
import { useUndoRedo } from "../hooks/undoRedoContext";
import { MoveTypes } from "../utils/utils";

const Header = () => {
  const { emptyBoard, setBoard, setSelected, setWon, setMoveType } =
    useSudoku();
  const { resetMoves } = useUndoRedo();
  const { setTime } = useTime();

  const reset = () => {
    setBoard(emptyBoard);
    resetMoves();
    setSelected([]);
    setTime(0);
    setWon(false);
    setMoveType({ current: MoveTypes.Number, previous: MoveTypes.Number });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuItem>
          <Link href="/play">
            <Typography variant="h6" onClick={reset}>
              Play
            </Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/create">
            <Typography variant="h6" onClick={reset}>
              Create
            </Typography>
          </Link>
        </MenuItem>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
