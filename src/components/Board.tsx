import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Board = ({ children }: Props) => {
  return <div className="board">{children}</div>;
};
