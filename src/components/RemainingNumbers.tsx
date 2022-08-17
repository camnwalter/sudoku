import { useSudoku } from "../hooks/sudokuContext";
import { SIZE } from "../utils/utils";

interface RemainingNumbersProps {
  onMouseDown: (
    e: React.MouseEvent<HTMLDivElement>,
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

  return remainingNumbers().length > 0 ? (
    <div className="remaining">
      {remainingNumbers().map((num) => (
        <div
          key={num}
          onMouseDown={(e) => {
            e.preventDefault();

            if (selected.length === 0 || selected.some(isLocked)) {
              setSelected(() => {
                const index = board.findIndex(({ number }) => number === num);

                if (index === -1) return [];

                const element = document.getElementById(index.toString());
                element?.focus();

                return [index];
              });

              return;
            }

            onMouseDown(e, num, e.shiftKey);
          }}
        >
          {num}
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
};
