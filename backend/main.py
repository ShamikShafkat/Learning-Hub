from fastapi import FastAPI, Request,HTTPException,status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as UserRouter
from routes.auth import router as AuthRouter
from routes.course import router as CourseRouter
from routes.section import router as SectionRouter
from routes.lesson import router as LessonRouter
import os
from starlette.middleware.sessions import SessionMiddleware


app = FastAPI()

origins = ["http://0.0.0.0:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["accessToken"] 
)

SECRET_KEY = os.environ.get('SECRET_KEY') or None
print(SECRET_KEY)
if SECRET_KEY is None:
    raise 'Missing SECRET_KEY'
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    errors = []
    for err in exc.errors():
        if len(err['loc']) == 1:
            field = err['loc'][0]
        elif len(err['loc']) > 1:
            field = f"{err['loc'][1]} in {err['loc'][0]}"
        else:
            field = "Unknown Field"
        errors.append({"field": field, "message": err['msg'], "type": err['type']})
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": "Validation Error", "details": errors},
    )
    
    
@app.exception_handler(HTTPException)
async def exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code,content={
        "success" : False,
        "message" : str(exc.detail),
        "details" : []
    })
    
    
    
app.include_router(UserRouter,prefix="/users",tags=["User"])
app.include_router(AuthRouter,prefix="/auth",tags=["Auth"])
app.include_router(CourseRouter,prefix="/courses",tags=["Course"])
app.include_router(SectionRouter,prefix="/sections",tags=["Section"])
app.include_router(LessonRouter,prefix="/lessons",tags=["Lesson"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)