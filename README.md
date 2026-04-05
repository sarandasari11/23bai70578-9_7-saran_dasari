# Experiment 7 - Spring Boot Role-Based Authorization (RBAC)

This project implements authentication and role-based authorization using Spring Security.

## Features Implemented

- Username/password authentication with Spring Security
- Role assignment for users (`ROLE_USER`, `ROLE_ADMIN`)
- Endpoint protection with role-based rules
- Proper status codes for unauthorized and forbidden access:
  - `401 Unauthorized` when no/invalid authentication is provided
  - `403 Forbidden` when the authenticated user lacks required role
- Demo users auto-seeded at startup

## Tech Stack

- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- H2 in-memory database
- Maven

## Project Structure

```text
exp7/
├── pom.xml
├── README.md
├── screenshots/
│   └── .gitkeep
└── src/
    ├── main/
    │   ├── java/com/example/experiment7/
    │   │   ├── config/SecurityConfig.java
    │   │   ├── controller/
    │   │   │   ├── AdminController.java
    │   │   │   ├── AuthController.java
    │   │   │   ├── PublicController.java
    │   │   │   └── UserController.java
    │   │   ├── dto/
    │   │   │   ├── LoginRequest.java
    │   │   │   └── LoginResponse.java
    │   │   ├── entity/
    │   │   │   ├── AppUser.java
    │   │   │   └── Role.java
    │   │   ├── repository/UserRepository.java
    │   │   ├── service/
    │   │   │   ├── AuthService.java
    │   │   │   └── CustomUserDetailsService.java
    │   │   └── Experiment7Application.java
    │   └── resources/application.properties
    └── test/java/com/example/experiment7/RbacIntegrationTest.java
└──pom.xml
    
```

## Demo Credentials

- USER account
  - username: `user1`
  - password: `user123`
- ADMIN account
  - username: `admin1`
  - password: `admin123`

## Access Rules

- `GET /api/public/hello` -> Public (no auth required)
- `GET /api/user/profile` -> `ROLE_USER` or `ROLE_ADMIN`
- `GET /api/admin/dashboard` -> `ROLE_ADMIN` only
- `POST /api/auth/login` -> Public; validates credentials

## Run Instructions

1. Open terminal in `exp7`.
2. Run:

```bash
mvn spring-boot:run
```

3. App starts on:

```text
http://localhost:8080
```

## Postman Testing Steps

## Postman Import Files

Import these files from the `postman/` folder:

- `postman/Experiment7-RBAC.postman_collection.json`
- `postman/Experiment7-local.postman_environment.json`

After importing, select the **Experiment7 Local** environment and run requests in sequence.

### 1) Public endpoint (no auth)

- Method: `GET`
- URL: `http://localhost:8080/api/public/hello`
- Expected: `200 OK`

### 2) Login endpoint with valid credentials

- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):

```json
{
  "username": "user1",
  "password": "user123"
}
```

- Expected: `200 OK` with role in response

### 3) USER accessing user endpoint

- Method: `GET`
- URL: `http://localhost:8080/api/user/profile`
- Authorization: Basic Auth (`user1` / `user123`)
- Expected: `200 OK`

### 4) USER accessing admin endpoint

- Method: `GET`
- URL: `http://localhost:8080/api/admin/dashboard`
- Authorization: Basic Auth (`user1` / `user123`)
- Expected: `403 Forbidden`

### 5) ADMIN accessing admin endpoint

- Method: `GET`
- URL: `http://localhost:8080/api/admin/dashboard`
- Authorization: Basic Auth (`admin1` / `admin123`)
- Expected: `200 OK`

### 6) No authentication on secured endpoint

- Method: `GET`
- URL: `http://localhost:8080/api/user/profile`
- No Authorization header
- Expected: `401 Unauthorized`

## Mandatory Screenshot Checklist

Put screenshots in the `screenshots/` folder. Suggested names:

- `01-login-success.png`
- `02-secured-success.png`
- `03-user-endpoint-success.png`
- `04-access-denied-or-admin-success.png`

Recommended extras:

- `05-invalid-login.png`
- `06-no-token-401.png`
- `07-user-forbidden-403.png`

## Test Coverage

Integration tests are included in:

- `RbacIntegrationTest`

They verify:

- Public endpoint access
- 401 for unauthenticated secured endpoint access
- USER can access user endpoint
- USER gets 403 on admin endpoint
- ADMIN can access admin endpoint
- Login endpoint authenticates valid credentials
