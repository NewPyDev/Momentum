from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    total_steps: int = 1
    emoji: Optional[str] = None
    image_url: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    total_steps: Optional[int] = None
    emoji: Optional[str] = None
    image_url: Optional[str] = None


class Goal(GoalBase):
    id: uuid.UUID
    completed_steps: int
    progress: int
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GoalResponse(Goal):
    steps: List['StepResponse'] = []

# Forward reference resolution
from .step import StepResponse
GoalResponse.model_rebuild()