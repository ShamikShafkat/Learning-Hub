from fastapi import APIRouter,status,Request,Response,Depends,HTTPException,Header
from validations.section import Create_Section_Validation
from models.section import Section as SectionModel
from config.database import courses_collection,sections_collection,client
from bson import ObjectId
from utils.helper import success_response
from middleware.permission import validate_permission
from utils.jwt import *

router = APIRouter()

@router.post("/",status_code=status.HTTP_201_CREATED)
async def create_section(validator : Create_Section_Validation,accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        course = await courses_collection.find_one({"_id" : ObjectId(validator.course_id)})
        if course is None:
            raise HTTPException(status_code=404,detail="Course does not exist.")
        
        course_section = await sections_collection.find_one({
            "course_id" : ObjectId(validator.course_id),
            "section_number" : validator.section_number
        })
            
        if course_section is not None:
            raise HTTPException(status_code=400,detail="Section number already exists.")
        
        course_section = await sections_collection.find_one({
            "course_id" : ObjectId(validator.course_id),
            "title" : validator.title
        })
        
        if course_section is not None:
            raise HTTPException(status_code=400,detail="This course has same title section already.")
        
        section = SectionModel(validator.title,validator.course_id,validator.section_number)
        section_dict = vars(section)
        section_dict["course_id"] = ObjectId(section_dict["course_id"])
        result = None
        async with await client.start_session() as session:
            async with session.start_transaction():    
                result = await sections_collection.insert_one(section_dict,session)
                await courses_collection.update_one({
                    "_id" : ObjectId(validator.course_id)
                },{
                    "$inc" : {
                        "total_sections" : 1
                    }
                },session=session)
                
        return success_response("Successfully created the section",[{
            "_id" : str(result.inserted_id)
        }])
        
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    
