from django.contrib import admin
from api.models import User, Item, Image, Post, Offer


class UserAdmin(admin.ModelAdmin):
    pass


class ImageAdmin(admin.ModelAdmin):
    pass


class ItemAdmin(admin.ModelAdmin):
    pass

class PostAdmin(admin.ModelAdmin):
    pass

class OfferAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Offer, OfferAdmin)
