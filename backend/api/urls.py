from django.urls import path
from .views import   single_offer, items_offered,  create_post, edit_post, create_offer, edit_offer, homepage, listingItem, search_item, VerifyEmail, item_handover, accepted_trade, set_pending, accepted_trade, category_list, currentUser_review, sendUserReview
from .views_folder.user_views import user_register, user_login, user_refresh, user_logout
from .views_folder.item_views import item_list, item_edit, image_list, all_item, newall_item

from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
router.register('image', views.ImageView)
router.register('image/multiple_upload', views.ImageView)

urlpatterns = [
    path('user/register', user_register),
    path('user/login', user_login),
    path('user/refresh', user_refresh),
    path('user/logout', user_logout),


    # to GET and POST all the item objects
    path('item/<int:userid>', item_list),
    # to get the item with full CRUD
    path('item-edit/<int:itemId>', item_edit),
    # to get the images path with GET and DELETE method only
    path('item-image/<int:itemId>', image_list),


    # HandOver
    path('SetPending', views.set_pending),
    path('acceptedTrade/<int:userId>', views.accepted_trade),
    path('itemHandover', views.item_handover),
    path('all-item/<int:userid>/<int:itemid>', all_item),
    path('all-item/<int:itemid>', all_item),
    path('all-info/<int:userid>', newall_item),

    # this path only lets you create a post and get all the post created for reference.
    path('create-post', views.create_post),
    # this path lets you get the specific post, edit it, and delete it.
    path('edit-post/<int:postId>', views.edit_post),
    # this path only lets you create an offer and get all the offer created for reference.


    path('create-offer', views.create_offer),
    # this path lets you get the specific offer, edit it, and delete it.
    path('edit-offer/<int:offerId>', views.edit_offer),


    # to get all listings
    path('homepage', views.homepage),
    # to get a single listing
    path('trades/<int:userId>', views.accepted_trade),
    path('listing/<int:postId>', views.listingItem),
    # this path gives an array of item names for the search bar
    path('search-item', views.search_item),

    # this path is for email verification
    path('verify-email', VerifyEmail.as_view(), name='verify-email'),
    path('categories-list', views.category_list),
    path('offered-items/<int:userId>', views.items_offered),


    # path('offered-items/<int:userId>/<int:offerId>', views.single_offer),
    path('singleOffer/<int:offerId>', views.single_offer),
    path('currentUserScore/<int:userId>', views.currentUser_review),
    path('sendUserReview/<int:userId>', views.sendUserReview),
    path('send-review/<int:userIdReview>', views.send_review)



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...


# ...use this one
urlpatterns += router.urls
