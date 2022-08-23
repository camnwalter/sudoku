import styles from "../styles/Row.module.css";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

interface RowProps {
  children: ReactNode;
}

const Row = ({ children }: RowProps) => (
  <div className={styles.row}>{children}</div>
);

export default dynamic(() => Promise.resolve(Row), { ssr: false });
