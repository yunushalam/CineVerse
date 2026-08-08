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
                        new Movie("Inception", "Sci-Fi", "English", 2010, 8.8, 148, "Christopher Nolan", "https://www.youtube.com/embed/YoHD9XEInc0", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", "MOVIE"),
                        new Movie("The Dark Knight", "Action", "English", 2008, 9.0, 152, "Christopher Nolan", "https://www.youtube.com/embed/EXeTwQWrcwY", "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", "MOVIE"),
                        new Movie("Dune: Part Two (Official Trailer)", "Sci-Fi", "English", 2024, 0.0, 3, "Denis Villeneuve", "https://www.youtube.com/embed/Way9Dexny3w", "https://images.unsplash.com/photo-1616012481717-3bf79471180b?auto=format&fit=crop&w=600&q=80", "TRAILER"),
                        new Movie("GTA VI (Trailer 1)", "Action", "English", 2023, 0.0, 2, "Rockstar Games", "https://www.youtube.com/embed/QdBZY2fkU-0", "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=600&q=80", "TRAILER"),
                        new Movie("Blinding Lights", "Pop", "English", 2019, 0.0, 4, "The Weeknd", "https://www.youtube.com/embed/4NRXx6U8ABQ", "https://images.unsplash.com/photo-1493225457124-a1a2a5956012?auto=format&fit=crop&w=600&q=80", "SONG"),
                        new Movie("Bohemian Rhapsody", "Rock", "English", 1975, 0.0, 6, "Queen", "https://www.youtube.com/embed/fJ9rUzIMcZQ", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80", "SONG")
                ));
            }
        };
    }
}
