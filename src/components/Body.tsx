import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  _ref: React.LegacyRef<HTMLTableElement>;
}

export const Body = ({ children, _ref }: Props) => {
  return (
    <div className="mainArea" ref={_ref}>
      {children}
    </div>
  );
};
