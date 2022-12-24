from django.urls import path
from .views import user_list
from api import views

urlpatterns = [
    path('all', views.user_list),
    path('', views.user_edit),
    path('hello', views.hello)
]
