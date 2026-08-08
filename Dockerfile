# Frontend Build Stage
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
ENV MAVEN_OPTS="-Xmx256m"
COPY pom.xml .
COPY src ./src
# Copy the built React app to Spring Boot's static folder BEFORE packaging
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
# Build the application
RUN mvn clean package -DskipTests -B

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
# Limit JVM memory for Render free tier (512MB total)
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
