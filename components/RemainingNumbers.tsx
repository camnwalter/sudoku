import { useSudoku } from "../hooks/sudokuContext";
import { SIZE } from "../utils/utils";
import styles from "../styles/RemainingNumbers.module.css";

interface RemainingNumbersProps {
  onPointerDown: (e: React.PointerEvent, key: number, shift: boolean) => void;
}

// TODO: Make this prettier
const RemainingNumbers = ({ onPointerDown }: RemainingNumbersProps) => {
  const { board, selected, setSelected, isLocked } = useSudoku();

  const remainingNumbers = () => {
    const counts = Array<number>(SIZE).fill(9);
    board.forEach(({ number }) => {
      if (number === null) return;
      counts[number - 1]--;
    });

    return counts.reduce<number[]>(
      (a, b, index) => (b > 0 ? [...a, index + 1] : a),
      []
    );
  };

  return (
    <>
      {remainingNumbers().length > 0 && (
        <div className={styles.remaining}>
          {remainingNumbers().map((num) => (
            <div
              className={styles.number}
              key={num}
              onPointerDown={(e) => {
                e.preventDefault();

                if (selected.length === 0 || selected.every(isLocked)) {
                  setSelected(() => {
                    const index = board.findIndex(
                      ({ number }) => number === num
                    );

                    if (index === -1) return [];

                    const element = document.getElementById(index.toString());
                    element?.focus();

                    return [index];
                  });

                  return;
                }

                onPointerDown(e, num, e.shiftKey);
              }}
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RemainingNumbers;
