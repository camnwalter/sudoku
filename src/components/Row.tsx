import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Row = ({ children }: Props) => {
  return <div className="row">{children}</div>;
};
