from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.reward import UserReward
from app.schemas.reward import UserRewardResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=UserRewardResponse)
def get_user_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_reward = db.query(UserReward).filter(
        UserReward.user_id == current_user.id
    ).first()
    
    if not user_reward:
        # Create default rewards if not exists
        user_reward = UserReward(user_id=current_user.id)
        db.add(user_reward)
        db.commit()
        db.refresh(user_reward)
    
    return user_reward