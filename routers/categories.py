from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.category import Category
from schema.categories import CategoryCreate, CategoryRead, CategoryUpdate
router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

@router.get('/', response_model=list[CategoryRead])
def get_categories(db: DbSession):
    return db.scalars(select(Category)).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=CategoryRead)
def create_category(category: CategoryCreate, db: DbSession):
     check_duplicate = db.scalars(select(Category).where(Category.name == category.name)).first()
     if check_duplicate:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Category name already exists')
     new_category = Category(name=category.name, description=category.description)
     new_category.slug = category.name.lower().replace(' ', '-')
     try:
          db.add(new_category)
          db.commit()
          db.refresh(new_category) 
     except Exception as e:
          db.rollback()
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
     return new_category

@router.get('/{category_id}', response_model=CategoryRead)
def get_category(category_id: int, db: DbSession):
     category = db.get(Category, category_id)
     if not category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     return category

@router.patch('/{category_id}', response_model=CategoryRead)
def update_category(category_id: int, category: CategoryUpdate, db: DbSession):
     existing_category = db.get(Category, category_id)
     if not existing_category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     if category.description is not None:
          existing_category.description = category.description
     if category.name is not None:
          duplicate_category = db.scalars(select(Category).where(Category.name == category.name, Category.id != category_id)).first()
          if duplicate_category:
               raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Category name already exists')
          existing_category.name = category.name
          existing_category.slug = category.name.lower().replace(' ', '-')
     db.commit()
     db.refresh(existing_category)
     return existing_category

@router.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: DbSession):
     existing_category = db.get(Category, category_id)
     if not existing_category:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
     db.delete(existing_category)
     db.commit()
     return None
