from django.urls import path
from .views import user_list, user_edit, item_list, hello
from api import views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

router = routers.DefaultRouter()
router.register('image', views.ImageView)
router.register('image/multiple_upload', views.ImageView)


urlpatterns = [
    path('user/all', views.user_list),
    path('user/login/', views.user_edit),
    path('item', views.item_list),
    path('item/<str:name>', views.item_edit),
    path('hello', views.hello),
    path('user/<str:name>', views.user_edit),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#
# use the static or...

# ...use this one
urlpatterns += router.urls
