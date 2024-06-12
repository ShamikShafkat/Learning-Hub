def course_individual_serializer(course) -> dict:
    return {
        "_id" : str(course["_id"]),
        "title" : course["title"],
        "description" : course["description"],
        "tags" : course["tags"],
        "intro_video_url" : course["intro_video_url"],
        "visibility_status" : course["visibility_status"],
        "price" :course["price"],
        "duration" : course["duration"],
        "prerequisites" : course["prerequisites"],
        "course_difficulty" : course["course_difficulty"],
        "rating" : course["rating"],
        "total_rating_count" : course["total_rating_count"],
        "enrollment_count" : course["enrollment_count"],
        "total_sections" : course["total_sections"],
        "total_lessons" : course["total_lessons"]
    }

def course_group_serializer(courses)->list[dict]:
    return [course_individual_serializer(course) for course in courses]