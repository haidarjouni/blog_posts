from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.category import Category
from schema.categories import CategoryCreate, CategoryRead, CategoryUpdate
router = APIRouter()

