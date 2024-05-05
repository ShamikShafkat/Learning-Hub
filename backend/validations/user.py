from pydantic import BaseModel, Field,validator,ConfigDict
from typing import Optional


class Update_Profile_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    name : Optional[str] = Field(None,examples=["Shamik"],description="Name of the user",min_length=1)
    phone_number : Optional[str] = Field(None,examples=["01313259855"],description="Phone number of the user",pattern=r"^01[3-9]\d{8}$")
    image : Optional[str] = Field(None,examples=["A valid base-64 string"],description="Image of the user in base-64 format")
    
class Change_Password_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    old_password : str = Field(...,examples=['123456'],description="Password field of an user",min_length=6)
    new_password : str = Field(...,examples=['123456'],description="Password field of an user",min_length=6)
    