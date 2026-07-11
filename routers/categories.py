from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.category import Category
from models.user import User
from schema.categories import CategoryCreate, CategoryRead, CategoryUpdate
from services.auth import get_current_active_user
from services.permissions import require_admin
from services.errors import raise_database_error
router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

# Creates a URL-friendly version of the category name.
def make_slug(name: str) -> str:
    return name.lower().strip().replace(" ", "-")

@router.get('/', response_model=list[CategoryRead])
def get_categories(db: DbSession):
     return db.scalars(select(Category)).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CategoryRead)
def create_category(category: CategoryCreate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     # Prevent duplicate category names.
     require_admin(current_user)
     check_duplicate = db.scalars(select(Category).where(Category.name == category.name)).first()
     if check_duplicate:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Category name already exists')
     new_category = Category(name=category.name, description=category.description)
     new_category.slug = make_slug(category.name)
     try:
          db.add(new_category)
          db.commit()
          db.refresh(new_category) 
     except Exception:
          db.rollback()
          raise_database_error("Could not create category")
     return new_category

@router.get('/{category_id}', response_model=CategoryRead)
def get_category(category_id: int, db: DbSession):
     category = db.get(Category, category_id)
     if not category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     return category

@router.patch('/{category_id}', response_model=CategoryRead)
def update_category(category_id: int, category: CategoryUpdate, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     existing_category = db.get(Category, category_id)
     if not existing_category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     require_admin(current_user)  
     if category.name is not None:
          duplicate_category = db.scalars(
               select(Category).where(
                    Category.name == category.name,
                    Category.id != category_id
               )
          ).first()
          if duplicate_category:
               raise HTTPException(status_code=400, detail="Category name already exists")
          existing_category.name = category.name
          existing_category.slug = make_slug(category.name)
     if category.description is not None:
          existing_category.description = category.description
     try:
          db.commit()
          db.refresh(existing_category)
     except Exception:
          db.rollback()
          raise_database_error("Could not update category")
     return existing_category

@router.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: DbSession, current_user: Annotated[User, Depends(get_current_active_user)]):
     existing_category = db.get(Category, category_id)
     if not existing_category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     require_admin(current_user)
     try:
          db.delete(existing_category)
          db.commit()
     except Exception:
          db.rollback()
          raise_database_error("Could not delete category")
     return None

