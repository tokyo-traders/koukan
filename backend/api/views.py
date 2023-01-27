from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
from .serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer
from .models import User, Item, Image, Post, Offer
from .authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

import jwt
import datetime
import io  # delete

from rest_framework.parsers import JSONParser  # delete
from rest_framework.renderers import JSONRenderer  # delete


@api_view(['GET', 'POST'])
def user_register(request):

    if request.method == "GET":
        obj = User.objects.all()
        item = Item.objects.all()
        serializer = UserSerializer(obj, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            print("!!!!!CHECK!!!!!", serializer)
            serializer.save()

            # email verification trial
            # get the user email 
            getUser = User.objects.get(email=serializer.data['email'])
            user = UserSerializer(getUser)
            # produce a token
            token = RefreshToken.for_user(getUser).access_token

            current_site = get_current_site(request).domain
            relativeLink = reverse('verify-email')
            abstractURL = 'http://'+current_site+relativeLink+"?token="+str(token)

            email_body = 'Hi '+str(user.data['username'])+ 'Click the link below to verify your email: \n'+ abstractURL
            data={'email_subject': 'Email Verification','email_to':str(user.data['email']), 'email_body': email_body,}

            # check util.py
            Util.send_confirmation(data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

class VerifyEmail(generics.GenericAPIView):
    def get(self):
        pass

@api_view(['GET', 'PUT', 'DELETE', 'POST'])
def user_login(request):
    if request.method == "GET":
        auth = get_authorization_header(request).split()
        if auth and len(auth) == 2:
            token = auth[1].decode("utf-8")
            id = decode_access_token(token)
            if id:
                user = User.objects.get(pk=id)
                return Response(UserSerializer(user).data)
            return Response(False, status=status.HTTP_401_UNAUTHORIZED)

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
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        user_password = serializer.data["password"]
        user_email = serializer.data["email"]
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        response = Response()
        response.set_cookie(key="refreshToken",
                            value=refresh_token, httponly=True)
        response.data = {
            "jwt": access_token
        }
        response.status_code = 200
        if user_password == password and user_email == email:
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

# --> this handles all the methods POST GET PUT DELETE


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


# class ItemView(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ItemSerializer

#     @action(detail=False, methods=['POST'])
#     def item_list(self, request, *args, **kwargs):
#         serializer = ItemSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()

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
            })
            imgUrl = []
        return Response(data)

        # Initialize final data to return
        # data = []
        # for item in items:
        #     serializer1 = ItemSerializer(item)
        #     print(serializer1.data['id'])
        #     data.append(
        #         {'itemID': serializer1.data['id'], 'itemName': serializer1.data['item_name'], 'itemImage': url})


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


@api_view(['GET', 'PUT', 'DELETE', 'POST'])
def item_edit(request, id, username):

    try:
        item = Item.objects.get(pk=id)
        # maybe filter is better
        user = User.objects.filter(username=username).first()
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(item)
        return Response(serializer.data)
    elif request.method == "PUT":
        # serializer = ItemSerializer(item, data=request.data)
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        message = {"message": "You have now deleted the offer"}
        return Response(message, status=status.HTTP_204_NO_CONTENT)


# @api_view(['GET'])
# def all_item(request, itemid):
#     try:
#         item = Item.objects.filter(id=itemid).all()
#         images = Image.objects.filter(item_id=itemid).all()
#     except Item.DoesNotExist or Image.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == "GET":
#         print("this is items", item)
#         print("this is images", images)
#         # data = {"images": images, "item": item}
#         data = []
#         data.append(ItemSerializer(item))
#         data.append(MultipleImageSerializer(images))
#         # data['images'] = images
#         # data['item'] = item
#         print("DATA: ")
#         return Response(data)

@api_view(['GET'])
def all_item(request, itemid):
    try:
        item = Item.objects.filter(id=itemid).first()
        images = Image.objects.all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        itemSerializer = ItemSerializer(item)
        print("😂", itemSerializer)
        data = []
        imgUrl = []
        for image in images:
            imageSerializer = ImageSerializer(image)
            if imageSerializer.data["item_id"] == itemSerializer.data["id"]:
                imgUrl.append(imageSerializer.data['image'])
        data.append({'itemName': itemSerializer.data['item_name'],
                     'images': imgUrl,
                     'details': itemSerializer.data['details']})
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


@api_view(['GET'])  # to be refactored
def homepage(request):
    if request.method == "GET":
        posts = Post.objects.all()
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
                    imageUrl.append(imageSerializer.data["image"])
            data.append({"post": postSerializer.data,
                        "item": itemSeralizer.data[0], "images": imageUrl,
                        "username": userSerializer.data[0]["username"], "phoneDetail": userSerializer.data[0]["phone_detail"]})
            imageUrl = []
        return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])  # to be refactored
