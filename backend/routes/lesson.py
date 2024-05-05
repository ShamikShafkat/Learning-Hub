from fastapi import APIRouter,status,HTTPException,Depends,Header,UploadFile,File
from validations.lesson import Create_Lesson_Validation
from models.lesson import Lesson as LessonModel
from config.database import enrollments_collection,sections_collection,lessons_collection,client,courses_collection
from bson import ObjectId
from utils.firebase import upload_lesson_video,upload_pdf
from utils.helper import success_response
from utils.jwt import *
from models.course import CourseStatus
from middleware.permission import validate_permission

router = APIRouter()

@router.post("/",status_code=status.HTTP_201_CREATED)
async def create_lesson(validator : Create_Lesson_Validation = Depends(Create_Lesson_Validation),
                        video : UploadFile = File(None),pdf : UploadFile = File(None),accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        #first check section exists or not
        section = await sections_collection.find_one({
            "_id" : ObjectId(validator.section_id)
        })
        if section is None:
            raise HTTPException(status_code=404,detail="Section does not exist.")
        
        #check same numbered lesson exists or not
        section_lesson = await lessons_collection.find_one({
            "section_id" : ObjectId(validator.section_id),
            "lesson_number" : validator.lesson_number
        })
        if section_lesson is not None:
            raise HTTPException(status_code=400,detail="Lesson number already exists for this section.")
        
        #check same title lesson exists or not
        section_lesson = await lessons_collection.find_one({
            "section_id" : ObjectId(validator.section_id),
            "title" : validator.title
        })
        if section_lesson is not None:
            raise HTTPException(status_code=400,detail="Lesson title already exists for this section.")
        
        
        lesson = LessonModel(validator.title,validator.section_id,validator.description,
                            None,None,validator.duration,validator.lesson_number)
        
        
        if video is not None:
            print("Uploading Video.....")
            url = await upload_lesson_video(video)
            print("Video uploaded")
            lesson.video_url = url
            
        if pdf is not None:
            url = await upload_pdf(pdf)
            lesson.pdf_url = url
            
        lesson_dict = vars(lesson)
        lesson_dict["section_id"] = ObjectId(lesson_dict["section_id"])
        result  = None
        
        async with await client.start_session() as session:
            async with session.start_transaction():
                result = await lessons_collection.insert_one(lesson_dict,session=session)
                await sections_collection.update_one({
                    "_id" : ObjectId(validator.section_id)
                },{
                    "$inc" : {
                        "total_lessons" : 1,
                        "duration" : validator.duration
                    }
                },session=session)
                await courses_collection.update_one({
                    "_id" : ObjectId(section["course_id"])
                },{
                    "$inc" : {
                        "duration" : validator.duration,
                        "total_lessons" : 1
                    }
                },session=session)
        
        return success_response("Lesson created successfully.",[{
            "_id" : str(result.inserted_id)
        }])
    
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    

    
@router.get("/{lesson_id}",status_code=status.HTTP_200_OK)
async def get_lesson(lesson_id : str,accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated")
        
        payload = verify_access_token(accessToken)
        
        lesson = await lessons_collection.find_one({
            "_id" : ObjectId(lesson_id)
        })
        section = await sections_collection.find_one({"_id" : lesson["section_id"]})

        enrollment = await enrollments_collection.find_one({"course_id" : section["course_id"],
                                                            "user_id" : ObjectId(payload["user_id"])})
        
        if enrollment is None:
            raise HTTPException(status_code=401,detail="You are not enrolled into the course.")
        
        lesson["_id"] = str(lesson["_id"])
        lesson["section_id"] = str(lesson["section_id"])
        return success_response("Lesson fetched successfully.",[lesson])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    
    
@router.put("/completed/{course_id}/{lesson_id}",status_code=status.HTTP_200_OK)
async def complete_lesson(course_id : str,lesson_id : str,accessToken : str =Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated")
        payload = verify_access_token(accessToken)
        enrollment = await enrollments_collection.find_one({
            "course_id" : ObjectId(course_id),
            "user_id" : ObjectId(payload["user_id"])
        })
        if enrollment is None:
            raise HTTPException(status_code=403,detail="You are enrolled in the course")
        
        
        course = await courses_collection.find_one({
            "_id" : ObjectId(course_id)
        })
        
        if lesson_id not in enrollment["completed_lessons"]:
            if course["total_lessons"] == (len(enrollment["completed_lessons"]) + 1):
                await enrollments_collection.update_one({
                    "course_id" : ObjectId(course_id),
                    "user_id" : ObjectId(payload["user_id"])
                },{
                    "$set" : {
                        "status" : CourseStatus.COMPLETED
                    },
                    "$push" : {
                        "completed_lessons" : lesson_id
                    }
                })
                return success_response("You have completed the lesson.",[{
                    "status" : CourseStatus.COMPLETED
                }])
            else:
                await enrollments_collection.update_one({
                    "course_id" : ObjectId(course_id),
                    "user_id" : ObjectId(payload["user_id"])
                },{
                    "$push" : {
                        "completed_lessons" : lesson_id
                    }
                })
                return success_response("You have completed the lesson.",[{
                    "course_status" : CourseStatus.ONGOING
                }])
        else:
            return success_response("You have already completed the lesson.",[])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    
    