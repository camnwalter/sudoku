import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Body = ({ children }: Props) => {
  return (
    <div className="wrapper">
      <div className="mainArea">{children}</div>
    </div>
  );
};
