import Link from "next/link";
import { useSudoku } from "../hooks/sudokuContext";
import { useTime } from "../hooks/timeContext";
import { useUndoRedo } from "../hooks/undoRedoContext";
import styles from "../styles/Header.module.css";
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
    <nav className={styles.header}>
      <Link href="/play">
        <div onClick={reset}>Play</div>
      </Link>
      <Link href="/create">
        <div onClick={reset}>Create</div>
      </Link>
    </nav>
  );
};

export default Header;
