from fastapi import APIRouter,status,Query,Header,File,UploadFile,Request,Form,Depends,HTTPException
from validations.course import Create_Course_Validation,Post_Questions_Validation
from utils.firebase import upload_course_video
from utils.helper import Video
from config.database import questions_collection,courses_collection,client,enrollments_collection,ratings_collection,users_collection
from models.course import Course as CourseModel
from utils.helper import success_response
from bson import ObjectId
from schemas.course import course_group_serializer,course_individual_serializer
from utils.jwt import *
from models.course import VisibilityStatus,CourseStatus
from validations.course import Post_Rating_Validation,Post_Answers_Validation
from models.user import UserType
from middleware.permission import validate_permission

router = APIRouter()


@router.post("/",status_code=status.HTTP_201_CREATED)
async def create_course(validator : Create_Course_Validation = Depends(Create_Course_Validation),
                        video : UploadFile = File(None),accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        
        course = CourseModel(validator.title,validator.description,validator.tags,None,validator.visibility_status,
                    validator.price,0,validator.prerequisites,validator.course_difficulty)
        if video is not None:
            url = await upload_course_video(video)
            course.intro_video_url = url
        course_dict = vars(course)
        result = await courses_collection.insert_one(course_dict)              
        return success_response("Successfully added a new course",[{
            "_id" : str(result.inserted_id)
        }])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    

    
@router.get("/",status_code=status.HTTP_200_OK)
async def get_courses():
    try:
        courses = await courses_collection.find().to_list(None)
        return success_response("Courses fetched successfully.",course_group_serializer(courses))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Failed to fetch courses.")

@router.get("/enrollments",status_code=status.HTTP_200_OK)
async def get_enrollments(given_date_str : str = Query(...,regex=r"^\d{4}-\d{2}-\d{2}$"),accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        end_date = datetime.strptime(given_date_str, "%Y-%m-%d")
        end_date = end_date + timedelta(days=1)      
        start_date = end_date - timedelta(days=30)
        pipeline = [
            {
                "$match" : {
                    "created_at" : {
                        "$gte" : start_date,
                        "$lte" : end_date
                    }
                }
            },
            {
                "$project" : {
                    "_id": {"$toString": "$_id"},
                    "user_id" : {"$toString": "$user_id"},
                    "course_id" : {"$toString": "$course_id"},
                    "created_at" : 1,
                    "price" : 1
                }
            }
        ]
        result = await enrollments_collection.aggregate(pipeline).to_list(None)
        return success_response("Fetched all the enrollments of past one month successfully.",result)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    


@router.post("/ratings",status_code=status.HTTP_201_CREATED)
async def post_rating(validator : Post_Rating_Validation, accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated.")
        payload = verify_access_token(accessToken)
        
        enrollment = await enrollments_collection.find_one({
            "user_id" : ObjectId(payload["user_id"]),
            "course_id" : ObjectId(validator.course_id)
        })
        if enrollment is None:
            raise HTTPException(status_code=403,detail="You are not enrolled into the course.")
        
        
        rating_dict = {
            "user_id" : ObjectId(payload["user_id"]),
            "course_id" : ObjectId(validator.course_id),
            "rating" : validator.rating,
            "review" : validator.review
        }
        
        
        course = await courses_collection.find_one({
            "_id" : ObjectId(validator.course_id)
        })
        
        async with await client.start_session() as session:
            async with session.start_transaction():
                result = await ratings_collection.insert_one(rating_dict,session=session)
                await courses_collection.update_one({
                    "_id" : ObjectId(validator.course_id)
                },{
                    "$inc" : {
                        "total_rating_count" : 1
                    },
                    "$set":{
                        "rating" : (course["rating"]*course["total_rating_count"] + validator.rating )/(course["total_rating_count"]+1)
                    }
                },session=session)
        
        return success_response('Rating posted successfully.',[])
        
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    

@router.post("/questions",status_code=status.HTTP_200_OK)
async def post_question(validator : Post_Questions_Validation,accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated")
        payload = verify_access_token(accessToken)
        question_dict = {
            "course_id" : ObjectId(validator.course_id),
            "user_id" : ObjectId(payload["user_id"]),
            "question" : validator.question,
            "asked_at" : datetime.now(),
            "answered"  : False,
            "answer" : None,
            "answered_at" : None
        }
        await questions_collection.insert_one(question_dict)
        return success_response("Your question has been successfully added.",[])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")  


@router.post("/answers",status_code=status.HTTP_201_CREATED)
async def post_answer(validator : Post_Answers_Validation,accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        await questions_collection.update_one({
            "_id" : ObjectId(validator.question_id)
        },{
            "$set" : {
                "answer" : validator.answer,
                "answered" : True,
                "answered_at" : datetime.now()
            }
        })
        
        return success_response("Successfully answered the question.",[])
        
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")  
    
            
@router.get("/{course_id}",status_code=status.HTTP_200_OK)
async def get_course(course_id : str):
    pipeline = [
        # Match the course by its ID
        {"$match": {"_id": ObjectId(course_id)}},
        # Lookup sections for the matched course
        {
            "$lookup": {
                "from": "sections",
                "localField": "_id",
                "foreignField": "course_id",
                "as": "sections"
            }
        },
        # Unwind sections array
        {"$unwind": "$sections"},
        # Lookup lessons for each section
        {
            "$lookup": {
                "from": "lessons",
                "localField": "sections._id",
                "foreignField": "section_id",
                "as": "sections.lessons"
            }
        },
        {
            "$project": {
                "sections": {
                    "_id": {"$toString": "$sections._id"},  # Convert ObjectId to string
                    "title": "$sections.title",
                    "duration" : "$sections.duration",
                    "total_lessons" : "$sections.total_lessons",
                    "section_number" : "$sections.section_number",
                    "lessons": {
                        "$map": {
                            "input": "$sections.lessons",
                            "as": "lesson",
                            "in": {
                                "_id": {"$toString": "$$lesson._id"},
                                "title": "$$lesson.title",
                                "description": "$$lesson.description",
                                "duration": "$$lesson.duration",
                                "lesson_number": "$$lesson.lesson_number",
                            }
                        }
                    }
                },
                "title": 1,
                "description": 1,
                "tags": 1,
                "intro_video_url": 1,
                "visibility_status": 1,
                "duration": 1,
                "prerequisites": 1,
                "course_difficulty": 1,
                "rating": 1,
                "total_rating_count": 1,
                "enrollment_count": 1,
                "total_sections": 1,
                "total_lessons" : 1
                
                # Project other fields as needed
            }
        },
        # Group by course id to group sections
        {
            "$group": {
                "_id": {"$toString": "$_id"},  # Convert ObjectId to string
                "title": {"$first": "$title"},
                "description": {"$first": "$description"},
                "tags": {"$first": "$tags"},
                "intro_video_url": {"$first": "$intro_video_url"},
                "visibility_status": {"$first": "$visibility_status"},
                "duration": {"$first": "$duration"},
                "prerequisites": {"$first": "$prerequisites"},
                "course_difficulty": {"$first": "$course_difficulty"},
                "rating": {"$first": "$rating"},
                "total_rating_count": {"$first": "$total_rating_count"},
                "enrollment_count": {"$first": "$enrollment_count"},
                "total_sections": {"$first": "$total_sections"},
                "total_lessons": {"$first": "$total_lessons"},
                "sections": {"$push": "$sections"}
            }
        }
        # You can add more stages as needed
    ]
    courses_with_sections_and_lessons = await courses_collection.aggregate(pipeline).to_list(None)
    return success_response("Course fetched successfully.",courses_with_sections_and_lessons)

         

  
@router.get("/ratings/{course_id}",status_code=status.HTTP_200_OK)
async def get_ratings(course_id : str):
    course = await courses_collection.find_one({
        "_id" : ObjectId(course_id)
    })
    
    if course is None:
        raise HTTPException(status_code=400,detail="Course not found.")
    
    pipeline = [
        {"$match": {"course_id": ObjectId(course_id)}},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$project" : {
                "_id" : {"$toString": "$_id"},
                "rating" : 1,
                "review" : 1,
                "user.image" : 1,
                "user.name" : 1
            }
        }
    ]
    
    result = await ratings_collection.aggregate(pipeline).to_list(None)
    return success_response("Rating fetched successfully.",result)

@router.get("/questions/{course_id}",status_code=status.HTTP_200_OK)
async def get_questions(course_id : str):
    course = await courses_collection.find_one({
        "_id" : ObjectId(course_id)
    })
    
    if course is None:
        raise HTTPException(status_code=400,detail="Course not found.")
    
    pipeline = [
        {"$match": {"course_id": ObjectId(course_id)}},
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$project" : {
                "_id" : {"$toString": "$_id"},
                "question" : 1,
                "user.image" : 1,
                "user.name" : 1,
                "answered" : 1,
                "asked_at" : 1,
                "answer" : 1,
                "answered_at" : 1
            }
        }
    ]
    
    result = await questions_collection.aggregate(pipeline).to_list(None)
    return success_response("Questions fetched successfully.",result)
     
@router.post("/enroll/{course_id}",status_code=status.HTTP_200_OK)
async def course_enroll(course_id : str,accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Unauthenticated")
        payload = verify_access_token(accessToken)

        course = await courses_collection.find_one({"_id" : ObjectId(course_id)})
        if course is None:
            raise HTTPException(status_code=404,detail="Course not found")
        
        
        enroll_dict = {
            "user_id" : ObjectId(payload["user_id"]),
            "course_id" : ObjectId(course_id),
            "created_at" : datetime.now(),
            "price" : course["price"],
            "completed_lessons" : [],
            "completed_at" : None,
            "status" : CourseStatus.ONGOING
        }
        
        prev_enrollment = await enrollments_collection.find_one({
            "course_id" : enroll_dict["course_id"],
            "user_id" : enroll_dict["user_id"]
        })
        
        if prev_enrollment is not None:
            raise HTTPException(400,detail="You are already enrolled into the course.")
        
        async with await client.start_session() as session:
            async with session.start_transaction():
                await enrollments_collection.insert_one(enroll_dict,session=session)
                await courses_collection.update_one({
                    "_id" : ObjectId(course_id)
                },{
                    "$inc" : {
                        "total_enrollment_count" : 1
                    }
                },session=session)
        return success_response("You have been successfully enrolled into the course.",[])
        
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")    

