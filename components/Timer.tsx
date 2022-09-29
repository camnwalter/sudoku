import { useSudoku } from "../hooks/sudokuContext";
import { useTime } from "../hooks/timeContext";
import useInterval from "../hooks/useInterval";
import styles from "../styles/Timer.module.css";

export const Timer = () => {
  const { board, won } = useSudoku();
  const { setTime, formatTime } = useTime();

  useInterval(!won && !board.every((cell) => cell.number === null), () =>
    setTime((prev) => prev + 1000)
  );

  return <div className={styles.timer}>{formatTime()}</div>;
};
