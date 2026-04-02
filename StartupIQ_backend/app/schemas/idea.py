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
    business_idea: str
    description: str
    success_rate: float
    demand_level: str
    competition_level: str
    profit_estimation: str
    ai_insights: Optional[Dict[str, Any]] = None
    inputs: Optional[IdeaCreate] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    is_saved: bool = False

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SavedIdeaRequest(BaseModel):
    idea_id: str
