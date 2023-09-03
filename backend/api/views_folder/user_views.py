from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from ..serializers import UserSerializer
from ..authentication import create_access_token, create_refresh_token,  decode_refresh_token
from ..utils import Util
from django.contrib.sites.shortcuts import get_current_site
from ..models import User
from django.urls import reverse
from rest_framework.status import HTTP_302_FOUND

@api_view(['GET', 'POST'])
def user_register(request):

    if request.method == "POST":
        userObj = {
            "first_name": request.data["first_name"] ,
            "last_name" :request.data["last_name"],
            "address":request.data["address"],
            "username":request.data[ "username"],
            "email":request.data["email"],
            "password": make_password(request.data["password"]),
            "phone_detail":request.data["phone_detail"]
        }
    
        serializer = UserSerializer(data=userObj)
        if serializer.is_valid():
            serializer.save()
            getUser = User.objects.get(email=serializer.data['email'])
            user = UserSerializer(getUser)
            token = create_refresh_token(user.data)

            current_site = get_current_site(request).domain
            relativeLink = reverse('verify-email')
            abstractURL = 'http://'+current_site + \
                relativeLink+"?token="+str(token)

            email_body = 'Hi ' + \
                str(user.data['username']) + \
                'Click the link below to verify your email: \n' + abstractURL
            data = {'email_subject': 'Email Verification', 'email_to': str(
                user.data['email']), 'email_body': email_body, }
            Util.send_confirmation(data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    

@api_view(['GET', 'PUT', 'DELETE', 'POST'])
def user_login(request):
    if request.method == "PUT":
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == "POST":
        password = request.data["password"]
        email = request.data["email"]
        print(email, password)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        user_password = serializer.data["password"]
        user_email = serializer.data["email"]
        match = check_password(request.data["password"], user_password)
        if match and user_email == email:
            access_token = create_access_token(serializer.data)
            refresh_token = create_refresh_token(serializer.data)

            response = Response()
            response.set_cookie(key="refreshToken",
                                value=refresh_token, secure=True, httponly=True)
            response.data = {
                "jwt": access_token
            }
            response.status_code = 200
            return response
        return Response(False, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def user_refresh(request):
    if request.method == "GET":
        refresh_token = request.COOKIES.get("refreshToken")
        id = decode_refresh_token(refresh_token)
        if id:
            access_token = create_access_token(id)
            response = Response()
            response.data = {
                "jwt": access_token
            }
            response.status_code = 200
            return response
        return Response(False, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    if request.method == "POST":
        response = Response()
        response.delete_cookie(key="refreshToken")
        response.data = {
            "message": "Loged out"
        }
        response.status_code = 200
        return response


# email verification
class VerifyEmail(generics.GenericAPIView):
    def get(self, request):
        activate_token = request.GET.get('token')
        try:
            getUser = decode_refresh_token(activate_token)
            user = User.objects.get(pk=getUser['id'])
            if not user.is_emailVerified:
                user.is_emailVerified = True

                user.save()
            frontend_url = 'https://tokyotraders.onrender.com/login' 
            redirect_url = request.build_absolute_uri(frontend_url)
            message = {
                "message": "You have successfully activated your account"}
            return Response(status=HTTP_302_FOUND, headers={"location": redirect_url})

        except jwt.ExpiredSignatureError as identifier:
            error = {"error": "Your activation link is expired."}
            return Response(error, status=status.HTTP_408_REQUEST_TIMEOUT)
        except jwt.exceptions.DecodeError as identifier:
            error = {"error": "Invalid token"}
            return Response(error, status=status.HTTP_401_UNAUTHORIZED)