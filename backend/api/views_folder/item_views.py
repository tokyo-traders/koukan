from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
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


# All items of a user
@api_view(['GET'])
def newall_item(request, userid):
    try:
        items = Item.objects.filter(user_id=userid).all()
        images = Image.objects.all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        imgUrl = []
        data = []
        for item in items:
            singleItemSerializer = ItemSerializer(item)
            for image in images:
                singleImageSerializer = ImageSerializer(image)
                if singleImageSerializer.data['item_id'] == singleItemSerializer.data['id']:
                    imgUrl.append(singleImageSerializer.data['image'])
            data.append({
                'itemID': singleItemSerializer.data['id'],
                'itemName': singleItemSerializer.data['item_name'],
                'itemImages': imgUrl,
                'userId': singleItemSerializer.data['user_id'],
                'category': singleItemSerializer.data['category'],
                
            })
            imgUrl = []
            print(data)
        return Response(data)


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
# @permission_classes([IsAuthenticated])
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


@api_view(['GET'])
def all_item(request, itemid):
    try:
        item = Item.objects.get(id=itemid)
        images = Image.objects.all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        itemSerializer = ItemSerializer(item)
        try:

            getOffer = Offer.objects.get(
                offered_item=itemSerializer.data['id'])
            currentOffer = OfferSerializer(getOffer)
            offeredItemId = currentOffer.data['offered_item']
            getItemDetail = Item.objects.get(pk=offeredItemId)
            itemDetail = ItemSerializer(getItemDetail)
            getUserInfo = User.objects.get(pk=itemDetail.data['user_id'])
            userInfo = UserSerializer(getUserInfo)
            print("current offer", currentOffer.data)
            data = []
            imgUrl = []
            for image in images:
                imageSerializer = ImageSerializer(image)
                if imageSerializer.data["item_id"] == itemSerializer.data["id"]:
                    imgUrl.append(imageSerializer.data['image'])
            data.append({'itemName': itemSerializer.data['item_name'],
                         'images': imgUrl,
                         'details': itemSerializer.data['details'], 'expiration': currentOffer.data['date_offered'], 'idOffer': currentOffer.data['id'], 'user_id': itemSerializer.data['user_id'], 'userName': userInfo.data['username'], 'userReputation': userInfo.data['reputation_rating'], 'userTotalReview': userInfo.data['total_review']})

        except Offer.DoesNotExist:
            data = []
            imgUrl = []
            for image in images:
                imageSerializer = ImageSerializer(image)
                if imageSerializer.data["item_id"] == itemSerializer.data["id"]:
                    imgUrl.append(imageSerializer.data['image'])
            data.append({'itemName': itemSerializer.data['item_name'],
                         'images': imgUrl,
                         'details': itemSerializer.data['details'], 'user_id': itemSerializer.data['user_id']})
        return Response(data)


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