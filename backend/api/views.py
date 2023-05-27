from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
from .serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer, CategoriesSerializer, ReportedUserSerializer, PostCategoriesSerializer
from .models import User, Item, Image, Post, Offer, Categories, ReportedUser, PostCategories
from .authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from rest_framework.permissions import IsAuthenticated

import jwt
import datetime
import io  # delete

from rest_framework.parsers import JSONParser  # delete
from rest_framework.renderers import JSONRenderer  # delete



@api_view(['GET', 'POST'])
def hello(request):
    if request.method == "GET":
        # queryset = User.objects.all()
        # serializer_class = UserSerializer
        return Response("Hello this is a test for fucntion based calls")
