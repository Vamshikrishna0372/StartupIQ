from datetime import timedelta
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.database.collections import get_user_collection
from app.schemas.user import UserCreate, UserLogin, TokenData
from bson import ObjectId
from datetime import datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_user_by_email(email: str):
    users_col = get_user_collection()
    return await users_col.find_one({"email": email})

async def create_new_user(user_in: UserCreate):
    users_col = get_user_collection()
    
    # Check for duplicate email
    if await get_user_by_email(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    user_dict = user_in.dict()
    user_dict["password"] = get_password_hash(user_in.password)
    user_dict["created_at"] = datetime.utcnow()
    
    result = await users_col.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

async def authenticate_user(user_login: UserLogin):
    user = await get_user_by_email(user_login.email)
    if not user:
        return False
    if not verify_password(user_login.password, user["password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    user = await get_user_by_email(token_data.email)
    if user is None:
        raise credentials_exception
    
    # Keep ObjectId for database compatibility
    return user
