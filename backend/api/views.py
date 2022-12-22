from django.shortcuts import render
# from django.http import HttpResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, CreateUserSerializer
from .models import User

@api_view(['GET', 'POST'])
def user_list(request):
    
    if request.method == "GET":
        obj = User.objects.all()
        serializer = UserSerializer(obj, many = True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def hello(request):
    if request.method == "GET":
        # queryset = User.objects.all()
        # serializer_class = UserSerializer
        return Response("Hello this is a test for fucntion based calls")