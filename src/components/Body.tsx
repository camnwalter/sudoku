import { ReactNode } from "react";
import { useSudoku } from "../hooks/sudokuContext";
import { useOutsideDetector } from "../hooks/useOutsideDetector";

interface Props {
  center: ReactNode;
  right: ReactNode;
}

export const Body = ({ center, right }: Props) => {
  const { setSelected } = useSudoku();

  const ref = useOutsideDetector(() => setSelected([]));

  return (
    <div className="mainArea">
      <div className="column" />
      <div className="largeColumn" ref={ref}>
        {center}
      </div>
      <div className="column">{right}</div>
    </div>
  );
};
