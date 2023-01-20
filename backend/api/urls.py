from django.urls import path

from .views import user_register, user_login, item_list, image_list, all_item, newall_item, create_post, edit_post, create_offer, edit_offer, hello


from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
router.register('image', views.ImageView)
router.register('image/multiple_upload', views.ImageView)

urlpatterns = [
    path('user/all', views.user_register),

    path('user/login', views.user_login),
    # to GET and POST all the item objects
    path('item/<int:userid>', views.item_list),
    # to get the item with full CRUD
    path('item/<str:username>/<int:id>', views.item_edit),
    # to get the images path with GET and DELETE method only
    path('item-image/<int:itemId>', views.image_list),
    path('hello', views.hello),
    path('all-item/<int:userid>/<int:itemid>', views.all_item),

    path('all-info/<int:userid>', views.newall_item),
    path('create-post', views.post_list),  # added manually from Koji
    # path('user/login/<str:name>', views.user_login),
    path('all-item/<int:itemid>', views.all_item),
    path('all-info/<int:userid>', views.newall_item),
    path('create-post', views.create_post), # this path only lets you create a post and get all the post created for reference.
    path('edit-post/<int:postId>', views.edit_post), # this path lets you get the specific post, edit it, and delete it.
    path('create-offer', views.create_offer), # this path only lets you create an offer and get all the offer created for reference.
    path('edit-offer/<int:offerId>', views.edit_offer), # this path lets you get the specific offer, edit it, and delete it.
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...


# ...use this one
urlpatterns += router.urls