import db from "lib/data/db";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
	const data = await req.json()
	const saved = await db.save(data.id, data.content)
	
	return new Response(JSON.stringify(saved))
}

export default handler