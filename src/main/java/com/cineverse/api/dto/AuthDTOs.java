package com.cineverse.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDTOs {

    @Schema(description = "User Login Request Payload")
    public static class LoginRequest {

        @NotBlank(message = "Username or Email is required")
        private String usernameOrEmail;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {
        }

        public LoginRequest(String usernameOrEmail, String password) {
            this.usernameOrEmail = usernameOrEmail;
            this.password = password;
        }

        public String getUsernameOrEmail() {
            return usernameOrEmail;
        }

        public void setUsernameOrEmail(String usernameOrEmail) {
            this.usernameOrEmail = usernameOrEmail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @Schema(description = "User Registration Request Payload")
    public static class RegisterRequest {

        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String role; // Optional: "ROLE_ADMIN" or "ROLE_USER"

        public RegisterRequest() {
        }

        public RegisterRequest(String username, String email, String password, String role) {
            this.username = username;
            this.email = email;
            this.password = password;
            this.role = role;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    @Schema(description = "Authentication Response containing JWT Access Token")
    public static class AuthResponse {

        private String accessToken;
        private String tokenType = "Bearer";
        private String username;
        private String role;

        public AuthResponse() {
        }

        public AuthResponse(String accessToken, String username, String role) {
            this.accessToken = accessToken;
            this.username = username;
            this.role = role;
            this.tokenType = "Bearer";
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getTokenType() {
            return tokenType;
        }

        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
