from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
import re
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
from services.permissions import require_auth_or_admin, require_login
from services.errors import raise_database_error
router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

# Creates a URL-friendly slug from a post title.
def make_slug(name: str) -> str:
     slug = re.sub(r"[^a-z0-9]+", "-", name.lower().strip()).strip("-")
     return slug or "post"

def create_unique_post_slug(db: DbSession, title: str, post_id: int | None = None) -> str:
     base_slug = make_slug(title)
     slug = base_slug
     counter = 2

     while True:
          query = select(Post).where(Post.slug == slug)
          if post_id is not None:
               query = query.where(Post.id != post_id)
          existing_post = db.scalar(query)
          if not existing_post:
               return slug
          slug = f"{base_slug}-{counter}"
          counter += 1

@router.get("/", response_model=list[PostRead])
def get_posts(db: DbSession):
     return db.scalars(
          select(Post)
          .where(Post.status == "published")
          .options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author))
          .order_by(Post.created_at.desc())
     ).all()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostRead)
def create_post(post: PostCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     require_login(current_user)
     category = db.get(Category, post.category_id)
     
     if not category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
          
     unique_tag_ids = set(post.tags)
     tags = db.scalars(select(Tag).where(Tag.id.in_(unique_tag_ids))).all()
     
     if len(tags) != len(unique_tag_ids):
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more tags not found")
     
     created_post = Post(    
          title=post.title,
          content=post.content,
          slug=create_unique_post_slug(db, post.title),
          status=post.status,
          category_id=post.category_id,
          author_id=current_user.id,
          tags=tags
     )
     
     try:
          db.add(created_post)
          db.commit()
          db.refresh(created_post)
     except Exception:
          db.rollback()
          raise_database_error("Could not create post")
     return created_post

@router.patch("/{post_id}", response_model=PostRead)
def update_post(post_id: int, post_update: PostUpdate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     post = db.get(Post, post_id)
     
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     require_auth_or_admin(target_user_id=post.author_id, current_user=current_user)

     if post_update.title is not None:
          post.title = post_update.title
          post.slug = create_unique_post_slug(db, post_update.title, post_id=post_id)
          
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
     except Exception:
          db.rollback()
          raise_database_error("Could not update post")
     return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     post = db.get(Post, post_id)
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     require_auth_or_admin(target_user_id=post.author_id, current_user=current_user)
     try:
          db.delete(post)
          db.commit()
     except Exception:
          db.rollback()
          raise_database_error("Could not delete post")

@router.get("/{post_id}/manage", response_model=PostReadDetailed)
def get_manage_post(post_id: int, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     post = db.scalars(
          select(Post)
          .where(Post.id == post_id)
          .options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author), selectinload(Post.comments))
     ).first()

     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

     require_auth_or_admin(target_user_id=post.author_id, current_user=current_user)
     return post

@router.get("/{post_id}", response_model=PostReadDetailed)
def get_post(post_id: int, db: DbSession):
     post = db.scalars(
          select(Post)
          .where(Post.id == post_id, Post.status == "published")
          .options(selectinload(Post.tags), joinedload(Post.category), joinedload(Post.author), selectinload(Post.comments))
     ).first()

     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     
     return post

@router.post("/{post_id}/comments", status_code=status.HTTP_201_CREATED, response_model=CommentRead)
def create_comment(post_id: int, comment: CommentCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     
     post = db.scalar(select(Post).where(Post.id == post_id, Post.status == "published"))
     
     if not post:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
     require_login(current_user)
     new_comment = Comment(
          content=comment.content,
          author_id=current_user.id,
          post_id=post_id
     )
     
     try:
          db.add(new_comment)
          db.commit()
          db.refresh(new_comment)
     except Exception:
          db.rollback()
          raise_database_error("Could not create comment")
     
     return new_comment


@router.patch("/comments/{comment_id}", response_model=CommentRead)
def update_comment( comment_id: int, comment_update: CommentCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     comment = db.get(Comment, comment_id)
     if not comment:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
     require_auth_or_admin(target_user_id=comment.author_id, current_user=current_user)
     if comment_update.content is not None:
          comment.content = comment_update.content
     
     try:
          db.commit()
          db.refresh(comment)
     except Exception:
          db.rollback()
          raise_database_error("Could not update comment")
     
     return comment

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(comment_id: int, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     comment = db.get(Comment, comment_id)
     
     if not comment:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
     require_auth_or_admin(target_user_id=comment.author_id, current_user=current_user)
     try:
          db.delete(comment)
          db.commit()
     except Exception:
          db.rollback()
          raise_database_error("Could not delete comment")

