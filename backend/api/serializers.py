from rest_framework import serializers
from .models import User, Item, Image, Post, Offer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


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

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"