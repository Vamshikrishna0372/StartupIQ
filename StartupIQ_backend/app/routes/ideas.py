from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.auth_service import get_current_user
from app.services.ml_service import ml_service
from app.services.groq_service import groq_service
from app.schemas.idea import IdeaCreate, IdeaResponse, SavedIdeaRequest
from app.database.collections import get_ideas_collection, get_saved_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/ideas", tags=["Business Ideas"])

@router.post("/generate", response_model=IdeaResponse)
async def generate_idea(idea_in: IdeaCreate, current_user: dict = Depends(get_current_user)):
    try:
        # 1. Strategy via ML Service prediction
        prediction = ml_service.predict_business_idea(idea_in.dict())
        
        # 2. Enhanced AI-powered insights via Groq
        ai_insights = await groq_service.generate_idea_insights(prediction["business_idea"])
        
        # 3. Add structural metadata
        prediction["user_id"] = ObjectId(current_user["_id"]) if isinstance(current_user["_id"], str) else current_user["_id"]
        prediction["inputs"] = idea_in.dict()
        prediction["timestamp"] = datetime.utcnow()
        prediction["ai_insights"] = ai_insights
        
        # 4. Persistence in MongoDB (ideas collection)
        ideas_col = get_ideas_collection()
        result = await ideas_col.insert_one(prediction)
        prediction["_id"] = str(result.inserted_id)
        prediction["user_id"] = str(prediction["user_id"])
        
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[IdeaResponse])
async def get_history(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        user_id = ObjectId(current_user["_id"]) if isinstance(current_user["_id"], str) else current_user["_id"]
        cursor = ideas_col.find({"user_id": user_id}).sort("timestamp", -1).limit(50)
        history = await cursor.to_list(length=50)
        
        for item in history:
            item["_id"] = str(item["_id"])
            item["user_id"] = str(item["user_id"]) if "user_id" in item else str(user_id)
            # Basic defaults
            if "business_idea" not in item: item["business_idea"] = "Untitled Idea"
            if "success_rate" not in item: item["success_rate"] = 0.0
            
        return history
    except Exception as e:
        import traceback
        print(f"CRITICAL ERROR in get_history: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
async def save_idea(request: SavedIdeaRequest, current_user: dict = Depends(get_current_user)):
    try:
        print(f"DEBUG: Saving idea with ID: {request.idea_id} for user: {current_user['_id']}")
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        # 1. Verify idea exists in history
        user_id = ObjectId(current_user["_id"]) if isinstance(current_user["_id"], str) else current_user["_id"]
        idea_id_obj = ObjectId(request.idea_id)
        
        idea = await ideas_col.find_one({"_id": idea_id_obj, "user_id": user_id})
        if not idea:
            print(f"DEBUG: Idea {request.idea_id} not found in history for user {user_id}")
            raise HTTPException(status_code=404, detail="Idea not found in history")
        
        # 2. Check if already saved
        existing = await saved_col.find_one({"original_id": str(idea["_id"]), "user_id": user_id})
        if existing:
            raise HTTPException(status_code=400, detail="This idea is already saved in your library")

        # 3. Save new entry
        idea["saved_at"] = datetime.utcnow()
        idea["original_id"] = str(idea.pop("_id"))
        
        result = await saved_col.insert_one(idea)
        return {"message": "Idea saved successfully", "saved_id": str(result.inserted_id)}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved")
async def get_saved_ideas(current_user: dict = Depends(get_current_user)):
    try:
        saved_col = get_saved_collection()
        user_id = ObjectId(current_user["_id"]) if isinstance(current_user["_id"], str) else current_user["_id"]
        # Limit to 50 for performance and use projections
        projection = {
            "business_idea": 1, "description": 1, "success_rate": 1, 
            "demand_level": 1, "profit_estimation": 1, "saved_at": 1,
            "original_id": 1, "user_id": 1
        }
        cursor = saved_col.find({"user_id": user_id}, projection).sort("saved_at", -1).limit(50)
        saved = await cursor.to_list(length=50)
        
        for item in saved:
            item["_id"] = str(item["_id"])
            if "user_id" in item:
                item["user_id"] = str(item["user_id"])
            
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/saved/{id}")
async def delete_saved_idea(id: str, current_user: dict = Depends(get_current_user)):
    try:
        saved_col = get_saved_collection()
        user_id = ObjectId(current_user["_id"]) if isinstance(current_user["_id"], str) else current_user["_id"]
        result = await saved_col.delete_one({"_id": ObjectId(id), "user_id": user_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Saved idea not found")
            
        return {"message": "Saved idea deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
