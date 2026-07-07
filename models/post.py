from __future__ import annotations
from datetime import datetime
from sqlalchemy import Integer, DateTime, String, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .category import Category
    from .user import User
    from .comment import Comment
    from .tag import Tag
from .base import Base

class Post(Base):
     __tablename__ = "posts"
     
     id: Mapped[int] = mapped_column(Integer, primary_key=True)
     author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
     category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False,index=True)
     title: Mapped[str] = mapped_column(String(200), nullable=False)
     slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
     content: Mapped[str] = mapped_column(Text, nullable=False)
     status: Mapped[str] = mapped_column(String(20), nullable=False,default="draft")
     created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False,server_default=func.now())
     updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False,server_default=func.now(), onupdate=func.now())
     published_at: Mapped[datetime|None] = mapped_column(DateTime(timezone=True), nullable=True)
     
     category: Mapped["Category"] = relationship("Category", back_populates="posts")
     author: Mapped["User"] = relationship("User", back_populates="posts")
     comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan", order_by="Comment.created_at.desc()")
     tags: Mapped[list["Tag"]] = relationship("Tag",secondary="post_tags",back_populates="posts")