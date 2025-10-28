from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid


class BadgeBase(BaseModel):
    name: str
    description: str
    icon: str
    type: str


class Badge(BadgeBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class BadgeResponse(Badge):
    earned_at: Optional[datetime] = None


class UserRewardBase(BaseModel):
    total_points: int = 0
    current_streak: int = 0
    longest_streak: int = 0


class UserReward(UserRewardBase):
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserRewardResponse(UserReward):
    badges: List[BadgeResponse] = []