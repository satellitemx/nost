import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useParams } from "solid-app-router";
import { createMemo, createResource, lazy, Match, Show, Suspense, Switch } from "solid-js";
import Head from "src/components/head";
import MadeWith from "src/components/made-with";
import hashid from "src/lib/hashid";
import { supabase } from "src/lib/supabase";
import styles from "src/styles/centre.module.css";
import "src/styles/quill-snow-override.css";
import { definitions } from "src/types";

const Editor = lazy(() => import("src/components/editor"));

const fetchNote = async (noteIdHashed: string) => {
  const decoded = hashid.decode(noteIdHashed).pop();
  if (!decoded) { return; }
  const { data: note } = await supabase
    .from<definitions["note"]>("note")
    .select("*")
    .eq("id", decoded as number)
    .maybeSingle()
  if (!note) { return; }
  const { data: changes } = await supabase
    .from<definitions["note_changes"]>("note_changes")
    .select("*")
    .eq("note_id", note.note_id)
    .order("created_at", {
      ascending: true,
    });
  const composed = changes?.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());

  return {
    noteId: note.note_id,
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
      <Show when={!data.loading} fallback="Loading data...">
        <Switch fallback="Loading data...">
          <Match when={noteId()}>
            <Suspense fallback="Loading editor...">
              <Editor noteId={noteId()!} disabled={true} prerendered={prerendered()} />
            </Suspense>
          </Match>
          <Match when={!noteId()}>
            <h1>Note not found</h1>
          </Match>
        </Switch>
      </Show>
    </div>
    <MadeWith />
  </>;
};
export default NoteViewPage;
