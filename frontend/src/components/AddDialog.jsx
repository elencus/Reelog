import {useEffect, useState} from "react";
import StarRating from "./StarRating.jsx";


export default function AddDialog({film, onSave, onClose, saving}) {
    const [status, setStatus] = useState(film?.status || "WATCHED");
    const [rating, setRating] = useState(film?.rating || 0);
    const [review, setReview] = useState(film?.reviewText || "");
    const [error, setError] = useState("");


    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        if (film) {
            setStatus(film.status || "WATCHED");
            setRating(film.rating || 0);
            setReview(film.reviewText || "");
            setError("");
        }
    }, [film]);

    if (!film) return null;

    function submit() {
        if (status === "WATCHED" && rating === 0) {
            setError("Give it a star rating, or move it to your watchlist.");
            return;
        }
        onSave({
            tmdbId: film.tmdbId,
            id: film.id,
            rating: status === "WATCHED" ? rating : null,
            review: review.trim() || null,
            status,
        });
    }

    return (
        <div className="overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <button className="dialog__close" onClick={onClose} aria-label="Close">×</button>

                <div className="dialog__head">
                    {film.posterUrl && <img className="dialog__poster" src={film.posterUrl} alt=""/>}
                    <div>
                        <h2 className="dialog__title">{film.title}</h2>
                        <p className="dialog__year mono">{film.year || "—"}</p>
                    </div>
                </div>

                <div className="segmented">
                    <button
                        className={`segmented__opt ${status === "WATCHED" ? "is-active" : ""}`}
                        onClick={() => setStatus("WATCHED")}
                    >
                        Watched
                    </button>
                    <button
                        className={`segmented__opt ${status === "WATCHLIST" ? "is-active" : ""}`}
                        onClick={() => setStatus("WATCHLIST")}
                    >
                        Watchlist
                    </button>
                </div>

                {status === "WATCHED" && (
                    <div className="field">
                        <label className="field__label">Your rating</label>
                        <StarRating value={rating} onChange={setRating} size="lg"/>
                    </div>
                )}

                <div className="field">
                    <label className="field__label" htmlFor="review">
                        {status === "WATCHED" ? "Review" : "Note"} <span className="field__opt">optional</span>
                    </label>
                    <textarea
                        id="review"
                        className="field__textarea"
                        rows={4}
                        placeholder={status === "WATCHED" ? "What did you think?" : "Why do you want to see it?"}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>

                {error && <p className="dialog__error">{error}</p>}

                <div className="dialog__actions">
                    <button className="btn btn--ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button className="btn btn--accent" onClick={submit} disabled={saving}>
                        {saving ? "Saving…" : film.id ? "Update" : "Save to diary"}
                    </button>
                </div>
            </div>
        </div>
    );
}
