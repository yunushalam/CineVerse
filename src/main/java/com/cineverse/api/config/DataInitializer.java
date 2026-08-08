package com.cineverse.api.config;

import com.cineverse.api.entity.Movie;
import com.cineverse.api.entity.User;
import com.cineverse.api.repository.MovieRepository;
import com.cineverse.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(MovieRepository movieRepository,
                                           UserRepository userRepository,
                                           PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin & User Accounts
            if (userRepository.count() == 0) {
                userRepository.saveAll(List.of(
                        new User("admin", "admin@cineverse.com", passwordEncoder.encode("adminpassword"), "ROLE_ADMIN"),
                        new User("user", "user@cineverse.com", passwordEncoder.encode("userpassword"), "ROLE_USER")
                ));
            }

            // Seed Sample Movies, Trailers, and Songs
            if (movieRepository.count() == 0) {
                movieRepository.saveAll(List.of(
                        Movie.builder().title("Inception").genre("Sci-Fi").language("English").releaseYear(2010).rating(8.8).duration(148).director("Christopher Nolan").videoUrl("https://www.youtube.com/embed/YoHD9XEInc0").posterUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80").contentType("MOVIE").build(),
                        Movie.builder().title("The Dark Knight").genre("Action").language("English").releaseYear(2008).rating(9.0).duration(152).director("Christopher Nolan").videoUrl("https://www.youtube.com/embed/EXeTwQWrcwY").posterUrl("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80").contentType("MOVIE").build(),
                        Movie.builder().title("Dune: Part Two (Official Trailer)").genre("Sci-Fi").language("English").releaseYear(2024).rating(0.0).duration(3).director("Denis Villeneuve").videoUrl("https://www.youtube.com/embed/Way9Dexny3w").posterUrl("https://images.unsplash.com/photo-1616012481717-3bf79471180b?auto=format&fit=crop&w=600&q=80").contentType("TRAILER").build(),
                        Movie.builder().title("GTA VI (Trailer 1)").genre("Action").language("English").releaseYear(2023).rating(0.0).duration(2).director("Rockstar Games").videoUrl("https://www.youtube.com/embed/QdBZY2fkU-0").posterUrl("https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=600&q=80").contentType("TRAILER").build(),
                        Movie.builder().title("Blinding Lights").genre("Pop").language("English").releaseYear(2019).rating(0.0).duration(4).director("The Weeknd").videoUrl("https://www.youtube.com/embed/4NRXx6U8ABQ").posterUrl("https://images.unsplash.com/photo-1493225457124-a1a2a5956012?auto=format&fit=crop&w=600&q=80").contentType("SONG").build(),
                        Movie.builder().title("Bohemian Rhapsody").genre("Rock").language("English").releaseYear(1975).rating(0.0).duration(6).director("Queen").videoUrl("https://www.youtube.com/embed/fJ9rUzIMcZQ").posterUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80").contentType("SONG").build()
                ));
            }
        };
    }
}
