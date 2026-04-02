from fastapi import APIRouter, Depends
from app.services.groq_service import groq_service
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/skills", tags=["Skills AI"])

class SkillSuggestRequest(BaseModel):
    query: str

@router.post("/suggest")
async def suggest_skills(req: SkillSuggestRequest):
    prompt = f"Given a skill: {req.query}, return a JSON array of 6-8 related professional skills. Only return the array, no explanation."
    try:
        from app.services.groq_service import groq_service
        import json
        completion = await groq_service.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a professional skills expert. Return JSON array only."},
                {"role": "user", "content": prompt},
            ],
            model=groq_service.model,
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        # Handle different potential JSON structures from AI
        skills = data.get("skills", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        if not skills and isinstance(data, dict):
            # If AI returned a list directly or in a different key
            for val in data.values():
                if isinstance(val, list):
                    skills = val
                    break
        return {"skills": skills[:8]}
    except Exception as e:
        return {"skills": []}
