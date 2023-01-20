import jwt, datetime
from rest_framework.response import Response
from rest_framework import  status

def create_access_token(id):
    payload = {
            "id": id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=1),
            "iat": datetime.datetime.utcnow()
        }
    return jwt.encode(payload, "access_secret", algorithm="HS256")
    
def create_refresh_token(id):
    payload = {
            "id": id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "iat": datetime.datetime.utcnow()
        }
    return jwt.encode(payload, "refresh_secret", algorithm="HS256")

def decode_access_token(token):
    try:
        payload = jwt.decode(token, "access_secret", algorithms="HS256")
        return payload["id"]
    except:
        return False


def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, "refresh_secret", algorithms="HS256")
        print(payload)
        return payload["id"]
    except:
        return False