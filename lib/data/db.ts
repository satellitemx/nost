import { createClient } from "@supabase/supabase-js"

const db = (() => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
	const supabase = createClient(supabaseUrl, supabaseKey)
	return {
		get_by_id: async (id: number | bigint) => {
			const result = await supabase
				.from("note")
				.select("*")
				.eq("id", id)
				.maybeSingle()
			if (result.data) {
				return result.data
			}
		},
		get: async (note_id: string) => {
			const found = await supabase
				.from("note")
				.select("*")
				.eq("note_id", note_id)
				.maybeSingle()
			if (found.data) {
				return found.data
			}
			const created = await supabase
				.from("note")
				.insert({ note_id })
				.select("*")
				.maybeSingle()
			return created.data
		},
		save: async (note_id: string, content: string) => {
			const updated = await supabase
				.from("note")
				.update({ content })
				.eq("note_id", note_id)
				.select("*")
				.maybeSingle()
			if (updated.error) {
				const inserted = await supabase
					.from("note")
					.insert({ note_id, content })
					.select("*")
					.maybeSingle()
				return inserted
			}
			return updated
		}
	}
})()

export default db