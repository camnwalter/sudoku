import React from "react";
import { useSudoku } from "../hooks/sudokuContext";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { MoveTypes } from "../utils/utils";
import { Board } from "./Board";
import { Body } from "./Body";
import { Buttons } from "./Buttons";
import { RemainingNumbers } from "./RemainingNumbers";
import { Timer } from "./Timer";

export const Game = () => {
  const { board, moveType, setNumber, setCorners, setCenters } = useSudoku();

  const { moves, setMoves } = useUndoRedo();

  const handleNumberPressed = (
    e: React.KeyboardEvent | React.MouseEvent,
    index: number,
    key: number,
    shift: boolean
  ) => {
    const { centers, corners, number } = board[index];
    if (
      moveType.current === MoveTypes.Corner ||
      (e.ctrlKey && number === null)
    ) {
      const value = corners.includes(key) ? -key : key;

      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Corner, index, value }, ...moves]
          : [{ type: MoveTypes.Corner, index, value }]
      );

      setCorners(
        index,
        corners.includes(key)
          ? corners.filter((num) => num !== key)
          : corners.concat(key).sort()
      );
    } else if (
      moveType.current === MoveTypes.Center ||
      (shift && number === null)
    ) {
      const value = centers.includes(key) ? -key : key;

      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Center, index, value }, ...moves]
          : [{ type: MoveTypes.Center, index, value }]
      );
      setCenters(
        index,
        centers.includes(key)
          ? centers.filter((num) => num !== key)
          : centers.concat(key).sort()
      );
    } else {
      setMoves(
        moves[0].type !== MoveTypes.Invalid
          ? (moves) => [{ type: MoveTypes.Number, index, value: key }, ...moves]
          : [{ type: MoveTypes.Number, index, value: key }]
      );
      setNumber(index, key);
      setCorners(index, []);
      setCenters(index, []);
    }
  };

  return (
    <Body
      center={
        <>
          <Timer />
          <Board onKeyDown={handleNumberPressed} />
          <RemainingNumbers onMouseDown={handleNumberPressed} />
        </>
      }
      right={<Buttons />}
    />
  );
};
