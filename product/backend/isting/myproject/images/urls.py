from django.urls import path
from .views import ImageListView

urlpatterns = [
    path('api/images/', ImageListView.as_view(), name='image-list'),
]
