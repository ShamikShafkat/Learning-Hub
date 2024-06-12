# from pymongo import MongoClient
# client = MongoClient("mongodb+srv://shamikshafkat:CWfN17DcNRetILjj@cluster0.k7chkhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient("mongodb+srv://shamikshafkat:CWfN17DcNRetILjj@cluster0.k7chkhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.learning_hub

users_collection = db["users"]

courses_collection = db["courses"]

sections_collection = db["sections"]

lessons_collection = db["lessons"]

enrollments_collection = db["enrollments"]

ratings_collection = db["ratings"]

questions_collection = db["questions"]

