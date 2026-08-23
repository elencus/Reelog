const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
let authToken = localStorage.getItem("token") || null;

export function setToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
}

export function getToken() {
    return authToken;
}

function authHeaders() {
    return authToken ? {Authorization:`Bearer ${authToken}`} : {};
}

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


export function getMovieDetails(tmdbId) {
    return fetch(`${BASE}/api/movies/details/${tmdbId}`).then(handle);
}

export function listMovies(status = "ALL") {
    return fetch(`${BASE}/api/movies?status=${status}`, {
        headers: { ...authHeaders() },
    }).then(handle);
}

export function addMovie(payload) {
    return fetch(`${BASE}/api/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
    }).then(handle);
}

export function updateMovie(id, payload) {
    return fetch(`${BASE}/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
    }).then(handle);
}

export function deleteMovie(id) {
    return fetch(`${BASE}/api/movies/${id}`, { method: "DELETE",
        headers: { ...authHeaders() },
    }).then(handle);
}

export function getSimilar(id) {
    return fetch(`${BASE}/api/movies/${id}/similar`, {
        headers: { ...authHeaders() },
    }).then(handle);
}

export function register(payload) {
    return fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).then(handle);
}

export function login(payload) {
    return fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    }).then(handle);
}

