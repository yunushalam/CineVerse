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

    @Builder.Default
    @Column(name = "contentType")
    private String contentType = "MOVIE";

}
