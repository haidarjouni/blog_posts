from pydantic import BaseModel, ConfigDict, Field
from .users import UserRead
from datetime import datetime, timezone

class CommentRead(BaseModel):
     id: int
     content: str
     author:  UserRead
     post_id: int
     created_at: datetime
     model_config = ConfigDict(from_attributes=True)
     
class CommentCreate(BaseModel):
     content: str