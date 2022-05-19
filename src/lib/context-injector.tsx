import { Component, JSX } from "solid-js";
import { ToastContextProvider } from "src/lib/use-toast";

const ContextInjector: Component<{
  children: JSX.Element;
}> = (props) => {
  return <ToastContextProvider>
    {props.children}
  </ToastContextProvider>;
};
export default ContextInjector;