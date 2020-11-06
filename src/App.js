import { React, Suspense, useState, useEffect } from "react"
import { useFirestoreDocData, useFirestore } from "reactfire"

const genChar = () => {
    return Math.floor(Math.random() * 26) + 97
}

const genId = () => {
    const id = []
    for (let i = 0; i < 6; i++) {
        id.push(String.fromCharCode(genChar()))
    }
    return id.join("")
}

const Toolset = ({ note, status }) => {
    const [currentStatus, setStatus] = useState("")

    useEffect(() => {
        switch (status) {
            case 0: setStatus(`Requesting /${note}...`); break
            case 1: setStatus(`Edited`); break
            case 2: setStatus(`Saving...`); break
            case 3: setStatus(`Failed when saving /${note}`); break
            default: setStatus(`Saved`)
        }
    }, [note, status])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    return (
        <div onClick={copyToClipboard} className={[0, 1, 2, 3].indexOf(status) !== -1 ? "toolset show-status" : "toolset"}>
            <div className="logo"></div>
            <p className="status">{currentStatus}</p>
        </div >
    )
}

const Toolbar = ({ note, status }) => {
    return (
        <div className="toolbar">
            <Toolset note={note} status={status} />
        </div>
    )
}

const Editor = ({ note, setStatus }) => {
    const col = useFirestore().collection("notes")
    let docRef = col.doc(note)
    let { data } = useFirestoreDocData(docRef)
    const [presentData, setPresentData] = useState(data)
    const [prev, setPrev] = useState(null)

    useEffect(() => {
        setStatus(-1)
    }, [])

    const handleChange = (e) => {
        setPresentData(e.target.value)
        setStatus(1)
        if (prev) clearInterval(prev)
        setPrev(setTimeout(() => {
            setStatus(2)
            col.doc(note).set({ data: e.target.value }).then(
                () => { setStatus(-1) }
            ).catch(
                () => { setStatus(3) }
            )
            clearTimeout(prev)
        }, 1000))
    }

    return (
        <textarea className="editor" onChange={handleChange} value={presentData}></textarea>
    )
}

const sanitise = note => {
    return note.split("").filter(char => "qwertyuiopasdfghjklzxcvbnm".indexOf(char) !== -1).join("")
}

const App = () => {
    if (window.location.host === "notes.sate.li") {
        // Redirect to new domain
        window.location.href = `https://nost.app${window.location.pathname}`
    }
    let note = window.location.pathname
    if (note.length === 1) {
        note = genId()
    }
    note = sanitise(note)
    window.history.pushState(note, `Nost - ${note}`, `/${note}`)
    document.title = `Nost - ${note}`

    const [status, setStatus] = useState(0) // 0: requesting; 1: waiting for save; 2: saving; 3: error on save; default: viewing

    const handleStatus = status => {
        setStatus(status)
    }

    return (

        <>
            <Toolbar note={note} status={status} />
            <Suspense fallback={<textarea className="editor"></textarea>}>
                <Editor note={note} setStatus={handleStatus} />
            </Suspense>
            <p className="footnote"><a href="https://github.com/satellitemx/nost" target="_blank">Built with ❤️</a></p>
        </>

    )
}

export default App