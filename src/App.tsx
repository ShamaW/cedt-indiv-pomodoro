import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";

function App() {
    const [name, setName] = useState("");
    const [greetMsg, setGreetMsg] = useState("");

    async function greet() {
        setGreetMsg(await invoke("greet", { name }));
    }

    return (
        <main className="container">
        <h1>Welcome to Tauri</h1>
        <form
            className="row"
            onSubmit={(e) => {
            e.preventDefault();
            greet();
            }}
        >
            <input
                id="greet-input"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name..."
            />
            <button type="submit">Greet</button>
        </form>
        <p>{greetMsg}</p>
        <p>Testing message from React component</p>
        </main>
    );
}

export default App;