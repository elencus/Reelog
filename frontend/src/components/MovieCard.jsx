import StarRating from "./StarRating.jsx";

const POSTER_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='360'>
      <rect width='100%' height='100%' fill='#2c2740'/>
      <text x='50%' y='50%' fill='#6d6682' font-family='monospace' font-size='16'
        text-anchor='middle' dominant-baseline='middle'>no poster</text>
    </svg>`
    );

export default function MovieCard({ movie, onDelete }) {
    const isWatchlist = movie.status === "WATCHLIST";

    return (
        <article className="card">
            <div className="card__poster-wrap">
                <img
                    className="card__poster"
                    src={movie.posterUrl || POSTER_FALLBACK}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                />
                <span className={`badge ${isWatchlist ? "badge--watchlist" : "badge--watched"}`}>
          {isWatchlist ? "Watchlist" : "Watched"}
        </span>
                <button className="card__delete" onClick={() => onDelete(movie)} aria-label={`Remove ${movie.title}`}>
                    ×
                </button>
            </div>

            <div className="card__body">
                <h3 className="card__title">{movie.title}</h3>
                <p className="card__meta mono">
                    {movie.releaseYear || "—"}
                    {movie.runtime ? ` · ${movie.runtime}m` : ""}
                </p>
                {movie.director && <p className="card__director">dir. {movie.director}</p>}

                {!isWatchlist && movie.rating ? <StarRating value={movie.rating} size="sm" /> : null}

                {movie.reviewText && <p className="card__review">{movie.reviewText}</p>}
            </div>
        </article>
    );
}
