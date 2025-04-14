from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models.user_models import Role, UserRole
from .models import models

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Create default roles if they don't exist
        for role_enum in UserRole:
            role = db.query(Role).filter(Role.name == role_enum).first()
            if not role:
                role = Role(
                    name=role_enum,
                    description=f"{role_enum.value} role"
                )
                db.add(role)
        
        db.commit()
        print("Database initialized with default roles")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 
