package org.reelog.dto;

import java.util.List;

public record MovieDetails (
        Long tmdbId,
        String title,
        String year,
        String posterUrl,
        String overview,
        String director,
        String genres,
        Integer runtime,
        Double tmdbRating,
        List<String> cast,
        String trailerKey
) {}
