# listing/admin.py
from django.contrib import admin
from . import models  # Если модель называется Product, а не Card

admin.site.register(models.ListingProduct)
