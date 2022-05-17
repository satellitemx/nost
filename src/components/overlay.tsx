import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";

const Overlay: Component<{
  children: JSX.Element;
}> = (props) => {

  return <Portal mount={document.body}>
    {props.children}
  </Portal>;
};
export default Overlay;