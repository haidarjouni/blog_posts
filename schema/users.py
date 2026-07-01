from pydantic import BaseModel, EmailStr, ConfigDict

class UserRead(BaseModel):
     id: int
     username: str
     email: EmailStr
     model_config = ConfigDict(from_attributes=True)
     
class UserCreate(BaseModel):
     username: str
     email: EmailStr
     password: str

class UserUpdate(BaseModel):
     username: str | None = None
     email: EmailStr | None = None