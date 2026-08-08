package com.cineverse.api.controller;

import com.cineverse.api.dto.ApiResponse;
import com.cineverse.api.dto.MovieDTO;
import com.cineverse.api.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@Tag(name = "Movie Management", description = "Endpoints for creating, reading, updating, deleting, and searching movies in CineVerse")
public class MovieController {

    private final MovieService movieService;

    // Constructor Injection as explicitly required by document specs
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping
    @Operation(summary = "Create a new movie", description = "Adds a new movie to the CineVerse database with valid field parameters.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Movie created successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload / Validation error",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<ApiResponse<MovieDTO>> createMovie(@Valid @RequestBody MovieDTO movieDTO) {
        MovieDTO createdMovie = movieService.createMovie(movieDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Movie created successfully", createdMovie),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    @Operation(summary = "Get all movies (supports optional pagination and sorting)",
            description = "Retrieves all movies. If page and size query parameters are passed, returns paged & sorted results. E.g., /movies?page=0&size=5&sortBy=rating")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved movies list or page")
    })
    public ResponseEntity<ApiResponse<?>> getAllMovies(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        if (page != null && size != null) {
            Page<MovieDTO> moviePage = movieService.getAllMoviesPagedAndSorted(page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Movies page retrieved successfully", moviePage));
        } else if (!"id".equals(sortBy)) {
            Page<MovieDTO> moviePage = movieService.getAllMoviesPagedAndSorted(0, 1000, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Sorted movies retrieved successfully", moviePage.getContent()));
        } else {
            List<MovieDTO> movies = movieService.getAllMovies();
            return ResponseEntity.ok(ApiResponse.success("All movies retrieved successfully", movies));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID", description = "Fetch details of a single movie by its unique database ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Movie retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<ApiResponse<MovieDTO>> getMovieById(
            @Parameter(description = "ID of the movie to fetch", required = true) @PathVariable Long id) {
        MovieDTO movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success("Movie retrieved successfully", movie));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update movie by ID", description = "Updates an existing movie by its unique database ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Movie updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<ApiResponse<MovieDTO>> updateMovie(
            @Parameter(description = "ID of the movie to update", required = true) @PathVariable Long id,
            @Valid @RequestBody MovieDTO movieDTO) {
        MovieDTO updatedMovie = movieService.updateMovie(id, movieDTO);
        return ResponseEntity.ok(ApiResponse.success("Movie updated successfully", updatedMovie));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete movie by ID", description = "Deletes a movie from database by its unique ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Movie deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteMovie(
            @Parameter(description = "ID of the movie to delete", required = true) @PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Movie deleted successfully", null));
    }

    @GetMapping("/genre/{genre}")
    @Operation(summary = "Get movies by genre", description = "Retrieves all movies matching the given genre.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getMoviesByGenre(@PathVariable String genre) {
        List<MovieDTO> movies = movieService.getMoviesByGenre(genre);
        return ResponseEntity.ok(ApiResponse.success("Movies retrieved by genre", movies));
    }

    @GetMapping("/language/{language}")
    @Operation(summary = "Get movies by language", description = "Retrieves all movies matching the given language.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getMoviesByLanguage(@PathVariable String language) {
        List<MovieDTO> movies = movieService.getMoviesByLanguage(language);
        return ResponseEntity.ok(ApiResponse.success("Movies retrieved by language", movies));
    }

    @GetMapping("/director/{director}")
    @Operation(summary = "Get movies by director", description = "Retrieves all movies directed by the specified director.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getMoviesByDirector(@PathVariable String director) {
        List<MovieDTO> movies = movieService.getMoviesByDirector(director);
        return ResponseEntity.ok(ApiResponse.success("Movies retrieved by director", movies));
    }

    @GetMapping("/rating/{rating}")
    @Operation(summary = "Get movies by minimum rating", description = "Retrieves all movies with rating greater than or equal to the specified value.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getMoviesByRating(@PathVariable Double rating) {
        List<MovieDTO> movies = movieService.getMoviesByRating(rating);
        return ResponseEntity.ok(ApiResponse.success("Movies retrieved by rating threshold", movies));
    }

    @GetMapping("/year/{year}")
    @Operation(summary = "Get movies by release year", description = "Retrieves all movies released in the specified year.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getMoviesByYear(@PathVariable Integer year) {
        List<MovieDTO> movies = movieService.getMoviesByYear(year);
        return ResponseEntity.ok(ApiResponse.success("Movies retrieved by release year", movies));
    }

    // -------------------------------------------------------------
    // BONUS ENDPOINTS
    // -------------------------------------------------------------

    @GetMapping("/search")
    @Operation(summary = "[Bonus] Search movies by title", description = "Searches for movies containing the title keyword (case-insensitive).")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> searchMoviesByTitle(
            @RequestParam(required = true) String title) {
        List<MovieDTO> movies = movieService.searchMoviesByTitle(title);
        return ResponseEntity.ok(ApiResponse.success("Search results for title: " + title, movies));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "[Bonus] Get top-rated movies", description = "Retrieves the top 5 highest-rated movies in the database.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getTopRatedMovies() {
        List<MovieDTO> movies = movieService.getTopRatedMovies();
        return ResponseEntity.ok(ApiResponse.success("Top rated movies retrieved", movies));
    }

    @GetMapping("/latest")
    @Operation(summary = "[Bonus] Get latest movies", description = "Retrieves the 5 most recently released movies.")
    public ResponseEntity<ApiResponse<List<MovieDTO>>> getLatestMovies() {
        List<MovieDTO> movies = movieService.getLatestMovies();
        return ResponseEntity.ok(ApiResponse.success("Latest movies retrieved", movies));
    }

    @GetMapping("/count/genre/{genre}")
    @Operation(summary = "[Bonus] Get total movie count by genre", description = "Returns total number of movies available in a specific genre.")
    public ResponseEntity<ApiResponse<Long>> getMovieCountByGenre(@PathVariable String genre) {
        long count = movieService.getMovieCountByGenre(genre);
        return ResponseEntity.ok(ApiResponse.success("Total movies count for genre: " + genre, count));
    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload local media file", description = "Uploads a local downloaded video or poster image file to the server.")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));
        }

        try {
            java.io.File uploadDir = new java.io.File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String cleanFilename = System.currentTimeMillis() + "_" + (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_") : "media");
            java.nio.file.Path targetPath = uploadDir.toPath().resolve(cleanFilename);

            java.nio.file.Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + cleanFilename;
            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", fileUrl));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to store file: " + e.getMessage()));
        }
    }
}
