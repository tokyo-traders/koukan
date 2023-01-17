from rest_framework import serializers
from .models import User, Item, Image, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name',
                  'username', 'email', 'password', 'address')


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'item_name', 'user_id', 'details', 'desire',
                  'offer_period', 'status', 'is_tradable')


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

# attempt from Flavio


class ItemWithSnapshotSerializer(serializers.ModelSerializer):
    snapshot = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['item_name', 'snapshot']

    def get_snapshot_field(itemId):
        snapshot_data = Image.objects.filter(item_id=itemId)
        return ImageSerializer(snapshot_data).data


# class MySerializer(serializers.ModelSerializer):
#     other_model_field = serializers.SerializerMethodField()

#     class Meta:
#         model = MyModel
#         fields = ('id', 'name', 'other_model_field')

#     def get_other_model_field(self, obj):
#         other_model_data = OtherModel.objects.filter(mymodel=obj)
#         return OtherModelSerializer(other_model_data, many=True).data

# this is koji's attempt
class MultiModelSerializer(serializers.Serializer):
    itemList = serializers.CharField(source='Item.item_name')
    imageList = serializers.ImageField(source='Image.image')

    class Meta:
        model = Item
        fields = ('itemList', 'imageList')
