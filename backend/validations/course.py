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
class Create_Course_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    title : str = Field(...,examples=["Introduction to ReactJS"],description="Title of the course",min_length=1)
    description : str = Field(...,examples=["This is a introductory course on python"],description="Description of the course",min_length=1)
    tags : List[str] = Field(...,examples=[["Python"]],description="Array of tags for the course")
    visibility_status : VisibilityStatus = Field(...,examples=["FREE,PAID"],description="Payment required or not for the course.")
    price : float = Field(...,examples=[0,100.5],description="Price of the course",ge=0)
    prerequisites : List[str] = Field(...,examples=[["Coding,If-else,For Loop"]],description="Requirements for the course")
    course_difficulty : CourseDifficulty = Field(...,examples=["BEGINNER,INTERMEDIATE,ADVACNED"],description="Difficulty of the course")    
    
    
class Post_Rating_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    course_id : str = Field(...,examples=["6632ccf7ef40823e075d7e0e"],description="Course id of the rated course",min_length=1)
    rating : float = Field(...,examples=[3.5],description="Rating of the user about the course",ge=0)
    review : str = Field(...,examples=["Very good course"],description="Review message of the user",min_length=1)

    
class Post_Questions_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    course_id : str = Field(...,examples=["6632ccf7ef40823e075d7e0e"],description="Course id of the rated course",min_length=1)
    question : str = Field(...,examples=["How many days should be required to complete the course?"],description="Question about the course",min_length=1)
    
class Post_Answers_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    question_id : str = Field(...,examples=["6632ccf7ef40823e075d7e0e"],description="Id of the question",min_length=1)
    answer : str = Field(...,examples=["10 days"],description="Answer of the question",min_length=1)