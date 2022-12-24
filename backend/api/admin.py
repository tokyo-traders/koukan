from django.contrib import admin
from api.models import User, Item

class UserAdmin(admin.ModelAdmin):
    pass

class ItemAdmin(admin.ModelAdmin):
    pass

admin.site.register(User, UserAdmin)
admin.site.register(Item, ItemAdmin)