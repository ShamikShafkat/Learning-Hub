from pydantic import BaseModel, Field,validator,ConfigDict,conlist
from typing import Optional,Any,List
from fastapi import Form
from models.course import VisibilityStatus,CourseDifficulty

def form_body(cls):
    cls.__signature__ = cls.__signature__.replace(
        parameters=[
            arg.replace(default=Form(...))
            for arg in cls.__signature__.parameters.values()
        ]
    )
    return cls



@form_body
class Create_Lesson_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    title : str = Field(...,examples=["Introduction to ReactJS"],description="Title of the lesson",min_length=1)
    section_id : str = Field(...,examples=["66328fa5873988b658e55059"],description="Id of the section that the lesson belongs",min_length=1)
    description : str = Field(...,examples=["Introduction to react"],description="Short description of the lesson",min_length=1)
    duration : int = Field(...,examples=[10],description="Length of the lesson in minutes",ge=0)
    lesson_number : int = Field(...,examples=[1],description="Serial number of the lesson",ge=1)
    