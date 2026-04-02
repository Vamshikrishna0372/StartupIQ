from fastapi import APIRouter, Depends, HTTPException, status
from app.services.auth_service import get_current_user
from app.database.collections import get_settings_collection
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/settings", tags=["User Settings"])

class SettingsUpdate(BaseModel):
    theme: Optional[str] = "dark"
    notifications: Optional[bool] = True
    language: Optional[str] = "en"
    ai_advisor_style: Optional[str] = "Professional"

@router.get("/")
async def get_user_settings(current_user: dict = Depends(get_current_user)):
    try:
        settings_col = get_settings_collection()
        user_settings = await settings_col.find_one({"user_id": current_user["_id"]})
        
        if not user_settings:
            # Create default settings if they don't exist
            default_settings = {
                "user_id": current_user["_id"],
                "theme": "dark",
                "notifications": True,
                "language": "en",
                "ai_advisor_style": "Professional",
                "updated_at": datetime.utcnow()
            }
            await settings_col.insert_one(default_settings)
            user_settings = default_settings
            
        user_settings["_id"] = str(user_settings["_id"])
        user_settings["user_id"] = str(user_settings["user_id"])
        return user_settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/")
async def update_user_settings(settings_in: SettingsUpdate, current_user: dict = Depends(get_current_user)):
    try:
        settings_col = get_settings_collection()
        update_data = settings_in.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        result = await settings_col.update_one(
            {"user_id": current_user["_id"]},
            {"$set": update_data},
            upsert=True
        )
        
        return {"message": "Settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
