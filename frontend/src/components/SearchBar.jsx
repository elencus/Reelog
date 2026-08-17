import { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSearch, onClear }) {
    const [value, setValue] = useState("");
    const timer = useRef(null);

    useEffect(() => {
        if (timer.current) clearTimeout(timer.current);
        const q = value.trim();
        if (!q) {
            onClear();
            return;
        }
        timer.current = setTimeout(() => onSearch(q), 350);
        return () => clearTimeout(timer.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className="searchbar">
            <svg className="searchbar__icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
                className="searchbar__input"
                type="text"
                placeholder="Search a film to log…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Search films"
            />
            {value && (
                <button className="searchbar__clear" onClick={() => setValue("")} aria-label="Clear search">
                    ×
                </button>
            )}
        </div>
    );
}
