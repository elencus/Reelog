const POSTER_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='180'>
      <rect width='100%' height='100%' fill='#2c2740'/>
      <text x='50%' y='50%' fill='#6d6682' font-family='monospace' font-size='11'
        text-anchor='middle' dominant-baseline='middle'>no poster</text>
    </svg>`
    );

export default function SearchResults({results, loading, query, onPick, loggedIds}) {
    if (loading) {
        return <p className="results__hint">Searching TMDB for “{query}”…</p>;
    }
    if (!results.length) {
        return <p className="results__hint">No films found for “{query}”. Try another title.</p>;
    }

    return (
        <div className="results">
            <p className="results__count">
                <span className="mono">{results.length}</span> result{results.length !== 1 ? "s" : ""} from TMDB
            </p>
            <ul className="results__list">
                {results.map((r) => (
                    <li key={r.tmdbId} className="result">
                        <img
                            className="result__poster"
                            src={r.posterUrl || POSTER_FALLBACK}
                            alt={`${r.title} poster`}
                            loading="lazy"
                        />
                        <div className="result__body">
                            <h3 className="result__title">
                                {r.title} <span className="result__year mono">{r.year || "—"}</span>
                            </h3>
                            {r.tmdbRating ? (
                                <p className="result__meta mono">TMDB {r.tmdbRating.toFixed(1)}</p>
                            ) : null}
                            {r.overview ? <p className="result__overview">{r.overview}</p> : null}
                        </div>
                        {loggedIds.has(r.tmdbId) ? (
                            <button className="btn btn--ghost result__add" disabled>
                                Already logged
                            </button>
                        ) : (
                            <button className="btn btn--accent result__add" onClick={() => onPick(r)}>
                                Log this
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
