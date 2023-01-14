from django.db import models
from django.utils import timezone

# this to create the folders in the file. Note: will not use yet. need further research.


def upload_path(instance, filename):
    return '/'.join([])

# Create your models here.


class User(models.Model):
    first_name = models.CharField(max_length=20, default="")
    last_name = models.CharField(max_length=20, default="")
    address = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=20, default="")
    email = models.CharField(max_length=50, default="")
    password = models.CharField(max_length=12, default="")
    created_at = models.DateTimeField(auto_now_add=True)


class Image(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to='%Y/%m/%d')
    item_id = models.ForeignKey(
        'Item', null=True, on_delete=models.CASCADE, related_name="item_model")

    # objects = models.Manager()


class Item(models.Model):
    item_name = models.CharField(max_length=200, default="")
    user_id = models.ForeignKey('User', on_delete=models.CASCADE,)
    date_of_post = models.DateTimeField(auto_now_add=True)
    details = models.TextField()
    desire = models.CharField(max_length=200, default="")
    offer_period = models.DateTimeField(default=timezone.now)
    status = models.IntegerField(default=0)
    is_tradable = models.BooleanField(default=True)
    # item_image = models.ImageField(blank=True, null=True, upload_to='images/')


class Post(models.Model):
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('Item', on_delete=models.CASCADE)
    price = models.BooleanField(default=False)
    desire = models.TextField(max_length=255)
    delivery = models.BooleanField(default=False)
    expiration = models.DateTimeField(default=timezone.now)


class Offers(models.Model):
    post_id = models.ForeignKey('Post', on_delete=models.CASCADE)
    offered_item = models.ForeignKey('Item', on_delete=models.CASCADE)
