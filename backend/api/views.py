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


# email verification
class VerifyEmail(generics.GenericAPIView):
    def get(self, request):
        activate_token = request.GET.get('token')
        try:
            getUser = jwt.decode(activate_token, settings.SECRET_KEY)
            user = User.objects.get(pk=getUser['user_id'])
            if not user.is_emailVerified:
                user.is_emailVerified = True

                user.save()

            message = {
                "message": "You have successfully activated your account"}
            return Response(message, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError as identifier:
            error = {"error": "Your activation link is expired."}
            return Response(error, status=status.HTTP_408_REQUEST_TIMEOUT)
        except jwt.exceptions.DecodeError as identifier:
            error = {"error": "Invalid token"}
            return Response(error, status=status.HTTP_401_UNAUTHORIZED)




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
                    imageUrl.append(imageSerializer.data["image"])
            data.append({"post": postSerializer.data,
                        "item": itemSeralizer.data[0], "images": imageUrl,
                         "username": userSerializer.data[0]["username"], "phoneDetail": userSerializer.data[0]["phone_detail"]})
            imageUrl = []
        return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])  # to be refactored
def listingItem(request, postId):
    if request.method == "GET":
        print(postId)
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
                imageUrl.append(imageSerializer.data["image"])
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


@ api_view(['GET', 'POST'])
def create_post(request):
    if request.method == "GET":
        post = Post.objects.all()
        serializer = PostSerializer(post, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        print("🤑", request.data)
        postSerializer = PostSerializer(data=request.data["post"])
        if postSerializer.is_valid():
            postSerializer.save()
            postSerializer.data["id"]
            for key in request.data["categories"]:
                if request.data["categories"][key]:
                    categ = {}
                    categ["post_id"] = postSerializer.data["id"]
                    categ["categories_id"] = key
                    print("😂", categ)
                    catSerializer = PostCategoriesSerializer(
                        data=categ, partial=True)
                    if catSerializer.is_valid():
                        catSerializer.save()

            return Response(postSerializer.data, status=status.HTTP_201_CREATED)
        else:
            error = {"error": "You have failed to create a post properly"}
            return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)


