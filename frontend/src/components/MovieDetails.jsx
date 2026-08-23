import { useEffect, useState } from "react";
import { getMovieDetails, getSimilar } from "../api.js";

export default function MovieDetails({ tmdbId, movieId, onOpenDetails, onClose }) {
    const [details, setDetails] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        if (tmdbId == null) return;
        setLoading(true);
        setError("");
        getMovieDetails(tmdbId)
            .then(setDetails)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [tmdbId]);

    useEffect(() => {
        if (movieId == null) {
            setSimilar([]);
            return;
        }
        getSimilar(movieId)
            .then(setSimilar)
            .catch(() => setSimilar([]));
    }, [movieId]);

    if (tmdbId == null) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="details" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <button className="dialog__close" onClick={onClose} aria-label="Close">×</button>

                {loading && <p className="results__hint">Loading details…</p>}
                {error && <p className="dialog__error">{error}</p>}

                {details && (
                    <>
                        <div className="details__head">
                            {details.posterUrl && (
                                <img className="details__poster" src={details.posterUrl} alt="" />
                            )}
                            <div className="details__info">
                                <h2 className="details__title">{details.title}</h2>
                                <p className="details__meta mono">
                                    {details.year || "—"}
                                    {details.runtime ? ` · ${details.runtime}m` : ""}
                                    {details.tmdbRating ? ` · TMDB ${details.tmdbRating.toFixed(1)}` : ""}
                                </p>
                                {details.director && (
                                    <p className="details__director">dir. {details.director}</p>
                                )}
                                {details.genres && (
                                    <p className="details__genres">{details.genres}</p>
                                )}
                            </div>
                        </div>

                        {details.overview && (
                            <p className="details__overview">{details.overview}</p>
                        )}

                        {details.cast && details.cast.length > 0 && (
                            <div className="details__section">
                                <h3 className="details__label">Cast</h3>
                                <div className="details__cast">
                                    {details.cast.map((name) => (
                                        <span key={name} className="cast-chip">{name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {details.trailerKey && (
                            <div className="details__section">
                                <h3 className="details__label">Trailer</h3>
                                <div className="details__trailer">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${details.trailerKey}`}
                                        title="Trailer"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {similar.length > 0 && (
                            <div className="details__section">
                                <h3 className="details__label">Similar films</h3>
                                <div className="similar-row">
                                    {similar.map((s) => (
                                        <div
                                            key={s.tmdbId}
                                            className="similar-item"
                                            onClick={() => onOpenDetails && onOpenDetails(s.tmdbId)}
                                        >
                                            {s.posterUrl ? (
                                                <img src={s.posterUrl} alt={s.title} className="similar-poster" />
                                            ) : (
                                                <div className="similar-poster similar-poster--empty">no poster</div>
                                            )}
                                            <span className="similar-title">{s.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}