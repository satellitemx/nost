import { Link } from "solid-app-router";
import { Portal } from "solid-js/web";
import styles from "src/styles/made-with.module.css";

const MadeWith = () => {
  return <Portal mount={document.body}>
    <div class={styles.container}>
      <span class={styles.strip}>Create your note with <Link href="/">Nost</Link></span>
    </div>
  </Portal>;
};
export default MadeWith;