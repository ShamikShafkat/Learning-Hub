from fastapi import APIRouter, Request, Response,status,HTTPException,Header
from config.database import users_collection,client
from schemas.user import user_group_serializer,create_user_class_to_dict,user_individual_serializer
from utils.helper import success_response,generate_random_string
from utils.jwt import *
from utils.mail_send import email_verification_code_send
from dotenv import load_dotenv
from bson import ObjectId
from validations.user import Update_Profile_Validation,Change_Password_Validation
import os
import binascii
from models.user import User as UserModel,VerificationCode
from utils.firebase import upload_image_from_base64
from middleware.permission import validate_permission

load_dotenv()

REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES"))
DEFAULT_IMAGE_PATH = os.getenv("PROFILE_PICTURE")

router = APIRouter()

@router.get("/",status_code=status.HTTP_200_OK)
async def get_users(accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        return success_response("Users fetched successfully.",user_group_serializer(await users_collection.find().to_list(None)))
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    

@router.put("/change_password",status_code=status.HTTP_200_OK)
async def change_password(validator: Change_Password_Validation,accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Access Token not provided in header.")
        payload = verify_access_token(accessToken)
        
        user = await users_collection.find_one({"_id" : ObjectId(payload["user_id"])})
        if(verify_hashed_token(validator.old_password,user["password"])):
            hashed_password = get_hashed_token(validator.new_password)
            result = await users_collection.update_one({"_id" : ObjectId(payload["user_id"])},{
                "$set" : {
                    "password" : hashed_password
                }
            })
            
            if not result.modified_count:
                raise HTTPException(status_code=500,detail="Failed to update user password. Please try again.")
            
            return success_response("Your password has been changed successfully.",[])
            
        else:
            raise HTTPException(status_code=400,detail="Incorrect password.")
    
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")
    
@router.put("/update_profile",status_code=status.HTTP_200_OK)
async def update_profile(validator : Update_Profile_Validation,accessToken : str = Header(None)):
    try :
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Access Token not provided in header")
        payload  = verify_access_token(accessToken)
        async with await client.start_session() as session : 
            async with session.start_transaction():
                if validator.image : 
                    url = upload_image_from_base64(validator.image,payload["user_id"])
                    result = await users_collection.update_one({"_id" : ObjectId(payload["user_id"])},{
                        "$set" : {
                            "image" : url
                        }
                    },session=session)
                    
                if validator.name : 
                    result = await users_collection.update_one({"_id" : ObjectId(payload["user_id"])},{
                        "$set" : {
                            "name" : validator.name
                        }
                    },session=session)
                    
                    
                if validator.phone_number : 
                    prev_user = await users_collection.find_one({
                        "phone_number" : validator.phone_number
                    },session=session)
                    
                    if prev_user and str(prev_user["_id"])!=payload["user_id"] : 
                        raise HTTPException(status_code=400,detail="Phone number already exists.")
                    
                    result = await users_collection.update_one({"_id" : ObjectId(payload["user_id"])},{
                        "$set" : {
                            "phone_number" : validator.phone_number
                        }
                    },session=session)
                    
                return success_response("User profile updated successfully.",[])
    except binascii.Error as e: 
        raise HTTPException(status_code=400, detail="Invalid Base64 string provided")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")

@router.get("/profile",status_code=status.HTTP_200_OK)
async def profile_details(accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated")
        payload = verify_access_token(accessToken)
        user_id = payload["user_id"]
        pipeline = [
            {
                "$match" : {
                    "_id" : ObjectId(user_id)
                },
            },
            {
                "$lookup": {
                    "from": "enrollments",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "enrollments"
                },
            },
            {
                "$unwind" : {
                    "path" : "$enrollments",
                    "preserveNullAndEmptyArrays" : True
                }
            },
            {
                "$lookup" : {
                    "from" : "courses",
                    "localField" : "enrollments.course_id",
                    "foreignField" : "_id",
                    "as" : "enrollments.courses"
                }
            },
            {
                "$project": {
                    "enrollments": {
                        "_id": {"$toString": "$enrollments._id"},  # Convert ObjectId to string
                        "price": "$enrollments.price",
                        "created_at" : "$enrollments.created_at",
                        "completed_lessons" : "$enrollments.completed_lessons",
                        "status" : "$enrollments.status",
                        "courses": {
                            "$map": {
                                "input": "$enrollments.courses",
                                "as": "course",
                                "in": {
                                    "_id": {"$toString": "$$course._id"},
                                    "title": "$$course.title",
                                    "description": "$$course.description",
                                    "duration": "$$course.duration",
                                    "total_lessons": "$$course.total_lessons",
                                }
                            }
                        }
                    },
                    "name": 1,
                    "email": 1,
                    "image": 1,
                    "phone_number": 1,
                    "role": 1
                }
            },
            # Group by course id to group sections
            {
                "$group": {
                    "_id": {"$toString": "$_id"},  # Convert ObjectId to string
                    "name": {"$first": "$name"},
                    "email": {"$first": "$email"},
                    "image": {"$first": "$image"},
                    "phone_number": {"$first": "$phone_number"},
                    "role": {"$first": "$role"},
                    "enrollmemts": {"$push": "$enrollments"}
                }
            }
            
        ]
        
        user = await users_collection.aggregate(pipeline).to_list(None)
        if not len(user) :
            raise HTTPException(status_code=404,detail="User not found.")
        return success_response("User fethced successfully.",user)
    
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")   

@router.get("/{userId}",status_code=status.HTTP_200_OK)
async def get_user(userId : str,accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        pipeline = [
            {
                "$match" : {
                    "_id" : ObjectId(userId)
                },
            },
            {
                "$lookup": {
                    "from": "enrollments",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "enrollments"
                },
            },
            {
                "$unwind" : {
                    "path" : "$enrollments",
                    "preserveNullAndEmptyArrays" : True
                }
            },
            {
                "$lookup" : {
                    "from" : "courses",
                    "localField" : "enrollments.course_id",
                    "foreignField" : "_id",
                    "as" : "enrollments.courses"
                }
            },
            {
                "$project": {
                    "enrollments": {
                        "_id": {"$toString": "$sections._id"},  # Convert ObjectId to string
                        "price": "$enrollments.price",
                        "created_at" : "$enrollments.created_at",
                        "completed_lessons" : "$enrollments.completed_lessons",
                        "status" : "$enrollments.status",
                        "courses": {
                            "$map": {
                                "input": "$enrollments.courses",
                                "as": "course",
                                "in": {
                                    "_id": {"$toString": "$$course._id"},
                                    "title": "$$course.title",
                                    "description": "$$course.description",
                                    "duration": "$$course.duration",
                                    "total_lessons": "$$course.total_lessons",
                                }
                            }
                        }
                    },
                    "name": 1,
                    "email": 1,
                    "image": 1,
                    "phone_number": 1,
                    "role": 1
                }
            },
            # Group by course id to group sections
            {
                "$group": {
                    "_id": {"$toString": "$_id"},  # Convert ObjectId to string
                    "name": {"$first": "$name"},
                    "email": {"$first": "$email"},
                    "image": {"$first": "$image"},
                    "phone_number": {"$first": "$phone_number"},
                    "role": {"$first": "$role"},
                    "enrollmemts": {"$push": "$enrollments"}
                }
            }
            
        ]
        
        user = await users_collection.aggregate(pipeline).to_list(None)
        if not len(user) :
            raise HTTPException(status_code=404,detail="User not found.")
        return success_response("User fethced successfully.",user)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    
