const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function handle(res) {
    if (!res.ok){
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            if (body.message) message = body.message;
            else if (body.error) message = body.error;
        } catch {

        }
        throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
}

export function searchTmdb(query) {
    return fetch(`${BASE}/api/movies/search?q=${encodeURIComponent(query)}`).then(handle);
}

export function listMovies(status = "ALL") {
    return fetch(`${BASE}/api/movies?status=${status}`).then(handle);
}

export function addMovie(payload) {
    return fetch(`${BASE}/api/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).then(handle);
}

export function updateMovie(id, payload) {
    return fetch(`${BASE}/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).then(handle);
}

export function deleteMovie(id) {
    return fetch(`${BASE}/api/movies/${id}`, { method: "DELETE"}).then(handle);
}

