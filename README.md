# Proffy API

## Description
The Proffy API is a RESTful service developed to support the Proffy application, aimed at connecting students with teachers. This project was inspired by the project developed by Rocketseat during the Next Level Week 2. This API provides endpoints for querying, creating, and listing classes offered by teachers, as well as for managing student connections with teachers.

## Available Endpoints
- `GET /classes`: Retrieves a list of all classes available.
- `POST /classes`: Creates a new class with the provided data.

- `GET /connections`: Retrieves the total number of connections made to teachers.
- `POST /connections`: Creates a new connection entry.

## Commands
- npm run build - This command builds the project for production.
- npm run db:migrate:latest - Runs database migrations to set up the database schema.
- npm run dev - Starts the API server in development mode with automatic reload on file changes.
- npm run test: Run tests

The API will be available at http://localhost:3333
