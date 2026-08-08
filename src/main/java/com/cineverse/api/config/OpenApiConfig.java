package com.cineverse.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cineVerseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CineVerse Movie Management REST API")
                        .description("Production-ready Movie Management REST API built with Spring Boot, Spring Data JPA, and Bean Validation.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("CineVerse Developer Team")
                                .email("support@cineverse.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
