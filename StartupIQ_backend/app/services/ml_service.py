import random
from typing import Dict, Any, List

class MLService:
    @staticmethod
    def predict_business_idea(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulated Decision Tree Logic to predict business ideas based on user inputs.
        """
        print(f"DEBUG: Generating business idea for input: {data}")
        skills = data.get("skills", [])
        budget = data.get("budget", 0)
        interest = data.get("interest", "").lower()
        risk = data.get("risk", "").lower()

        # Simple logic-based "Decision Tree" simulation
        ideas = [
            {"idea": "E-commerce for niche hobbyists", "base_success": 75, "demand": "High", "competition": "Medium", "profit": "₹20,000 - ₹80,000 / mo"},
            {"idea": "Personalized AI Tutoring Service", "base_success": 85, "demand": "Very High", "competition": "Low", "profit": "₹50,000 - ₹1,20,000 / mo"},
            {"idea": "Sustainable Eco-friendly Packaging", "base_success": 70, "demand": "Medium", "competition": "Medium", "profit": "₹30,000 - ₹1,20,000 / mo"},
            {"idea": "Remote Tech Consultancy", "base_success": 90, "demand": "High", "competition": "High", "profit": "₹1,00,000 - ₹5,00,000 / mo"},
            {"idea": "Micro-SaaS for Task Management", "base_success": 65, "demand": "Medium", "competition": "Very High", "profit": "₹10,000 - ₹50,000 / mo"}
        ]

        # Select business idea based on skills & interest
        if "coding" in [s.lower() for s in skills] or "technology" in interest:
            if budget > 50000:
                selected = ideas[3] # Tech Consultancy
            else:
                selected = ideas[1] # AI Tutoring
        elif budget < 10000:
            selected = ideas[4] # Micro-SaaS
        elif "marketing" in [s.lower() for s in skills]:
            selected = ideas[0] # E-commerce
        else:
            selected = ideas[2] # Eco-packaging

        # Apply risk factor to success rate
        risk_modifier = 0.9 if risk == "high" else 1.1
        final_success_rate = min(98.0, selected["base_success"] * risk_modifier)

        response = {
            "business_idea": selected["idea"],
            "description": f"A strategic startup idea tailored for someone with interests in {interest} and skills in {', '.join(skills)}.",
            "success_rate": round(final_success_rate, 2),
            "demand_level": selected["demand"],
            "competition_level": selected["competition"],
            "profit_estimation": selected["profit"]
        }
        print(f"DEBUG: Generated response: {response}")
        return response

ml_service = MLService()
