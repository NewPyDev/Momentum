from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class StepBase(BaseModel):
    title: str
    description: Optional[str] = None


class StepCreate(StepBase):
    pass


class StepUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class Step(StepBase):
    id: uuid.UUID
    is_completed: bool
    goal_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StepResponse(Step):
    pass

# Update GoalResponse after StepResponse is defined
try:
    from .goal import update_goal_response
    update_goal_response()
except ImportError:
    pass