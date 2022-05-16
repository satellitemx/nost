import { supabase } from "lib/supabase";
import { useCallback } from "react";
import { definitions } from "types/supabase";

const useNote = (noteId: string) => {
  const write = useCallback((delta: any) => {
    supabase
      .from<definitions["note_changes"]>("note_changes")
      .insert([
        { note_id: noteId, delta: JSON.stringify(delta) },
      ])
      .then();
  }, [noteId]);

  return {
    write
  };
};
export default useNote;