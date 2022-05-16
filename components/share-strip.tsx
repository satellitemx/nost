import { FC } from "react";
import styles from "styles/share-strip.module.css";

const ShareStrip: FC<{
  noteId: string;
}> = ({ noteId }) => {

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const getViewOnlyLink = async () => {
    const { protocol, host } = window.location;
    const res = await fetch(`/api/share/${noteId}`);
    const { share } = await res.json();
    return `${protocol}//${host}/view/${share}`;
  };

  const shareViewOnly = async () => {
    // nice one Safari
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": getViewOnlyLink()
      })
    ]);
  };

  const announce = () => {
    alert("Link has been copied to clipboard.");
  };

  return <div className={styles.strip}>
    <span className={styles.button} onClick={share}>Share</span>
    <span className={styles.button} onClick={shareViewOnly}>Share View Only</span>
  </div>;
};
export default ShareStrip;
