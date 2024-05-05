from enum import Enum

class VisibilityStatus(str,Enum):
    FREE = "FREE"
    PAID = "PAID" 

class CourseDifficulty(str,Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    
class CourseStatus(str,Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"

class Course:
    title : str
    description : str
    tags : list[str] = []
    intro_video_url : str = None
    visibility_status : str = VisibilityStatus.FREE
    price : float  = 0
    duration : int = 0
    prerequisites : list[str] = []
    course_difficulty : str = CourseDifficulty.BEGINNER
    rating : float = 0
    total_rating_count : int = 0
    enrollment_count : int = 0
    total_sections : int = 0
    total_lessons : int = 0
    
    def __init__(self,title,description,tags,intro_video_url,
                 visibility_status,price,duration,prerequisites,course_difficulty) -> None:
        self.title = title
        self.description = description
        self.tags = tags
        self.intro_video_url = intro_video_url
        self.visibility_status = visibility_status
        self.price = price
        self.duration = duration
        self.prerequisites = prerequisites
        self.course_difficulty = course_difficulty
        self.rating = 0
        self.total_rating_count = 0
        self.enrollment_count = 0
        self.total_sections = 0
        self.total_lessons = 0