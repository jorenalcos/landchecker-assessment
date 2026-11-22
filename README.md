# LandChecker

**Every property, a new possibility.**

LandChecker is a full-stack real estate marketplace designed to help users discover and explore property listings across Cebu, Philippines.

The platform provides property discovery, keyword search, property categorization, advanced filtering, pagination, personal watchlists, and an administrative dashboard for managing property listings.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Administrator Account Seeding](#administrator-account-seeding)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Features

### Property Marketplace

- Browse available property listings.
- Search properties by keyword or location.
- Browse properties by category:
  - Houses
  - Land
  - Condominiums
  - Commercial properties
- Filter properties by minimum and maximum price.
- Filter properties by minimum and maximum bedrooms.
- Paginated property listings.
- View individual property details.

### User Authentication

- User registration and login.
- JWT-based authentication.
- Secure password hashing.
- Protected application routes.
- Role-based access control.

### Personal Watchlist

- Add properties to a personal watchlist.
- View saved properties.
- Remove properties from the watchlist.
- User-specific saved listings.

### Admin Dashboard

- Dedicated administrative dashboard.
- Manage property listings.
- Create new property listings.
- Update existing listings.
- Delete property listings.
- Restricted property management access for administrators.

### Backend and Infrastructure

- RESTful API architecture.
- Request validation.
- PostgreSQL database.
- Redis caching.
- Property cache invalidation.
- API rate limiting.
- Automated backend tests.
- Swagger API documentation.
- Docker-based development environment.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| State Management | Zustand |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Ruby on Rails API |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Authentication | JWT |
| Backend Testing | RSpec |
| API Documentation | Rswag / Swagger |
| Containerization | Docker, Docker Compose |

---

## Project Architecture

```text
landchecker/
│
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── ...
│   ├── config/
│   ├── db/
│   │   ├── migrations/
│   │   └── seeds.rb
│   ├── spec/
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── properties/
│   │   │   ├── watchlists/
│   │   │   └── admin/
│   │   ├── routes/
│   │   └── ...
│   ├── .env.example
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- Docker Desktop
- Docker Compose
- Node.js
- pnpm
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd landchecker
```

### 2. Configure environment variables

Create the backend and frontend environment files using the examples provided below.

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Update the environment variables with your local configuration.

### 3. Build and start Docker services

From the project root:

```bash
docker compose up --build -d
```

This starts the configured application services and dependencies, including:

- Rails API
- PostgreSQL
- Redis

### 4. Run database migrations

```bash
docker compose exec backend bundle exec rails db:migrate
```

### 5. Seed the administrator account

```bash
docker compose exec backend bundle exec rails db:seed
```

See [Administrator Account Seeding](#administrator-account-seeding) for details.

### 6. Install frontend dependencies

```bash
cd frontend
pnpm install
```

### 7. Start the frontend development server

```bash
pnpm dev
```

### 8. Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger Documentation | http://localhost:3000/api-docs |

---

## Environment Configuration

### Backend Environment

Create:

`backend/.env`

Example:

```env
# Rails
RAILS_ENV=development
SECRET_KEY_BASE=REPLACE_WITH_YOUR_RAILS_SECRET_KEY_BASE

# PostgreSQL
DATABASE_URL=postgres://landchecker:YOUR_DATABASE_PASSWORD@db:5432/landchecker_development

# Redis
REDIS_URL=redis://redis:6379/0

# Default Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=REPLACE_WITH_A_STRONG_PASSWORD
```

Generate a Rails secret key using:

```bash
docker compose exec backend bundle exec rails secret
```

Copy the generated value into `SECRET_KEY_BASE`.

**Important:** The database hostname `db` and Redis hostname `redis` are Docker Compose service names. They are used when the Rails application runs inside Docker.

The example administrator credentials are placeholders. Configure your own secure credentials.

### Frontend Environment

Create:

`frontend/.env`

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The frontend uses this URL to communicate with the Rails API during local development.

### Environment File Security

Never commit actual environment files containing credentials or secrets.

Make sure the following files are excluded from Git:

```gitignore
.env
.env.*
!.env.example

node_modules/
dist/
coverage/

backend/log/
backend/tmp/
```

Keep example files such as `.env.example` in the repository so other developers can configure their environments.

---

## Database Setup

LandChecker uses PostgreSQL as its primary database.

### Run migrations

```bash
docker compose exec backend bundle exec rails db:migrate
```

### Check migration status

```bash
docker compose exec backend bundle exec rails db:migrate:status
```

### Reset the development database

**Warning:** This destroys existing development database data.

```bash
docker compose exec backend bundle exec rails db:reset
```

---

## Administrator Account Seeding

LandChecker supports administrator account initialization through the Rails database seeder.

The administrator credentials are configured using environment variables.

### 1. Configure administrator credentials

Inside `backend/.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourStrongPassword123!
```

Use a strong password for your administrator account.

### 2. Run the seeder

From the project root:

```bash
docker compose exec backend bundle exec rails db:seed
```

The seeder uses the configured administrator email and password to initialize the administrator account.

### 3. Verify administrator access

Open the frontend:

```text
http://localhost:5173
```

Log in using the administrator credentials configured in your backend environment.

The administrator account should have access to the admin dashboard and property management functionality.

**Note:** Keep the administrator credentials private. Do not publish real credentials in the README, source code, GitHub issues, or screenshots.

---

## Admin Panel Management Guide

LandChecker provides an administrative panel for managing property listings. Only authenticated users with the `admin` role can access administrative features.

### 1. Access the Admin Panel

1. Start the LandChecker application.
2. Open the frontend in your browser:
   `http://localhost:5173`
3. Log in using the administrator account configured through the database seeder.
4. After successful authentication, the administrator is redirected to the Admin Dashboard.

**Admin Panel URL:**

```text
http://localhost:5173/admin
```

### 2. Admin Dashboard

The dashboard serves as the main navigation area for administrators.

Available navigation:

| Navigation | Description |
|---|---|
| LandChecker Logo | Returns to the public marketplace |
| Dashboard | Opens the admin dashboard |
| Properties | Opens property management |
| Logout | Ends the administrator session |

### 3. Manage Property Listings

Navigate to:

```text
http://localhost:5173/admin/properties
```

The Properties Management page allows administrators to manage existing property listings.

Available operations:

- View property listings.
- Create new property listings.
- Edit existing property information.
- Delete property listings.

### 4. Create a Property

To add a new property:

1. Open the Admin Panel.
2. Navigate to **Properties**.
3. Select the **Add Property** or **Create Property** action.
4. Complete the property form.
5. Submit the form to save the listing.

Property information includes:

| Field | Description |
|---|---|
| Title | Property listing title |
| Description | Property details and overview |
| Price | Property selling price |
| Bedrooms | Number of bedrooms |
| Bathrooms | Number of bathrooms |
| Property Type | House, Land, Condominium, or Commercial |
| Address | Property location |
| Status | Property availability status |

After successful creation, the property listing is saved and becomes available through the marketplace according to its configured status and listing behavior.

### 5. Edit a Property

To update an existing listing:

1. Navigate to **Admin → Properties**.
2. Locate the property you want to update.
3. Select the **Edit** action.
4. Modify the necessary property information.
5. Save your changes.

The updated property information is persisted in the database and reflected in the marketplace.

### 6. Delete a Property

To remove a property listing:

1. Navigate to **Admin → Properties**.
2. Locate the property you want to remove.
3. Select the **Delete** action.
4. Confirm the deletion when prompted.

**Important:** Deleted property listings are removed according to the application's current deletion implementation. Verify that the correct listing is selected before confirming.

### 7. Administrator Access and Security

The admin panel is protected through authentication and role-based access control.

Security behavior:

- Only authenticated users can access protected routes.
- Only users with the `admin` role can access administrative routes.
- Regular users cannot create, update, or delete property listings.
- Backend authorization protects administrative API operations.
- Administrators can log out to end their authenticated session.

### 8. Return to the Public Marketplace

Administrators can return to the public marketplace by clicking the LandChecker logo in the admin navigation.

Marketplace URL:

```text
http://localhost:5173/
```

---

**Administration Note:** Keep administrator credentials secure. Do not share admin login details or expose them in public documentation.

## Running the Application

### Start all Docker services

```bash
docker compose up -d
```

### Stop all Docker services

```bash
docker compose down
```

### Rebuild the application

```bash
docker compose up --build -d
```

### View running containers

```bash
docker compose ps
```

### View backend logs

```bash
docker compose logs -f backend
```

### View database logs

```bash
docker compose logs -f db
```

### View Redis logs

```bash
docker compose logs -f redis
```

---

## API Endpoints

Base URL:

```text
http://localhost:3000/api/v1
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve authenticated user |

### Properties

| Method | Endpoint | Description |
|---|---|---|
| GET | `/properties` | Retrieve property listings |
| GET | `/properties/:id` | Retrieve property details |
| POST | `/properties` | Create a property |
| PATCH | `/properties/:id` | Update a property |
| DELETE | `/properties/:id` | Delete a property |

Property listing supports query parameters such as:

```text
?page=1
&per_page=10
&search=cebu
&property_type=House
&min_price=500000
&max_price=5000000
&min_bedrooms=2
&max_bedrooms=4
```

Example:

```http
GET /api/v1/properties?page=1&per_page=10&property_type=House
```

Property creation, updating, and deletion require administrator authorization.

### Watchlists

| Method | Endpoint | Description |
|---|---|---|
| GET | `/watchlists` | Retrieve authenticated user's watchlist |
| POST | `/watchlists` | Add a property to the watchlist |
| DELETE | `/watchlists/:id` | Remove a property from the watchlist |

Watchlist endpoints require JWT authentication.

---

## API Documentation

LandChecker uses Swagger for API documentation.

After starting the backend, access:

```text
http://localhost:3000/api-docs
```

The API documentation provides an interface for exploring and testing available endpoints.

---

## Testing

LandChecker uses RSpec for backend testing.

Run the complete backend test suite:

```bash
docker compose exec -e RAILS_ENV=test backend bundle exec rspec
```

The test environment is explicitly set to `test` to avoid using the development database configuration.

---

## Security

LandChecker includes the following security measures:

- Password hashing through Rails `has_secure_password`.
- JWT-based authentication.
- Role-based authorization.
- Protected administrative operations.
- API request rate limiting.
- Input validation.
- Environment-based secret management.
- Redis-backed application caching.

Never expose production secrets, database passwords, JWT signing secrets, or administrator credentials in public repositories.

---

## Future Improvements

Potential future enhancements include:

- Property image gallery and media management.
- Advanced location-based property search.
- Map-based property discovery.
- Property verification workflow.
- Enhanced administrative analytics.
- Email notifications.
- Inquiry and property contact functionality.
- Deployment and production infrastructure improvements.

---

## Author

**Joren Alcos**

Full-Stack Developer

---

**LandChecker**

*Every property, a new possibility.*