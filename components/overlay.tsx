import { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Overlay: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted
    ? createPortal(
      children,
      document.getElementById("overlay")!
    )
    : null;
};

export default Overlay;