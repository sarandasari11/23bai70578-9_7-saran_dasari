# Experiment 9(Formally-7) - Spring Boot Role-Based Authorization (RBAC)

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
- React
- Bootstrap
- Material UI
- Axios

## Project Structure

```text
exp7/
├── pom.xml
├── README.md
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── styles.css
│       ├── components/
│       │   ├── AdminDashboard.js
│       │   ├── Login.js
│       │   ├── SessionPanel.js
│       │   ├── TopBar.js
│       │   └── UserDashboard.js
│       └── utils/
│           ├── api.js
│           └── auth.js
├── screenshots/
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

### Backend (Spring Boot API)

1. Open terminal in `exp7`.
2. Run:

```bash
mvn spring-boot:run
```

3. Backend starts on:

```text
http://localhost:8080
```

### Frontend (React RBAC UI)

1. Open terminal in `exp7/frontend`.
2. Install dependencies:

```bash
npm install
```

3. Start React app:

```bash
npm start
```

4. Frontend runs on:

```text
http://localhost:3000
```

## Frontend RBAC Flow

### 1) Login Page

- Accepts username/password
- Calls `POST /api/auth/login`
- Stores session details in `sessionStorage`:
  - `username`
  - `role`
  - `authHeader` (Basic auth header derived from login credentials)
- Redirects by role:
  - `USER` -> `/user`
  - `ADMIN` -> `/admin`

### 2) Role-Based Dashboards

- USER Dashboard:
  - Can call `GET /api/user/profile`
  - Cannot access `GET /api/admin/dashboard`
- ADMIN Dashboard:
  - Can call `GET /api/admin/dashboard`
  - Can call `GET /api/user/profile`

### 3) Role-Based UI Control

- USER role cannot see active admin controls
- ADMIN role sees user and admin controls
- Unauthorized route access redirects to login or forbidden view

### 4) Logout

- Logout action calls `sessionStorage.clear()` and redirects to login

## Frontend Route Map

- `/` -> Login page
- `/user` -> User dashboard (USER or ADMIN)
- `/admin` -> Admin dashboard (ADMIN only)
- `/forbidden` -> Access denied page

## Frontend API Integration Notes

- Login uses `/api/auth/login` to validate credentials and fetch role
- Secured calls use `Authorization: Basic ...` from stored session auth header
- Backend still enforces role checks; UI restrictions are only a convenience layer

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
