package com.cineverse.api.exception;

public class MovieNotFoundException extends RuntimeException {

    public MovieNotFoundException(String message) {
        super(message);
    }

    public MovieNotFoundException(Long id) {
        super("Movie not found with ID: " + id);
    }
}
