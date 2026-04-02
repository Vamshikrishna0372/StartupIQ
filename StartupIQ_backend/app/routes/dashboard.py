from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.database.collections import get_ideas_collection, get_saved_collection
from typing import List
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Simple In-Memory Cache
_summary_cache = {}
CACHE_TTL = 30 # seconds

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    
    # Check Cache
    now = datetime.utcnow().timestamp()
    if user_id in _summary_cache:
        data, ts = _summary_cache[user_id]
        if now - ts < CACHE_TTL:
            return data

    try:
        ideas_col = get_ideas_collection()
        saved_col = get_saved_collection()
        
        # Combined aggregation for count and avg success rate
        pipeline = [
            {"$match": {"user_id": user_id}},
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

        saved_count = await saved_col.count_documents({"user_id": user_id})
        
        response = {
            "total_analyses": stats["total"],
            "avg_success_rate": stats["avg_success"],
            "saved_ideas_count": saved_count,
            "trending_industries": [
                {"name": "Generative AI", "growth": 45, "revenue": "₹120 Cr"},
                {"name": "HealthTech", "growth": 28, "revenue": "₹85 Cr"},
                {"name": "Sustainable Energy", "growth": 32, "revenue": "₹210 Cr"},
                {"name": "Cybersecurity", "growth": 25, "revenue": "₹98 Cr"},
                {"name": "FinTech", "growth": 30, "revenue": "₹350 Cr"}
            ]
        }
        
        # Save to Cache
        _summary_cache[user_id] = (response, now)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
async def get_dashboard_trends(current_user: dict = Depends(get_current_user)):
    try:
        ideas_col = get_ideas_collection()
        pipeline = [
            {"$match": {"user_id": current_user["_id"], "timestamp": {"$exists": True, "$ne": None}}},
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
        trend_data = []
        for t in trends:
            month_idx = t["_id"]
            if month_idx and 1 <= month_idx <= 12:
                trend_data.append({
                    "name": months[month_idx - 1],
                    "ideas": t["count"],
                    "success": round(t.get("avg_success", 0) or 0, 1)
                })
        
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

