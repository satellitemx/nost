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

const Toolbar = ({ note, status, changeStatus }) => {
    const [currentStatusText, setStatusText] = useState("")

    useEffect(() => {
        switch (status) {
            case 0: setStatusText(`Requesting /${note}...`); break
            case 1: setStatusText(`Edited`); break
            case 2: setStatusText(`Saving...`); break
            case 3: setStatusText(`Failed when saving /${note}`); break
            case 4: setStatusText(`Link copied`); break
            default: setStatusText(`Saved`)
        }
    }, [note, status])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        changeStatus(4)
        setTimeout(() => {
            changeStatus(-1)
        }, 3000)
    }

    return (
        <div className="toolbar">
            <div onClick={copyToClipboard} className={[0, 1, 2, 3, 4].indexOf(status) !== -1 ? "toolset show-status" : "toolset"}>
                <div className="logo"></div>
                <p className="status">{currentStatusText}</p>
            </div >
        </div>
    )
}

const Editor = ({ note, changeStatus }) => {
    const col = useFirestore().collection("notes")
    let docRef = col.doc(note)
    let { data } = useFirestoreDocData(docRef)
    const [presentData, setPresentData] = useState(data)
    const [prev, setPrev] = useState(null)

    useEffect(() => {
        changeStatus(-1)
    }, [])

    const handleChange = (e) => {
        setPresentData(e.target.value)
        changeStatus(1)
        if (prev) clearInterval(prev)
        setPrev(setTimeout(() => {
            changeStatus(2)
            col.doc(note).set({
                data: e.target.value,
                lastUpdate: new Date()
            }).then(
                () => { changeStatus(-1) }
            ).catch(
                () => { changeStatus(3) }
            )
            clearTimeout(prev)
        }, 1000))
    }

    return (
        <textarea className="editor" onChange={handleChange} value={presentData}></textarea>
    )
}

const Footnote = () => {
    return (
        <div className="footnote">
            <a href="https://github.com/satellitemx/nost" target="_blank" rel="noreferrer">
                <p className="footnote-show">Built with ❤️</p>
                <p className="footnote-hidden">Have a look at the source code 🐙</p>
            </a>
        </div>
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

    const [status, setStatus] = useState(0)
    // 0: requesting
    // 1: waiting for save
    // 2: saving
    // 3: error on save
    // 4: copied
    // -1: viewing

    const changeStatus = status => {
        setStatus(status)
    }

    return (

        <>
            <Toolbar note={note} status={status} changeStatus={changeStatus} />
            <Suspense fallback={<textarea className="editor"></textarea>}>
                <Editor note={note} changeStatus={changeStatus} />
            </Suspense>
            <Footnote />
        </>

    )
}

export default App