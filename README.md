# Blog Posts

A learning-focused full-stack blog application built with FastAPI, PostgreSQL, SQLAlchemy, Alembic, React, TypeScript, React Router, TanStack Query, React Hook Form, and Zod.

The goal of this project was to build a realistic CRUD app manually instead of relying on a framework that hides the important pieces. It covers database modeling, relationships, migrations, authentication, protected routes, form validation, error handling, and a React frontend that talks to a FastAPI backend.

## Tech Stack

**Backend**

- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic migrations
- Pydantic schemas
- JWT access tokens
- Rotating refresh tokens stored in the database
- HttpOnly cookies for auth

**Frontend**

- React
- TypeScript
- Vite
- React Router loaders, actions, forms, redirects, and error boundaries
- TanStack Query for the current user cache
- React Hook Form
- Zod
- Tailwind CSS

## Features

- User signup and login
- HttpOnly cookie authentication
- Access token and refresh token flow
- Logout with refresh token revocation
- Current user endpoint
- Public post list
- Public post detail page
- Public user profile page
- Create, edit, and delete posts
- Create, edit, and delete comments
- Create, edit, and delete categories
- Create, edit, and delete tags
- Category and tag relationships for posts
- Author/admin permission checks
- Admin-only category and tag management
- Form validation with Zod and React Hook Form
- API error handling with styled frontend messages
- Not found, unauthorized, loading, and default error pages
- Route protection with React Router route groups and TanStack Query

## Auth Flow

This project uses HttpOnly cookies instead of storing tokens in `localStorage`.

1. The user submits the login form.
2. FastAPI verifies the credentials.
3. The backend creates an access token and refresh token.
4. The tokens are sent as HttpOnly cookies.
5. The frontend cannot read the tokens directly, which is intentional.
6. The browser automatically sends the cookies with authenticated requests.
7. The frontend asks `/api/users/me` for the current user.
8. TanStack Query caches that current user as `["currentUser"]`.
9. Navbar and route guards reuse the cached current user.
10. If the access token expires, the frontend calls `/api/auth/refresh`.
11. Logout revokes the refresh token, clears cookies, and sets the cached current user to `null`.

Backend authorization is still the real security layer. Frontend route protection only improves the user experience by hiding pages and actions users cannot use.

## Route Protection

The frontend uses an `AuthGuard` route wrapper for broad access rules:

- logged-in users can create posts
- admins can manage categories and tags
- logged-out users are redirected to login
- non-admin users are redirected to the unauthorized page

Resource ownership checks stay close to the resource:

- post edit/delete checks author or admin
- user edit/delete checks owner or admin
- comment edit/delete checks author or admin

The backend repeats these checks so users cannot bypass permissions by calling the API directly.

## Docker Setup

The application runs as three Docker Compose services:

- `frontend`: React and Vite on port `5173`
- `backend`: FastAPI and Uvicorn on port `8000`
- `db`: PostgreSQL 17 with persistent volume storage

Compose creates a private network for the services. The backend connects to PostgreSQL using the service hostname `db`, while browser-side React requests use `http://localhost:8000`.

### 1. Clone the project

```bash
git clone https://github.com/haidarjouni/blog_posts.git
cd blog_posts
```

### 2. Configure backend environment variables

Copy `.env.example` to a new `.env` file in the project root and provide a new secret key:

```env
SECRET_KEY=replace-with-a-long-random-secret
DB_CONNECTION_STRING=postgresql+psycopg://postgres:admin@db:5432/blog_posts
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
COOKIE_SECURE=false
```

Do not commit `.env`. The hostname is `db` because the backend and PostgreSQL run on the same Compose network.

`COOKIE_SECURE=false` is for local HTTP development. Use `COOKIE_SECURE=true` in production so auth cookies are sent only over HTTPS.

### 3. Build and start the application

```bash
docker compose up --build
```

This command builds the custom frontend and backend images, pulls PostgreSQL if needed, creates the network and database volume, and starts all three containers.

