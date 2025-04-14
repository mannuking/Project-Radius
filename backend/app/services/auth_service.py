from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user_models import User, UserRole
from ..models.models import ARInvoice

# Security configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not AuthService.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        return user

    @staticmethod
    def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
        if not current_user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user

    @staticmethod
    def has_role(user: User, role: UserRole) -> bool:
        return any(r.name == role for r in user.roles)

    @staticmethod
    def check_permission(user: User, invoice: ARInvoice, action: str) -> bool:
        """
        Check if user has permission to perform action on invoice
        """
        # Directors have full access
        if AuthService.has_role(user, UserRole.DIRECTOR):
            return True
            
        # Operations can do everything except view director-only reports
        if AuthService.has_role(user, UserRole.OPERATIONS):
            return True
            
        # Billers and Collectors can only access their assigned invoices
        if invoice.assigned_user_id == user.id:
            return True
            
        return False

    @staticmethod
    def get_user_invoices(db: Session, user: User, skip: int = 0, limit: int = 100) -> List[ARInvoice]:
        """
        Get invoices based on user role
        """
        query = db.query(ARInvoice)
        
        # Directors and Operations can see all invoices
        if AuthService.has_role(user, UserRole.DIRECTOR) or AuthService.has_role(user, UserRole.OPERATIONS):
            return query.offset(skip).limit(limit).all()
        
        # Billers and Collectors can only see their assigned invoices
        return query.filter(ARInvoice.assigned_user_id == user.id).offset(skip).limit(limit).all() 
