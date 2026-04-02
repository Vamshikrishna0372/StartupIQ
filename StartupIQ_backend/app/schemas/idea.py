from pydantic import BaseModel, Field, AliasChoices
from typing import List, Optional, Dict, Any
from datetime import datetime

class IdeaCreate(BaseModel):
    skills: List[str]
    budget: float
    interest: str
    risk: str = Field(..., validation_alias=AliasChoices('risk', 'riskLevel'))
    location: Optional[str] = "Remote"
    experience: Optional[str] = Field("Beginner", validation_alias=AliasChoices('experience', 'experienceLevel'))

class IdeaResponse(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_idea: Optional[str] = "Untitled Business"
    description: Optional[str] = "No description"
    success_rate: Optional[float] = 0.0
    demand_level: Optional[str] = "Medium"
    competition_level: Optional[str] = "Medium"
    profit_estimation: Optional[str] = "N/A"
    ai_insights: Any = None
    inputs: Any = None
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    is_saved: bool = False
    user_id: Optional[str] = None

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SavedIdeaRequest(BaseModel):
    idea_id: str
