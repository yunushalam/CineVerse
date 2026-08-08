package com.cineverse.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Data Transfer Object for Movie requests and responses")
public class MovieDTO {

    @Schema(description = "Auto-generated unique identifier of the movie", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Schema(description = "Title of the movie", example = "Inception", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank(message = "Genre is required")
    @Schema(description = "Genre of the movie", example = "Sci-Fi", requiredMode = Schema.RequiredMode.REQUIRED)
    private String genre;

    @NotBlank(message = "Language is required")
    @Schema(description = "Original language of the movie", example = "English", requiredMode = Schema.RequiredMode.REQUIRED)
    private String language;

    @NotNull(message = "Release year is required")
    @Min(value = 1900, message = "Release year must be at least 1900")
    @Schema(description = "Release year of the movie (>= 1900)", example = "2010", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer releaseYear;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    @Schema(description = "Movie rating between 0.0 and 10.0", example = "8.8", requiredMode = Schema.RequiredMode.REQUIRED)
    private Double rating;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Schema(description = "Duration of the movie in minutes (>= 1)", example = "148", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer duration;

    @NotBlank(message = "Director is required")
    @Schema(description = "Director of the movie", example = "Christopher Nolan", requiredMode = Schema.RequiredMode.REQUIRED)
    private String director;

    @Schema(description = "Video or Trailer URL of the movie", example = "https://www.youtube.com/embed/YoHD9XEInc0")
    private String videoUrl;

    @Schema(description = "Poster Image URL of the movie", example = "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg")
    private String posterUrl;

    // Explicit Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}
