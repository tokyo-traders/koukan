from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import UserSerializer, ItemSerializer, ImageSerializer,PostItemSerializer,SearchPostSerializer,UserPostSerializer, PostSerializer, OfferSerializer, CategoriesSerializer, PostCategoriesSerializer
from ..models import User, Item, Image, Post, Offer, Categories, PostCategories
from ..authentication import  auth_state
from django.core.cache import cache
import math
import json



@api_view(['GET']) 
def homepage(request):
    if request.method == "GET":
        page = int(request.query_params.get('page', 1))
        cache_data = cache.get(f"homepage{page}")
        if cache_data:
            return Response(json.loads(cache_data), status=status.HTTP_200_OK)
        pageQuery = page * 18
        visible_posts_count = Post.objects.filter(visibile=True).count()
        Totalpages = math.ceil(visible_posts_count/18)
        result = Post.objects.select_related('item_id').filter(visibile=True)[(pageQuery-18): pageQuery]
        postSerializer = PostItemSerializer(result, many=True)
        posts = postSerializer.data
        data = []
        for post in posts:
            image = Image.objects.filter(item_id=post["item_id"]["id"])
            imageSerializer = ImageSerializer(image,many=True)
            data.append({"post": post,
                        "images": [imageSerializer.data[0]],
                        })
        cache.set(f"homepage{page}", json.dumps({"data": data, "TotalPages": Totalpages}), timeout=300)
        return Response({"data": data, "TotalPages": Totalpages}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def categoryListing(request, category):
    if request.method == "GET":
        cache_data = cache.get(f"categoryListing{category}")
        if cache_data:
            return Response(json.loads(cache_data), status=status.HTTP_200_OK)
        page = int(request.query_params.get('page', 1))
        pageQuery = page * 18
        visible_posts_count = Post.objects.filter(visibile=True,item_id__category=category).count()
        result = Post.objects.select_related('item_id').filter(visibile=True,item_id__category=category)[(pageQuery-18): pageQuery]
        Totalpages = math.ceil(visible_posts_count/18)
        postSerializer = PostItemSerializer(result, many=True)
        posts = postSerializer.data
        data = []
        for post in posts:
            image = Image.objects.filter(item_id=post["item_id"]["id"])
            imageSerializer = ImageSerializer(image,many=True)
            imageData = imageSerializer.data
            data.append({"post": post,
                        "images": imageData})
        cache.set(f"categoryListing{category}", json.dumps({"data": data, "TotalPages": Totalpages}), timeout=300)
        return Response({"data": data, "TotalPages": Totalpages}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def search(request):
    if request.method == "GET":
        search = str(request.query_params.get('search'))
        result = Post.objects.select_related('item_id').filter(visibile=True, item_id__item_name__icontains=search)
        postSerializer = SearchPostSerializer(result, many=True)
        posts = postSerializer.data
        return Response(posts, status=status.HTTP_200_OK)

@api_view(['GET'])
def userListing(request, userid):
    if request.method == "GET": 
        posts = Post.objects.filter(visibile=True, user_id=userid)
        data = []
        for post in posts:
            postSerializer = PostSerializer(post)
            itemID = postSerializer.data['item_id']
            item = Item.objects.get(pk=itemID)
            image = Image.objects.filter(item_id=itemID)
            itemSeralizer = ItemSerializer(item)
            imageSerializer = ImageSerializer(image,many=True)
            data.append({"post": postSerializer.data,
                        "item": itemSeralizer.data, "images": imageSerializer.data})
        return Response(data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def listingItem(request, postId):
    if request.method == "GET":
        post = Post.objects.select_related('item_id').select_related("user_id").get(pk=postId)
        categories = PostCategories.objects.filter(post_id=postId)
        categoriesSerializer= PostCategoriesSerializer(categories, many=True)
        postSerializer = UserPostSerializer(post)
        categoriesData = categoriesSerializer.data
        postData = postSerializer.data
        images = Image.objects.filter(item_id=postData["item_id"]["id"])
        imageSerializer = ImageSerializer(images, many=True)
        image = imageSerializer.data
        postData["images"] = (image)
        postData["categories"] = (categoriesData)
        return Response(postData, status=status.HTTP_200_OK)
    

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
        return Response(data, status=status.HTTP_200_OK)


@ api_view(['GET'])
def category_list(request):
    try:
        categories = Categories.objects.all()
    except Categories.DoesNotExist:
        error = {"error": "You have failed to get the categories"}
        return Response(error, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        cache_data = cache.get("category_list")
        if cache_data:
            return Response(json.loads(cache_data), status=status.HTTP_200_OK)
        catergorySerializer = CategoriesSerializer(categories, many=True).data
        cache.set("category_list", json.dumps(catergorySerializer), timeout=10800)
        return Response(catergorySerializer, status=status.HTTP_200_OK)



@ api_view(['GET'])
def items_offered(request, userId):
    if request.method == "GET":
        try:
            user = User.objects.get(pk=userId)
            allItems = Item.objects.filter(user_id=userId)
            itemSerializer = ItemSerializer(allItems, many=True).data
            data = []
            for item in itemSerializer:  
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
                    file = imageSerializer.data[0]['image']
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
                                "image": file
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
        file1 = item1Image['image']
        item2 = Item.objects.get(pk=currentPostItemId)
        wantedItem = ItemSerializer(item2).data
        getItem2Image = Image.objects.filter(item_id=currentPostItemId).first()
        item2Image = ImageSerializer(getItem2Image).data
        file2 = item2Image['image']
        getUser = User.objects.get(pk=currentPostUserId)
        otherUser = UserSerializer(getUser).data
        data = {"itemOffered": currentUserItem['item_name'], "itemOfferedImage": file1,
                "desiredItem": wantedItem['item_name'], "desiredItemImage":file2, "otherUserInfo": otherUser['username']}
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
        return Response(toBeupdated.data, status=status.HTTP_200_OK)

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
        return Response(status=status.HTTP_403_FORBIDDEN)