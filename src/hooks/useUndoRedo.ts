import { useState } from "react";
import { MoveTypes } from "../utils/utils";
import { useSudoku } from "./sudokuContext";

interface Moves {
  type: MoveTypes;
  index: number;
  value: number;
}

const initialState = {
  type: MoveTypes.Invalid,
  index: -1,
  value: -1,
};

export const useUndoRedo = () => {
  const { board, setNumber, setCorners, setCenters } = useSudoku();

  const [undos, setUndos] = useState<Moves[]>([initialState]);
  const [moves, setMoves] = useState<Moves[]>([initialState]);

  const resetMoves = () => {
    setUndos([initialState]);
    setMoves([initialState]);
  };

  const undoMove = () => {
    const { type, index, value } = moves[0];

    if (moves.length === 1 && index === -1) {
      alert("Cannot undo! No moves to undo.");
      return;
    }
    switch (type) {
      case MoveTypes.Number: {
        if (moves.length == 1) {
          setNumber(index, null);
          setMoves([{ type: MoveTypes.Number, index: -1, value: -1 }]);
        } else {
          moves.slice(1).forEach((move) => {
            if (move.index === index) {
              setNumber(index, move.value);
              return;
            }
          });
          setNumber(index, null);
          setMoves(moves.slice(1));
        }
        break;
      }
      case MoveTypes.Corner: {
        const { corners } = board[index];
        setCorners(
          index,
          value > 0
            ? corners.filter((num) => num !== value)
            : corners.concat(-value).sort()
        );
        setMoves(
          moves.length > 1
            ? moves.slice(1)
            : [{ type: MoveTypes.Number, index: -1, value: -1 }]
        );
        break;
      }
      case MoveTypes.Center: {
        const { centers } = board[index];
        setCenters(
          index,
          value > 0
            ? centers.filter((num) => num !== value)
            : centers.concat(-value).sort()
        );
        setMoves(
          moves.length > 1
            ? moves.slice(1)
            : [{ type: MoveTypes.Number, index: -1, value: -1 }]
        );
        break;
      }
    }
    setUndos((undos) => [...undos, { type, index, value }]);
  };

  const redoMove = () => {
    const { type, index, value } = undos[undos.length - 1];

    if (undos.length === 1) {
      alert("Nothing to redo!");
      return;
    }
    switch (type) {
      case MoveTypes.Number: {
        setNumber(index, value);
        setMoves((moves) => [{ type, index, value }, ...moves]);
        break;
      }
      case MoveTypes.Corner: {
        const { corners } = board[index];
        setCorners(
          index,
          value < 0
            ? corners.filter((num) => num !== -value)
            : corners.concat(value).sort()
        );
        setMoves((moves) => [{ type, index, value }, ...moves]);
        break;
      }
      case MoveTypes.Center: {
        const { centers } = board[index];
        setCenters(
          index,
          value < 0
            ? centers.filter((num) => num !== -value)
            : centers.concat(-value).sort()
        );
        setMoves((moves) => [{ type, index, value: -value }, ...moves]);
        break;
      }
    }
    setUndos(undos.slice(0, -1));
  };

  return { resetMoves, undoMove, redoMove, setMoves, moves };
};
