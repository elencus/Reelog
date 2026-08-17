import { useState } from "react";

function Star({ filled }) {
    return (
        <svg viewBox="0 0 24 24" className={`star ${filled ? "star--on" : ""}`} aria-hidden="true">
            <path d="M12 2.5l2.9 6.03 6.6.9-4.8 4.62 1.16 6.55L12 18.6l-5.86 3l1.16-6.55L2.5 9.43l6.6-.9L12 2.5z" />
        </svg>
    );
}

export default function StarRating({ value = 0, onChange, size = "md" }) {
    const [hover, setHover] = useState(0);
    const interactive = typeof onChange === "function";
    const shown = hover || value;

    if (!interactive) {
        return (
            <div className={`stars stars--${size}`} aria-label={`${value} of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} filled={n <= value} />
                ))}
            </div>
        );
    }

    return (
        <div className={`stars stars--interactive stars--${size}`} role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    type="button"
                    key={n}
                    className="star-btn"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    aria-checked={value === n}
                    role="radio"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(n)}
                >
                    <Star filled={n <= shown} />
                </button>
            ))}
        </div>
    );
}
