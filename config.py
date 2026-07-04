import os
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
     secret_key: str
     db_connection_string: str
     algorithm: str = "HS256"
     access_token_expire_minutes: int = 30
    
    
def get_settings() -> Settings:
     secret_key = os.environ.get("SECRET_KEY")
     db_connection_string = os.getenv("DB_CONNECTION_STRING")

     if not secret_key:
          raise RuntimeError("SECRET_KEY is required")
     
     if not db_connection_string:
          raise RuntimeError("DB_CONNECTION_STRING is required")
     
     return Settings(
          secret_key=secret_key,
          algorithm=os.environ.get("ALGORITHM", "HS256"),
          access_token_expire_minutes=int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30")),
          db_connection_string=db_connection_string
     )

settings = get_settings()
