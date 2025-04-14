from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
from .database import get_db, engine, Base
from .services.ar_service import ARService
from .services.auth_service import AuthService
from .models import models
from .models.user_models import User, Role, UserRole
from .routes import auth, users

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AR Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.post("/api/import-ar-data")
async def import_ar_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    Import AR data from Excel/CSV file.
    Only Operations and Directors can import data.
    """
    # Check permissions
    if not (AuthService.has_role(current_user, UserRole.OPERATIONS) or 
            AuthService.has_role(current_user, UserRole.DIRECTOR)):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to import data"
        )
    
    if not file.filename.endswith(('.xlsx', '.csv')):
        raise HTTPException(
            status_code=400,
            detail="File must be an Excel (.xlsx) or CSV file"
        )
    
    try:
        # Read the file based on its type
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)
        else:
            df = pd.read_csv(file.file)
        
        # Validate the data
        is_valid, validation_errors = ARService.validate_ar_data(df)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Invalid data format",
                    "errors": validation_errors
                }
            )
        
        # Process the data
        result = ARService.process_ar_data(df, db)
        
        return {
            "message": "Data imported successfully",
            "processed_count": result["processed_count"],
            "error_count": result["error_count"],
            "errors": result["errors"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"} 
