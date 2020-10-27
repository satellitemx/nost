import React from "react"
import ReactDOM from "react-dom"
import { FirebaseAppProvider } from "reactfire"

import config from "./FBConfig" // Import your own
import App from "./App"
import "./main.css"

ReactDOM.render(
    <FirebaseAppProvider firebaseConfig={config} >
        <App />
    </FirebaseAppProvider>,
    document.getElementById("root"))