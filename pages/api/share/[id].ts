import hashid from "lib/hashid";
import { supabase } from "lib/supabase";
import { NextApiHandler } from "next";
import { definitions } from "types/supabase";

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET": {
      const noteId = req.query.id as string;
      const { data } = await supabase
        .from<definitions["note"]>("note")
        .select("id")
        .eq("note_id", noteId);
      if (!data || data?.length === 0) {
        return res.status(404).end();
      }
      const { id } = data.pop()!;
      const hashed = hashid.encode([id]);
      return res.json({
        share: hashed
      });
    }
    default: return res.status(400).end();
  }
};
export default handler;
