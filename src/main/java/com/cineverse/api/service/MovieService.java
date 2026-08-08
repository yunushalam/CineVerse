package com.cineverse.api.service;

import com.cineverse.api.dto.MovieDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MovieService {

    MovieDTO createMovie(MovieDTO movieDTO);

    List<MovieDTO> getAllMovies();

    Page<MovieDTO> getAllMoviesPagedAndSorted(int page, int size, String sortBy, String sortDir);

    MovieDTO getMovieById(Long id);

    MovieDTO updateMovie(Long id, MovieDTO movieDTO);

    void deleteMovie(Long id);

    List<MovieDTO> getMoviesByGenre(String genre);

    List<MovieDTO> getMoviesByLanguage(String language);

    List<MovieDTO> getMoviesByDirector(String director);

    List<MovieDTO> getMoviesByRating(Double rating);

    List<MovieDTO> getMoviesByYear(Integer year);

    List<MovieDTO> searchMoviesByTitle(String title);

    List<MovieDTO> getTopRatedMovies();

    List<MovieDTO> getLatestMovies();

    long getMovieCountByGenre(String genre);
}
