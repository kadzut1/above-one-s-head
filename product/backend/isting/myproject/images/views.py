# myapp/views.py
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ImageListView(APIView):
    def get(self, request):
        images_folder = os.path.join(settings.BASE_DIR, 'setting', 'images')  # Путь к папке с изображениями

        # Отладочный вывод для проверки пути
        print("Путь к папке с изображениями:", images_folder)

        try:
            # Получаем все файлы из папки 'images'
            if not os.path.exists(images_folder):
                return Response({'error': 'Папка с изображениями не найдена'}, status=status.HTTP_404_NOT_FOUND)

            image_files = [f for f in os.listdir(images_folder) if os.path.isfile(os.path.join(images_folder, f))]

            if not image_files:
                return Response({'error': 'Изображения не найдены'}, status=status.HTTP_404_NOT_FOUND)

            # Преобразуем в относительные пути для удобства использования
            image_files = [os.path.join('images', f) for f in image_files]

            return Response({'images': image_files}, status=status.HTTP_200_OK)

        except Exception as e:
            # Логирование ошибок
            print("Ошибка при обработке запроса:", str(e))
            return Response({'error': 'Ошибка при получении изображений'}, status=status.HTTP_400_BAD_REQUEST)
