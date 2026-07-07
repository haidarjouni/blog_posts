from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.tag import Tag
from schema.tags import TagCreate, TagRead, TagUpdate

router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]


# Creates a URL-friendly version of the tag name.
def make_slug(name: str) -> str:
    return name.lower().strip().replace(" ", "-")


@router.get("/", response_model=list[TagRead])
def get_tags(db: DbSession):
    return db.scalars(select(Tag)).all()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TagRead)
def create_tag(tag: TagCreate, db: DbSession):
     slug = make_slug(tag.name)

     # Prevent duplicate tag names or slugs.
     existing_tag = db.scalar(select(Tag).where((Tag.name == tag.name) | (Tag.slug == slug)))

     if existing_tag:
          raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST,
               detail="Tag already exists"
          )

     new_tag = Tag(name=tag.name, slug=slug)
     try:
          db.add(new_tag)
          db.commit()
          db.refresh(new_tag)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
     return new_tag


@router.get("/{tag_id}", response_model=TagRead)
def get_tag(tag_id: int, db: DbSession):
    tag = db.get(Tag, tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    return tag


@router.patch("/{tag_id}", response_model=TagRead)
def update_tag(tag_id: int, tag_update: TagUpdate, db: DbSession):
     tag = db.get(Tag, tag_id)

     if not tag:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Tag not found" )

     slug = make_slug(tag_update.name)

     # Check that another tag does not already use this name or slug.
     existing_tag = db.scalar(select(Tag).where(((Tag.name == tag_update.name) | (Tag.slug == slug)),Tag.id != tag_id))

     if existing_tag:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Tag already exists")

     tag.name = tag_update.name
     tag.slug = slug
     try:
          db.add(tag)
          db.commit()
          db.refresh(tag)
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


     return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: DbSession):
     tag = db.get(Tag, tag_id)
     if not tag:
          raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail="Tag not found"
          )
     try:
          tag.posts.clear()
          db.delete(tag)
          db.commit()
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))     
     return None