import db from "lib/data/db";
import hashids from "lib/data/hashids";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
	const note_id = req.query.note_id as string | undefined
	if (!note_id) {
		return res.status(400).end()
	}
	const note = await db.get(note_id)
	if (!note) {
		return res.status(500).end()
	}
	const view_id = hashids.encode(note.id)

	return res.json({
		view_id
	})
}

export default handler