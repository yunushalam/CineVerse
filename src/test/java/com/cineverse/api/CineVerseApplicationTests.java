package com.cineverse.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CineVerseApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void testGetAllMovies() throws Exception {
        mockMvc.perform(get("/movies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(5))));
    }

    @Test
    void testGetMovieById() throws Exception {
        mockMvc.perform(get("/movies/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Inception")));
    }

    @Test
    void testGetMovieByInvalidIdThrows404() throws Exception {
        mockMvc.perform(get("/movies/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("Movie not found")));
    }

    @Test
    void testCreateMovie() throws Exception {
        String jsonPayload = """
                {
                    "title": "Dune: Part Two",
                    "genre": "Sci-Fi",
                    "language": "English",
                    "releaseYear": 2024,
                    "rating": 8.7,
                    "duration": 166,
                    "director": "Denis Villeneuve"
                }
                """;

        mockMvc.perform(post("/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Dune: Part Two")));
    }

    @Test
    void testCreateMovieValidationError() throws Exception {
        String invalidJsonPayload = """
                {
                    "title": "",
                    "genre": "Sci-Fi",
                    "language": "English",
                    "releaseYear": 1800,
                    "rating": 15.0,
                    "duration": 0,
                    "director": ""
                }
                """;

        mockMvc.perform(post("/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.fieldErrors.title", is("Title is required")))
                .andExpect(jsonPath("$.fieldErrors.releaseYear", is("Release year must be at least 1900")))
                .andExpect(jsonPath("$.fieldErrors.rating", is("Rating must be at most 10.0")))
                .andExpect(jsonPath("$.fieldErrors.duration", is("Duration must be at least 1 minute")))
                .andExpect(jsonPath("$.fieldErrors.director", is("Director is required")));
    }

    @Test
    void testFilterByGenre() throws Exception {
        mockMvc.perform(get("/movies/genre/Sci-Fi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void testSearchTitleBonus() throws Exception {
        mockMvc.perform(get("/movies/search").param("title", "Avengers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data[0].title", containsString("Avengers")));
    }
}
