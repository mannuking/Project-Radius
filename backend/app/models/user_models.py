from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .models import Base

# Association table for user-role relationship
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True)
)

class UserRole(enum.Enum):
    BILLER = "Biller"
    COLLECTOR = "Collector"
    OPERATIONS = "Operations"
    DIRECTOR = "Director"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    assigned_invoices = relationship("ARInvoice", back_populates="assigned_user")
    comments = relationship("InvoiceComment", back_populates="user")
    contact_attempts = relationship("ContactAttempt", back_populates="user")
    ptps = relationship("PromiseToPay", back_populates="user")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Enum(UserRole), unique=True, index=True)
    description = Column(String)
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles") 
