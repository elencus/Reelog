package org.reelog.dto;

public record SearchResult(
        Long tmdbId,
        String title,
        String year,
        String posterUrl,
        Double tmdbRating,
        String overview
){}
