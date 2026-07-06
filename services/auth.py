from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import HTTPException, Cookie
from fastapi.params import Depends

import jwt
from sqlalchemy.orm import Session
from config import settings
from database import get_db
from models.user import User
from schema.users import TokenRequest
from services.passwordhashing import verify_password
import secrets
import hashlib
from models.refresh_tokens import RefreshToken

# this is used to authenticate login credentials and return the user object if valid, otherwise return False
def authenticate_user(username: str, password: str, db: Annotated[Session, Depends(get_db)]) -> User | bool:
     user = db.query(User).filter((User.username == username)).first()
     if not user:
          return False
     if not verify_password(user.password_hash, password):
          return False
     return user

def hash_refresh_token(token: str) -> str:
     return hashlib.sha256(token.encode('utf-8')).hexdigest()

def create_refresh_token(user_id: int, db: Annotated[Session, Depends(get_db)]) -> str:
     refresh_token = secrets.token_urlsafe(64)  
     hashed_refresh_token = hash_refresh_token(refresh_token)
     expires_at = timedelta(days=settings.refresh_token_expire_days) + datetime.now(timezone.utc)
     refresh_token_entry = RefreshToken(
          user_id=user_id,
          token_hash=hashed_refresh_token,
          expires_at=expires_at
     )
     db.add(refresh_token_entry)
     return refresh_token
# this is used to create a JWT access token for the user
def create_access_token(data:dict, expires_delta: timedelta | None = None):
     #data is created while creatign the token and it contains the user id as sub
     to_encode = data.copy()
     if expires_delta:
          expire = datetime.now(timezone.utc) + expires_delta
     else:
          expire = datetime.now(timezone.utc) + timedelta(minutes=15)
     to_encode.update({"exp": expire})
     #here the encoding happens using the secret key and algorithm defined in the settings
     encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
     return encoded_jwt

def get_current_user( db: Annotated[Session, Depends(get_db)], access_token: Annotated[str | None, Cookie()]= None):
     #gets the current authenticated user based on the token provided in the request header
     credentials_exception = HTTPException(
          status_code=401,
          detail="Could not validate credentials",
          headers={"WWW-Authenticate": "Bearer"},
     )
     if not access_token:
          raise credentials_exception
     try:
          payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
          user_id: str = payload.get("sub")
          if user_id is None:
               raise credentials_exception
          user_id = int(user_id)
          token_data = TokenRequest(user_id=user_id)
     except jwt.PyJWTError:
          raise HTTPException(status_code=401, detail="Invalid token")
     user = db.get(User, token_data.user_id)
     if user is None:
          raise credentials_exception
     return user

def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]): 
     #for abstraction only
     return current_user