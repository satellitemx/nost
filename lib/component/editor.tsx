"use client";

import Script from "next/script";
import type Quill from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { FC, useRef } from "react";

const Editor: FC<{
	id: string;
	content?: string;
}> = ({
	id,
	content = ""
}) => {

		const editorRef = useRef<HTMLDivElement>(null)
		const quillRef = useRef<Quill | null>(null)
		const shareBtnRef = useRef<HTMLButtonElement>(null)

		const handleSave = async () => {
			const quill = quillRef.current
			if (quill) {
				const content = quill.getContents()
				const converter = new QuillDeltaToHtmlConverter(content.ops)
				const html = converter.convert()
				await fetch("/api/save", {
					method: "POST",
					body: JSON.stringify({
						id,
						content: html
					})
				})
			}
		}

		const handleShare = async () => {
			await handleSave()
			const payload = await fetch(`/api/share/${id}`)
			const data = await payload.json()
			const url = `${process.env.NEXT_PUBLIC_URL}/view/${data.view_id}`
			navigator.clipboard.writeText(url)
			shareBtnRef.current!.innerText = `Copied ${url}`
		}

		return <>
			<div
				id="editor"
				ref={editorRef}
				dangerouslySetInnerHTML={{
					__html: content
				}}
			/>
			<button onClick={handleSave}>Save</button>
			<button ref={shareBtnRef} onClick={handleShare}>Share</button>
			<Script onLoad={() => {
				// @ts-ignore
				quillRef.current = new Quill("#editor", {
					theme: "snow"
				})
			}} src="https://cdn.quilljs.com/1.3.6/quill.js" />
		</>
	}

export default Editor