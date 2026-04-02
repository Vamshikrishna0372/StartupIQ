from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    ai_response: str
    timestamp: datetime = datetime.utcnow()

class ChatHistoryEntry(BaseModel):
    user_id: str
    messages: List[dict] # List of {"role": "user/ai", "content": "..."}
    timestamp: datetime = datetime.utcnow()
