package org.reelog.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long tmdbId;

    @Column(nullable = false)
    private String title;

    private String releaseYear;
    private String director;
    private String genres;
    private Integer runtime;

    @Column(length = 3000)
    private String overview;
    private String posterUrl;
    private Double tmdbRating;
    private Integer rating;

    @Column(length = 3000)
    private String reviewText;

    @Column(nullable = false)
    private String status;
    private LocalDate watchedDate;
}
