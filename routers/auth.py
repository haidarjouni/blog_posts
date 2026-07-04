from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from models.refresh_tokens import RefreshToken
from models.user import User
from schema.users import Token, RefreshTokenRequest
from typing_extensions import Annotated
from config import settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from services.auth import authenticate_user, create_access_token, create_refresh_token, hash_refresh_token
router = APIRouter()

@router.post('/token', response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)])-> Token:
     user: User | bool = authenticate_user(form_data.username , form_data.password, db)
     if not user:
          raise HTTPException(
               status_code=401,
               detail="Incorrect username or password",
               headers={"WWW-Authenticate": "Bearer"},
          )
     access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
     access_token: str = create_access_token(
          data={"sub": str(user.id)},
          expires_delta=access_token_expires
     )
     refresh_token: str = create_refresh_token(user.id, db)
     db.commit()
     return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

@router.post('/refresh', response_model=Token)
def refresh_access_token(token_request: RefreshTokenRequest, db: Annotated[Session, Depends(get_db)]):
     hashed_token_request = hash_refresh_token(token_request.refresh_token)
     result = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hashed_token_request))
     if not result:
          raise HTTPException(status_code=401, detail="Invalid refresh token")
     
     if result.revoked_at is not None:
          raise HTTPException(status_code=401, detail="Refresh token revoked")
     
     if result.expires_at < datetime.now(timezone.utc):
          raise HTTPException(status_code=401, detail="Refresh token expired")     
     access_token = create_access_token(data={"sub": str(result.user_id)}, expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
     new_refresh_token = create_refresh_token(result.user_id, db)
     result.revoked_at = datetime.now(timezone.utc)
     db.commit()
     return Token(access_token=access_token, refresh_token=new_refresh_token, token_type="bearer")

@router.post('/revoke', status_code=204)
def revoke_refresh_token(token_request: RefreshTokenRequest, db: Annotated[Session, Depends(get_db)]):
     hashed_token_request = hash_refresh_token(token_request.refresh_token)
     result = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hashed_token_request))
     
     if not result:
          raise HTTPException(status_code=401, detail="Invalid refresh token")
     
     result.revoked_at = datetime.now(timezone.utc)
     db.commit()
     return