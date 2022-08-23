import Link from "next/link";

import styles from "../styles/Header.module.css";

const Header = () => (
  <nav className={styles.header}>
    <Link href="/">Home</Link>
    <Link href="/play">Play</Link>
    <Link href="/create">Create</Link>
  </nav>
);

export default Header;
