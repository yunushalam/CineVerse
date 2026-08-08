package com.cineverse.api.repository;

import com.cineverse.api.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByLanguageIgnoreCase(String language);

    List<Movie> findByDirectorIgnoreCase(String director);

    List<Movie> findByRatingGreaterThanEqual(Double rating);

    List<Movie> findByReleaseYear(Integer releaseYear);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findTop5ByOrderByRatingDesc();

    List<Movie> findTop5ByOrderByReleaseYearDesc();

    long countByGenreIgnoreCase(String genre);
}
