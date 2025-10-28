from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.core.config import settings
import httpx

router = APIRouter()


@router.post("/subscribe")
async def create_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Paddle subscription for the user"""
    if not settings.PADDLE_VENDOR_ID or not settings.PADDLE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Paddle payment integration not configured"
        )
    
    # For demo purposes, return a mock checkout URL
    # In production, you would integrate with Paddle's API
    checkout_url = f"https://checkout.paddle.com/subscription?vendor={settings.PADDLE_VENDOR_ID}&product=premium_plan&user_id={current_user.id}"
    
    return {"checkout_url": checkout_url}


@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel user's subscription"""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have an active subscription"
        )
    
    # In production, you would call Paddle's API to cancel the subscription
    current_user.is_premium = False
    current_user.paddle_subscription_id = None
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}


@router.post("/webhook")
async def paddle_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Paddle webhook events"""
    # In production, you would verify the webhook signature
    # and handle different event types (subscription_created, subscription_cancelled, etc.)
    
    body = await request.json()
    event_type = body.get("alert_name")
    
    if event_type == "subscription_created":
        user_id = body.get("passthrough")  # User ID passed during checkout
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_premium = True
                user.paddle_subscription_id = body.get("subscription_id")
                db.commit()
    
    elif event_type == "subscription_cancelled":
        subscription_id = body.get("subscription_id")
        if subscription_id:
            user = db.query(User).filter(
                User.paddle_subscription_id == subscription_id
            ).first()
            if user:
                user.is_premium = False
                user.paddle_subscription_id = None
                db.commit()
    
    return {"status": "ok"}