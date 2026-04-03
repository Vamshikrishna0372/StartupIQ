from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.database.collections import get_ideas_collection, get_saved_collection
from typing import List
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Simple In-Memory Cache
_summary_cache = {}
CACHE_TTL = 30 # seconds

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    user_id_str = str(current_user["_id"])
    user_id_obj = ObjectId(user_id_str)
    
    # Check Cache
    now = datetime.utcnow().timestamp()
    if user_id_str in _summary_cache:
        data, ts = _summary_cache[user_id_str]
        if now - ts < CACHE_TTL:
            return data

    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        # Combined aggregation for count and avg success rate
        pipeline = [
            {"$match": {"user_id": user_id_obj}},
            {"$group": {
                "_id": None,
                "total": {"$sum": 1},
                "avg_success": {"$avg": "$success_rate"}
            }}
        ]
        
        stats = {"total": 0, "avg_success": 0.0}
        async for res in ideas_col.aggregate(pipeline):
            stats["total"] = res["total"]
            stats["avg_success"] = round(res["avg_success"], 1)

        saved_count = await saved_col.count_documents({"user_id": user_id_obj})
        
        response = {
            "total_analyses": stats["total"],
            "avg_success_rate": stats["avg_success"],
            "saved_ideas_count": saved_count,
            "trending_industries": [] # Removed fake data for trending unless specifically added
        }
        
        # Save to Cache
        _summary_cache[user_id_str] = (response, now)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
async def get_dashboard_trends(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        user_id_obj = ObjectId(str(current_user["_id"]))
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=6)
        
        pipeline = [
            {"$match": {
                "user_id": user_id_obj, 
                "timestamp": {"$gte": start_date}
            }},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                "count": {"$sum": 1},
                "avg_success": {"$avg": "$success_rate"}
            }}
        ]
        cursor = ideas_col.aggregate(pipeline)
        trends = await cursor.to_list(length=30)
        
        data_map = {t["_id"]: {"count": t["count"], "avg_success": t.get("avg_success", 0) or 0} for t in trends}
        
        trend_data = []
        for i in range(7):
            d = start_date + timedelta(days=i)
            d_str = d.strftime("%Y-%m-%d")
            day_name = d.strftime("%a") # Mon, Tue...
            
            if d_str in data_map:
                trend_data.append({
                    "name": day_name,
                    "ideas": data_map[d_str]["count"],
                    "success": round(data_map[d_str]["avg_success"], 1)
                })
            else:
                trend_data.append({
                    "name": day_name,
                    "ideas": 0,
                    "success": 0
                })
        
        return {"trend_data": trend_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activity")
async def get_dashboard_activity(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        user_id_obj = ObjectId(str(current_user["_id"]))
        
        gen_cursor = ideas_col.find({"user_id": user_id_obj}).sort("timestamp", -1).limit(10)
        generations = await gen_cursor.to_list(length=10)
        
        save_cursor = saved_col.find({"user_id": user_id_obj}).sort("saved_at", -1).limit(10)
        saves = await save_cursor.to_list(length=10)
        
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
        
        return {"recent_activity": activity[:10]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

