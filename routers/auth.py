from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from models.refresh_tokens import RefreshToken
from models.user import User
from typing_extensions import Annotated
from config import settings
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from services.auth import authenticate_user, create_access_token, create_refresh_token, hash_refresh_token
router = APIRouter()

def set_auth_cookie(response: Response, key: str, value: str, max_age: int) -> None:
     response.set_cookie(
          key=key,
          value=value,
          httponly=True,
          secure=settings.cookie_secure,
          samesite="lax",
          max_age=max_age,
     )

def delete_auth_cookie(response: Response, key: str) -> None:
     response.delete_cookie(
          key=key,
          secure=settings.cookie_secure,
          samesite="lax",
     )

@router.post('/login')
def login_for_access_token(response: Response ,form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
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
     set_auth_cookie(response, "access_token", access_token, settings.access_token_expire_minutes * 60)
     set_auth_cookie(response, "refresh_token", refresh_token, settings.refresh_token_expire_days * 24 * 60 * 60)
     return {"message": "Logged in"}



@router.post('/refresh')
def refresh_access_token(response: Response, db: Annotated[Session, Depends(get_db)], refresh_token: Annotated[str | None, Cookie()] = None):
     if not refresh_token:
          raise HTTPException(status_code=401, detail="Refresh token missing")
     
     hashed_token_request = hash_refresh_token(refresh_token)
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
     set_auth_cookie(response, "access_token", access_token, settings.access_token_expire_minutes * 60)
     set_auth_cookie(response, "refresh_token", new_refresh_token, settings.refresh_token_expire_days * 24 * 60 * 60)
     db.commit()
     return {"message": "Token refreshed"}

@router.post('/logout', status_code=204)
def logout(response: Response, db: Annotated[Session, Depends(get_db)], refresh_token: Annotated[str | None, Cookie()] = None):
     if  refresh_token:
          hashed_token_request = hash_refresh_token(refresh_token)
          result = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hashed_token_request))
     
          if result and result.revoked_at is None:
               result.revoked_at = datetime.now(timezone.utc)
               db.commit()
               
     delete_auth_cookie(response, "access_token")
     delete_auth_cookie(response, "refresh_token")
     return
