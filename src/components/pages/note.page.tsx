import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useParams } from "solid-app-router";
import { createMemo, createResource, lazy, Show, Suspense } from "solid-js";
import Head from "src/components/head";
import ShareStrip from "src/components/share-strip";
import { supabase } from "src/lib/supabase";
import styles from "src/styles/centre.module.css";
import "src/styles/quill-snow-override.css";

const Editor = lazy(() => import("src/components/editor"));

const fetchNote = async (noteId: string) => {
  let { data } = await supabase
    .from<{
      id: number;
      note_id: string;
      note_changes: Array<{
        delta: string;
      }>;
    }>("note")
    .select("*, note_changes(delta)")
    .eq("note_id", noteId);
  if (!data || data?.length === 0) {
    const { data: newData } = await supabase
      .from("note")
      .insert([{
        note_id: noteId
      }]);
    data = newData;
  }
  const row = data?.pop();
  const composed = row?.note_changes?.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());

  return {
    id: row?.id,
    delta: composed ?? new Delta()
  };
};

const NotePage = () => {
  const { noteId } = useParams();
  const [data] = createResource(noteId, fetchNote);
  const prerendered = createMemo(() => {
    const delta = data()?.delta;
    if (!delta) { return ""; }
    const converter = new QuillDeltaToHtmlConverter(delta.ops ?? [], {});
    return converter.convert();
  });

  return <>
    <Head>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
    </Head>
    <div class={styles.container}>
      <Show when={!data.loading} fallback={"Loading data..."}>
        <Suspense fallback={"Loading editor..."}>
          <Editor noteId={noteId} disabled={false} prerendered={prerendered()} />
        </Suspense>
      </Show>
    </div>
    <ShareStrip id={data()?.id} />
  </>;
};
export default NotePage;
