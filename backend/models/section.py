class Section:
    title : str
    duration : int = 0
    course_id : str
    total_lessons : int = 0
    section_number : int
    def __init__(self,title,course_id,section_number) -> None:
        self.title = title
        self.duration = 0
        self.course_id = course_id
        self.total_lessons = 0
        self.section_number = section_number