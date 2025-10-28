from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.models.step import Step
from app.schemas.step import StepCreate, StepUpdate, StepResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/{goal_id}/steps", response_model=StepResponse)
def create_step(
    goal_id: str,
    step_data: StepCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify goal ownership
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    step = Step(**step_data.model_dump(), goal_id=goal_id)
    db.add(step)
    db.commit()
    db.refresh(step)
    
    return step


@router.put("/{goal_id}/steps/{step_id}", response_model=StepResponse)
def update_step(
    goal_id: str,
    step_id: str,
    step_data: StepUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify goal ownership
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    step = db.query(Step).filter(
        Step.id == step_id,
        Step.goal_id == goal_id
    ).first()
    
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step not found"
        )
    
    update_data = step_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(step, field, value)
    
    # Update goal progress if step completion changed
    if 'is_completed' in update_data:
        completed_steps = db.query(Step).filter(
            Step.goal_id == goal_id,
            Step.is_completed == True
        ).count()
        goal.completed_steps = completed_steps
    
    db.commit()
    db.refresh(step)
    
    return step


@router.patch("/{goal_id}/steps/{step_id}/toggle", response_model=StepResponse)
def toggle_step_completion(
    goal_id: str,
    step_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify goal ownership
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    step = db.query(Step).filter(
        Step.id == step_id,
        Step.goal_id == goal_id
    ).first()
    
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step not found"
        )
    
    # Toggle completion
    step.is_completed = not step.is_completed
    
    # Update goal progress
    completed_steps = db.query(Step).filter(
        Step.goal_id == goal_id,
        Step.is_completed == True
    ).count()
    goal.completed_steps = completed_steps
    
    db.commit()
    db.refresh(step)
    
    return step


@router.delete("/{goal_id}/steps/{step_id}")
def delete_step(
    goal_id: str,
    step_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify goal ownership
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    step = db.query(Step).filter(
        Step.id == step_id,
        Step.goal_id == goal_id
    ).first()
    
    if not step:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Step not found"
        )
    
    db.delete(step)
    
    # Update goal progress
    completed_steps = db.query(Step).filter(
        Step.goal_id == goal_id,
        Step.is_completed == True
    ).count()
    goal.completed_steps = completed_steps
    
    db.commit()
    
    return {"message": "Step deleted successfully"}