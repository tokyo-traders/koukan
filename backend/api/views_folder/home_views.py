from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
from ..serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer, CategoriesSerializer, ReportedUserSerializer, PostCategoriesSerializer
from ..models import User, Item, Image, Post, Offer, Categories, ReportedUser, PostCategories
from ..utils import Util
from ..authentication import  auth_state
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
import json
import base64
import os
from django.http import HttpResponse

import jwt
import datetime
import io  # delete

from rest_framework.parsers import JSONParser  # delete
from rest_framework.renderers import JSONRenderer  # delete

@api_view(['GET'])  # to be refactored
def homepage(request):
    if request.method == "GET":
        posts = Post.objects.filter(visibile=True)
        images = Image.objects.all()
        data = []
        imageUrl = []
        for post in posts:
            postSerializer = PostSerializer(post)
            postID = postSerializer.data['item_id']
            item = Item.objects.filter(pk=postID)
            itemSeralizer = ItemSerializer(
                item, many=True)  # we need this "many=True"!)
            itemID = itemSeralizer.data[0]['id']
            userID = postSerializer.data['user_id']
            user = User.objects.filter(pk=userID)
            userSerializer = UserSerializer(user, many=True)
            for image in images:
                imageSerializer = ImageSerializer(image)
                if imageSerializer.data["item_id"] == itemID:
                    file = f".{imageSerializer.data['image']}"
                    with open(file, 'rb') as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    imageUrl.append(encoded_string)
            data.append({"post": postSerializer.data,
                        "item": itemSeralizer.data[0], "images": imageUrl,
                         "username": userSerializer.data[0]["username"], "phoneDetail": userSerializer.data[0]["phone_detail"]})
            imageUrl = []
        return Response(data, status=status.HTTP_200_OK)
    
@api_view(['GET'])  # to be refactored
def listingItem(request, postId):
    if request.method == "GET":
        auth = auth_state(request)
        if auth: 
            data = []
            post = Post.objects.get(pk=postId, visibile=True)
            images = Image.objects.all()
            imageUrl = []
            postSerializer = PostSerializer(post)
            postID = postSerializer.data["item_id"]
            item = Item.objects.filter(pk=postID)
            itemSeralizer = ItemSerializer(
                item, many=True)  # we need this "many=True"!)
            itemID = itemSeralizer.data[0]['id']
            userID = postSerializer.data['user_id']
            user = User.objects.filter(pk=userID)
            userSerializer = UserSerializer(user, many=True)
            categories = PostCategories.objects.filter(post_id=postId)
            # # categories = PostCategories.objects.get(pk=1)
            catSerializer = PostCategoriesSerializer(categories, many=True)
            print(catSerializer.data)
            for image in images:
                imageSerializer = ImageSerializer(image)
                if imageSerializer.data["item_id"] == itemID:
                    file = f".{imageSerializer.data['image']}"
                    with open(file, 'rb') as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                        imageUrl.append(encoded_string)
            data.append({"post": postSerializer.data,
                        "item": itemSeralizer.data[0],
                        "images": imageUrl,
                        "username": userSerializer.data[0]["username"],
                        "phoneDetail": userSerializer.data[0]["phone_detail"],
                        "email": userSerializer.data[0]["email"],
                        "rating": userSerializer.data[0]["reputation_rating"],
                        "total_review": userSerializer.data[0]["total_review"],
                        "categories": catSerializer.data
                        })
            imageUrl = []
            return Response(data, status=status.HTTP_200_OK)
    
@ api_view(['GET'])
def search_item(request):
    if request.method == "GET":
        posts = Post.objects.all()
        data = []
        for post in posts:
            postSerializer = PostSerializer(post)
            itemID = postSerializer.data['item_id']
            item = Item.objects.get(pk=itemID)
            itemSerializer = ItemSerializer(item)
            data.append(itemSerializer.data['item_name'])
            print("this is item serializer", itemSerializer.data)
            print("this is the data", data)
        return Response(data, status=status.HTTP_200_OK)


@ api_view(['GET'])
def category_list(request):
    try:
        categories = Categories.objects.all()
    except Categories.DoesNotExist:
        error = {"error": "You have failed to get the categories"}
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        catergorySerializer = CategoriesSerializer(categories, many=True)
        return Response(catergorySerializer.data, status=status.HTTP_200_OK)



