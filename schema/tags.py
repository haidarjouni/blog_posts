from pydantic import BaseModel, ConfigDict

class TagRead(BaseModel):
    id: int
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)

class TagCreate(BaseModel):
    name: str

class TagUpdate(BaseModel):
    name: str | None = None