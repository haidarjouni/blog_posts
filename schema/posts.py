from pydantic import BaseModel, ConfigDict
from .comments import CommentRead 
from .users import UserRead
from .categories import CategoryRead
from .tags import TagRead
class PostCreate(BaseModel):
     title: str
     author_id: int
     category_id: int 
     content: str
     status: str = "published"
     tags: list[int]

class PostRead(BaseModel):
     id: int
     author: UserRead
     title: str
     content: str
     status: str
     category: CategoryRead
     tags: list[TagRead] 
     model_config = ConfigDict(from_attributes=True)

class PostUpdate(BaseModel):
     title: str | None = None
     content: str | None = None
     category_id: int | None = None
     tags: list[int] | None = None
     
class PostReadDetailed(PostRead):
     comments: list[CommentRead] = []