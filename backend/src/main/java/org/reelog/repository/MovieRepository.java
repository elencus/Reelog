package org.reelog.repository;

import org.reelog.model.Movie;
import org.reelog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByUserOrderByIdDesc(User user);

    List<Movie> findByUserAndStatusOrderByIdDesc(User user, String status);

    boolean existsByUserAndTmdbId(User user, Long tmdbId);

    Optional<Movie> findByIdAndUser(Long id, User user);
}