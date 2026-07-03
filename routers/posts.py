from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from database import get_db
from models.category import Category
from models.post import Post
from models.tag import Tag
from models.user import User
from schema.posts import PostCreate, PostRead, PostUpdate

router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

# Creates a URL-friendly version of the tag name.
def make_slug(name: str) -> str:
    return name.lower().strip().replace(" ", "-")

@router.get("/", response_model=list[PostRead])
def get_posts(db: DbSession):
     return db.scalars(select(Post).options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author))).all()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostRead)
def create_post(post: PostCreate, db: DbSession):
     category = db.get(Category, post.category_id)
     
     if not category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
     author = db.get(User, post.author_id)
     
     if not author:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
     
     if not post.tags:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one tag is required")
     
     unique_tag_ids = set(post.tags)
     tags = db.scalars(select(Tag).where(Tag.id.in_(unique_tag_ids))).all()
     
     if len(tags) != len(unique_tag_ids):
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more tags not found")
     
     created_post = Post(    
          title=post.title,
          content=post.content,
          slug=make_slug(post.title),
          status=post.status,
          category_id=post.category_id,
          author_id=post.author_id,
          tags=tags
     )
     
     try:
          db.add(created_post)
          db.commit()
          db.refresh(created_post)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
     return created_post


@router.get("/{post_id}", response_model=PostRead)
def get_post(post_id: int, db: DbSession):
     post = db.scalars(select(Post).where(Post.id == post_id).options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author), selectinload(Post.comments))).first()

     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     return post
