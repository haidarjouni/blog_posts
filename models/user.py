from typing import List

from sqlalchemy import  DateTime, String, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
     from .comment import Comment
     from .post import Post
     from .refresh_tokens import RefreshToken
    
from .base import Base

class User(Base):
     __tablename__ = "users"
     
     id: Mapped[int] = mapped_column(primary_key=True,)
     username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
     email : Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
     password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
     is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
     created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
     updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False,server_default=func.now(), onupdate=func.now())
     
     posts: Mapped[List["Post"]] = relationship("Post", back_populates="author")
     comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
     refresh_tokens: Mapped[List["RefreshToken"]] = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")