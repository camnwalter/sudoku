import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Board = ({ children }: Props) => {
  return (
    <table className="board">
      <tbody>{children}</tbody>
    </table>
  );
};
