from pydantic import BaseModel
from typing import List

class TrendingIndustry(BaseModel):
    name: str
    growth: int
    revenue: str

class DashboardStats(BaseModel):
    total_analyses: int
    avg_success_rate: float
    saved_ideas_count: int
    recent_activity: List[dict]
    trending_industries: List[TrendingIndustry]
    trend_data: List[dict] = []
