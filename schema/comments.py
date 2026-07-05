from pydantic import BaseModel, ConfigDict, Field, field_validator
from .users import UserRead
from datetime import datetime, timezone

class CommentRead(BaseModel):
     id: int = Field(gt=0)
     content: str
     author:  UserRead
     post_id: int = Field(gt=0)
     created_at: datetime
     model_config = ConfigDict(from_attributes=True)
     
class CommentCreate(BaseModel):
     content: str = Field(min_length=1, max_length=1000)

     # This Pydantic decorator strips accidental spaces and blocks empty comments.
     @field_validator("content")
     @classmethod
     def validate_content(cls, content: str) -> str:
          content = content.strip()
          if not content:
               raise ValueError("Comment content cannot be empty")
          return content
