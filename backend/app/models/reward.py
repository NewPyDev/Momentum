from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

# Association table for user badges
user_badges = Table(
    'user_badges',
    Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('user_rewards.user_id')),
    Column('badge_id', UUID(as_uuid=True), ForeignKey('badges.id'))
)


class UserReward(Base):
    __tablename__ = "user_rewards"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    total_points = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="rewards")
    badges = relationship("Badge", secondary=user_badges, back_populates="users")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    type = Column(String, nullable=False)  # bronze, silver, gold
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("UserReward", secondary=user_badges, back_populates="badges")