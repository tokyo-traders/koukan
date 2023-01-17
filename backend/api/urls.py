from django.urls import path

from .views import user_list, user_edit, item_list, image_list, all_item, newall_item, hello

from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
router.register('image', views.ImageView)
router.register('image/multiple_upload', views.ImageView)

urlpatterns = [
    # to access registration
    path('user/register', views.user_register),
    path('user/login', views.user_login),
    path('user/refresh', views.user_refresh),
    path('user/logout', views.user_logout),
    # to GET and POST all the item objects
    path('item/<int:userid>', views.item_list),
    # to get the item with full CRUD
    path('item/<str:username>/<int:id>', views.item_edit),
    # to get the images path with GET and DELETE method only
    path('item-image/<int:itemId>', views.image_list),
    path('hello', views.hello),
    path('all-item/<int:userid>/<int:itemid>', views.all_item),
    path('all-info/<int:userid>', views.newall_item),
    path('user/login/<str:name>', views.user_edit),
    path('all-item/<int:itemid>', views.all_item),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...



# ...use this one
urlpatterns += router.urls
