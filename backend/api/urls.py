from django.urls import path
from .views import user_list, user_edit, item_list, image_list, hello
from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
router.register('image', views.ImageView)
router.register('image/multiple_upload', views.ImageView)

urlpatterns = [
    path('user/all', views.user_list),
    path('user/login', views.user_edit),
    path('item/<int:userid>', views.item_list), # to GET and POST all the item objects
    path('item/<str:username>/<int:id>', views.item_edit), # to get the item with full CRUD
    path('item-image/<int:itemId>', views.image_list), # to get the images path with GET and DELETE method only
    path('hello', views.hello),
    path('user/login/<str:name>', views.user_edit),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...

# ...use this one
urlpatterns += router.urls
