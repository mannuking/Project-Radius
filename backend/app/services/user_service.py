from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.user_models import User, Role, UserRole
from .auth_service import AuthService

class UserService:
    @staticmethod
    def create_user(
        db: Session, 
        username: str, 
        email: str, 
        full_name: str, 
        password: str, 
        role_names: List[UserRole]
    ) -> User:
        # Check if username or email already exists
        if db.query(User).filter(User.username == username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = AuthService.get_password_hash(password)
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hashed_password
        )
        
        # Assign roles
        for role_name in role_names:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name, description=f"{role_name.value} role")
                db.add(role)
            user.roles.append(role)
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_users(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        role: Optional[UserRole] = None
    ) -> List[User]:
        query = db.query(User)
        if role:
            query = query.join(User.roles).filter(Role.name == role)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def update_user(
        db: Session, 
        user_id: int, 
        email: Optional[str] = None,
        full_name: Optional[str] = None,
        password: Optional[str] = None,
        is_active: Optional[bool] = None,
        role_names: Optional[List[UserRole]] = None
    ) -> User:
        user = UserService.get_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if email is not None:
            # Check if email is already taken by another user
            existing_user = db.query(User).filter(User.email == email, User.id != user_id).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            user.email = email
            
        if full_name is not None:
            user.full_name = full_name
            
        if password is not None:
            user.hashed_password = AuthService.get_password_hash(password)
            
        if is_active is not None:
            user.is_active = is_active
            
        if role_names is not None:
            # Clear existing roles
            user.roles = []
            # Assign new roles
            for role_name in role_names:
                role = db.query(Role).filter(Role.name == role_name).first()
                if not role:
                    role = Role(name=role_name, description=f"{role_name.value} role")
                    db.add(role)
                user.roles.append(role)
        
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        user = UserService.get_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        db.delete(user)
        db.commit()
        return True 
