from fastapi import APIRouter

api_router = APIRouter()

# Import routers
try:
    from app.api.v1.endpoints import auth, goals, steps, rewards, payments
    
    api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
    api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
    api_router.include_router(steps.router, prefix="/goals", tags=["steps"])
    api_router.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
    api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
except ImportError as e:
    print(f"Warning: Could not import API endpoints: {e}")
    pass