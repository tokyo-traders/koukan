from django.urls import path
from .views import user_list, hello
from api import views

urlpatterns = [
    path('', views.user_list),
    path('hello', views.hello)
]