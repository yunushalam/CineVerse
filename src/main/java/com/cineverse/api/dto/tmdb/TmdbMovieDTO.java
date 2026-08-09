package com.cineverse.api.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TmdbMovieDTO {

    private Long id;
    
    private String title;
    
    @JsonProperty("original_title")
    private String originalTitle;
    
    private String overview;
    
    @JsonProperty("release_date")
    private String releaseDate;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("genre_ids")
    private List<Integer> genreIds;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    @JsonProperty("runtime")
    private Integer runtime;
    
    @JsonProperty("original_language")
    private String originalLanguage;
    
    private List<Genre> genres;
    
    @Data
    public static class Genre {
        private Integer id;
        private String name;
    }
}
