import useToast from "lib/use-toast";
import { FC } from "react";
import styles from "styles/share-strip.module.css";

const ShareStrip: FC<{
  noteId: string;
}> = ({ noteId }) => {

  const { element, toast } = useToast();

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast("Link copied!");
  };

  const getViewOnlyLink = async () => {
    const { protocol, host } = window.location;
    const res = await fetch(`/api/share/${noteId}`);
    const { share } = await res.json();
    return `${protocol}//${host}/view/${share}`;
  };

  const shareViewOnly = async () => {
    try {
      const link = await getViewOnlyLink();
      await navigator.clipboard.writeText(link);
      toast("Link copied!");
    } catch { }
    try {
      // nice one Safari
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": getViewOnlyLink()
        })
      ]);
      toast("Link copied!");
    } catch { }
  };

  return <div className={styles.strip}>
    <span className={styles.button} onClick={share}>Share</span>
    <span className={styles.button} onClick={shareViewOnly}>Share View Only</span>
    {element}
  </div>;
};
export default ShareStrip;
