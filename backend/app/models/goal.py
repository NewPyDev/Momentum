from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    total_steps = Column(Integer, nullable=False, default=1)
    completed_steps = Column(Integer, default=0)
    emoji = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="goals")
    steps = relationship("Step", back_populates="goal", cascade="all, delete-orphan")

    @property
    def progress(self) -> int:
        if self.total_steps == 0:
            return 0
        return int((self.completed_steps / self.total_steps) * 100)