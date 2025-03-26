# Node.js REST API with PostgreSQL and Firebase Auth

A comprehensive Node.js REST API demonstrating backend development practices, featuring PostgreSQL database integration, Google OAuth 2.0 authentication, and robust testing infrastructure.

## Features

- Express.js REST API
- Firebase Authentication
- Swagger API Documentation
- Comprehensive Test Suite
- Security Middleware (Helmet.js)
- Winston Logger
- In-Memory Database (Ready for PostgreSQL integration)

## API Endpoints

### Public Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item
- `GET /api-docs` - Swagger API documentation

### Protected Endpoints (Requires Authentication)

- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up Firebase credentials in environment variables:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_APP_ID=your_app_id
```

3. Start the server:

```bash
npm start
```

4. Run tests:

```bash
npm test
```

## Test Coverage

Current test coverage metrics:

- Statements: 75.86%
- Branches: 56.41%
- Functions: 72.22%
- Lines: 75.86%

## Security

This API implements several security measures:

- Firebase Authentication
- Helmet.js security headers
- Input validation
- Error handling middleware

## API Documentation

Access the Swagger documentation at `/api-docs` when the server is running.
