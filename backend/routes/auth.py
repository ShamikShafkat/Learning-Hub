from fastapi import APIRouter, Request, Response,status,HTTPException,Header
from config.database import users_collection
from schemas.user import user_group_serializer,create_user_class_to_dict,user_individual_serializer
from validations.auth import User_Create_Validation,Email_Verification_Validation,Login_Validation
from validations.auth import Forget_Password_Initiate_Validation,Forget_Password_Confirm_Validation
from utils.helper import success_response,generate_random_string
from utils.jwt import *
from utils.mail_send import email_verification_code_send,forget_password_verification_code_send
from dotenv import load_dotenv
from bson import ObjectId
import os
from models.user import User as UserModel,VerificationCode,UserType
from middleware.permission import validate_permission
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from authlib.integrations.starlette_client import OAuthError


load_dotenv()
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES"))
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES"))
DEFAULT_IMAGE_PATH = os.getenv("PROFILE_PICTURE")

router = APIRouter()
# oauth = OAuth()

# Define Google OAuth credentials
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:5000/auth/google/callback"
AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
USER_INFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"
SECRET_KEY = os.getenv("SECRET_KEY")

# oauth.register(
#     name="google",
#     client_id=CLIENT_ID,
#     client_secret=CLIENT_SECRET,
#     authorize_url=AUTH_BASE_URL,
#     access_token_url=TOKEN_URL,
#     client_kwargs={"scope": "openid email profile"},
# )


config_data = {'GOOGLE_CLIENT_ID': CLIENT_ID, 'GOOGLE_CLIENT_SECRET': CLIENT_SECRET}
starlette_config = Config(environ=config_data)
oauth = OAuth(starlette_config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)


@router.post("/register",status_code=status.HTTP_201_CREATED)
async def register(user : User_Create_Validation):
    #first check whether the email already exists or not
    prev_user = await users_collection.find_one({"email" : user.email})
    if prev_user is not None:
        raise HTTPException(status_code=400,detail="Email already exists.")
    
    #hash the password
    hashed_password = get_hashed_token(user.password)
    user.password = hashed_password
    
    #generate email verification code
    token = generate_random_string(6)
    hashed_token = get_hashed_token(token)
    expiry_time = datetime.now() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    email_verification_code = VerificationCode(hashed_token,expiry_time)
    
    #create new user model
    new_user = UserModel(user.name,user.email,hashed_password,DEFAULT_IMAGE_PATH,user.phone_number,
                         email_verification_code=email_verification_code)
    
    #send email verification code to user
    result = await email_verification_code_send(user.email,token)
    if not result:
        raise HTTPException(status_code=404,detail="Email not found.")
    
    #convert class to dict for mongodb
    user_dict = create_user_class_to_dict(new_user)    
                
    #create user in mongodb
    result = await users_collection.insert_one(user_dict)
        
    #send response
    return success_response("Your account has been created successfully. Please verify your email before login.",[{
        "_id" : str(result.inserted_id)
    }])

@router.post("/verifyEmail",status_code=status.HTTP_200_OK)
async def email_verification(validator : Email_Verification_Validation):
    #check whether email exists or not
    current_user = await users_collection.find_one({"email" : validator.email})
    if not current_user:
        raise HTTPException(status_code=404,detail="Email not found.")
    
    #random api call prevention
    if not current_user["email_verification_code"]:
        raise HTTPException(status_code=400,detail="Invalid request.")
    
    #check verification code is valid or not
    email_verification_code = current_user["email_verification_code"]
    if not verify_hashed_token(validator.token,email_verification_code["token"]):
        raise HTTPException(status_code=400,detail="Invalid verification code provided.")
    current_time = datetime.now() 
    if current_time > email_verification_code["expiry_time"]:
        token = generate_random_string(6)
        hashed_token = get_hashed_token(token)
        expiry_time = datetime.now() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
        email_verification_code = VerificationCode(hashed_token,expiry_time)
        result = await email_verification_code_send(validator.email,token)
        if not result:
            raise HTTPException(status_code=404,detail="Email not found.")
        result = await users_collection.update_one({"email" : validator.email},{"$set":{
            "email_verification_code" : vars(email_verification_code)
        }})
        
        if not result.modified_count:
            raise HTTPException(status_code=500,detail="Some error occured, please try again.")
        
        raise HTTPException(status_code=400,detail="Your verification code has been expired. A new code has been sent to your account.")

    #update verification status
    result = await users_collection.update_one({"email" : validator.email},{"$set" : {
        "is_email_verified" : True,
        "email_verification_code" : None
    }})
    
    if not result.modified_count:
        raise HTTPException(status_code=500,detail="Failed to verify email. Please try again.")
    
    return success_response("Successfully verified your account.",[])
    
@router.post("/login",status_code=status.HTTP_200_OK)
async def login(validator : Login_Validation,response : Response):
    user = await users_collection.find_one({"email" : validator.email})
    if not user :
        raise HTTPException(status_code=404,detail="User not found.")
    if(verify_hashed_token(validator.password,user["password"])):
        if not user["is_email_verified"]:
            raise HTTPException(status_code=400,detail="Your email is not verified. Please verify your email first.")
        
        accessToken = create_access_token(str(user["_id"]))
        refreshToken = create_refresh_token(str(user["_id"]))
        hashed_refreshToken = get_hashed_token(refreshToken)
        response.headers["accessToken"] = accessToken
        response.set_cookie(key="refreshToken",value=refreshToken,httponly=True,samesite="strict",secure=False,max_age=60*REFRESH_TOKEN_EXPIRE_MINUTES)
        result = await users_collection.update_one({"email" : validator.email},{"$set":{
            "refresh_token" : hashed_refreshToken
        }})
        
        if not result.modified_count:
            raise HTTPException(status_code=500,detail="Failed to login, please try again.")
        
        return success_response("Successfully logged in.",[user_individual_serializer(user)])            
    else:
        raise HTTPException(status_code=404,detail="Incorrect password.")

