from app.database.db import db_manager

# Collections that are more easily accessible
def get_user_collection():
    return db_manager.db.users

def get_ideas_collection():
    return db_manager.db.ideas

def get_saved_collection():
    return db_manager.db.saved

def get_chat_collection():
    return db_manager.db.chat

def get_settings_collection():
    return db_manager.db.settings

def get_analytics_collection():
    return db_manager.db.analytics

def get_feedback_collection():
    return db_manager.db.feedback
