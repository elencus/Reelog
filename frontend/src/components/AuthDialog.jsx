import {useEffect, useState} from "react";
import {login, register, setToken} from "../api.js";

export default function AuthDialog({onClose, onAuth}) {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);


    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setError("");
    }, []);

    async function submit() {
        setError("");
        setBusy(true);
        try {
            if (mode === "register") {
                await register({username, email, password});
                const res = await login({username, password});
                setToken(res.token);
                onAuth(username);
            } else {
                const res = await login({username, password});
                setToken(res.token);
                onAuth(username);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <button className="dialog__close" onClick={onClose} aria-label="Close">×</button>

                <h2 className="dialog__title">
                    {mode === "login" ? "Sign in" : "Create account"}
                </h2>

                <div className="segmented" style={{marginTop: "16px"}}>
                    <button
                        className={`segmented__opt ${mode === "login" ? "is-active" : ""}`}
                        onClick={() => {
                            setMode("login");
                            setUsername("");
                            setEmail("");
                            setPassword("");
                            setError("");
                        }}
                    >
                        Sign in
                    </button>
                    <button
                        className={`segmented__opt ${mode === "register" ? "is-active" : ""}`}
                        onClick={() => {
                            setMode("register");
                            setUsername("");
                            setEmail("");
                            setPassword("");
                            setError("");
                        }}
                    >
                        Register
                    </button>
                </div>

                <div className="field">
                    <label className="field__label">Username</label>
                    <input
                        className="field__input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                    />
                </div>

                {mode === "register" && (
                    <div className="field">
                        <label className="field__label">Email</label>
                        <input
                            className="field__input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                )}

                <div className="field">
                    <label className="field__label">Password</label>
                    <input
                        className="field__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                </div>

                {error && <p className="dialog__error">{error}</p>}

                <div className="dialog__actions">
                    <button className="btn btn--ghost" onClick={onClose} disabled={busy}>
                        Cancel
                    </button>
                    <button className="btn btn--accent" onClick={submit} disabled={busy}>
                        {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
