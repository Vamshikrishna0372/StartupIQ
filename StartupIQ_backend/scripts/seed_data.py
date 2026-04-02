import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta
import random

# Get the MongoDB URL from environment (assuming it's set or we use local)
# In their project, it's actually hardcoded in connection.py or similar.
# Let's check where the mongo URI is.

async def seed():
    # Attempt to connect to the same DB as the app
    client = AsyncIOMotorClient("mongodb+srv://admin:admin%40vamshi@cluster0.6kkcalv.mongodb.net/startupiq?appName=Cluster0")
    db = client.startupiq
    users_coll = db.users
    ideas_coll = db.ideas
    saved_coll = db.saved
    
    # Get the first registered user
    user = await users_coll.find_one({})
    if not user:
        print("No user found in database. Please register first.")
        return
    
    user_id = user["_id"]
    print(f"Seeding ideas for user: {user.get('email', 'unknown')} ({user_id})")
    
    # Sample Startup Ideas
    ideas = [
        {
            "business_idea": "Eco-Friendly Tech Recycler",
            "description": "A platform for businesses to responsibly recycle outdated electronics with certificated data destruction and carbon credit rewards.",
            "success_rate": 84,
            "competition_level": "medium",
            "demand_level": "high",
            "profit_estimation": "₹12L - ₹35L / year",
            "ai_insights": "The corporate sustainability sector is booming. Certification of data destruction is a key differentiator.",
            "category": "Sustainability",
            "timestamp": datetime.now() - timedelta(days=62)
        },
        {
            "business_idea": "AI-Powered Personal Stylist",
            "description": "An app that uses computer vision to analyze your current wardrobe and suggest new outfits based on weather, trends, and your body type.",
            "success_rate": 72,
            "competition_level": "high",
            "demand_level": "medium",
            "profit_estimation": "₹4L - ₹10L / year",
            "ai_insights": "Personalized fashion is growing, but subscription models are becoming saturated. Focus on direct wardrobe integration.",
            "category": "Fashion Tech",
            "timestamp": datetime.now() - timedelta(days=31)
        },
        {
            "business_idea": "Micro-Warehouse Network",
            "description": "Connecting unused basement and garage spaces to small e-commerce businesses to create hyper-local delivery hubs.",
            "success_rate": 91,
            "competition_level": "low",
            "demand_level": "very high",
            "profit_estimation": "₹15L - ₹50L / year",
            "ai_insights": "The 'last mile' problem is the most expensive part of logistics. Decentralized warehousing solved this cost effectively.",
            "category": "Logistics",
            "timestamp": datetime.now() - timedelta(days=5)
        },
        {
            "business_idea": "Boutique Indoor Farming Kits",
            "description": "Smart, automated hydroponic systems designed for modern apartments to grow rare gourmet mushrooms and herbs.",
            "success_rate": 65,
            "competition_level": "medium",
            "demand_level": "medium",
            "profit_estimation": "₹2L - ₹6L / year",
            "ai_insights": "D2C urban farming has high initial interest but high churn. Focus on recurring substrate/seed shipments.",
            "category": "Agriculture",
            "timestamp": datetime.now() - timedelta(days=45)
        },
        {
            "business_idea": "VR Meditation Retreats",
            "description": "Immersive 3D environments for remote workers to take 15-minute 'mental vacations' with biofeedback health tracking.",
            "success_rate": 78,
            "competition_level": "medium",
            "demand_level": "high",
            "profit_estimation": "₹8L - ₹20L / year",
            "ai_insights": "Remote work fatigue is a major corporate pain point. B2B health insurance integrations could be a key revenue stream.",
            "category": "Wellness",
            "timestamp": datetime.now() - timedelta(days=12)
        }
    ]
    
    # Add common fields
    for idea in ideas:
        idea["user_id"] = user_id
    
    # Clear existing if needed? No, let's just append.
    res = await ideas_coll.insert_many(ideas)
    print(f"Inserted {len(res.inserted_ids)} ideas.")
    
    # Also save one or two to show 'Saved Ideas'
    saved_ideas = [
        {
            "business_idea": ideas[0]["business_idea"],
            "description": ideas[0]["description"],
            "success_rate": ideas[0]["success_rate"],
            "competition_level": ideas[0]["competition_level"],
            "demand_level": ideas[0]["demand_level"],
            "profit_estimation": ideas[0]["profit_estimation"],
            "ai_insights": ideas[0]["ai_insights"],
            "user_id": user_id,
            "saved_at": datetime.now()
        },
        {
            "business_idea": ideas[2]["business_idea"],
            "description": ideas[2]["description"],
            "success_rate": ideas[2]["success_rate"],
            "competition_level": ideas[2]["competition_level"],
            "demand_level": ideas[2]["demand_level"],
            "profit_estimation": ideas[2]["profit_estimation"],
            "ai_insights": ideas[2]["ai_insights"],
            "user_id": user_id,
            "saved_at": datetime.now()
        }
    ]
    
    await saved_coll.insert_many(saved_ideas)
    print(f"Saved {len(saved_ideas)} ideas to your library.")

if __name__ == "__main__":
    asyncio.run(seed())
