from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.services.groq_service import groq_service
from app.schemas.chat import ChatRequest, ChatResponse
from app.database.collections import get_chat_collection
from datetime import datetime
from typing import List

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("/", response_model=ChatResponse)
async def chat_with_advisor(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # 1. Get AI response from Groq
        ai_response = await groq_service.generate_chat_response(request.message)
        
        # 2. Store conversation in the "chat" collection
        chat_col = get_chat_collection()
        chat_entry = {
            "user_id": current_user["_id"],
            "messages": [
                {"role": "user", "content": request.message},
                {"role": "ai", "content": ai_response}
            ],
            "timestamp": datetime.utcnow()
        }
        await chat_col.insert_one(chat_entry)
        
        return ChatResponse(ai_response=ai_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=dict)
async def get_chat_history(current_user: dict = Depends(get_current_user)):
    try:
        chat_col = get_chat_collection()
        cursor = chat_col.find({"user_id": current_user["_id"]}).sort("timestamp", -1)
        history = await cursor.to_list(length=100)
        
        formatted_history = []
        for entry in history:
            # Extract messages from the stored conversation
            if "messages" in entry:
                formatted_history.extend(entry["messages"])
                
        return {"history": formatted_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
