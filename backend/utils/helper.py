import random
import string
from enum import Enum
import re
from datetime import datetime
from pydantic import BaseModel

def generate_random_string(length):
    characters = string.ascii_letters + string.digits  # Include letters and digits
    return ''.join(random.choice(characters) for _ in range(length))

def success_response(message : str,data : list)->dict:
    return {
        "success" : True,
        "message" : message,
        "data" : data
    }
    
def failure_response(message : str,details : list)->dict:
    return {
        "success" : False,
        "message" : message,
        "details" : details
    }
    
class Video:
    filename : str
    content_type : str
    data : bytes
    
    def __init__(self,filename,content_type,data) -> None:
        self.filename = filename
        self.content_type = content_type
        self.data = data


def validate_date_of_birth(date_str):
    # Regular expression pattern for date validation
    date_pattern = r"^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$"

    # Check if the date string matches the pattern
    if not re.match(date_pattern, date_str):
        return False

    # Parse the date string to a datetime object
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return False

    # Additional logical checks for the date
    year, month, day = map(int, date_str.split('-'))
    if day > 28:
        if day > 30 and (month in [4, 6, 9, 11] or (month == 2 and day > 29 or (year % 4 != 0 or (year % 100 == 0 and year % 400 != 0)))):
            return False
    return True   

