from sqlalchemy import Column, Integer, DateTime, String,ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .base import Base

class PostsTags(Base):
     __tablename__ = "post_tags"     
     post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), primary_key=True)
     tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id"), primary_key=True )
     created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
     updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
     
     
     