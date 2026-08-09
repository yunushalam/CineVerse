package com.cineverse.api.service;

import com.cineverse.api.dto.tmdb.TmdbMovieDTO;
import com.cineverse.api.dto.tmdb.TmdbSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TmdbService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api-key}")
    private String apiKey;

    @Value("${tmdb.base-url}")
    private String baseUrl;

    public TmdbService() {
        this.restTemplate = new RestTemplate();
    }

    public TmdbSearchResponse searchMovies(String query) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("TMDB API Key is not configured in application.properties");
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .path("/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .toUriString();

        return restTemplate.getForObject(url, TmdbSearchResponse.class);
    }

    public TmdbMovieDTO getMovieDetails(Long tmdbId) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("TMDB API Key is not configured in application.properties");
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .path("/movie/{id}")
                .queryParam("api_key", apiKey)
                .buildAndExpand(tmdbId)
                .toUriString();

        return restTemplate.getForObject(url, TmdbMovieDTO.class);
    }
}
