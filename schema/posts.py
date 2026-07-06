from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from .comments import CommentRead 
from .users import UserRead
from .categories import CategoryRead
from .tags import TagRead
from datetime import datetime
ALLOWED_POST_STATUSES = {"draft", "published", "archived"}


def validate_not_blank(value: str, field_name: str) -> str:
     value = value.strip()
     if not value:
          raise ValueError(f"{field_name} cannot be empty")
     return value


def validate_tag_ids(tag_ids: list[int]) -> list[int]:
     if not tag_ids:
          raise ValueError("At least one tag is required")
     if any(tag_id <= 0 for tag_id in tag_ids):
          raise ValueError("Tag IDs must be positive numbers")
     if len(tag_ids) != len(set(tag_ids)):
          raise ValueError("Tag IDs cannot contain duplicates")
     return tag_ids

class PostCreate(BaseModel):
     title: str = Field(min_length=1, max_length=200)
     category_id: int = Field(gt=0)
     content: str = Field(min_length=1)
     status: str = "published"
     tags: list[int]
     

     # This Pydantic decorator cleans title/content and rejects strings that are only spaces.
     @field_validator("title", "content")
     @classmethod
     def validate_text_fields(cls, value: str, info) -> str:
          return validate_not_blank(value, info.field_name)

     # This Pydantic decorator allows only the statuses your API expects.
     @field_validator("status")
     @classmethod
     def validate_status(cls, status: str) -> str:
          status = status.strip().lower()
          if status not in ALLOWED_POST_STATUSES:
               raise ValueError("Status must be draft, published, or archived")
          return status

     # This Pydantic decorator checks the tag list before the database lookup runs.
     @field_validator("tags")
     @classmethod
     def validate_tags(cls, tags: list[int]) -> list[int]:
          return validate_tag_ids(tags)

class PostRead(BaseModel):
     id: int = Field(gt=0)
     author: UserRead
     title: str
     content: str
     status: str
     category: CategoryRead
     tags: list[TagRead] 
     created_at: datetime
     model_config = ConfigDict(from_attributes=True)
     

class PostUpdate(BaseModel):
     title: str | None = Field(default=None, min_length=1, max_length=200)
     content: str | None = None
     category_id: int | None = Field(default=None, gt=0)
     tags: list[int] | None = None
     status: str | None = Field(default=None)

     # This Pydantic decorator validates optional text only when that field is provided.
     @field_validator("title", "content")
     @classmethod
     def validate_text_fields(cls, value: str | None, info) -> str | None:
          if value is None:
               return value
          return validate_not_blank(value, info.field_name)

     # This Pydantic decorator keeps update tag IDs valid before changing relationships.
     @field_validator("tags")
     @classmethod
     def validate_tags(cls, tags: list[int] | None) -> list[int] | None:
          if tags is None:
               return tags
          return validate_tag_ids(tags)

     # This Pydantic decorator validates status on normal post updates.
     @field_validator("status")
     @classmethod
     def validate_status(cls, status: str | None) -> str | None:
          if status is None:
               return status
          status = status.strip().lower()
          if status not in ALLOWED_POST_STATUSES:
               raise ValueError("Status must be draft, published, or archived")
          return status

     # This Pydantic decorator rejects empty PATCH bodies for post updates.
     @model_validator(mode="after")
     def validate_at_least_one_field(self):
          if self.title is None and self.content is None and self.category_id is None and self.tags is None and self.status is None:
               raise ValueError("At least one field must be provided")
          return self
     
class PostReadDetailed(PostRead):
     comments: list[CommentRead] = []
     
class PostUpdateWithStatus(PostUpdate):
     pass
