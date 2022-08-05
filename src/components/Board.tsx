import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  _ref: React.LegacyRef<HTMLTableElement>;
}

export const Board = ({ children, _ref }: Props) => {
  return (
    <table className="board" ref={_ref}>
      <tbody>{children}</tbody>
    </table>
  );
};
