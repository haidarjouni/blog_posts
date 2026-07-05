from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def validate_tag_name_value(name: str) -> str:
    name = name.strip()
    if not name:
        raise ValueError("Tag name cannot be empty")
    return name

class TagRead(BaseModel):
    id: int = Field(gt=0)
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)

class TagCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

    # This Pydantic decorator strips spaces and rejects empty tag names.
    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        return validate_tag_name_value(name)

class TagUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)

    # This Pydantic decorator validates the tag name only when it is provided.
    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str | None) -> str | None:
        if name is None:
            return name
        return validate_tag_name_value(name)

    # This Pydantic decorator validates the whole update body to avoid empty PATCH requests.
    @model_validator(mode="after")
    def validate_at_least_one_field(self):
        if self.name is None:
            raise ValueError("At least one field must be provided")
        return self
