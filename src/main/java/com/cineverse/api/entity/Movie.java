package com.cineverse.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Genre is required")
    @Column(nullable = false)
    private String genre;

    @NotBlank(message = "Language is required")
    @Column(nullable = false)
    private String language;

    @Min(value = 1900, message = "Release year must be at least 1900")
    @Column(name = "release_year", nullable = false)
    private Integer releaseYear;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    @Column(nullable = false)
    private Double rating;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Column(nullable = false)
    private Integer duration;

    @NotBlank(message = "Director is required")
    @Column(nullable = false)
    private String director;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "content_type")
    private String contentType = "MOVIE";

    public Movie() {
    }

    public Movie(String title, String genre, String language, Integer releaseYear, Double rating, Integer duration, String director) {
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.duration = duration;
        this.director = director;
    }

    public Movie(String title, String genre, String language, Integer releaseYear, Double rating, Integer duration, String director, String videoUrl, String posterUrl) {
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.duration = duration;
        this.director = director;
        this.videoUrl = videoUrl;
        this.posterUrl = posterUrl;
        this.contentType = "MOVIE";
    }

    public Movie(String title, String genre, String language, Integer releaseYear, Double rating, Integer duration, String director, String videoUrl, String posterUrl, String contentType) {
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.duration = duration;
        this.director = director;
        this.videoUrl = videoUrl;
        this.posterUrl = posterUrl;
        this.contentType = contentType;
    }

    public Movie(Long id, String title, String genre, String language, Integer releaseYear, Double rating, Integer duration, String director, String videoUrl, String posterUrl) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.duration = duration;
        this.director = director;
        this.videoUrl = videoUrl;
        this.posterUrl = posterUrl;
        this.contentType = "MOVIE";
    }

    public Movie(Long id, String title, String genre, String language, Integer releaseYear, Double rating, Integer duration, String director, String videoUrl, String posterUrl, String contentType) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.releaseYear = releaseYear;
        this.rating = rating;
        this.duration = duration;
        this.director = director;
        this.videoUrl = videoUrl;
        this.posterUrl = posterUrl;
        this.contentType = contentType;
    }

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

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}
