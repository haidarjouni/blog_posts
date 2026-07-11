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

## Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd blog_posts
```

### 2. Create backend environment

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=replace-with-a-long-random-secret
DB_CONNECTION_STRING=postgresql+psycopg://postgres:admin@localhost/blog_posts
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30
```

Update the database username, password, host, and database name for your local PostgreSQL setup.

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Start the backend

```bash
uvicorn main:app --reload
```

The API runs on:

```text
http://localhost:8000
```

### 6. Install frontend dependencies

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Screenshots

Screenshots should be added before publishing the project.

Suggested screenshots:

- home page with latest posts
- post detail page with comments
- login page
- create post page
- user profile page
- category/tag admin page
- unauthorized page

Recommended folder:

```text
docs/screenshots/
```

Then reference them in this section with Markdown image links.

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
| `GET` | `/api/users/` | List users |
| `POST` | `/api/users/` | Create a user |
| `GET` | `/api/users/{user_id}` | Get a user profile with posts and comments |
| `PATCH` | `/api/users/{user_id}` | Update user profile, owner/admin only |
| `DELETE` | `/api/users/{user_id}` | Delete user, owner/admin only |

### Posts

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/posts/` | List posts ordered by newest first |
| `POST` | `/api/posts/` | Create a post, login required |
| `GET` | `/api/posts/{post_id}` | Get post details with comments |
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

The main learning goals are complete. The app has working backend CRUD, relationships, authentication, protected actions, frontend routing, validation, and error handling.

Next steps are packaging and presentation:

- add screenshots
- Dockerize backend, frontend, and PostgreSQL
- polish README setup after Docker is added
- publish to GitHub
