# 🎬 Reelog

A personal film diary. Search films through **TMDB**, log them with star ratings
and reviews, track what you've watched and what's next, and get recommendations
based on your taste. Each user has their own private diary.

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

---

## Features

- **TMDB search** — find any film and log it in seconds
- **Personal diary** — rate (1–5★), review, and mark films as *watched* or *watchlist*
- **Rich detail view** — poster, cast, director, genres, and an embedded trailer
- **Recommendations** — "similar films" powered by TMDB
- **Favorites & rewatch tracking** — heart films you love, count rewatches
- **Stats dashboard** — films watched, average rating, hours logged, top genre
- **Search, sort & filter** your diary, paginated for larger collections
- **User accounts** — JWT authentication; every diary is private to its owner
- **Guest mode** — browse and search without an account; sign in to save

---

## Tech stack

| Layer     | Technology                                       |
|-----------|--------------------------------------------------|
| Frontend  | React 18, Vite                                   |
| Backend   | Spring Boot 3.3 (Java 17), Spring Security, JWT  |
| Database  | PostgreSQL 16                                    |
| External  | TMDB API                                         |

The frontend, backend, and database run as three separate services. TMDB is used
only as a source of film metadata; all user data lives in PostgreSQL.

---

## Getting started

### Prerequisites

- Java 17+, Maven
- Node.js 18+
- Docker (for PostgreSQL)
- A free [TMDB API Read Access Token](https://www.themoviedb.org/settings/api)

### 1. Start the database

```bash
docker run --name filmlog-db -e POSTGRES_DB=filmlog \
  -e POSTGRES_USER=filmlog -e POSTGRES_PASSWORD=filmlog \
  -p 5432:5432 -d postgres:16
```

### 2. Run the backend

Create `backend/.env` (git-ignored):
- TMDB_TOKEN=your_tmdb_read_access_token
- DB_HOST=localhost
- DB_NAME=filmlog
- DB_USER=filmlog
- DB_PASSWORD=filmlog
- JWT_SECRET=your_long_random_secret_at_least_64_characters_long_for_security

Then run the Spring Boot app from your IDE, or:

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Project structure

```
Reelog/
├── backend/          Spring Boot API (auth, movies, TMDB client, JWT security)
├── frontend/         React + Vite UI
└── docker-compose.yml
```

## Security notes

Passwords are hashed with BCrypt. Secrets (`.env`) are never committed. The
frontend stores only a public API base URL and the user's own JWT.