from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.user_service import UserService
from ..services.auth_service import AuthService
from ..models.user_models import User, UserRole

router = APIRouter()

@router.post("/", response_model=dict)
async def create_user(
    username: str,
    email: str,
    full_name: str,
    password: str,
    role_names: List[UserRole],
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    # Only Operations and Directors can create users
    if not (AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = UserService.create_user(
        db=db,
        username=username,
        email=email,
        full_name=full_name,
        password=password,
        role_names=role_names
    )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "roles": [role.name.value for role in user.roles]
    }

@router.get("/", response_model=List[dict])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[UserRole] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    # Only Operations and Directors can list users
    if not (AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    users = UserService.get_users(db=db, skip=skip, limit=limit, role=role)
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "roles": [role.name.value for role in user.roles]
        }
        for user in users
    ]

@router.get("/{user_id}", response_model=dict)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    # Users can view their own profile, Operations and Directors can view any profile
    if not (current_user.id == user_id or 
            AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = UserService.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "roles": [role.name.value for role in user.roles]
    }

@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: int,
    email: Optional[str] = None,
    full_name: Optional[str] = None,
    password: Optional[str] = None,
    is_active: Optional[bool] = None,
    role_names: Optional[List[UserRole]] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    # Only Operations and Directors can update users
    if not (AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = UserService.update_user(
        db=db,
        user_id=user_id,
        email=email,
        full_name=full_name,
        password=password,
        is_active=is_active,
        role_names=role_names
    )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "roles": [role.name.value for role in user.roles]
    }

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    # Only Operations and Directors can delete users
    if not (AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    UserService.delete_user(db=db, user_id=user_id)
    return {"message": "User deleted successfully"} 
