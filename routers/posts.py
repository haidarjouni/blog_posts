from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from database import get_db
from models.category import Category
from models.post import Post
from models.tag import Tag
from models.user import User
from schema.posts import PostCreate, PostRead, PostReadDetailed, PostUpdate
from schema.comments import CommentCreate, CommentRead
from models.comment import Comment
from services.auth import get_current_active_user
router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

# Creates a URL-friendly version of the tag name.
def make_slug(name: str) -> str:
    return name.lower().strip().replace(" ", "-")

@router.get("/", response_model=list[PostRead])
def get_posts(db: DbSession):
     return db.scalars(select(Post).options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author))).all()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostRead)
def create_post(post: PostCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     category = db.get(Category, post.category_id)
     
     if not category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
     
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
          author_id=current_user.id,
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

@router.patch("/{post_id}", response_model=PostRead)
def update_post(post_id: int, post_update: PostUpdate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     post = db.get(Post, post_id)
     
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     if post.author_id != current_user.id:
          raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to update this post")
     
     if post_update.title is not None:
          post.title = post_update.title
          post.slug = make_slug(post_update.title)
     if post_update.content is not None:
          post.content = post_update.content
     if post_update.category_id is not None:
          category = db.get(Category, post_update.category_id)
          if not category:
               raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
          post.category_id = post_update.category_id
     if post_update.tags is not None:
          unique_tag_ids = set(post_update.tags)
          tags = db.scalars(select(Tag).where(Tag.id.in_(unique_tag_ids))).all()
          if len(tags) != len(unique_tag_ids):
               raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more tags not found")
          post.tags = tags
     if post_update.status is not None:
          post.status = post_update.status
     try:
          db.commit()
          db.refresh(post)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
     return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     post = db.get(Post, post_id)
     
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     if post.author_id != current_user.id:
          raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this post")
     
     try:
          db.delete(post)
          db.commit()
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{post_id}", response_model=PostReadDetailed)
def get_post(post_id: int, db: DbSession):
     post = db.scalars(select(Post).where(Post.id == post_id).options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author), selectinload(Post.comments))).first()

     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     return post

@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED, response_model=CommentRead)
def create_comment(post_id: int, comment: CommentCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):

     post = db.get(Post, post_id)
     
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     new_comment = Comment(
          content=comment.content,
          author_id=current_user.id,
          post_id=post_id
     )
     
     try:
          db.add(new_comment)
          db.commit()
          db.refresh(new_comment)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
     
     return new_comment
