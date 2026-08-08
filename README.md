# 🎬 yunushVerse API - Movie Management REST API

A production-ready Movie Management REST API built with **Spring Boot**, **Spring Data JPA**, **Bean Validation**, **Constructor Injection**, **Swagger/OpenAPI Documentation**, and **Global Exception Handling**.

---

## 📌 Table of Contents
- [Objective](#-objective)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Package Structure](#-project-architecture--package-structure)
- [Entity Specification & Validation Rules](#-entity-specification--validation-rules)
- [API Endpoints Reference](#-api-endpoints-reference)
  - [Core REST CRUD APIs](#1-core-rest-crud-apis)
  - [Filter APIs](#2-filter-apis)
  - [Pagination & Sorting APIs](#3-pagination--sorting-apis)
  - [Bonus Challenge APIs](#4-bonus-challenge-apis)
- [Global Exception Handling & Validation](#-global-exception-handling--validation)
- [Swagger / OpenAPI Documentation](#-swagger--openapi-documentation)
- [Database Configuration (H2 & MySQL)](#-database-configuration-h2--mysql)
- [How to Run & Test](#-how-to-run--test)
  - [Using Maven](#1-using-maven)
  - [Using Postman Collection](#2-using-postman-collection)
  - [Sample cURL Requests](#3-sample-curl-requests)

---

## 🎯 Objective
Build a production-ready Movie Management REST API using core Spring Boot concepts (excluding Spring Security) for full lifecycle management of movies including CRUD operations, filtered search, pagination, sorting, OpenAPI interactive documentation, custom exceptions, and database persistence.

---

## 🛠 Tech Stack
- **Framework**: Spring Boot 3.3.2
- **Language**: Java 17+
- **Persistence**: Spring Data JPA (Hibernate)
- **Databases**: H2 In-Memory DB (Default) / MySQL Database
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Min`, `@DecimalMin`, `@DecimalMax`)
- **Documentation**: OpenAPI 3.0 / Swagger UI (`springdoc-openapi`)
- **Dependency Injection**: Constructor Injection
- **Build Tool**: Maven

---

## 📁 Project Architecture & Package Structure

```text
src
 └── main
      ├── java
      │    └── com.cineverse.api
      │         ├── config
      │         │    ├── DataInitializer.java
      │         │    └── OpenApiConfig.java
      │         ├── controller
      │         │    └── MovieController.java
      │         ├── dto
      │         │    ├── ApiResponse.java
      │         │    ├── ErrorDetails.java
      │         │    └── MovieDTO.java
      │         ├── entity
      │         │    └── Movie.java
      │         ├── exception
      │         │    ├── GlobalExceptionHandler.java
      │         │    └── MovieNotFoundException.java
      │         ├── repository
      │         │    └── MovieRepository.java
      │         ├── service
      │         │    ├── MovieService.java
      │         │    └── MovieServiceImpl.java
      │         └── CineVerseApplication.java
      └── resources
           └── application.properties
```

---

## 🗄 Entity Specification & Validation Rules

### Entity: `Movie`

| Field | Data Type | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | Primary Key, `@GeneratedValue` | Auto-generated unique identifier |
| `title` | `String` | `@NotBlank` | Name of the movie |
| `genre` | `String` | `@NotBlank` | Movie genre (e.g. Sci-Fi, Action, Thriller) |
| `language` | `String` | `@NotBlank` | Primary language of the movie |
| `releaseYear` | `Integer` | `@Min(1900)` | Year of release (must be >= 1900) |
| `rating` | `Double` | `@DecimalMin("0.0")`, `@DecimalMax("10.0")` | Rating between 0.0 and 10.0 |
| `duration` | `Integer` | `@Min(1)` | Duration in minutes (must be >= 1) |
| `director` | `String` | `@NotBlank` | Name of the director |

---

## 🚀 API Endpoints Reference

### 1. Core REST CRUD APIs

| HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/movies` | Create a new movie | `201 Created` |
| `GET` | `/movies` | Retrieve all movies | `200 OK` |
| `GET` | `/movies/{id}` | Retrieve single movie by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/movies/{id}` | Update existing movie by ID | `200 OK` / `404 Not Found` |
| `DELETE` | `/movies/{id}` | Delete movie by ID | `200 OK` / `404 Not Found` |

### 2. Filter APIs

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/movies/genre/{genre}` | Filter movies by genre (case-insensitive) |
| `GET` | `/movies/language/{language}` | Filter movies by language |
| `GET` | `/movies/director/{director}` | Filter movies by director name |
| `GET` | `/movies/rating/{rating}` | Filter movies with rating >= threshold |
| `GET` | `/movies/year/{year}` | Filter movies by release year |

### 3. Pagination & Sorting APIs

| HTTP Method | Endpoint | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/movies?page=0&size=5` | `page`, `size` | Paginated movies list |
| `GET` | `/movies?sortBy=rating` | `sortBy` | Movies sorted by specific attribute |
| `GET` | `/movies?page=0&size=5&sortBy=title` | `page`, `size`, `sortBy` | Paginated and sorted movies list |

### 4. Bonus Challenge APIs

| HTTP Method | Endpoint | Query / Path Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/movies/search?title=Avengers` | `title` | Search movies by title keyword |
| `GET` | `/movies/top-rated` | None | Top 5 highest rated movies |
| `GET` | `/movies/latest` | None | Top 5 most recently released movies |
| `GET` | `/movies/count/genre/{genre}` | `{genre}` | Count total movies in a specific genre |

---

## ⚠️ Global Exception Handling & Validation

All endpoints enforce input validation using `@Valid`. Any validation failure triggers `GlobalExceptionHandler` (`@RestControllerAdvice`), returning a clean, consistent JSON payload:

### Validation Error Response Example (HTTP 400 Bad Request)
```json
{
    "timestamp": "2026-08-05T14:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed for one or more request fields",
    "path": "/movies",
    "fieldErrors": {
        "title": "Title is required",
        "rating": "Rating must be at most 10.0",
        "releaseYear": "Release year must be at least 1900"
    }
}
```

### Movie Not Found Response Example (HTTP 404 Not Found)
```json
{
    "timestamp": "2026-08-05T14:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Movie not found with ID: 99",
    "path": "/movies/99",
    "fieldErrors": null
}
```

---

## 📖 Swagger / OpenAPI Documentation

Swagger UI is pre-configured and accessible out of the box when the application is running:

- **Swagger UI Interactive Interface**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) (or [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html))
- **OpenAPI JSON Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

All endpoints, DTO models, parameters, and HTTP responses are documented using `@Operation`, `@ApiResponses`, `@Parameter`, and `@Schema`.

---

## 💾 Database Configuration (H2 & MySQL)

### Default: H2 In-Memory Database
By default, the project runs on **H2 In-Memory Database** with pre-seeded sample data on startup.
- **H2 Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:cineversedb`
- **Username**: `sa`
- **Password**: *(leave blank)*

### Switching to MySQL Database
To run with **MySQL**:
1. Create a MySQL database:
   ```sql
   CREATE DATABASE cineverse_db;
   ```
2. Open `src/main/resources/application.properties`, uncomment the MySQL section, and update your password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cineverse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```

---

## 🧪 How to Run & Test

### 1. Using Maven

#### Start Application:
```bash
mvn spring-boot:run
```
*(Or use Maven wrapper if installed: `./mvnw spring-boot:run`)*

### 2. Using Postman Collection
A complete Postman Collection is included in the project root: `CineVerse_API.postman_collection.json`.
1. Open Postman.
2. Click **Import** -> Select `CineVerse_API.postman_collection.json`.
3. Run any of the 17 pre-configured requests!

### 3. Sample cURL Requests

#### Create Movie (`POST /movies`):
```bash
curl -X POST http://localhost:8080/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Oppenheimer",
    "genre": "Biography",
    "language": "English",
    "releaseYear": 2023,
    "rating": 8.9,
    "duration": 180,
    "director": "Christopher Nolan"
  }'
```

#### Get All Movies (`GET /movies`):
```bash
curl -X GET http://localhost:8080/movies
```

#### Get Movie By ID (`GET /movies/1`):
```bash
curl -X GET http://localhost:8080/movies/1
```

#### Paginated & Sorted Movies (`GET /movies?page=0&size=5&sortBy=rating`):
```bash
curl -X GET "http://localhost:8080/movies?page=0&size=5&sortBy=rating"
```

#### Search Movie Title (`GET /movies/search?title=Avengers`):
```bash
curl -X GET "http://localhost:8080/movies/search?title=Avengers"
```

#### Get Top Rated Movies (`GET /movies/top-rated`):
```bash
curl -X GET http://localhost:8080/movies/top-rated
```

---

## 🚀 Commercial Deployment & Production Setup

### Can you use this project commercially?
**Yes, 100%!** The underlying technology stack (**Spring Boot**, **Hibernate/JPA**, **Jackson**, **OpenAPI/Swagger**) is released under permissive open-source licenses (**Apache 2.0 / LGPL**), allowing commercial use, modification, distribution, and monetization.

### 🐳 Deploying with Docker
A production multi-stage `Dockerfile` and `docker-compose.yml` are included in the repository.

#### Quick Start with Docker Compose:
```bash
docker-compose up --build -d
```
This boots up both the **CineVerse Spring Boot Application** and **MySQL 8.0 Database** in isolated production containers!

### ☁️ Cloud Deployment Options
1. **Render / Railway**: Push your code to GitHub, connect your repository, and select Docker build.
2. **AWS Cloud (Amazon EC2 / ECS / S3)**: Use Amazon S3 for storing uploaded video files and Amazon CloudFront CDN for global low-latency streaming.
3. **Google Cloud Run**: Serverless container execution with auto-scaling.

