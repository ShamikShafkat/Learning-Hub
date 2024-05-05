class Lesson:
    title : str
    section_id : str
    description : str
    video_url : str = None
    pdf_url : str = None
    duration : int
    lesson_number : int
    
    
    def __init__(self,title,section_id,description,video_url,pdf_url,duration,lesson_number) -> None:
        self.title = title
        self.section_id = section_id
        self.description = description
        self.video_url = video_url
        self.pdf_url = pdf_url
        self.duration = duration
        self.lesson_number = lesson_number
    