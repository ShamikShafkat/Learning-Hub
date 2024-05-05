import pyrebase
import base64
from fastapi import HTTPException
import binascii
import os 
from dotenv import load_dotenv

load_dotenv()


FIREBASE_STORAGE_API_KEY = os.getenv("FIREBASE_STORAGE_API_KEY")
FIREBASE_STORAGE_AUTH_DOMAIN = os.getenv("FIREBASE_STORAGE_AUTH_DOMAIN")
FIREBASE_STORAGE_PROJECT_ID = os.getenv("FIREBASE_STORAGE_PROJECT_ID")
FIREBASE_STORAGE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_STORAGE_BUCKET")
FIREBASE_STORAGE_MESSAGING_SENDER_ID = os.getenv("FIREBASE_STORAGE_MESSAGING_SENDER_ID")
FIREBASE_STORAGE_APP_ID = os.getenv("FIREBASE_STORAGE_APP_ID")
FIREBASE_DATABASE_URL = os.getenv("FIREBASE_DATABASE_URL")

config = {
  "apiKey": FIREBASE_STORAGE_API_KEY,
  "authDomain": FIREBASE_STORAGE_AUTH_DOMAIN,
  "projectId": FIREBASE_STORAGE_PROJECT_ID,
  "storageBucket": FIREBASE_STORAGE_STORAGE_BUCKET,
  "messagingSenderId": FIREBASE_STORAGE_MESSAGING_SENDER_ID,
  "appId": FIREBASE_STORAGE_APP_ID,
  "databaseURL": FIREBASE_DATABASE_URL,
}



firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

# Function to upload image
def upload_image_from_base64(base64_string:str,userId:int):
  image_bytes = base64.b64decode(base64_string)
  filename = f"{userId}.jpg"
  storage.child("images/" + filename).put(image_bytes)
  url = storage.child("images/" + filename).get_url(None)
  return url

    
# Function to upload video
async def upload_course_video(video):
  storage.child("videos/courses/" + video.filename).put(await video.read())
  return storage.child("videos/courses/" + video.filename).get_url(None)        


# Function to upload video
async def upload_lesson_video(video):
  storage.child("videos/lessons/" + video.filename).put(await video.read())
  return storage.child("videos/lessons/" + video.filename).get_url(None)        

# Function to upload video
async def upload_pdf(pdf):
  storage.child("pdf/lessons/" + pdf.filename).put(await pdf.read())
  return storage.child("pdf/lessons/" + pdf.filename).get_url(None)        