@ api_view(['GET', 'PUT', 'DELETE'])
def edit_post(request, postId):
    try:
        getPost = Post.objects.filter(pk=postId).first()
        postSerializer = PostSerializer(getPost)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(postSerializer.data, status=status.HTTP_200_OK)
    if request.method == "PUT":
        editedPostSerializer = PostSerializer(
            getPost, data=request.data, partial=True)
        if editedPostSerializer.is_valid():
            editedPostSerializer.save()
            return Response("the post is no more visible", status=status.HTTP_200_OK)
        return Response("post is still visible", status=status.HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        currentPostID = postSerializer.data['id']
        try:
            postToBeDeleted = Post.objects.get(pk=currentPostID)
            postToBeDeleted.delete()
            message = {"The post has been deleted!"}
            return Response(message, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            error = {"There is no posting to be deleted!"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)


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
# def item_handover(request, userIdreview):
#     getUser = User.objects.get(id=userIdreview)
#     user = UserSerializer(getUser)
#     print(user)
#     # return Response(user.data, status=status.HTTP_200_OK)
#     if request.method == "PUT":
#         user = UserSerializer(getUser, data=)
# receive one item
def item_handover(request):
    # print("BODY: ", request.data)
    # try:
    #     handedOverItem = Item.objects.filter(id=itemId).first()
    # except Item.DoesNotExist:
    #     return Response("no item to handover!", status=status.HTTP_404_NOT_FOUND)
    # if request.method == "PUT":
    #     # newItemUserId = newItem.data['user_id']
    #     try:
    #         toBeUpdated = ItemSerializer(
    #             handedOverItem, data=request.data, partial=True)
    #         if toBeUpdated.is_valid():
    #             toBeUpdated.save()
    #             print("new details", toBeUpdated.data)
    #             message = {"You have successfully obtained the new item"}
    #             return Response(message, status=status.HTTP_200_OK)
    #         print("before change", toBeUpdated.data)
    #     except Item.DoesNotExist:
    #         return Response("hey no item", status=status.HTTP_404_NOT_FOUND)

    # swap items
    listedPost = Post.objects.filter(id=request.data["post_id"]).first()
    postSerializer = PostSerializer(listedPost)

    listedItem = Item.objects.filter(id=postSerializer.data["item_id"]).first()

    # try:
    #     offeredItem = Item.objects.filter(
    #         id=request.data['offered_item']).first()
    # except Item.DoesNotExist or Image.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    offeredItem = Item.objects.filter(id=request.data['offered_item']).first()

    listedSerializer = ItemSerializer(listedItem)
    offeredSerializer = ItemSerializer(offeredItem)
    print("😁", listedSerializer.data["id"])
    print("😁", offeredSerializer.data["id"])

    if request.method == "PUT":
        print("😁", request.data)
        item_Serializer = ItemSerializer(
            listedItem, data={"user_id": offeredSerializer.data["user_id"]}, partial=True)

        offered_Serializer = ItemSerializer(
            offeredItem, data={"user_id": listedSerializer.data["user_id"]}, partial=True)
        if item_Serializer.is_valid():
            item_Serializer.save()
        if offered_Serializer.is_valid():
            offered_Serializer.save()
            offer = Offer.objects.get(pk=request.data['id'])
            offer.delete()
            listedPost.delete()
            return Response("swapped", status=status.HTTP_200_OK)
        print(item_Serializer.data)
        print(offered_Serializer.data)
    return Response(item_Serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
def accepted_trade(request, userId):

    try:
        posts = Post.objects.filter(user_id=userId)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    postData = []
    for post in posts:
        postSerializer = PostSerializer(post)
        # print("post", postSerializer.data)
        try:
            item = Item.objects.filter(
                id=postSerializer.data["item_id"]).first()
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        itemSerializer = ItemSerializer(item)
        itemImage_list = []
        post_offer = {}
        itemImages = Image.objects.filter(item_id=itemSerializer.data["id"])
        for itemImage in itemImages:
            itemImageSerializer = ImageSerializer(itemImage)
            itemImage_list.append(itemImageSerializer.data)
        try:
            offer = Offer.objects.filter(
                post_id=postSerializer.data["id"]).filter(acceptance=True).first()
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        offerSerializer = OfferSerializer(offer)
        try:
            Offeritem = Item.objects.filter(
                id=offerSerializer.data["offered_item"]).first()
        except Item.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if Offeritem:
            itemOfferSerializer = ItemSerializer(Offeritem)
            # print("offered item",itemOfferSerializer.data)
            offerImage_list = []
            offerImages = Image.objects.filter(
                item_id=itemOfferSerializer.data["id"])
            for offerImage in offerImages:
                offerImageSerializer = ImageSerializer(offerImage)
                offerImage_list.append(offerImageSerializer.data)
            post_offer = {"offer": offerSerializer.data,
                          "item": itemOfferSerializer.data, "image": offerImage_list}
        if post_offer:
            postData.append({"post": postSerializer.data, "post_item": itemSerializer.data,
                            "offers": post_offer, "image": itemImage_list})

    if request.method == "GET":
        return Response(postData, status=status.HTTP_200_OK)


@ api_view(['GET', 'PUT'])
def set_pending(request):
    if request.method == "PUT":
        print(request.data)
        try:
            offer = Offer.objects.filter(pk=request.data["id"]).first()
        except Offer.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        # print("😁", offer)
        serializer = OfferSerializer(offer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("saved", status=status.HTTP_200_OK)
        return Response("did not save")


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
                                "image": imageSerializer.data[0]['image']
                            })
                except Offer.DoesNotExist:
                    print("next")

        except User.DoesNotExist:
            error = {"Error on user"}
            return Response(error, status=status.HTTP_404_NOT_FOUND)
    return Response(data, status=status.HTTP_200_OK)


# @api_view(['GET'])
# def single_offer(request, userId, offerId):
#     if request.method == "GET":
#         try:
#             user = User.objects.get(pk=userId)
#             offer = OfferSerializer(Offer.objects.get(pk=offerId))
#             getUserId = UserSerializer(user).data["id"]
#             getOfferId = offer['id'].value
#             getPostId = offer['post_id']
#             allItems = Item.objects.filter(user_id=getUserId)
#             itemSerializer = ItemSerializer(allItems, many=True).data
#             data = []
#             for item in itemSerializer:
#                 getOffer = Offer.objects.get(
#                     offered_item=item['id'], acceptance=False)
#                 test = OfferSerializer(getOffer).data
#                 image = Image.objects.filter(item_id=item['id'])
#                 imageSerializer = ImageSerializer(image, many=True)
#                 if test['offered_item'] == item['id']:
#                     data.append(
#                         {"itemName": item['item_name'], "image": imageSerializer.data[0]['image']})
#         except User.DoesNotExist:
#             error = {"Error on user"}
#             return Response(error, status=status.HTTP_404_NOT_FOUND)
#         return Response(data, status=status.HTTP_200_OK)

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
        item2 = Item.objects.get(pk=currentPostItemId)
        wantedItem = ItemSerializer(item2).data
        getItem2Image = Image.objects.filter(item_id=currentPostItemId).first()
        item2Image = ImageSerializer(getItem2Image).data
        getUser = User.objects.get(pk=currentPostUserId)
        otherUser = UserSerializer(getUser).data
        data = {"itemOffered": currentUserItem['item_name'], "itemOfferedImage": item1Image['image'],
                "desiredItem": wantedItem['item_name'], "desiredItemImage": item2Image['image'], "otherUserInfo": otherUser['username']}
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
    print("✌️", request.data, "✌️", userIdReview)
    if request.method == 'PUT':
        user = User.objects.get(pk=userIdReview)
        # editedUser = UserSerializer(user, data={"reputation_rating" : data + request.data}, partial=True)
        if editedUser.is_valid():
            editedUser.save()
            return Response("review sent succesfully", status=status.HTTP_202_ACCEPTED)
        else:
            return Response('wrong review', status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def hello(request):
    if request.method == "GET":
        # queryset = User.objects.all()
        # serializer_class = UserSerializer
        return Response("Hello this is a test for fucntion based calls")
