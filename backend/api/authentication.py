import jwt, datetime
from rest_framework.authentication import get_authorization_header

import environ
env = environ.Env()

def create_access_token(user):
    payload = {
            "user": {
               "id": user["id"],
                "first_name": user["first_name"] ,
                "last_name": user["last_name"],
                "address": user['address'],
                "username": user["username"],
                "email": user["email"],
                "phone_detail": user["phone_detail"],
                "is_emailVerified": user["is_emailVerified"],
                "is_phoneVerified": user["is_phoneVerified"],
                "reputation_rating": user["reputation_rating"],
                "total_review": user["total_review"]  
            },
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
            "iat": datetime.datetime.utcnow()
        }
    return jwt.encode(payload, "access_secret", algorithm="HS256")
    
def create_refresh_token(user):
    payload = {
            "user": {
               "id": user["id"],
                "first_name": user["first_name"] ,
                "last_name": user["last_name"],
                "address": user['address'],
                "username": user["username"],
                "email": user["email"],
                "phone_detail": user["phone_detail"],
                "is_emailVerified": user["is_emailVerified"],
                "is_phoneVerified": user["is_phoneVerified"],
                "reputation_rating": user["reputation_rating"],
                "total_review": user["total_review"]  
            },
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=3),
            "iat": datetime.datetime.utcnow()
        }
    return jwt.encode(payload, "refresh_secret", algorithm="HS256")

def decode_access_token(token):
    try:
        payload = jwt.decode(token, "access_secret", algorithms="HS256")
        return payload["user"]
    except:
        return False

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, "refresh_secret", algorithms="HS256")
        return payload["user"]
    except:
        return False
    
def auth_state(request):
    auth = get_authorization_header(request).split()
    print(request)
    if auth and len(auth) == 2:
        token = auth[1].decode("utf-8")
        user = decode_access_token(token)
        return user
    return False