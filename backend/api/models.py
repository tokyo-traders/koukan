from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
import datetime
# this to create the folders in the file. Note: will not use yet. need further research.

date = timezone.now


def upload_path(instance, filename):
    return '/'.join([])

# Create your models here.


class User(models.Model):
    first_name = models.CharField(max_length=20, default="")
    last_name = models.CharField(max_length=20, default="")
    address = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=20, default="", unique=True)
    email = models.EmailField(max_length=50, default="", unique=True)
    password = models.CharField(max_length=12, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )  # This is for validation in phone details
    phone_detail = models.CharField(
        validators=[phone_regex], default="", max_length=20, unique=True)
    is_emailVerified = models.BooleanField(default=False)
    is_phoneVerified = models.BooleanField(default=False)
    reputation_rating = models.DecimalField(
        max_digits=1000, decimal_places=0, default=0)
    total_review = models.IntegerField(default=0, null=True)


class Image(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to='%Y/%m/%d')
    item_id = models.ForeignKey(
        'Item', null=True, on_delete=models.CASCADE, related_name="item_model")

    # objects = models.Manager()


class Item(models.Model):
    item_name = models.CharField(max_length=200, default="")
    user_id = models.ForeignKey('User', on_delete=models.CASCADE,)
    date_of_post = models.DateTimeField(auto_now_add=True)
    details = models.TextField(default="")
    category = models.ForeignKey('Categories', on_delete=models.CASCADE)


class Post(models.Model):
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    item_id = models.ForeignKey('Item', on_delete=models.CASCADE)
    price = models.BooleanField(default=False)
    delivery = models.BooleanField(default=False)
    desire = models.TextField(max_length=255, default="")
    expiration = models.DateTimeField(
        default=timezone.now() + datetime.timedelta(weeks=+1))
    date_posted = models.DateTimeField(auto_now_add=True)
    visibile = models.BooleanField(default=True)


class Offer(models.Model):
    post_id = models.ForeignKey('Post', on_delete=models.CASCADE)
    offered_item = models.ForeignKey('Item', on_delete=models.CASCADE)
    acceptance = models.BooleanField(default=False)
    date_offered = models.DateTimeField(auto_now_add=True)
    post_confirmation = models.BooleanField(default=False)
    offer_confirmation = models.BooleanField(default=False)
    visibile = models.BooleanField(default=True)


class Categories(models.Model):
    category_name = models.CharField(max_length=50, default="")
    reputation_point = models.DecimalField(
        max_digits=10, decimal_places=4, default=0)


class ReportedUser(models.Model):
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    subject = models.CharField(max_length=100, default="")
    reason = models.TextField(default="")
