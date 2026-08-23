import {useEffect, useState} from "react";
import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import AddDialog from "./components/AddDialog.jsx";
import MovieCard from "./components/MovieCard.jsx";
import Stats from "./components/Stats.jsx";
import MovieDetails from "./components/MovieDetails.jsx"
import {addMovie, deleteMovie, listMovies, searchTmdb, updateMovie} from "./api.js";

const FILTERS = [
    {key: "ALL", label: "All"},
    {key: "WATCHED", label: "Watched"},
    {key: "WATCHLIST", label: "Watchlist"},
    {key: "FAVORITES", label: "Favorites"},
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

    const [sortBy, setSortBy] = useState("added");
    const [diaryQuery, setDiaryQuery] = useState("");

    const [detailsTmdbId, setDetailsTmdbId] = useState(null);
    const [detailsMovieId, setDetailsMovieId] = useState(null);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    const searchMode = query.length > 0;

    useEffect(() => {
        loadDiary(filter);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, diaryQuery, sortBy]);

    async function loadDiary(status) {
        try {
            const apiStatus = status === "FAVORITES" ? "ALL" : status;
            setDiary(await listMovies(apiStatus));
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
            if (payload.id) {
                await updateMovie(payload.id, payload);
            } else {
                await addMovie(payload);
            }
            setPicked(null);
            clearSearch();
            await loadDiary(filter);
            flash(payload.id ? "Updated." : "Added to your diary.");
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

    async function handleToggleFavorite(movie) {
        try {
            await updateMovie(movie.id, {
                rating: movie.rating,
                review: movie.reviewText,
                status: movie.status,
                favorite: !movie.favorite,
                rewatchCount: movie.rewatchCount,
            });
            await loadDiary(filter);
        } catch (e) {
            flash(e.message);
        }
    }

    function openDetails(tmdbId, movieId = null){
        setDetailsTmdbId(tmdbId);
        setDetailsMovieId(movieId);
    }

    async function handleRewatch(movie) {
        try {
            await updateMovie(movie.id, {
                rating: movie.rating,
                review: movie.reviewText,
                status: movie.status,
                favorite: movie.favorite,
                rewatchCount: (movie.rewatchCount || 0) + 1,
            });
            flash("Rewatch logged.");
            await loadDiary(filter);
        } catch (e) {
            flash(e.message);
        }
    }

    function flash(message) {
        setToast(message);
        setTimeout(() => setToast(null), 2600);
    }

    const visibleDiary = diary
        .filter((m) => {
            if (filter === "FAVORITES" && !m.favorite) return false;
            const q = diaryQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                m.title.toLowerCase().includes(q) ||
                (m.director && m.director.toLowerCase().includes(q)) ||
                (m.genres && m.genres.toLowerCase().includes(q))
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "year":
                    return (b.releaseYear || "").localeCompare(a.releaseYear || "");
                case "title":
                    return a.title.localeCompare(b.title);
                case "added":
                default:
                    return b.id - a.id;
            }
        });
    const totalPages = Math.ceil(visibleDiary.length / PER_PAGE);
    const pagedDiary = visibleDiary.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="app">
            <header className="masthead">
                <div className="masthead__inner">
                    <div className="wordmark">
                        <span className="wordmark__reel">●</span>
                        FILM<span className="wordmark__accent">LOG</span>
                    </div>
                    <p className="tagline">A diary of everything you watch.</p>
                    <SearchBar onSearch={handleSearch} onClear={clearSearch}/>
                </div>
                <div className="masthead__rule"/>
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
                            loggedIds={new Set(diary.map((m) => m.tmdbId))}
                        />
                    </section>
                ) : (
                    <section>
                        {diary.length > 0 && <Stats movies={diary}/>}
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

                        <div className="diary-controls">
                            <input
                                className="diary-search"
                                type="text"
                                placeholder="Filter your diary…"
                                value={diaryQuery}
                                onChange={(e) => setDiaryQuery(e.target.value)}
                            />
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="added">Recently added</option>
                                <option value="rating">Highest rated</option>
                                <option value="year">Newest year</option>
                                <option value="title">Title (A–Z)</option>
                            </select>
                        </div>

                        {diary.length === 0 ? (
                            <div className="empty">
                                <p className="empty__line">Nothing logged yet.</p>
                                <p className="empty__hint">Search a film above to start your diary.</p>
                            </div>
                        ) : visibleDiary.length === 0 ? (
                            <div className="empty">
                                <p className="empty__line">No films match your filter.</p>
                                <p className="empty__hint">Try a different search term.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid">
                                    {pagedDiary.map((m) => (
                                        <MovieCard key={m.id} movie={m} onDelete={handleDelete} onEdit={setPicked}
                                                   onToggleFavorite={handleToggleFavorite} onRewatch={handleRewatch}
                                                   onOpenDetails={() => openDetails(m.tmdbId, m.id)}/>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="page-btn"
                                            onClick={() => setPage((p) => p - 1)}
                                            disabled={page === 1}
                                        >
                                            ← Prev
                                        </button>
                                        <span className="page-info mono">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            className="page-btn"
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={page === totalPages}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
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

            <MovieDetails tmdbId={detailsTmdbId} movieId ={detailsMovieId}  onOpenDetails={(tmdbId) => openDetails(tmdbId, null)} onClose={() => {setDetailsTmdbId(null); setDetailsMovieId(null); }}/>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
