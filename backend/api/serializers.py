from rest_framework import serializers
from .models import User, Item, Image, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'username', 'email', 'password', 'address']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'user_id', 'details', 'desire',
                  'offer_period', 'status', 'is_tradable']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"


class MultipleImageSerializer(serializers.Serializer):  # no ModelSerializer
    images = serializers.ListField(
        child=serializers.ImageField()
    )
    itemId = serializers.ListField(
        child=serializers.IntegerField()
    )

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

