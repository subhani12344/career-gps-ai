from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    goal: str
    skills: List[str]
    location: str
    xp: int
    level: int

    class Config:
        from_attributes = True
