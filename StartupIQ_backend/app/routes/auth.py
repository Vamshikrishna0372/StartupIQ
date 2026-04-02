from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth_service import create_new_user, authenticate_user, get_current_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate):
    try:
        user = await create_new_user(user_in)
        return {"message": "User registered successfully", "user_id": user["_id"]}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(UserLogin(email=form_data.username, password=form_data.password))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(subject=user["email"])
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.database.collections import get_user_collection
from bson import ObjectId

@router.put("/profile", response_model=dict)
async def update_profile(user_data: dict, current_user: dict = Depends(get_current_user)):
    try:
        user_col = get_user_collection()
        
        update_fields = {}
        if "name" in user_data:
            update_fields["name"] = user_data["name"]
        if "email" in user_data:
            update_fields["email"] = user_data["email"]
            
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        await user_col.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": update_fields}
        )
        
        return {"message": "Profile updated successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    try:
        if "password" in current_user:
            del current_user["password"]
        if isinstance(current_user.get("_id"), ObjectId):
            current_user["_id"] = str(current_user["_id"])
        return current_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
