import hashid from "lib/hashid";
import { supabase } from "lib/supabase";
import { GetServerSideProps, NextPage } from "next";
import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import styles from "styles/editor.module.css";
import { definitions } from "types/supabase";

interface NoteViewPageProps {
  content: string;
}
const NoteViewPage: NextPage<NoteViewPageProps> = ({ content }) => {
  return <>
    <div className="layout">
      <div className={styles.editor} dangerouslySetInnerHTML={{
        __html: content
      }} />
    </div>
    <style jsx>{`
      .layout {
        display: grid;
        width: 100%;
        min-height: 100vh;
        align-items: center;
        justify-items: center;
        grid-template-rows: auto;
      }  
    `}</style>
  </>;
};

export default NoteViewPage;
export const getServerSideProps: GetServerSideProps<NoteViewPageProps> = async (ctx) => {
  const id = ctx.query.id as string | undefined;
  if (!id) {
    return { notFound: true };
  }
  const decoded = hashid.decode(id).pop()!;
  const { data } = await supabase
    .from<definitions["note"] & {
      note_changes: Array<{
        delta: definitions["note_changes"]["delta"]
      }>
    }>("note")
    .select("*, note_changes(delta)")
    .eq("id", decoded as number);

  const row = data?.pop();
  if (!row) {
    return { notFound: true };
  }

  const composed = row.note_changes.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());
  const converter = new QuillDeltaToHtmlConverter(composed.ops, {});
  const content = converter.convert();
  return {
    props: {
      content
    }
  };
};