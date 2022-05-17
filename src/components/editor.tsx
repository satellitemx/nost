import createDebounce from "@solid-primitives/debounce";
import Quill, { TextChangeHandler } from "quill";
import Delta from "quill-delta";
import { Component, createEffect, onCleanup, onMount } from "solid-js";
import { supabase } from "src/lib/supabase";
import styles from "src/styles/editor.module.css";

const Editor: Component<{
  noteId: string;
  prerendered: string;
  disabled: boolean;
}> = (props) => {

  let delta = new Delta();
  let lastAcknowledgedId = "";

  const checkDifferenceAndUpdateFn = () => {
    const captured = new Delta(delta);
    delta = new Delta();
    supabase
      .from("note_changes")
      .insert([
        { delta: JSON.stringify(captured), note_id: props.noteId },
      ])
      .then(({ data }) => {
        const row = data?.pop();
        lastAcknowledgedId = row?.id ?? "";
      });
  };

  const checkDifferenceAndUpdate = createDebounce(checkDifferenceAndUpdateFn, 500);

  let editorRef!: HTMLDivElement;
  let quill: Quill;

  onMount(() => {
    quill = new Quill(editorRef, {
      theme: "snow",
      modules: {
        toolbar: false,
      },
    });
    if (props.disabled) {
      quill.disable();
    }
  });

  createEffect(() => {
    const subscription = supabase
      .from(`note_changes:note_id=eq.${props.noteId}`)
      .on("INSERT", payload => {
        const { new: content } = payload;
        if (content.id !== lastAcknowledgedId) {
          quill.updateContents(content.delta, "api");
        }
      }).subscribe();
    onCleanup(() => {
      subscription.unsubscribe();
    });
  });

  createEffect(() => {
    if (props.disabled) { return; }
    const textChangeHandler: TextChangeHandler = (newDelta, oldDelta, source) => {
      if (source === "user") {
        delta = delta.compose(newDelta as Delta);
        checkDifferenceAndUpdate();
      }
    };
    quill.on("text-change", textChangeHandler);
    onCleanup(() => {
      quill.off("text-change", textChangeHandler);
    });
  });

  return <>
    <div class={styles.editor}>
      <div ref={editorRef} innerHTML={props.prerendered} />
    </div>
  </>;
};
export default Editor;