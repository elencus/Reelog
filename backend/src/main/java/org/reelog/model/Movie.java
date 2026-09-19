package org.reelog.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "movies", uniqueConstraints = @UniqueConstraint(columnNames = {"tmdb_id", "user_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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

    private Boolean favorite = false;
    private Integer rewatchCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}
