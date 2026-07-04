from datetime import timedelta
from schema.users import Token

from typing_extensions import Annotated
from config import settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from services.auth import authenticate_user, create_access_token
router = APIRouter()

@router.post('/token', response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)])-> Token:
     user = authenticate_user(form_data.username , form_data.password, db)
     if not user:
          raise HTTPException(
               status_code=401,
               detail="Incorrect username or password",
               headers={"WWW-Authenticate": "Bearer"},
          )
     access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
     access_token = create_access_token(
          data={"sub": str(user.id)},
          expires_delta=access_token_expires
     )
     
     return Token(access_token=access_token, token_type="bearer")