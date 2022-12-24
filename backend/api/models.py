from django.db import models
from django.utils import timezone

# Create your models here.
class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=20, default="")
    last_name = models.CharField(max_length=20, default="")
    address = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=20, default="")
    email = models.CharField(max_length=50, default="")
    password = models.CharField(max_length=12, default="")
    created_at = models.DateTimeField(auto_now_add=True)

class Item(models.Model):
    item_name = models.CharField(max_length=200, default="")
    user_id = models.ForeignKey('User',on_delete=models.CASCADE,)
    date_of_post = models.DateTimeField(auto_now_add=True)
    details = models.TextField()
    desire = models.CharField(max_length=200, default="")
    offer_period = models.DateTimeField(default=timezone.now)
    status = models.IntegerField(default=0)
    is_tradable = models.BooleanField(default=True)
