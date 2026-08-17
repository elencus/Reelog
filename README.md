# Reelog 

A personal film diary. Search films via the **TMDB API**, log them with a star
rating and a short review, and browse your collection — split into *Watched* and
*Watchlist*.

## Stack

| Service    | Tech                          | Port |
|------------|-------------------------------|------|
| Frontend   | React + Vite                  | 5173 |
| Backend    | Spring Boot (Java 17), REST   | 8080 |
| Database   | PostgreSQL                    | 5432 |

TMDB is used only as an external source of film metadata (titles, posters,
directors). Your own entries live in PostgreSQL.

## Features

- Live film search through the TMDB API
- Log films with a 1–5 star rating, a review, and watched/watchlist status
- Browse your diary with filters
- Full CRUD (add, view, update, delete)

## Getting started

### 1. Get a TMDB token
Create an account at [themoviedb.org](https://www.themoviedb.org/), go to
**Settings → API**, and copy your **API Read Access Token**.

### 2. Start PostgreSQL
```bash
docker run --name filmlog-db -e POSTGRES_DB=filmlog \
  -e POSTGRES_USER=filmlog -e POSTGRES_PASSWORD=filmlog \
  -p 5432:5432 -d postgres:16
```

### 3. Run the backend
Create `backend/.env` with your token:
TMDB_TOKEN=your_token_here
DB_HOST=localhost
DB_NAME=filmlog
DB_USER=filmlog
DB_PASSWORD=filmlog

Then run the Spring Boot app (from your IDE, or `./mvnw spring-boot:run`).
The API starts on http://localhost:8080.

### 4. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## API

| Method | Path                     | Purpose                            |
|--------|--------------------------|------------------------------------|
| GET    | `/api/movies/search?q=`  | Search films via TMDB              |
| GET    | `/api/movies?status=`    | List diary (ALL/WATCHED/WATCHLIST) |
| POST   | `/api/movies`            | Add a film                         |
| PUT    | `/api/movies/{id}`       | Update rating / review / status    |
| DELETE | `/api/movies/{id}`       | Remove a film                      |

## Notes

Secrets (`.env`) are git-ignored and never committed. The frontend only stores a
public API base URL, never secrets.
