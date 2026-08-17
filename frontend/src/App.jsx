import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import AddDialog from "./components/AddDialog.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { addMovie, deleteMovie, listMovies, searchTmdb } from "./api.js";

const FILTERS = [
    { key: "ALL", label: "All" },
    { key: "WATCHED", label: "Watched" },
    { key: "WATCHLIST", label: "Watchlist" },
];

export default function App() {
    const [diary, setDiary] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const [picked, setPicked] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const searchMode = query.length > 0;

    useEffect(() => {
        loadDiary(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    async function loadDiary(status) {
        try {
            setDiary(await listMovies(status));
        } catch (e) {
            flash(e.message);
        }
    }

    async function handleSearch(q) {
        setQuery(q);
        setSearching(true);
        try {
            setResults(await searchTmdb(q));
        } catch (e) {
            flash(e.message);
            setResults([]);
        } finally {
            setSearching(false);
        }
    }

    function clearSearch() {
        setQuery("");
        setResults([]);
    }

    async function handleSave(payload) {
        setSaving(true);
        try {
            await addMovie(payload);
            setPicked(null);
            clearSearch();
            await loadDiary(filter);
            flash("Added to your diary.");
        } catch (e) {
            flash(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(movie) {
        if (!confirm(`Remove “${movie.title}” from your diary?`)) return;
        try {
            await deleteMovie(movie.id);
            await loadDiary(filter);
        } catch (e) {
            flash(e.message);
        }
    }

    function flash(message) {
        setToast(message);
        setTimeout(() => setToast(null), 2600);
    }

    return (
        <div className="app">
            <header className="masthead">
                <div className="masthead__inner">
                    <div className="wordmark">
                        <span className="wordmark__reel">●</span>
                        FILM<span className="wordmark__accent">LOG</span>
                    </div>
                    <p className="tagline">A diary of everything you watch.</p>
                    <SearchBar onSearch={handleSearch} onClear={clearSearch} />
                </div>
                <div className="masthead__rule" />
            </header>

            <main className="main">
                {searchMode ? (
                    <section>
                        <button className="backlink" onClick={clearSearch}>← Back to your diary</button>
                        <SearchResults
                            results={results}
                            loading={searching}
                            query={query}
                            onPick={setPicked}
                        />
                    </section>
                ) : (
                    <section>
                        <div className="toolbar">
                            <h2 className="toolbar__title">Your diary</h2>
                            <div className="tabs">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.key}
                                        className={`tab ${filter === f.key ? "is-active" : ""}`}
                                        onClick={() => setFilter(f.key)}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {diary.length === 0 ? (
                            <div className="empty">
                                <p className="empty__line">Nothing logged yet.</p>
                                <p className="empty__hint">Search a film above to start your diary.</p>
                            </div>
                        ) : (
                            <div className="grid">
                                {diary.map((m) => (
                                    <MovieCard key={m.id} movie={m} onDelete={handleDelete} />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            <AddDialog
                film={picked}
                onSave={handleSave}
                onClose={() => setPicked(null)}
                saving={saving}
            />

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
