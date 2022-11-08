import db from "lib/data/db";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
	const data = JSON.parse(req.body)
	const saved = await db.save(data.note_id, data.content)
	
	return res.json(saved)
}

export default handler