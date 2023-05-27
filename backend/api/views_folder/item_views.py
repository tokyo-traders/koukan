from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer, CategoriesSerializer, ReportedUserSerializer, PostCategoriesSerializer
from ..models import User, Item, Image, Post, Offer, Categories, ReportedUser, PostCategories
from ..authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from rest_framework_simplejwt.tokens import RefreshToken
from ..utils import Util
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
def item_list(request, userid):
    if request.method == "GET":
        # item = Item.objects.all()
        # id = request.query_params.get('userId')
        item = Item.objects.filter(user_id=userid).all()
        serializer = ItemSerializer(item, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            # itemId = serializer.validated_data.get('id', )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE', 'POST', 'PATCH'])
def item_edit(request, itemId):

    try:
        # item = Item.objects.get(item_name=itemName)
        item = Item.objects.get(pk=itemId)
        itemSerializer = ItemSerializer(item)
        # maybe filter is better
        # user = User.objects.filter(username=username).first()
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        print(itemSerializer.data)
        return Response(itemSerializer.data, status=status.HTTP_200_OK)
    if request.method == "PATCH":
        currentItemId = itemSerializer.data['id']
        try:
            getItem = Item.objects.get(pk=currentItemId)
            serializer = ItemSerializer(
                getItem, data=request.data, partial=True)
        except Item.DoesNotExist:
            error = {"There is no item to be updated"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        currentItemId = itemSerializer.data['id']
        try:
            toBeDeleted = Item.objects.get(pk=currentItemId)
            toBeDeleted.delete()
            message = {"message": "You have now deleted the offer"}
            return Response(message, status=status.HTTP_204_NO_CONTENT)
        except Item.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)



@ api_view(['GET', 'DELETE'])
def image_list(request, itemId):
    try:
        # image = Image.object.get(item_id=itemId)
        image = Image.objects.filter(item_id=itemId).all()
    except Image.DoesNotExist:

        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ImageSerializer(image, many=True)
        return Response(serializer.data)
    elif request.method == "DELETE":
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ImageView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

# --> detail=false is not sending ids in the url
@action(detail=False, methods=["POST"])
def multiple_upload(self, request, *args, **kwargs):
    serializer = MultipleImageSerializer(data=request.data)
    # itemId = int(request.POST.get('itemId'))
    if serializer.is_valid(raise_exception=True):
        images = serializer.validated_data.get('images')
        itemId = serializer.validated_data.get('itemId')
        getItemInstance = Item.objects.get(pk=itemId[0])

        image_list = []
        for img in images:
            print(img)
            image_list.append(
                Image(image=img, item_id=getItemInstance)
            )

        if image_list:  # --> if imagelist exists
            Image.objects.bulk_create(image_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)

class ImageView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    # --> detail=false is not sending ids in the url
    @action(detail=False, methods=["POST"])
    def multiple_upload(self, request, *args, **kwargs):
        serializer = MultipleImageSerializer(data=request.data)
        # itemId = int(request.POST.get('itemId'))
        if serializer.is_valid(raise_exception=True):
            images = serializer.validated_data.get('images')
            itemId = serializer.validated_data.get('itemId')
            getItemInstance = Item.objects.get(pk=itemId[0])

            image_list = []
            for img in images:
                print(img)
                image_list.append(
                    Image(image=img, item_id=getItemInstance)
                )

            if image_list:  # --> if imagelist exists
                Image.objects.bulk_create(image_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
