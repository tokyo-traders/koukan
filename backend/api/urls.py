from django.urls import path

from .views import user_list, user_edit

from api import views

urlpatterns = [
    path('all', views.user_list),
    path('<str:name>', views.user_edit),
    path('hello', views.hello)
]