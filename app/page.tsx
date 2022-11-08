import hashids from "lib/data/hashids"
import random from "lib/data/random"
import { redirect } from "next/navigation"

const getRandomId = () => {
	return hashids.encode(random.generateInteger())
}

export default function IndexPage() {
	const randomId = getRandomId()
	redirect(`/${randomId}`)
}