def listingItem(request, postId):
    if request.method == "GET":
        post = Post.objects.get(pk=postId)
        images = Image.objects.all()
        imageUrl = []
        postSerializer = PostSerializer(post)
        postID = postSerializer.data["item_id"]
        item = Item.objects.filter(pk=postID)
        itemSeralizer = ItemSerializer(
            item, many=True)  # we need this "many=True"!)
        itemID = itemSeralizer.data[0]['id']
        # userID = itemSeralizer.data[0]['user_id']
        # userUsername = User.objects.get(pk=userID).first()
        # print("this is user", userUsername)
        for image in images:
            imageSerializer = ImageSerializer(image)
            if imageSerializer.data["item_id"] == itemID:
                imageUrl.append(imageSerializer.data["image"])
        data = {"post": postSerializer.data,
                "item": itemSeralizer.data[0], "images": imageUrl}
        imageUrl = []
        return Response(data, status=status.HTTP_200_OK)


@ api_view(['GET', 'POST'])
def create_post(request):
    if request.method == "GET":
        post = Post.objects.all()
        serializer = PostSerializer(post, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error = {"error": "You have failed to create a post properly"}
            return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)


@ api_view(['GET', 'PUT', 'DELETE'])
def edit_post(request, postId):
    try:
        post = Post.objects.filter(pk=postId).first()
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "PUT":
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == "DELETE":
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@ api_view(['GET'])
def all_item(request, itemid):
    try:
        item = Item.objects.filter(id=itemid).first()
        images = Image.objects.all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        itemSerializer = ItemSerializer(item)
        data = []
        imgUrl = []
        for image in images:
            imageSerializer = ImageSerializer(image)
            if imageSerializer.data["item_id"] == itemSerializer.data["id"]:
                imgUrl.append(imageSerializer.data['image'])
        data.append({'itemName': itemSerializer.data['item_name'],
                     'image': imgUrl, 'details': itemSerializer.data['details'], 'user_id': itemSerializer.data['user_id']})
        return Response(data)


@api_view(['GET', 'POST'])
def create_offer(request):
    if request.method == "GET":
        offer = Offer.objects.all()
        serializer = OfferSerializer(offer, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error = {"error": "You have failed to create an offer properly"}
            return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)
        

@ api_view(['GET', 'PUT', 'DELETE'])
def edit_offer(request, offerId):
    try:
        offer = Offer.objects.filter(pk=offerId).first()
    except Offer.DoesNotExist:
        error = {"error": "There is no offer found"}
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = OfferSerializer(offer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "PUT":
        serializer = OfferSerializer(offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            error = {"error": "You have failed to update the offer"}
            return Response(error, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    elif request.method == "DELETE":
        offer.delete()
        message = {"message": "You have now deleted the offer"}
        return Response(message, status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT', 'POST'])
def item_handover(request):


    try:
        listedItem = Item.objects.filter(id=request.data["post_id"]).first()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    try:
        offeredItem = Item.objects.filter(id=request.data['offered_item']).first()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    print("🥵",ItemSerializer(listedItem))
    print("🤑",ItemSerializer(offeredItem))
    # item = Item.objects.get(pk=itemId)
  
    if request.method == "PUT":
        serializer = ItemSerializer( data=request.data, partial=True)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response("saved", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'POST':
        item.delete()
        message = {"message": "You have now deleted the offer"}
        return Response(message, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
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


@api_view(['GET'])
def accepted_trade(request, userId):

    try:
        posts = Post.objects.filter(user_id=userId)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    postData = []
    for post in posts:
        postSerializer = PostSerializer(post)
        print("post",postSerializer.data)
        try:
            item = Item.objects.filter(id=postSerializer.data["item_id"]).first()
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        itemSerializer = ItemSerializer(item)
        print("item",itemSerializer.data)
        try:
            offers = Offer.objects.filter(post_id=postSerializer.data["id"]).filter(acceptance = True)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        post_offers = []
        for offer in offers:
            offerSerializer = OfferSerializer(offer)
            print("offers",offerSerializer.data)
            try:
                Offeritem = Item.objects.filter(id=offerSerializer.data["offered_item"]).first()
            except Post.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            itemOfferSerializer = ItemSerializer(Offeritem)
            print("offered item",itemOfferSerializer.data)
            post_offers.append({"offer": offerSerializer.data, "item": itemOfferSerializer.data})
        if post_offers:
            postData.append({"post": postSerializer.data, "post_item": itemSerializer.data, "offers": post_offers})
        

    if request.method == "GET":
        return Response(postData, status=status.HTTP_200_OK)
  
@api_view(['GET', 'PUT'])
def set_pending(request):
    if request.method == "PUT":
        serializer = OfferSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("saved", status=status.HTTP_200_OK)
        return Response("did not save")


@api_view(['GET', 'POST'])
def hello(request):
    if request.method == "GET":
        # queryset = User.objects.all()
        # serializer_class = UserSerializer
        return Response("Hello this is a test for fucntion based calls")