@router.post("/forget_password/initiate",status_code=status.HTTP_200_OK)
async def forget_password_initiate(validator : Forget_Password_Initiate_Validation):
    user = await users_collection.find_one({"email" : validator.email})
    if not user:
        raise HTTPException(status_code=404,detail="Email not found.")
    
    token = generate_random_string(6)
    hashed_token = get_hashed_token(token)
    expiry_time = datetime.now() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    forget_password_verification_code = VerificationCode(hashed_token,expiry_time)
    result = await forget_password_verification_code_send(validator.email,token)
    if not result:
        raise HTTPException(status_code=404,detail="Email not found.")
    result = await users_collection.update_one({"email" : validator.email},{"$set":{
        "forget_password_verification_code" : vars(forget_password_verification_code)
    }})
        
    if not result.modified_count:
        raise HTTPException(status_code=500,detail="Some error occured, please try again.")

    return success_response("A password reset code has been sent to your email.",[])
    
@router.put("/forget_password/confirm",status_code=status.HTTP_200_OK)
async def forget_password_confirm(validator : Forget_Password_Confirm_Validation):
    #check whether email exists or not
    current_user = await users_collection.find_one({"email" : validator.email})
    if not current_user:
        raise HTTPException(status_code=404,detail="Email not found.")
    
    #random api call prevention
    if not current_user["forget_password_verification_code"]:
        raise HTTPException(status_code=400,detail="Invalid request.")
    
    #check verification code is valid or not
    forget_password_verification_code = current_user["forget_password_verification_code"]
    if not verify_hashed_token(validator.token,forget_password_verification_code["token"]):
        raise HTTPException(status_code=400,detail="Invalid verification code provided.")
    current_time = datetime.now() 
    if current_time > forget_password_verification_code["expiry_time"]:
        raise HTTPException(status_code=400,detail="Your verification code has been expired.")

    #update password 
    hashed_password = get_hashed_token(validator.password)
    result = await users_collection.update_one({"email" : validator.email},{"$set" : {
        "forget_password_verification_code" : None,
        "password" : hashed_password    
    }})
    
    if not result.modified_count:
        raise HTTPException(status_code=500,detail="Failed to reset password. Please try again.")
    
    return success_response("Your password has been reset successfully.",[])
    
@router.post("/logout",status_code=status.HTTP_200_OK)
async def logout(accessToken : str = Header(None)):
    try:
        if accessToken is None:
            raise HTTPException(status_code=401,detail="Access token not provided in header.")
        payload = verify_access_token(accessToken)
        user = await users_collection.find_one({"_id" : ObjectId(payload["user_id"])})
        if user is None:
            raise HTTPException(status_code=400,detail="Invalid access token.")
        result = await users_collection.update_one({"_id":ObjectId(payload["user_id"])},{
            "$set" : {
                "refresh_token" : None
            }
        })
        
        if not result.modified_count:
            raise HTTPException(status_code=500,detail="Some error occured. Please try again.")
        
        return success_response("Logged out successfully.",[])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")
    
@router.post("/admins/register",status_code=status.HTTP_201_CREATED)
async def create_admin(validator : User_Create_Validation, accessToken : str = Header(None)):
    try:
        await validate_permission(accessToken)
        
        #first check whether the email already exists or not
        prev_user = await users_collection.find_one({
            "$or": [
                {"email": validator.email},
                {"phone_number": validator.phone_number}
        ]
        })
        if prev_user is not None:
            if prev_user["email"] == validator.email:
                raise HTTPException(status_code=400,detail="Email already exists.")
            else:
                raise HTTPException(status_code=400,detail="Phone number already exists.")
                
        #hash the password
        hashed_password = get_hashed_token(validator.password)
        validator.password = hashed_password
        
        #generate email verification code
        token = generate_random_string(6)
        hashed_token = get_hashed_token(token)
        expiry_time = datetime.now() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
        email_verification_code = VerificationCode(hashed_token,expiry_time)
        
        #create new user model
        new_user = UserModel(validator.name,validator.email,hashed_password,DEFAULT_IMAGE_PATH,validator.phone_number,
                            email_verification_code=email_verification_code,role=UserType.ADMIN)
        
        #send email verification code to user
        result = await email_verification_code_send(validator.email,token)
        if not result:
            raise HTTPException(status_code=404,detail="Email not found.")
        
        #convert class to dict for mongodb
        user_dict = create_user_class_to_dict(new_user)    
                    
        #create user in mongodb
        result = await users_collection.insert_one(user_dict)
            
        #send response
        return success_response("Admin created successfully.",[{
            "_id" : str(result.inserted_id)
        }])
            
    except ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Your access token has been expired")
    except JWTError:
        raise HTTPException(status_code=401,detail="Your access token is not valid")
    


#error code , not implemented
@router.get("/google")
async def auth_google(request: Request):
    redirect_uri = REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def auth_google_callback(request: Request):
    print("Yes")
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        print(e)
    # resp = await oauth.google.parse_id_token(request, token)
    # user_info = await oauth.google.get(
    #     USER_INFO_URL, token=token
    # )
    # print(user_info)
    # return {"user_info": user_info}
    return "Success"

