import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useParams } from "solid-app-router";
import { createMemo, createResource, lazy, Show, Suspense } from "solid-js";
import Head from "src/components/head";
import ShareStrip from "src/components/share-strip";
import { supabase } from "src/lib/supabase";
import styles from "src/styles/centre.module.css";
import "src/styles/quill-snow-override.css";
import { definitions } from "src/types";

const Editor = lazy(() => import("src/components/editor"));

const fetchNote = async (noteId: string) => {
  let { data: note } = await supabase
    .from<definitions["note"]>("note")
    .select("id")
    .eq("note_id", noteId)
    .maybeSingle()
  if (!note) {
    const { data: newNote } = await supabase
      .from<definitions["note"]>("note")
      .insert([{
        note_id: noteId
      }])
      .single();
    note = newNote;
  }
  const { data: changes } = await supabase
    .from<definitions["note_changes"]>("note_changes")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", {
      ascending: true,
    });
  const composed = changes?.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());

  return {
    noteId: note!.id,
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
    <ShareStrip id={data()?.noteId} />
  </>;
};
export default NotePage;
