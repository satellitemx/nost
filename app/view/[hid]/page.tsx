import db from "lib/data/db"
import hashids from "lib/data/hashids"
import { notFound } from "next/navigation"
import { PageParams } from "type/next"

const getData = async (hash_id: string) => {
	const id = hashids.decode(hash_id).pop()
	if (!id) {
		notFound()
	}
	const data = await db.get_by_id(id)
	return data
}

export default async function ViewNotePage({
	params
}: {
	params: PageParams
}) {
	const data = await getData(params.hid)

	return <div
		dangerouslySetInnerHTML={{
			__html: data?.content
		}}
	/>
}