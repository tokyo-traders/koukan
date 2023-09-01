from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import ItemSerializer, ImageSerializer, MultipleImageSerializer
from ..models import Item, Image
from ..authentication import  auth_state


@api_view(['GET', 'POST'])
def item_list(request, userid):

    if request.method == "GET":
        item = Item.objects.filter(user_id=userid).all()
        serializer = ItemSerializer(item, many=True)
        return Response(serializer.data)
    
    if request.method == "POST":
        auth = auth_state(request)
        if auth:
            serializer = ItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'PUT', 'DELETE', 'POST', 'PATCH'])
def item_edit(request, itemId):

    try:
        item = Item.objects.get(pk=itemId)
        itemSerializer = ItemSerializer(item)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(itemSerializer.data, status=status.HTTP_200_OK)
    if request.method == "PATCH":
        auth = auth_state(request)
        if auth:
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
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == 'DELETE':
        auth = auth_state(request)
        if auth:
            currentItemId = itemSerializer.data['id']
            try:
                toBeDeleted = Item.objects.get(pk=currentItemId)
                toBeDeleted.delete()
                message = {"message": "You have now deleted the offer"}
                return Response(message, status=status.HTTP_204_NO_CONTENT)
            except Item.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_403_FORBIDDEN)



@ api_view(['GET', 'DELETE'])
def image_list(request, itemId):
    try:
        image = Image.objects.filter(item_id=itemId).all()
    except Image.DoesNotExist:

        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ImageSerializer(image, many=True)
        image_list = []
        for image in serializer.data:
            image_list.append(image['image'])
        return Response(image_list)
    elif request.method == "DELETE":
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@ api_view(["POST"])
def multiple_upload(request):
     if request.method == "POST":
        serializer = MultipleImageSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            images = serializer.validated_data.get('images')
            itemId = serializer.validated_data.get('itemId')
            getItemInstance = Item.objects.get(pk=itemId[0])

            image_list = []
            for img in images:
                image_list.append(
                    Image(image=img, item_id=getItemInstance)
                )

            if image_list:  # --> if imagelist exists
                Image.objects.bulk_create(image_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)

