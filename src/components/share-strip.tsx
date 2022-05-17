import { Component } from "solid-js";
import hashid from "src/lib/hashid";
import styles from "src/styles/share-strip.module.css";

const ShareStrip: Component<{
  id?: number;
}> = (props) => {

  const shareEditable = async () => { 
    await navigator.clipboard.writeText(window.location.href);
  };

  const shareViewOnly = async () => {
    if (!props.id) { return; }
    const encoded = hashid.encode(props.id);
    await navigator.clipboard.writeText(`${window.location.origin}/view/${encoded}`);
  };

  return <div class={styles.container}>
    <div class={styles.strip}>
      <button class={styles.button} onClick={shareEditable}>Share</button>
      <button disabled={!props.id} class={styles.button} onClick={shareViewOnly}>Share (View Only)</button>
    </div>
  </div>;
};
export default ShareStrip;