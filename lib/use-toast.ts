import Toast from "components/toast";
import { ReactNode, useEffect, useState } from "react";

const useToast = () => {
  const [content, setContent] = useState<ReactNode>(null);
  const element = Toast({ children: content });

  useEffect(() => {
    if (content) {
      const timeout = setTimeout(() => {
        setContent(null);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content]);

  return {
    element,
    toast: setContent
  };
};
export default useToast;