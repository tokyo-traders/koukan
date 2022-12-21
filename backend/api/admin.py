from django.contrib import admin
from api.models import User

class UserAdmin(admin.ModelAdmin):
    pass
  
admin.site.register(User, UserAdmin)