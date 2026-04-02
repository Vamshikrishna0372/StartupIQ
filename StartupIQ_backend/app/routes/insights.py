from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.services.groq_service import groq_service
from pydantic import BaseModel
import json

router = APIRouter(prefix="/insights", tags=["Insights AI"])

class InsightRequest(BaseModel):
    idea_id: str
    business_idea: str
    description: str

@router.post("/analyze")
async def analyze_idea_deeply(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""
    Analyze the following business idea deeply:
    Idea: {req.business_idea}
    Description: {req.description}

    Provide a professional analysis in JSON format with exactly these keys. Each value must be a JSON array of strings:
    - strengths: [3-4 strategic strengths]
    - weaknesses: [3-4 critical weaknesses]
    - opportunities: [3-4 market opportunities]
    - risks: [3-4 primary risks]
    - strategy: [4-5 sequential growth steps]

    Only return valid JSON.
    """
    try:
        completion = await groq_service.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a strategic business consultant. Return JSON only with arrays of strings for each category."},
                {"role": "user", "content": prompt},
            ],
            model=groq_service.model,
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        return {
            "strengths": data.get("strengths", []),
            "weaknesses": data.get("weaknesses", []),
            "opportunities": data.get("opportunities", []),
            "risks": data.get("risks", []),
            "strategy": data.get("strategy", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
