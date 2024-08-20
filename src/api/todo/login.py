from todo.models import (LoginConfig)
from todo.app import app, settings
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from google.auth.transport import requests
from google.oauth2 import id_token
from todo.models import Token, UserId
import uuid

@app.get("/login-config", response_model=LoginConfig, status_code=200)
def get_login_config() -> LoginConfig:
    return LoginConfig(googleClientId=settings.GOOGLE_LOGIN_CLIENT_ID)

@app.post("/login/google")
def google_login(token: Token) -> str:
    try:
        id_info = id_token.verify_oauth2_token(token.token, requests.Request(), settings.GOOGLE_LOGIN_CLIENT_ID)
        google_user_id = id_info['sub']
        print("google user id: ", google_user_id)
        userid = get_or_create_user(google_user_id)
        print("userid: ", userid)
        return userid
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

async def get_or_create_user(google_user_id: str) -> str:
    user = await UserId.find_one(UserId.googleid == google_user_id)
    if user:
        return user.userid
    new_user = UserId(userid=str(uuid.uuid4()), googleid=google_user_id)
    await new_user.insert()
    return new_user.userid
