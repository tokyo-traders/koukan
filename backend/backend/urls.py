from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
print("😎",BASE_DIR)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls"))
]

