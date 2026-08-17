package org.reelog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbMovie (

        Long id,
        String title,
        String overview,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("vote_average") Double voteAverage,
        Integer runtime,
        List<Genre> genres,
        Credits credits
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Genre(String name) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Credits(List<Crew> crew) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Crew(String name, String job) {}
}
