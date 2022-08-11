import { ReactNode } from "react";

interface Props {
  center: ReactNode;
  right: ReactNode;
  outsideClickHandler: React.LegacyRef<HTMLTableElement>;
}

export const Body = ({ outsideClickHandler, center, right }: Props) => {
  return (
    <div className="mainArea">
      <div className="column" />
      <div className="largeColumn" ref={outsideClickHandler}>
        {center}
      </div>
      <div className="column">{right}</div>
    </div>
  );
};
