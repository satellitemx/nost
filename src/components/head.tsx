import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";

const Head: Component<{
  children: JSX.Element;
}> = ({ children }) => {
  return <Portal mount={document.head}>
    {children}
  </Portal>;
};
export default Head;