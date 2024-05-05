from pydantic import BaseModel, Field,validator,ConfigDict,conlist
from typing import Optional,Any,List
from models.course import VisibilityStatus,CourseDifficulty

class Create_Section_Validation(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    title : str = Field(...,examples=["Introduction to ReactJS"],description="Title of the section",min_length=1)
    course_id : str = Field(...,examples=["66328fa5873988b658e55059"],description="Id of the course that the section belongs",min_length=1)
    section_number : int = Field(...,examples=[1],description="Serial number of the section",ge=1)
    