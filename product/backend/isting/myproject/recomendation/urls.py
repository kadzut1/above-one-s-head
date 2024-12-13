# recomend_text/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Маршрут для предсказания категорий на основе ввода пользователя
    path('api/predict/', views.predict, name='predict'),
    path('api/predict_top_classes/', views.predict_top_classes, name='predict_top_classes'),
    path('api/random_products/', views.load_random_products, name='random_products'),
]