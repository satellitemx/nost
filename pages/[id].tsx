import ShareStrip from "components/share-strip";
import { supabase } from "lib/supabase";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Delta, { Op } from "quill-delta";
import { Suspense } from "react";
import { definitions } from "types/supabase";

const Editor = dynamic(() => import("components/editor"), { ssr: false });

interface NoteProps {
  noteId: string;
  ops: Array<Op>;
}
const NotePage: NextPage<NoteProps> = ({ noteId, ops }) => {
  const delta = new Delta(ops);
  return <>
    <div className="layout">
      <Suspense fallback={<div>Loading...</div>}>
        <Editor noteId={noteId} delta={delta} />
      </Suspense>
    </div>
    <footer>
      <ShareStrip noteId={noteId} />
    </footer>
    <style jsx>{`
      .layout {
        display: grid;
        width: 100%;
        min-height: 100vh;
        align-items: center;
        justify-items: center;
        grid-template-rows: auto;
      }
      footer {
        display: grid;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        justify-items: center;
        align-items: center;
        padding: 0.5rem;
      }
    `}</style>
  </>;
};
export default NotePage;
export const getServerSideProps: GetServerSideProps<NoteProps> = async (ctx) => {
  const noteId = ctx.query.id as string;
  let { data } = await supabase
    .from<definitions["note"] & {
      note_changes: Array<{
        delta: definitions["note_changes"]["delta"]
      }>
    }>("note")
    .select("*, note_changes(delta)")
    .eq("note_id", noteId);

  if (data?.length === 0) {
    await supabase
      .from<definitions["note"]>("note")
      .insert({ note_id: noteId })
      .order("created_at", {
        ascending: true
      });
  }
  const row = data?.pop();
  const composed = row?.note_changes?.reduce((acc, cur) => acc.compose(JSON.parse(cur.delta)), new Delta());

  return {
    props: {
      noteId,
      ops: composed ? composed.ops : [],
    }
  };
};