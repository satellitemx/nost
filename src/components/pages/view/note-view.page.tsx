import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useParams } from "solid-app-router";
import { createMemo, createResource, lazy, Show, Suspense } from "solid-js";
import Head from "src/components/head";
import hashid from "src/lib/hashid";
import { supabase } from "src/lib/supabase";
import styles from "src/styles/note-page.module.css";
import "src/styles/quill-snow-override.css";

const Editor = lazy(() => import("src/components/editor"));

const fetchNote = async (noteIdHashed: string) => {
  const decoded = hashid.decode(noteIdHashed).pop();
  if (!decoded) { return; }
  const { data } = await supabase
    .from<{
      id: number;
      note_id: string;
      note_changes: Array<{
        delta: string;
      }>;
    }>("note")
    .select("*, note_changes(delta)")
    .eq("id", decoded as number);
  const row = data?.pop();
  const composed = row?.note_changes?.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());

  return {
    id: row?.id,
    noteId: row?.note_id,
    delta: composed ?? new Delta()
  };
};

const NoteViewPage = () => {
  const { hashed } = useParams();
  const [data] = createResource(hashed, fetchNote);
  const prerendered = createMemo(() => {
    const delta = data()?.delta;
    if (!delta) { return ""; }
    const converter = new QuillDeltaToHtmlConverter(delta.ops ?? [], {});
    return converter.convert();
  });
  const noteId = createMemo(() => data()?.noteId);

  return <>
    <Head>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
    </Head>
    <div class={styles.container}>
      <Show when={!data.loading && noteId()} fallback={"Loading data..."}>
        <Suspense fallback={"Loading editor..."}>
          <Editor noteId={noteId()!} disabled={true} prerendered={prerendered()} />
        </Suspense>
      </Show>
    </div>
  </>;
};
export default NoteViewPage;
