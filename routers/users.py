from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models.post import Post
from models.user import User as UserModel
from schema.users import UserDetails, UserRead, UserCreate, UserUpdate
from services.passwordhashing import hash_password
from services.auth import get_current_active_user
from services.permissions import require_auth_or_admin
router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: Annotated[UserModel, Depends(get_current_active_user)]):
    return current_user

@router.get('/', response_model=list[UserRead])
def get_users(db: DbSession):
    users = db.scalars(select(UserModel)).all()
    return users


@router.post('/', response_model=UserRead)
def create_user(db: DbSession, user: UserCreate):
     existing_user = db.scalars(
          select(UserModel).where((UserModel.email == user.email) | (UserModel.username == user.username))
     ).first()
     #check if user already exists
     if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
     # create the new user
     new_user = UserModel(
          username = user.username,
          email = user.email,
          password_hash = hash_password(user.password)
     )
     #add it to the db
     try:
          db.add(new_user)
          db.commit()
          db.refresh(new_user)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=400, detail=str(e))
     return new_user

@router.get('/{user_id}', response_model=UserDetails)
def get_user(user_id: int, db: DbSession):
     user = db.scalar(
          select(UserModel)
          .where(UserModel.id == user_id)
          .options(
               selectinload(UserModel.posts).selectinload(Post.category),
               selectinload(UserModel.posts).selectinload(Post.tags),
               selectinload(UserModel.comments),
          )
     )
     if not user:
          raise HTTPException(status_code=404, detail="User not found")
     return user

@router.patch('/{user_id}', response_model=UserRead)
def update_user(current_user: Annotated[UserModel, Depends(get_current_active_user)], user_id: int, user_update: UserUpdate, db: DbSession):
     existing_user = db.get(UserModel, user_id)
     if not existing_user:
          raise HTTPException(status_code=404, detail="User not found")
     require_auth_or_admin(target_user_id=user_id, current_user=current_user)
     if user_update.username is not None:
          if db.scalars(select(UserModel).where(UserModel.username == user_update.username, UserModel.id != user_id)).first():
               raise HTTPException(status_code=400, detail="Username already exists")
          existing_user.username = user_update.username
     if user_update.email is not None:
          if db.scalars(select(UserModel).where(UserModel.email == user_update.email, UserModel.id != user_id)).first():
               raise HTTPException(status_code=400, detail="Email already exists")
          existing_user.email = user_update.email
     try:
          db.commit()
          db.refresh(existing_user)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=400, detail=str(e))
     return existing_user
          
     

@router.delete('/{user_id}', status_code=status.HTTP_200_OK)
def delete_user(user_id: int, current_user: Annotated[UserModel, Depends(get_current_active_user)], db: DbSession):
     user = db.get(UserModel,user_id)
     if not user:
          raise HTTPException(status_code=404, detail="User not found")
     require_auth_or_admin(target_user_id=user_id, current_user=current_user)
     try:
          db.delete(user)
          db.commit()
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=400, detail=str(e))
     return
