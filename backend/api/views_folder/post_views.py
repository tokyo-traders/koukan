from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PostSerializer, OfferSerializer, PostCategoriesSerializer
from ..models import Post, Offer
from ..authentication import  auth_state


@ api_view(['GET', 'POST'])
def create_post(request):
    auth = auth_state(request)
    if auth:
        if request.method == "GET":
            post = Post.objects.all()
            serializer = PostSerializer(post, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == "POST":
            postSerializer = PostSerializer(data=request.data["post"])
            if postSerializer.is_valid():
                postSerializer.save()
                postSerializer.data["id"]
                for key in request.data["categories"]:
                    if request.data["categories"][f"{key}"]:
                        categ = {}
                        categ["post_id"] = postSerializer.data["id"]
                        categ["categories_id"] = key
                        catSerializer = PostCategoriesSerializer(
                            data=categ, partial=True)
                        if catSerializer.is_valid():
                            catSerializer.save()

                return Response(postSerializer.data, status=status.HTTP_201_CREATED)
            else:
                error = {"error": "You have failed to create a post properly"}
                return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response(status=status.HTTP_403_FORBIDDEN)
            

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
        auth = auth_state(request)
        if auth:
            serializer = OfferSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                error = {"error": "You have failed to create an offer properly"}
                return Response(error, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response(status=status.HTTP_403_FORBIDDEN)


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
