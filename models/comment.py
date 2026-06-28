from typing import List

from sqlalchemy import Column, ForeignKey, Integer, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING


if TYPE_CHECKING:
     from .post import Post
     from .user import User
    
from .base import Base

class Comment(Base):
     __tablename__ = "comments"
     
     id: Mapped[int] = mapped_column(Integer, primary_key=True,)
     content: Mapped[str] = mapped_column(String(500), nullable=False)
     author_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
     post_id: Mapped[int] = mapped_column(Integer, ForeignKey("posts.id"), nullable=False)
     created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
     updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
     
     post: Mapped["Post"] = relationship("Post", back_populates="comments")
     author: Mapped["User"] = relationship("User", back_populates="comments")
     