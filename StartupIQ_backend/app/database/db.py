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
            # Use 'startupiq' as the default database if not specified in URI
            self.db = self.client.get_database("startupiq")
            # Send a ping to confirm a successful connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB.")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise e

    async def close_mongo_connection(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

db_manager = Database()

def get_db():
    return db_manager.db
