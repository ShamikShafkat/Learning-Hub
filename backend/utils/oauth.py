from fastapi import FastAPI, Depends, HTTPException,Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

app = FastAPI()
oauth = OAuth()

# Define Google OAuth credentials
CLIENT_ID = "your_client_id"
CLIENT_SECRET = "your_client_secret"
REDIRECT_URI = "http://localhost:8000/auth/callback"
AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://accounts.google.com/o/oauth2/token"
USER_INFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"

oauth.register(
    name="google",
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url=AUTH_BASE_URL,
    access_token_url=TOKEN_URL,
    client_kwargs={"scope": "openid email profile"},
)

@app.get("/auth")
async def auth_google(request: Request):
    redirect_uri = REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback")
async def auth_google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    resp = await oauth.google.parse_id_token(request, token)
    user_info = await oauth.google.get(
        USER_INFO_URL, token=token
    )
    # Here you can handle the user information obtained from Google
    return {"user_info": user_info}

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
