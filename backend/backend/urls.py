from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.static import serve
from django.urls import re_path
import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    path('', TemplateView.as_view(template_name="index.html")),
     re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]

