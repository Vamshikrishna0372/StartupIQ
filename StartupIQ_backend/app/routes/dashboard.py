from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.database.collections import get_ideas_collection, get_saved_collection
from typing import List
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        total_analyses = await ideas_col.count_documents({"user_id": current_user["_id"]})
        
        avg_success_rate = 0.0
        if total_analyses > 0:
            pipeline = [
                {"$match": {"user_id": current_user["_id"]}},
                {"$group": {"_id": None, "avg_success": {"$avg": "$success_rate"}}}
            ]
            async for res in ideas_col.aggregate(pipeline):
                avg_success_rate = round(res["avg_success"], 1)

        saved_ideas_count = await saved_col.count_documents({"user_id": current_user["_id"]})
        
        return {
            "total_analyses": total_analyses,
            "avg_success_rate": avg_success_rate,
            "saved_ideas_count": saved_ideas_count,
            "trending_industries": [
                {"name": "Generative AI", "growth": 45, "revenue": "$1.2B"},
                {"name": "HealthTech", "growth": 28, "revenue": "$850M"},
                {"name": "Sustainable Energy", "growth": 32, "revenue": "$2.1B"},
                {"name": "Cybersecurity", "growth": 25, "revenue": "$980M"},
                {"name": "FinTech", "growth": 30, "revenue": "$3.5B"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
async def get_dashboard_trends(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        pipeline = [
            {"$match": {"user_id": current_user["_id"]}},
            {"$group": {
                "_id": {"$month": "$timestamp"},
                "count": {"$sum": 1},
                "avg_success": {"$avg": "$success_rate"}
            }},
            {"$sort": {"_id": 1}}
        ]
        cursor = ideas_col.aggregate(pipeline)
        trends = await cursor.to_list(length=12)
        
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        trend_data = [{"name": months[t["_id"]-1], "ideas": t["count"], "success": round(t["avg_success"], 1)} for t in trends]
        
        return {"trend_data": trend_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activity")
async def get_dashboard_activity(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        # 1. Fetch recent generations
        gen_cursor = ideas_col.find({"user_id": current_user["_id"]}).sort("timestamp", -1).limit(10)
        generations = await gen_cursor.to_list(length=10)
        
        # 2. Fetch recent saves
        save_cursor = saved_col.find({"user_id": current_user["_id"]}).sort("saved_at", -1).limit(10)
        saves = await save_cursor.to_list(length=10)
        
        # 3. Interleave and sort
        activity = []
        for g in generations:
            activity.append({
                "id": str(g["_id"]),
                "type": "generate",
                "action": "Generated Concept",
                "detail": g.get("business_idea", "New Idea"),
                "time": g.get("timestamp", datetime.utcnow()).isoformat()
            })
        for s in saves:
            activity.append({
                "id": str(s["_id"]),
                "type": "save",
                "action": "Bookmarked Concept",
                "detail": s.get("business_idea", "Saved Idea"),
                "time": s.get("saved_at", datetime.utcnow()).isoformat()
            })
            
        activity.sort(key=lambda x: x["time"], reverse=True)
        
        return {"recent_activity": activity[:15]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

