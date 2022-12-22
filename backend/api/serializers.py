from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']


class CreateUserSerializer(serializers.ModelSerializer):
    class meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']