package com.cineverse.api.service;

import com.cineverse.api.dto.MovieDTO;
import com.cineverse.api.dto.tmdb.TmdbMovieDTO;
import com.cineverse.api.entity.Movie;
import com.cineverse.api.exception.MovieNotFoundException;
import com.cineverse.api.repository.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;

    // Constructor Injection as explicitly required by document specs
    public MovieServiceImpl(MovieRepository movieRepository, TmdbService tmdbService) {
        this.movieRepository = movieRepository;
        this.tmdbService = tmdbService;
    }

    @Override
    public MovieDTO createMovie(MovieDTO movieDTO) {
        Movie movie = mapToEntity(movieDTO);
        Movie savedMovie = movieRepository.save(movie);
        return mapToDTO(savedMovie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieDTO> getAllMoviesPagedAndSorted(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Movie> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        return mapToDTO(movie);
    }

    @Override
    public MovieDTO updateMovie(Long id, MovieDTO movieDTO) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));

        existingMovie.setTitle(movieDTO.getTitle());
        existingMovie.setGenre(movieDTO.getGenre());
        existingMovie.setLanguage(movieDTO.getLanguage());
        existingMovie.setReleaseYear(movieDTO.getReleaseYear());
        existingMovie.setRating(movieDTO.getRating());
        existingMovie.setDuration(movieDTO.getDuration());
        existingMovie.setDirector(movieDTO.getDirector());
        existingMovie.setVideoUrl(movieDTO.getVideoUrl());
        existingMovie.setPosterUrl(movieDTO.getPosterUrl());

        Movie updatedMovie = movieRepository.save(existingMovie);
        return mapToDTO(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
        movieRepository.delete(movie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getMoviesByLanguage(String language) {
        return movieRepository.findByLanguageIgnoreCase(language)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getMoviesByDirector(String director) {
        return movieRepository.findByDirectorIgnoreCase(director)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getMoviesByRating(Double rating) {
        return movieRepository.findByRatingGreaterThanEqual(rating)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getMoviesByYear(Integer year) {
        return movieRepository.findByReleaseYear(year)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> searchMoviesByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getTopRatedMovies() {
        return movieRepository.findTop5ByOrderByRatingDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieDTO> getLatestMovies() {
        return movieRepository.findTop5ByOrderByReleaseYearDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getMovieCountByGenre(String genre) {
        return movieRepository.countByGenreIgnoreCase(genre);
    }

    @Override
    public MovieDTO importFromTmdb(Long tmdbId) {
        TmdbMovieDTO tmdbMovie = tmdbService.getMovieDetails(tmdbId);
        
        Movie movie = new Movie();
        movie.setTitle(tmdbMovie.getTitle() != null ? tmdbMovie.getTitle() : tmdbMovie.getOriginalTitle());
        
        String genre = "Unknown";
        if (tmdbMovie.getGenres() != null && !tmdbMovie.getGenres().isEmpty()) {
            genre = tmdbMovie.getGenres().get(0).getName();
        }
        movie.setGenre(genre);
        
        movie.setLanguage(tmdbMovie.getOriginalLanguage() != null ? tmdbMovie.getOriginalLanguage() : "en");
        
        Integer releaseYear = 2024;
        if (tmdbMovie.getReleaseDate() != null && tmdbMovie.getReleaseDate().length() >= 4) {
            try {
                releaseYear = Integer.parseInt(tmdbMovie.getReleaseDate().substring(0, 4));
            } catch (NumberFormatException ignored) {}
        }
        movie.setReleaseYear(releaseYear);
        
        movie.setRating(tmdbMovie.getVoteAverage() != null ? Math.round(tmdbMovie.getVoteAverage() * 10.0) / 10.0 : 0.0);
        movie.setDuration(tmdbMovie.getRuntime() != null && tmdbMovie.getRuntime() > 0 ? tmdbMovie.getRuntime() : 120);
        movie.setDirector("Unknown Director"); // TMDB requires a separate /credits call for director
        
        movie.setVideoUrl(""); 
        if (tmdbMovie.getPosterPath() != null) {
            movie.setPosterUrl("https://image.tmdb.org/t/p/w500" + tmdbMovie.getPosterPath());
        }
        
        Movie savedMovie = movieRepository.save(movie);
        return mapToDTO(savedMovie);
    }

    // Helper mapper methods
    private MovieDTO mapToDTO(Movie movie) {
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setGenre(movie.getGenre());
        dto.setLanguage(movie.getLanguage());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setRating(movie.getRating());
        dto.setDuration(movie.getDuration());
        dto.setDirector(movie.getDirector());
        dto.setVideoUrl(movie.getVideoUrl());
        dto.setPosterUrl(movie.getPosterUrl());
        return dto;
    }

    private Movie mapToEntity(MovieDTO dto) {
        Movie movie = new Movie();
        movie.setId(dto.getId());
        movie.setTitle(dto.getTitle());
        movie.setGenre(dto.getGenre());
        movie.setLanguage(dto.getLanguage());
        movie.setReleaseYear(dto.getReleaseYear());
        movie.setRating(dto.getRating());
        movie.setDuration(dto.getDuration());
        movie.setDirector(dto.getDirector());
        movie.setVideoUrl(dto.getVideoUrl());
        movie.setPosterUrl(dto.getPosterUrl());
        return movie;
    }
}
