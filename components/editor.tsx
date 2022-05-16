import { supabase } from "lib/supabase";
import useDebounce from "lib/use-debounce";
import useNote from "lib/use-note";
import Head from "next/head";
import Quill, { TextChangeHandler } from "quill";
import Delta from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "styles/editor.module.css";
import { definitions } from "types/supabase";

const Editor: FC<{
  noteId: string;
  delta: Delta;
}> = ({ noteId, delta }) => {
  const { write } = useNote(noteId);
  const editorRef = useRef<HTMLDivElement>(null);
  const instance = useRef<Quill | undefined>();
  const [initialised, setInitialised] = useState(false);
  const [changes, setChanges] = useState<Delta>(new Delta());
  const debounced = useDebounce(changes, 1000);
  const [lastSavedId, setLastSavedId] = useState<string>();
  const initialContent = useMemo(() => {
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    return converter.convert();
  }, [delta]);

  // setup quill
  useEffect(() => {
    if (editorRef && editorRef.current) {
      const { current: currentEditorEl } = editorRef;
      const quill = instance.current || new Quill(currentEditorEl, {
        placeholder: "Leave a note...",
        theme: "snow",
        modules: {
          toolbar: false,
          history: {
            delay: 1000,
          }
        },
      });
      instance.current = quill;
      setInitialised(true);

      const handler: TextChangeHandler = (delta, oldDelta, source) => {
        if (source === "user") {
          setChanges(d => d.compose(delta as Delta));
        }
      };
      quill.on("text-change", handler);
      return () => {
        quill.off("text-change", handler);
      };
    }
  }, [editorRef, write]);

  // setup live subscription
  useEffect(() => {
    if (!initialised) { return; }
    const quill = instance.current!;
    const noteChnages = supabase
      .from<definitions["note_changes"]>(`note_changes:note_id=eq.${noteId}`)
      .on("INSERT", payload => {
        const { new: content } = payload;
        if (content.id !== lastSavedId) {
          quill.updateContents(content.delta as any, "api");
        }
      }).subscribe();

    return () => {
      noteChnages.unsubscribe();
    };
  }, [initialised, lastSavedId, noteId]);

  useEffect(() => {
    if (debounced.ops.length === 0) { return; }
    const abortController = new AbortController();
    supabase
      .from<definitions["note_changes"]>("note_changes")
      .insert([
        { delta: JSON.stringify(debounced), note_id: noteId },
      ])
      .abortSignal(abortController.signal)
      .then(({ data }) => {
        const row = data?.pop();
        setLastSavedId(row?.id);
        setChanges(new Delta());
      });
  }, [debounced, noteId]);

  return <>
    <Head>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
    </Head>
    <div className={styles.editor} >
      <div id="editor" ref={editorRef} dangerouslySetInnerHTML={{
        __html: initialContent,
      }} />
    </div>
  </>;
};
export default Editor;