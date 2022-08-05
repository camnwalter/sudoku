import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Buttons = ({ children }: Props) => {
  return <div className="buttons">{children}</div>;
};
