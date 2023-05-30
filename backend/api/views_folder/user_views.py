from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authentication import get_authorization_header
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer, CategoriesSerializer, ReportedUserSerializer, PostCategoriesSerializer
from ..models import User, Item, Image, Post, Offer, Categories, ReportedUser, PostCategories
from ..authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token, auth_state
from ..utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from rest_framework.status import HTTP_302_FOUND
from rest_framework.permissions import IsAuthenticated

import jwt
import datetime
import io  # delete

from rest_framework.parsers import JSONParser  # delete
from rest_framework.renderers import JSONRenderer  # delete


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
        # # # serializer.is_active = False # make the accounte deactivated check if this works
            serializer.save()
            # email verification trial
            # get the user email
            getUser = User.objects.get(email=serializer.data['email'])
            user = UserSerializer(getUser)
            print(user.data)
            # produce a token
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

            # check util.py
            Util.send_confirmation(data)
            # return redirect('/')
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
        print("i made it 😁", password, email)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        user_password = serializer.data["password"]
        user_email = serializer.data["email"]
        match = check_password(request.data["password"], user_password)
        print(match)
        if match and user_email == email:
            access_token = create_access_token(serializer.data)
            refresh_token = create_refresh_token(serializer.data)
            print("😎", user_password, user_email)

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
            print('🤑',activate_token)
            getUser = decode_refresh_token(activate_token)
            print('🤩',getUser)
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