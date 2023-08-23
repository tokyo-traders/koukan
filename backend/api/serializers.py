from rest_framework import serializers
from .models import User, Item, Image, Post, Offer, Categories, ReportedUser,PostCategories

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class SafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "address", "phone_detail", "is_emailVerified", "reputation_rating", "total_review"] 


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"

class SearchItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["item_name"]

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
    item_id = ItemSerializer()

    class Meta:
        model = Post
        fields = "__all__"


class SearchPostSerializer(serializers.ModelSerializer):
    item_id = SearchItemSerializer()

    class Meta:
        model = Post
        fields = ["id",'item_id']

class UserPostSerializer(serializers.ModelSerializer):
    item_id = ItemSerializer()
    user_id = SafeUserSerializer()

    class Meta:
        model = Post
        fields = "__all__"



class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = "__all__"

class ReportedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportedUser
        field = "__all__"

class PostCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostCategories
        fields = "__all__"