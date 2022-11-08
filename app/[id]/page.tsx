import Editor from "lib/component/editor"
import db from "lib/data/db"
import { PageParams } from "type/next"

export default async function NotePage({
	params
}: {
	params: PageParams
}) {
	const data = await db.get(params.id)

	return <>
		<Editor
			note_id={params.id}
			content={data?.content}
		/>
	</>
}