The application is available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`

### 4. Run database migrations

On the first run, open another terminal and apply the Alembic migrations:

```bash
docker compose exec backend alembic upgrade head
```

PostgreSQL creates the database itself, while Alembic creates the application tables and columns. The named `postgres_data` volume preserves them when containers are recreated.

To check the tables:

```bash
docker compose exec db psql -U postgres -d blog_posts -c "\dt"
```

### 5. Stop or restart the application

```bash
docker compose down
```

This removes the containers and Compose network but keeps the PostgreSQL volume and its data. Avoid `docker compose down -v` unless you intentionally want to delete the database data.

For a normal restart:

```bash
docker compose up
```

After changing source code or a Dockerfile:

```bash
docker compose up --build
```

After changing only Compose configuration, such as environment variables or ports:

```bash
docker compose up -d --force-recreate
```

## Docker Notes

- `0.0.0.0` is the listening address inside a container; use `localhost` from the browser.
- `VITE_API_URL=http://localhost:8000` is supplied to the frontend by Compose because React runs in the browser.
- The backend uses `db:5432` because `db` is PostgreSQL's Compose service name.
- Docker images contain snapshots of the source code. Rebuild after changing source unless development bind mounts are added.
- The frontend currently uses Vite's development server. A production deployment should build the static frontend and serve it with a production web server.

## Optional Local Development Without Docker

The application can still run directly on the host. Install PostgreSQL locally or publish the database container's port, use `localhost` instead of `db` in `DB_CONNECTION_STRING`, create a Python virtual environment, install `requirements.txt`, and run:

```bash
alembic upgrade head
uvicorn main:app --reload
```

For the frontend, install its dependencies and create `frontend/.env.development.local` containing `VITE_API_URL=http://localhost:8000`:

```bash
npm install
npm run dev
```

## API Overview

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login with username/password form data and set auth cookies |
| `POST` | `/api/auth/refresh` | Rotate refresh token and issue a new access token |
| `POST` | `/api/auth/logout` | Revoke refresh token and clear auth cookies |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/me` | Return the currently authenticated user |
| `GET` | `/api/users/` | List public users without email addresses |
| `POST` | `/api/users/` | Create a user |
| `GET` | `/api/users/{user_id}` | Get a public user profile with published posts and comments |
| `GET` | `/api/users/{user_id}/account` | Get private account data, owner/admin only |
| `PATCH` | `/api/users/{user_id}` | Update user profile, owner/admin only |
| `DELETE` | `/api/users/{user_id}` | Delete user, owner/admin only |

### Posts

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/posts/` | List published posts ordered by newest first |
| `POST` | `/api/posts/` | Create a post, login required |
| `GET` | `/api/posts/{post_id}` | Get published post details with comments |
| `GET` | `/api/posts/{post_id}/manage` | Get any owned/admin-managed post for editing |
| `PATCH` | `/api/posts/{post_id}` | Update post, author/admin only |
| `DELETE` | `/api/posts/{post_id}` | Delete post, author/admin only |

### Comments

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/posts/{post_id}/comments` | Create a comment, login required |
| `PATCH` | `/api/posts/comments/{comment_id}` | Update comment, author/admin only |
| `DELETE` | `/api/posts/comments/{comment_id}` | Delete comment, author/admin only |

### Categories

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/categories/` | List categories |
| `POST` | `/api/categories/` | Create category, admin only |
| `GET` | `/api/categories/{category_id}` | Get category |
| `PATCH` | `/api/categories/{category_id}` | Update category, admin only |
| `DELETE` | `/api/categories/{category_id}` | Delete category, admin only |

### Tags

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tags/` | List tags |
| `POST` | `/api/tags/` | Create tag, admin only |
| `GET` | `/api/tags/{tag_id}` | Get tag |
| `PATCH` | `/api/tags/{tag_id}` | Update tag, admin only |
| `DELETE` | `/api/tags/{tag_id}` | Delete tag, admin only |

## Project Status

The main learning goals are complete. The app has working backend CRUD, relationships, authentication, protected actions, frontend routing, validation, error handling, and a Docker Compose development environment for the frontend, backend, and PostgreSQL.
