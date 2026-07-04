from datetime import datetime, timedelta
from typing import Annotated
from fastapi import HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from config import settings
from database import get_db
from models.user import User
from schema.users import TokenData
from services.passwordhashing import verify_password
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
# this is used to authenticate login credentials and return the user object if valid, otherwise return False
def authenticate_user(username: str, password: str, db: Annotated[Session, Depends(get_db)]) -> User | bool:
     user = db.query(User).filter((User.username == username)).first()
     if not user:
          return False
     if not verify_password(user.password_hash, password):
          return False
     return user

# this is used to create a JWT access token for the user
def create_access_token(data:dict, expires_delta: timedelta | None = None):
     #data is created while creatign the token and it contains the user id as sub
     to_encode = data.copy()
     if expires_delta:
          expire = datetime.utcnow() + expires_delta
     else:
          expire = datetime.utcnow() + timedelta(minutes=15)
     to_encode.update({"exp": expire})
     #here the encoding happens using the secret key and algorithm defined in the settings
     encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
     return encoded_jwt

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[Session, Depends(get_db)]):
     #gets the current authenticated user based on the token provided in the request header
     credentials_exception = HTTPException(
          status_code=401,
          detail="Could not validate credentials",
          headers={"WWW-Authenticate": "Bearer"},
     )
     try:
          payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
          user_id: str = payload.get("sub")
          if user_id is None:
               raise credentials_exception
          user_id = int(user_id)
          token_data = TokenData(user_id=user_id)
     except jwt.PyJWTError:
          raise HTTPException(status_code=401, detail="Invalid token")
     user = db.get(User, token_data.user_id)
     if user is None:
          raise credentials_exception
     return user

def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]): 
     #for abstraction only
     return current_user