@ api_view(['GET'])
def items_offered(request, userId):
    if request.method == "GET":
        try:
            user = User.objects.get(pk=userId)
            allItems = Item.objects.filter(user_id=userId)
            itemSerializer = ItemSerializer(allItems, many=True).data
            data = []
            for item in itemSerializer:
                # print("😁", item)
                try:
                    getOffer = Offer.objects.get(
                        offered_item=item['id'], acceptance=True)
                    test = OfferSerializer(getOffer).data
                    getPost = Post.objects.get(id=test["post_id"])
                    post = PostSerializer(getPost).data
                    itemId = post['item_id']
                    getDesiredItem = Item.objects.get(pk=itemId)
                    desiredItem = ItemSerializer(getDesiredItem)
                    getDesireditemImage = Image.objects.filter(
                        item_id=itemId).first()
                    desiredItemImage = ImageSerializer(getDesireditemImage)
                    image = Image.objects.filter(item_id=item['id'])
                    imageSerializer = ImageSerializer(image, many=True)
                    file = f".{imageSerializer.data[0]['image']}"
                    with open(file, 'rb') as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    if test['offered_item'] == item['id']:
                        data.append(
                            {
                                "offer": test,
                                "itemName": item['item_name'],
                                "itemId": item['id'],
                                "desideredUserId": desiredItem.data['user_id'],
                                "desideredItemId": desiredItem.data['id'],
                                "desiredItemName": desiredItem.data['item_name'],
                                "desiredItemImage": desiredItemImage.data['image'],
                                "image": encoded_string
                            })
                except Offer.DoesNotExist:
                    print("next")

        except User.DoesNotExist:
            error = {"Error on user"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
def single_offer(request, offerId):
    try:
        currentOffer = Offer.objects.get(pk=offerId)
        item1Id = OfferSerializer(currentOffer).data["offered_item"]
        item2PostId = OfferSerializer(currentOffer).data["post_id"]
        getPost = Post.objects.get(pk=item2PostId)
        currentPostItemId = PostSerializer(getPost).data["item_id"]
        currentPostUserId = PostSerializer(getPost).data["user_id"]
    except Offer.DoesNotExist:
        error = {"There is no such offer!"}
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        item1 = Item.objects.get(pk=item1Id)
        currentUserItem = ItemSerializer(item1).data
        getItem1Image = Image.objects.filter(item_id=item1Id).first()
        item1Image = ImageSerializer(getItem1Image).data
        file = f".{item1Image['image']}"
        with open(file, 'rb') as image_file:
            encoded_string1 = base64.b64encode(image_file.read()).decode('utf-8')
        item2 = Item.objects.get(pk=currentPostItemId)
        wantedItem = ItemSerializer(item2).data
        getItem2Image = Image.objects.filter(item_id=currentPostItemId).first()
        item2Image = ImageSerializer(getItem2Image).data
        file = f".{item2Image['image']}"
        with open(file, 'rb') as image_file:
            encoded_string2 = base64.b64encode(image_file.read()).decode('utf-8')
        getUser = User.objects.get(pk=currentPostUserId)
        otherUser = UserSerializer(getUser).data
        data = {"itemOffered": currentUserItem['item_name'], "itemOfferedImage": encoded_string1,
                "desiredItem": wantedItem['item_name'], "desiredItemImage":encoded_string2, "otherUserInfo": otherUser['username']}
        if data:
            return Response(data, status=status.HTTP_200_OK)
        else:
            error = {"there is something wrong in the single item offered"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def currentUser_review(request, userId):
    if request.method == "GET":
        try:
            getUser = User.objects.get(pk=userId)
            currentUser = UserSerializer(getUser).data
        except User.DoesNotExist:
            error = {"there is no user for the current user review"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)

        data = {
            "currentReputationScore": currentUser['reputation_rating'], "totalReviews": currentUser['total_review']}
        if data:
            return Response(data, status=status.HTTP_200_OK)
        else:
            error = {"there is something wrong in the current user review"}
            return Response(error, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'PUT'])
def sendUserReview(request, userId):
    try:
        getUser = User.objects.get(pk=userId)
        currentUser = UserSerializer(getUser).data
    except User.DoesNotExist:
        error = {"there is no user for the send user review"}
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        data = {
            "currentReputationScore": currentUser['reputation_rating'], "totalReviews": currentUser['total_review']}
        if data:
            return Response(data, status=status.HTTP_200_OK)
        else:
            error = {"there is something wrong in the send user review"}
            return Response(error, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    if request.method == "PUT":
        currentUserId = currentUser['id']
        try:
            getUser = User.objects.get(pk=currentUserId)
        except User.DoesNotExist:
            error = {"there is no user to be updated in review"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)

        updateUser = UserSerializer(getUser).data
        sumPoints = int(updateUser['reputation_rating']) + \
            int(request.data['reputation_rating'])
        updateUser['reputation_rating'] = str(sumPoints)
        totalReview = int(updateUser['total_review']) + 1
        updateUser['total_review'] = str(totalReview)
        newdata = {
            "reputation_rating": updateUser['reputation_rating'], "total_review": updateUser["total_review"]}
        try:
            test = User.objects.get(pk=updateUser['id'])
        except User.DoesNotExist:
            error = {"there is no user to be updated in review 2"}
            return Response(status=status.HTTP_404_NOT_FOUND)
        toBeupdated = UserSerializer(test, data=newdata, partial=True)
        toBeupdated.is_valid(raise_exception=True)
        toBeupdated.save()
        print("latest data", toBeupdated)
        return Response(toBeupdated.data, status=status.HTTP_200_OK)
        # if serializer.is_valid(raise_exception=True):
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     error = {"the serializer to be edited is not valid in send user review"}
        #     return Response(error, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['PUT'])
def send_review(request, userIdReview):
    if request.method == 'PUT':
        auth = auth_state(request)
        if auth:
            user = User.objects.get(pk=userIdReview)
            editedUser = UserSerializer(user, data={"reputation_rating" : user.data + request.data}, partial=True)
            if editedUser.is_valid():
                editedUser.save()
                return Response("review sent succesfully", status=status.HTTP_202_ACCEPTED)
            else:
                return Response('wrong review', status=status.HTTP_400_BAD_REQUEST)