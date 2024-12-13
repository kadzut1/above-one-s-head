import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RandomImage = () => {
  const [images, setImages] = useState([]);
  const [randomImage, setRandomImage] = useState(null);
  const [loading, setLoading] = useState(true);  // Для отслеживания состояния загрузки

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Запросим список изображений с сервера
        const response = await axios.get('http://127.0.0.1:8000/api/images/');
        setImages(response.data.images);  // Сохраняем список изображений
        setLoading(false);  // Завершаем загрузку
      } catch (error) {
        console.error('Ошибка при получении изображений:', error);
        setLoading(false);  // Завершаем загрузку, даже если ошибка
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Выбираем случайное изображение
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setRandomImage(images[randomIndex]);
    }
  }, [images]);

  const imageUrl = randomImage ? `http://127.0.0.1:8000/static/${randomImage}` : '';

  // Обработка случая, когда изображение отсутствует
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'http://127.0.0.1:8000/static/default-image.jpg';  // Путь к изображению-заглушке
  };

  return (
    <div>
      {loading ? (
        <p>Загрузка изображения...</p>
      ) : randomImage ? (
        <img
          src={imageUrl}
          alt="Random"
          onError={handleImageError}  // Обработчик ошибки загрузки изображения
        />
      ) : (
        <p>Нет доступных изображений.</p>
      )}
    </div>
  );
};

export default RandomImage;
