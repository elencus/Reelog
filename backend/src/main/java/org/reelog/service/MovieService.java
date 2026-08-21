package org.reelog.service;

import org.reelog.dto.*;
import org.reelog.model.Movie;
import org.reelog.repository.MovieRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final RestClient tmdb;
    private final MovieRepository repository;
    private final String imageBaseUrl;

    public MovieService(RestClient tmdbRestClient,
                        MovieRepository repository,
                        @Value("${tmdb.image-base-url}") String imageBaseUrl) {
        this.tmdb = tmdbRestClient;
        this.repository = repository;
        this.imageBaseUrl = imageBaseUrl;
    }

    public List<SearchResult> search(String query){
        if (query == null || query.isBlank()) {
            return List.of();
        }

        TmdbSearchResponse response = tmdb.get()
                .uri(uri -> uri.path("/search/movie")
                        .queryParam("query", query)
                        .queryParam("include_adult", false)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);

        if (response == null || response.results() == null) {
            return List.of();
        }

        return response.results().stream()
                .map(m -> new SearchResult(
                        m.id(),
                        m.title(),
                        year(m.releaseDate()),
                        posterUrl(m.posterPath()),
                        m.voteAverage(),
                        m.overview()))
                .collect(Collectors.toList());
    }

    public Movie add(AddMovieRequest request){
        if (repository.existsByTmdbId(request.tmdbId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This film is already in your diary");
        }

        TmdbMovie details = fetchDetails(request.tmdbId());

        Movie movie = new Movie();
        movie.setTmdbId(details.id());
        movie.setTitle(details.title());
        movie.setReleaseYear(year(details.releaseDate()));
        movie.setOverview(details.overview());
        movie.setPosterUrl(posterUrl(details.posterPath()));
        movie.setTmdbRating(details.voteAverage());
        movie.setRuntime(details.runtime());
        movie.setGenres(joinGenres(details));
        movie.setDirector(findDirector(details));

        applyUserFields(movie, request.rating(), request.review(), request.status());

        return repository.save(movie);
    }

    public List<Movie> list(String status) {
        if (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) {
            return repository.findAllByOrderByIdDesc();
        }
        return repository.findByStatusOrderByIdDesc(status.toUpperCase());
    }

    public Movie update(Long id, UpdateMovieRequest request){
        Movie movie = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Film not found"));
        applyUserFields(movie, request.rating(), request.review(), request.status());

        if (request.favorite() != null) {
            movie.setFavorite(request.favorite());
        }

        if (request.rewatchCount() != null){
            movie.setRewatchCount(request.rewatchCount());
        }

        return repository.save(movie);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Film not found");
        }
        repository.deleteById(id);
    }


    private TmdbMovie fetchDetails(Long tmdbId) {
        TmdbMovie details = tmdb.get()
                .uri(uri -> uri.path("/movie/{id}")
                        .queryParam("append_to_response", "credits")
                        .build(tmdbId))
                .retrieve()
                .body(TmdbMovie.class);

        if (details == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TMDB has no film with id " + tmdbId);
        }
        return details;
    }

    private void applyUserFields(Movie movie, Integer rating, String review, String status) {
        String normalized = status.toUpperCase();
        movie.setStatus(normalized);

        if ("WATCHED".equals(normalized)) {
            movie.setRating(rating);
            movie.setReviewText(review);
            if (movie.getWatchedDate() == null) {
                movie.setWatchedDate(LocalDate.now());
            }
        } else {
            movie.setRating(null);
            movie.setReviewText(review);
            movie.setWatchedDate(null);
        }
    }

    private String year(String releaseDate) {
        if (releaseDate == null || releaseDate.length() < 4) {
            return null;
        }
        return releaseDate.substring(0, 4);
    }

    private String posterUrl(String posterPath) {
        return posterPath != null ? imageBaseUrl + posterPath: null;
    }

    private String joinGenres(TmdbMovie details) {
        if (details.genres() == null || details.genres().isEmpty()) {
            return null;
        }
        return  details.genres().stream()
                .map(TmdbMovie.Genre::name)
                .collect(Collectors.joining(", "));
    }

    private String findDirector(TmdbMovie details){
        if (details.credits() == null || details.credits().crew() == null) {
            return null;
        }

        return details.credits().crew().stream()
                .filter(c -> "Director".equals(c.job()))
                .map(TmdbMovie.Crew::name)
                .findFirst()
                .orElse(null);
    }
}
