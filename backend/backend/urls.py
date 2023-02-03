from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from backend.settings import BASE_DIR
import os


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    path('', TemplateView.as_view(template_name="index.html"))
]

print("😁",(
    os.path.join(BASE_DIR, "backend", 'static')
    # BASE_DIR / "static/"
))