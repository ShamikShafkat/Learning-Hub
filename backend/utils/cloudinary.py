import cloudinary
from cloudinary.uploader import upload
from dotenv import load_dotenv
import os

load_dotenv()

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

def upload_video(video,course_id : str):
    cloudinary.config(
        cloud_name="drmcyjzky",
        api_key="816453522454985",
        api_secret="rEwZ_ZKhp85d6nSoE-PSd-3B3GA"
    )
    
    # Upload the file to Cloudinary
    response = upload(video.file, folder="courses", resource_type="video")
    
    # Extract the URL of the uploaded file
    video_url = response['secure_url']
    
    # You can now use video_url in your further logic
    
    return {"video_url": video_url}