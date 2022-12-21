from django.urls import path
from .views import UserView, user_list
from api import views

urlpatterns = [
    path('', views.user_list)
]