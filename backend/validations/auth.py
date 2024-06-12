from pydantic import BaseModel, Field,validator,ConfigDict
from typing import Optional


class User_Create_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    name :str = Field(...,examples=["Shamik"],description="Name of the user",min_length=1)
    email : str = Field(...,examples=['shamik@gmail.com'],description='Email field of an user',pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password : str = Field(...,examples=['123456'],description="Password field of an user",min_length=6)
    phone_number : str = Field(...,examples=["01313259855"],description="Phone number of the user",pattern=r"^01[3-9]\d{8}$")
    
class Email_Verification_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    email : str = Field(...,examples=['shamik@gmail.com'],description='Email field of an user',pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    token : str = Field(...,examples=["xX1fg2"],description="The verification code sent to the user email.",min_length=6,max_length=6)
    
class Login_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    email : str = Field(...,examples=['shamik@gmail.com'],description='Email field of an user',pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password : str = Field(...,examples=['123456'],description="Password field of an user",min_length=6)
    
class Forget_Password_Initiate_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    email : str = Field(...,examples=['shamik@gmail.com'],description='Email field of an user',pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    
    
class Forget_Password_Confirm_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    email : str = Field(...,examples=['shamik@gmail.com'],description='Email field of an user',pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    token : str = Field(...,examples=["xX1fg2"],description="The verification code sent to the user email.",min_length=6,max_length=6)
    password : str = Field(...,examples=['123456'],description="Password field of an user",min_length=6)
    