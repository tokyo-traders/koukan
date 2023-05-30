from django.urls import path
from .views import hello
from .views_folder.user_views import user_register, user_login, user_refresh, user_logout, VerifyEmail
from .views_folder.item_views import item_list, item_edit, image_list, multiple_upload
from .views_folder.handover_views import all_item, newall_item, set_pending, accepted_trade, item_handover
from .views_folder.post_views import   create_post, edit_post, create_offer, edit_offer
from .views_folder.home_views import single_offer, items_offered, homepage, listingItem, search_item, category_list, currentUser_review, sendUserReview, send_review

from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
# router.register('image', ImageView)
# router.register('image/multiple_upload',ImageView)

urlpatterns = [
    #user_views
    path('image/multiple_upload', multiple_upload),
    path('user/register', user_register),
    path('user/login', user_login),
    path('user/refresh', user_refresh),
    path('user/logout', user_logout),


    #item_views
    # to GET and POST all the item objects
    path('item/<int:userid>', item_list),
    # to get the item with full CRUD
    path('item-edit/<int:itemId>', item_edit),
    # to get the images path with GET and DELETE method only
    path('item-image/<int:itemId>', image_list),


    # Handover_views
    path('SetPending', set_pending),
    path('acceptedTrade/<int:userId>', accepted_trade),
    path('itemHandover', item_handover),
    path('all-item/<int:userid>/<int:itemid>', all_item),
    path('all-item/<int:itemid>', all_item),
    path('all-info/<int:userid>', newall_item),
    path('verify-email', VerifyEmail.as_view(), name='verify-email'),   

    #post_views
    # this path only lets you create a post and get all the post created for reference.
    path('create-post', create_post),
    # this path lets you get the specific post, edit it, and delete it.
    path('edit-post/<int:postId>', edit_post),
    # this path only lets you create an offer and get all the offer created for reference.
    path('create-offer', create_offer),
    # this path lets you get the specific offer, edit it, and delete it.
    path('edit-offer/<int:offerId>', edit_offer),

    #home_views
    # to get all listings
    path('homepage', homepage),
    path('listing/<int:postId>', listingItem),
    # this path gives an array of item names for the search bar
    path('search-item', search_item),
    path('categories-list', category_list),
    path('offered-items/<int:userId>', items_offered),
    path('singleOffer/<int:offerId>', single_offer),
    path('currentUserScore/<int:userId>', currentUser_review),
    path('sendUserReview/<int:userId>', sendUserReview),
    path('send-review/<int:userIdReview>', send_review)



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...


# ...use this one
urlpatterns += router.urls
