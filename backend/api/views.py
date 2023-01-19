from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.authentication import get_authorization_header
from .serializers import UserSerializer, ItemSerializer, ImageSerializer, MultipleImageSerializer, PostSerializer, OfferSerializer
from .models import User, Item, Image, Post, Offer
from .authentication import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token


import jwt, datetime

@api_view(['GET', 'POST'])
def user_register(request):

    if request.method == "GET":
        obj = User.objects.all()
        item = Item.objects.all()
        # print(item)
        serializer = UserSerializer(obj, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


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
            print(user)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        user_password = serializer.data["password"]
        user_email = serializer.data["email"]
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        response = Response()
        response.set_cookie(key="refreshToken", value= refresh_token, httponly=True)
        response.data = {
            "jwt": access_token
        }
        response.status_code = 200
        print(response)
        if user_password == password and user_email == email:
            return response
        return Response(False, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def user_refresh(request):
    if request.method == "GET":
        refresh_token=request.COOKIES.get("refreshToken")
        id = decode_refresh_token(refresh_token)
        if id:
            access_token = create_access_token(id)
            response = Response()
            response.data = {
                "jwt": access_token
                }
            response.status_code = 200
            print(response)
            return response
        return Response(False, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def user_logout(request):
    if request.method == "POST":
        response = Response()
        response.delete_cookie(key="refreshToken")
        response.data = {
            "message":"Loged out"
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
        return Response(status=status.HTTP_404_NOT_FOUND)\

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
                'itemImages': imgUrl
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
        print(request.data)
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
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def all_item(request, userid, itemid):
    try:
        items = Item.objects.filter(user_id=userid).all().values('item_name')
        images = Image.objects.filter(item_id=itemid).all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        print("this is items", items)
        print("this is images", images)
        data = []
        for item in items:
            for info in images:
                data.append({'itemName': item['item_name'],
                            'image': info.image.url})
                print("data", data)
                return Response(data)


@api_view(['GET', 'DELETE'])
def image_list(request, itemId):
    try:
        # image = Image.object.get(item_id=itemId)
        image = Image.objects.filter(item_id=itemId).all()
    except Image.DoesNotExist:

        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # Will check if need ImageSerializer or MultipleImageSerializer
        # image = Image.object.filter(item_id=itemId).all()
        # count = 0
        # for img in image:
        #     serializer = ImageSerializer(img)
        #     count += 1
        #     print("this is image serializer", serializer)
        #     print("this is the count", count)
        #     return Response(serializer.data)
        serializer = ImageSerializer(image, many=True)
        return Response(serializer.data)
    elif request.method == "DELETE":
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
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
            error = {"error":"You have failed to create a post properly"}
            return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET', 'PUT', 'DELETE'])
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


@api_view(['GET'])
def all_item(request, itemid):
    try:
        item = Item.objects.filter(id=itemid).first()
        images = Image.objects.all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        itemSerializer = ItemSerializer(item)
        print("this is serialized item", itemSerializer)
        print("this is images", images)
        data = []
        imgUrl = []
        for image in images:
            imageSerializer = ImageSerializer(image)
            if imageSerializer.data["item_id"] == itemSerializer.data["id"]:
                imgUrl.append(imageSerializer.data['image'])
        data.append({'itemName': itemSerializer.data['item_name'],
                        'image': imgUrl})
        print("data", data)
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
            error = {"error":"You have failed to create an offer properly"}
            return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['GET', 'PUT', 'DELETE'])
def edit_offer(request, offerId):
    try:
        offer = Offer.objects.filter(pk=offerId).first()
    except Offer.DoesNotExist:
        error = {"error":"There is no offer found"}
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


@api_view(['GET', 'POST'])
def hello(request):
    if request.method == "GET":
        # queryset = User.objects.all()
        # serializer_class = UserSerializer
        return Response("Hello this is a test for fucntion based calls")
