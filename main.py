from fastapi import FastAPI
from routers.users import router as users_router
from routers.categories import router as categories_router
from routers.tags import router as tags_router
from routers.posts import router as posts_router
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI( )
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix='/api/users', tags=['users'])
app.include_router(categories_router, prefix='/api/categories', tags=['categories'])
app.include_router(tags_router, prefix='/api/tags', tags=['tags'])
app.include_router(posts_router, prefix='/api/posts', tags=['posts'])
app.include_router(auth_router, prefix='/api/auth', tags=['auth'])