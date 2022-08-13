import { useSudoku } from "../hooks/sudokuContext";
import { SIZE } from "../utils/utils";

interface RemainingNumbersProps {
  onMouseDown: (
    e: React.MouseEvent,
    index: number,
    key: number,
    shift: boolean
  ) => void;
}

export const RemainingNumbers = ({ onMouseDown }: RemainingNumbersProps) => {
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
    <div className="remaining">
      {remainingNumbers().map((num) => (
        <div
          key={num}
          onMouseDown={(e) => {
            e.preventDefault();

            if (selected === -1 || isLocked(selected)) {
              setSelected(() => {
                const index = board.findIndex(({ number }) => number === num);

                const element = document.getElementById(index.toString());
                element?.focus();

                return index;
              });

              return;
            }

            onMouseDown(e, selected, num, e.shiftKey);
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
};
