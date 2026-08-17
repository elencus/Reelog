export default function Stats({ movies }) {
    const watched = movies.filter((m) => m.status === "WATCHED");

    const rated = watched.filter((m) => m.rating);
    const avgRating = rated.length
        ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(1)
        : "—";

    const totalMinutes = watched.reduce((sum, m) => sum + (m.runtime || 0), 0);
    const hours = Math.floor(totalMinutes / 60);

    const genreCount = {};
    watched.forEach((m) => {
        if (m.genres) {
            m.genres.split(",").forEach((g) => {
                const genre = g.trim();
                if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
        }
    });
    const topGenre =
        Object.keys(genreCount).length
            ? Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0][0]
            : "—";

    const stats = [
        { label: "Films watched", value: watched.length },
        { label: "Avg rating", value: avgRating === "—" ? "—" : `${avgRating}★` },
        { label: "Hours watched", value: hours },
        { label: "Top genre", value: topGenre },
    ];

    return (
        <div className="stats">
            {stats.map((s) => (
                <div key={s.label} className="stat">
                    <div className="stat__value">{s.value}</div>
                    <div className="stat__label">{s.label}</div>
                </div>
            ))}
        </div>
    );
}