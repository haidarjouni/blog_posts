# Internship-Ready Full-Stack AI Roadmap

This roadmap is built around project-based learning. The goal is to become ready for junior or internship-level full-stack AI work by first building normal backend/frontend skill, then adding AI search, agents, MCP, and one polished portfolio project.

## Current Focus: Project 1

### FastAPI Blog Backend

Goal: understand the backend pieces manually before using bigger frameworks.

Build and finish:

- FastAPI app structure
- PostgreSQL database
- SQLAlchemy models
- Alembic migrations
- CRUD endpoints
- model relationships
- manual password hashing
- register and login
- JWT authentication
- current user dependency
- protected routes
- Docker setup after backend/auth works

Optional after auth:

- small React frontend connected to this API

Done when:

- users can register and log in
- authenticated users can access protected routes
- blog resources have working CRUD
- relationships work correctly
- migrations are clean
- the app runs with Docker

## Project 2: Django REST + Frontend

Goal: learn the professional Django API workflow and connect it to a modern frontend.

Build:

- Django project/app structure
- Django REST Framework API
- PostgreSQL database
- Django models
- migrations
- admin panel for managing data
- Django auth/user system
- permissions
- serializers
- API auth
- React or Next.js frontend
- Docker
- deployment

Done when:

- the frontend talks to the DRF backend
- auth works from the frontend
- protected API routes are enforced
- the app is deployed and documented

## Project 3: Small pgvector/RAG App

Goal: learn AI search and retrieval before building agents.

Build:

- PostgreSQL with pgvector
- embeddings
- document chunking
- semantic search
- simple RAG flow
- upload/search/ask experience

Done when:

- documents can be stored and chunked
- embeddings are saved in PostgreSQL
- semantic search returns relevant chunks
- the app can answer questions using retrieved context

## Project 4: Small Agents + MCP App

Goal: learn AI tool use in a small, clean project.

Build:

- tool calling
- simple agent loop
- MCP basics
- tools that read from a database, files, or an API
- clear logging of what the agent did

Done when:

- the AI can choose and call tools
- tools can read useful app data
- the result is understandable and repeatable
- the project stays small enough to explain clearly

## Project 5: Huge Portfolio App

Goal: combine everything into one strong project that proves job readiness.

Build:

- users and auth
- polished frontend
- backend API
- PostgreSQL
- file upload or document data
- pgvector/RAG
- agents/MCP
- background jobs if needed
- Docker
- deployment
- polished README
- screenshots
- architecture diagram

Done when:

- the app looks like a real product
- it is deployed
- the README explains the problem, stack, architecture, and setup
- it has screenshots or a demo video
- it proves backend, frontend, database, auth, Docker, deployment, and AI skills

## Learning Rules

- Do not switch to Django until Project 1 is finished.
- Learn only the Django fundamentals needed for DRF APIs.
- Skip Django templates, classic views, and forms unless they become useful later.
- Do not start the huge AI app before pgvector, agents, and MCP are learned in small projects.
- Prefer one polished portfolio project over many unfinished demos.
- Learn each tool right before using it in a project.
- Keep every project explainable in interviews.

## Target Outcome

By Summer 2027, the portfolio should show:

- one strong manual FastAPI backend project
- one Django REST Framework full-stack project
- one small pgvector/RAG project
- one small agents/MCP project
- one large full-stack AI portfolio project
