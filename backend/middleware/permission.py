from fastapi import HTTPException
from utils.jwt import *
from config.database import users_collection
from bson import ObjectId
from models.user import UserType

async def validate_permission(accessToken):
    if accessToken is None:
        raise HTTPException(status_code=401,detail="Unauthorized")
    payload = verify_access_token(accessToken)
    current_user_id = payload["user_id"]
    current_user = await users_collection.find_one({
        "_id" : ObjectId(current_user_id)
    })
        
    if current_user["role"]!=UserType.ADMIN:
        raise HTTPException(status_code=403,detail="You are not authorized to do the task.")
        
    return True
    