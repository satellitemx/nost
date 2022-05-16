import Overlay from "components/overlay";
import { FC, ReactNode } from "react";
import styles from "styles/toast.module.css";

const Toast: FC<{
  children: ReactNode;
}> = ({ children }) => {
  if (!children) return null;
  return <Overlay>
    <div className={styles.container}>
      {children}
    </div>
  </Overlay>;
};
export default Toast;