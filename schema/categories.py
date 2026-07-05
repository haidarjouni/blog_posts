from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def validate_name_value(name: str) -> str:
     name = name.strip()
     if not name:
          raise ValueError("Category name cannot be empty")
     return name


def validate_description_value(description: str | None) -> str | None:
     if description is None:
          return description
     description = description.strip()
     if not description:
          raise ValueError("Description cannot be empty")
     return description
     
class CategoryCreate(BaseModel):
     name: str = Field(min_length=1, max_length=100)
     description: str | None = Field(default=None, max_length=250)

     # This Pydantic decorator cleans the category name and rejects blank names.
     @field_validator("name")
     @classmethod
     def validate_name(cls, name: str) -> str:
          return validate_name_value(name)

     # This Pydantic decorator allows no description, but rejects whitespace-only descriptions.
     @field_validator("description")
     @classmethod
     def validate_description(cls, description: str | None) -> str | None:
          return validate_description_value(description)
     
class CategoryUpdate(BaseModel):
     name: str | None = Field(default=None, min_length=1, max_length=100)
     description: str | None = Field(default=None, max_length=250)

     # This Pydantic decorator validates name only when it is included in the PATCH body.
     @field_validator("name")
     @classmethod
     def validate_name(cls, name: str | None) -> str | None:
          if name is None:
               return name
          return validate_name_value(name)

     # This Pydantic decorator keeps optional descriptions meaningful when provided.
     @field_validator("description")
     @classmethod
     def validate_description(cls, description: str | None) -> str | None:
          return validate_description_value(description)

     # This Pydantic decorator validates the whole object so empty updates are rejected early.
     @model_validator(mode="after")
     def validate_at_least_one_field(self):
          if self.name is None and self.description is None:
               raise ValueError("At least one field must be provided")
          return self
     
class CategoryRead(BaseModel):
     id: int = Field(gt=0)
     name: str
     slug: str
     description: str | None = None
     model_config = ConfigDict(from_attributes=True)
