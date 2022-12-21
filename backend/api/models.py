from django.db import models

# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=20, default="")
    last_name = models.CharField(max_length=20, default="")
    address = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=20, default="")
    email = models.CharField(max_length=50, default="")
    password = models.CharField(max_length=12, default="")
    created_at = models.DateTimeField(auto_now_add=True)