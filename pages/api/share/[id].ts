import db from "lib/data/db";
import hashids from "lib/data/hashids";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
	const note_id = req.nextUrl.pathname.split("/").pop()
	if (!note_id) {
		return new Response(
			"Note not found",
			{ 
				status: 400
			}
		)
	}
	const note = await db.get(note_id)
	if (!note) {
		throw new Error("Failed to get note. ")
	}
	const view_id = hashids.encode(note.id)

	return new Response(JSON.stringify({
		view_id
	}))
}

export default handler