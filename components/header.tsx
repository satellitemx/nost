import { FC, ReactNode } from "react";
import styles from "styles/header.module.css";

const Header: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return <div className={styles.header}>
    {children}
  </div>;
};
export default Header;