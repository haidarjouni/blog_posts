from sqlalchemy import  DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
     from .post import Post
     
class Tag(Base):
     __tablename__ = "tags"
     
     id: Mapped[int] = mapped_column(primary_key=True)
     name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
     slug: Mapped[str | None] = mapped_column(String(250), unique=True, nullable=True)
     created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
     
     posts: Mapped[list["Post"]] = relationship("Post", secondary="post_tags", back_populates="tags")
     
     