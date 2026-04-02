from groq import AsyncGroq
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"

    async def generate_chat_response(self, message: str) -> str:
        try:
            completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a professional startup advisor. Provide clear, practical, and strategic answers."},
                    {"role": "user", "content": message},
                ],
                model=self.model,
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq API Chat Error: {e}")
            return "I'm sorry, I'm having trouble connecting to my AI core right now. Please try again later."

    async def generate_idea_insights(self, idea_name: str) -> dict:
        prompt = f"""
        You are a professional startup advisor. 
        Given the business idea: {idea_name}
        Provide a detailed analysis in JSON format with the following keys. Each value MUST be a plain string:
        - explanation: A detailed description of the business.
        - success_reasoning: Why this business is likely to succeed.
        - risks: Potential challenges and risks.
        - marketing_strategy: How to acquire the first 100 customers.
        - growth_plan: How to scale this business in the first 12 months.
        
        Only return the JSON and ensure every value is a simple string, not a nested object.
        """
        try:
            completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a strategic business analyst. Return only valid JSON."},
                    {"role": "user", "content": prompt},
                ],
                model=self.model,
                response_format={"type": "json_object"}
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            logger.error(f"Groq API Idea Insight Error: {e}")
            return {
                "explanation": "Could not generate AI insights at this moment.",
                "success_reasoning": "N/A",
                "risks": "N/A",
                "marketing_strategy": "N/A",
                "growth_plan": "N/A"
            }

    async def suggest_skills(self, interest: str) -> list:
        prompt = f"Suggest 8-10 professional skills related to the interest area: {interest}. Return a JSON list of strings only."
        try:
            completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a career advisor. Return a JSON list of strings."},
                    {"role": "user", "content": prompt},
                ],
                model=self.model,
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            # Handle both {"skills": [...]} and [...] if possible, but response_format json_object needs an object
            if "skills" in data:
                return data["skills"]
            return list(data.values())[0] if isinstance(list(data.values())[0], list) else []
        except Exception as e:
            logger.error(f"Groq API Suggest Skills Error: {e}")
            return ["Marketing", "Sales", "Management", "Design", "Development"]

groq_service = GroqService()
