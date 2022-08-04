import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Sidebar = ({ children }: Props) => {
  return (
    <div className="sidebarWrapper">
      <div className="sidebar">{children}</div>
    </div>
  );
};
