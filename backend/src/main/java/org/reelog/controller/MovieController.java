package org.reelog.controller;


import jakarta.validation.Valid;
import org.reelog.dto.AddMovieRequest;
import org.reelog.dto.MovieDetails;
import org.reelog.dto.SearchResult;
import org.reelog.dto.UpdateMovieRequest;
import org.reelog.model.Movie;
import org.reelog.service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService service;

    public MovieController(MovieService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<SearchResult> search(
            @RequestParam("q") String query) {
        return service.search(query);
    }

    @GetMapping("/details/{tmdbId}")
    public MovieDetails details(@PathVariable Long tmdbId){
        return service.getDetails(tmdbId);
    }

    @GetMapping
    public List<Movie> list(
            @RequestParam(value = "status", required = false)
            String status) {
        return service.list(status);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Movie add(@Valid @RequestBody AddMovieRequest request) {
        return service.add(request);
    }

    @PutMapping("/{id}")
    public Movie update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMovieRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/similar")
    public List<SearchResult> similar(@PathVariable Long id) {
        return service.similarTo(id);
    }
}
