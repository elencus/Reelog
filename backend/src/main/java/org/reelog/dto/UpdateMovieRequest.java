package org.reelog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateMovieRequest (
        @Min(1) @Max(5) Integer rating,
        String review,

        @NotNull
        @Pattern(regexp = "WATCHED|WATCHLIST", message = "status must be WATCHED  or WATCHLIST")
        String status,
        Boolean favorite,
        Integer rewatchCount
) {}
