from  datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator, model_validator

from schema.tags import TagRead
from .categories import CategoryRead

def validate_username_value(username: str) -> str:
     username = username.strip()
     if not username:
          raise ValueError("Username cannot be empty")
     if not username.replace("_", "").isalnum():
          raise ValueError("Username can only contain letters, numbers, and underscores")
     return username
     
class UserPostRead(BaseModel):
     id: int
     title: str
     content: str
     status: str
     category: CategoryRead
     tags: list[TagRead] = Field(default_factory=list)
     created_at: datetime
     model_config = ConfigDict(from_attributes=True)

class UserCommentRead(BaseModel):
     id: int
     content: str
     created_at: datetime
     model_config = ConfigDict(from_attributes=True)
     
class UserPublic(BaseModel):
     id: int = Field(gt=0)
     username: str
     is_admin: bool
     model_config = ConfigDict(from_attributes=True)

class UserRead(UserPublic):
     email: EmailStr
     
class UserDetails(UserPublic):
     posts: list[UserPostRead] = Field(default_factory=list)
     comments: list[UserCommentRead] = Field(default_factory=list)
          
class UserCreate(BaseModel):
     username: str = Field(min_length=3, max_length=50)
     email: EmailStr
     password: str = Field(min_length=8, max_length=128)

     # This Pydantic decorator validates and cleans the username before the route uses it.
     @field_validator("username")
     @classmethod
     def validate_username(cls, username: str) -> str:
          return validate_username_value(username)

     # This Pydantic decorator rejects weak passwords before they are hashed and saved.
     @field_validator("password")
     @classmethod
     def validate_password(cls, password: str) -> str:
          if password.strip() != password:
               raise ValueError("Password cannot start or end with spaces")
          if password.isalpha() or password.isdigit():
               raise ValueError("Password must contain both letters and numbers")
          return password

class UserUpdate(BaseModel):
     username: str | None = Field(default=None, min_length=3, max_length=50)
     email: EmailStr | None = None

     # This Pydantic decorator runs only when username is sent in the update body.
     @field_validator("username")
     @classmethod
     def validate_username(cls, username: str | None) -> str | None:
          if username is None:
               return username
          return validate_username_value(username)

     # This Pydantic decorator validates the whole update object, not just one field.
     @model_validator(mode="after")
     def validate_at_least_one_field(self):
          if self.username is None and self.email is None:
               raise ValueError("At least one field must be provided")
          return self
     
