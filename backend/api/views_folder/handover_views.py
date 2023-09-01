from rest_framework import  status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import UserSerializer, ItemSerializer, ImageSerializer, PostSerializer, OfferSerializer
from ..models import User, Item, Image, Post, Offer
from ..authentication import  auth_state


@ api_view(['GET', 'PUT'])
def set_pending(request):
    if request.method == "PUT":
        auth = auth_state(request)
        if auth:
            try:
                offer = Offer.objects.filter(pk=request.data["id"]).first()
            except Offer.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = OfferSerializer(offer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("saved", status=status.HTTP_200_OK)
            return Response("did not save")
        return Response(status=status.HTTP_403_FORBIDDEN)
        
@ api_view(['GET'])
def accepted_trade(request, userId):

    try:
        posts = Post.objects.filter(user_id=userId)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    postData = []
    for post in posts:
        postSerializer = PostSerializer(post)
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
        auth = auth_state(request)
        if auth:
            return Response(postData, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)
    

@api_view(['PUT', 'POST'])
def item_handover(request):
    # swap items
    listedPost = Post.objects.filter(id=request.data["post_id"]).first()
    postSerializer = PostSerializer(listedPost)
    listedItem = Item.objects.filter(id=postSerializer.data["item_id"]).first()
    offeredItem = Item.objects.filter(id=request.data['offered_item']).first()
    listedSerializer = ItemSerializer(listedItem)
    offeredSerializer = ItemSerializer(offeredItem)

    if request.method == "PUT":
        auth = auth_state(request)
        if auth:
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
            return Response(item_Serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def all_item(request, itemid):
    try:
        item = Item.objects.get(pk=itemid)
        images = Image.objects.filter(item_id=itemid)
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
            itemSerializer = ItemSerializer(item)
            imageSerializer = ImageSerializer(images, many=True)
            try:
                getOffer = Offer.objects.filter(
                    offered_item=itemid).first()
                currentOffer = OfferSerializer(getOffer)
                offeredItemId = currentOffer.data['offered_item']
                getItemDetail = Item.objects.get(pk=offeredItemId)
                itemDetail = ItemSerializer(getItemDetail)
                getUserInfo = User.objects.get(pk=itemDetail.data['user_id'])
                userInfo = UserSerializer(getUserInfo)
                data = []
                data.append({'itemName': itemSerializer.data['item_name'],
                            'images': imageSerializer.data,
                            'details': itemSerializer.data['details'],
                            'expiration': currentOffer.data['date_offered'],
                            'idOffer': currentOffer.data['id'],
                            'user_id': itemSerializer.data['user_id'],
                            'userName': userInfo.data['username'],
                            'userReputation': userInfo.data['reputation_rating'],
                            'userTotalReview': userInfo.data['total_review']})
            except Offer.DoesNotExist:
                data = []
                data.append({
                    'itemName': itemSerializer.data['item_name'],
                    'images': imageSerializer.data,
                    'details': itemSerializer.data['details'],
                    'user_id': itemSerializer.data['user_id']
                    })
            return Response(data)


# All items of a user
@api_view(['GET'])
def newall_item(request, userid):
    try:
        items = Item.objects.filter(user_id=userid).all()
    except Item.DoesNotExist or Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        auth = auth_state(request)
        if auth:
            data = []
            for item in items:
                singleItemSerializer = ItemSerializer(item)
                images = Image.objects.filter(item_id=singleItemSerializer.data["id"])
                singleImageSerializer = ImageSerializer(images, many=True)
                data.append({
                    'itemID': singleItemSerializer.data['id'],
                    'itemName': singleItemSerializer.data['item_name'],
                    'itemImages': singleImageSerializer.data,
                    'userId': singleItemSerializer.data['user_id'],
                    'category': singleItemSerializer.data['category'],
                    
                })
            return Response(data)
        return Response(status=status.HTTP_403_FORBIDDEN)