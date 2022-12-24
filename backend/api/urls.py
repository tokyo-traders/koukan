from django.urls import path
from .views import user_list, user_edit, item_list, hello
from api import views

urlpatterns = [
    path('user', views.user_list),
    path('item', views.item_list),
    path('item/<str:name>', views.item_edit),
    path('hello', views.hello),
    path('user/<str:name>', views.user_edit),
]
