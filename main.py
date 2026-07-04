from fastapi import FastAPI
from routers.users import router as users_router
from routers.categories import router as categories_router
from routers.tags import router as tags_router
from routers.posts import router as posts_router
from routers.auth import router as auth_router
app = FastAPI()

app.include_router(users_router, prefix='/users', tags=['users'])
app.include_router(categories_router, prefix='/categories', tags=['categories'])
app.include_router(tags_router, prefix='/tags', tags=['tags'])
app.include_router(posts_router, prefix='/posts', tags=['posts'])
app.include_router(auth_router, prefix='/auth', tags=['auth'])