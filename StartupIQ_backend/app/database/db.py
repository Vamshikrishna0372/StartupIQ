from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_mongo(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URI)
            self.db = self.client.get_database("startupiq")
            await self.client.admin.command('ping')
            # Initialize Indexes for performance
            await self.initialize_indexes()
            logger.info("Successfully connected to MongoDB and initialized indexes.")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB on startup: {e}")
            # NO RAISE: Allow app to start so we can use health checks to debug
            pass

    async def initialize_indexes(self):
        """Create indexes for high-speed lookups."""
        try:
            # Users: Unique Index on email
            await self.db.users.create_index("email", unique=True)
            
            # Ideas: Index on user_id (filtering) and timestamp (sorting)
            await self.db.ideas.create_index([("user_id", 1), ("timestamp", -1)])
            
            # Saved: Index on user_id and saved_at
            await self.db.saved.create_index([("user_id", 1), ("saved_at", -1)])
            await self.db.saved.create_index("original_id")
            
            # Chat: Index on user_id and timestamp
            await self.db.chat.create_index([("user_id", 1), ("timestamp", -1)])
            
            # Settings: Index on user_id
            await self.db.settings.create_index("user_id", unique=True)
            
            logger.info("MongoDB indexes created successfully.")
        except Exception as e:
            logger.warning(f"Could not initialize indexes (likely already exist): {e}")

    async def close_mongo_connection(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

db_manager = Database()

def get_db():
    return db_manager.db
