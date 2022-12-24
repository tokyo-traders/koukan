from django.urls import path
from .views import user_list
from api import views

urlpatterns = [
    path('user', views.user_list),
    path('hello', views.hello),
    path('user/<str:name>', views.user_edit),
]
