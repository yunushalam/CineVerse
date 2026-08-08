package com.cineverse.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Structured error response payload")
public class ErrorDetails {

    @Schema(description = "Timestamp of the error", example = "2026-08-05T14:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP Status Code", example = "400")
    private int status;

    @Schema(description = "HTTP Error Reason Phrase", example = "Bad Request")
    private String error;

    @Schema(description = "Error message", example = "Validation failed for request")
    private String message;

    @Schema(description = "Request URI path", example = "/movies")
    private String path;

    @Schema(description = "Map of field-specific validation errors", example = "{\"title\": \"Title is required\"}")
    private Map<String, String> fieldErrors;

    public ErrorDetails() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorDetails(int status, String error, String message, String path, Map<String, String> fieldErrors) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.fieldErrors = fieldErrors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
