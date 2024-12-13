import React, { useState, useEffect } from "react";
import axios from "axios";
import "../web-scss/ProductSearch.scss"; // Подключаем стили

const ProductSearch = () => {
  const [userInput, setUserInput] = useState(""); // Строка ввода пользователя
  const [products, setProducts] = useState([]); // Массив с продуктами
  const [loading, setLoading] = useState(false); // Статус загрузки
  const [error, setError] = useState(null); // Ошибки при запросе
  const [images, setImages] = useState([]); // Массив с изображениями для случайного выбора

  // Загружаем изображения для случайного выбора
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/images/"); // Получаем список изображений
        setImages(response.data.images); // Сохраняем список изображений
      } catch (error) {
        console.error('Ошибка при получении изображений:', error);
      }
    };

    fetchImages();
  }, []);

  // Функция для обработки ввода пользователя и отправки запроса
  const handleSearch = async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    setLoading(true); // Включаем индикатор загрузки
    setError(null); // Очищаем ошибки при новом запросе

    try {
      // Отправка запроса на сервер
      const response = await axios.post("http://127.0.0.1:8000/api/predict/", {
        user_input: userInput, // Отправляем введённый текст
      });

      // Если запрос успешен, обновляем состояние с продуктами
      setProducts(response.data.products.slice(0, 5)); // Оставляем только первые 5 товаров
    } catch (err) {
      // Обработка ошибки, если запрос не удался
      setError("Произошла ошибка при загрузке товаров");
    } finally {
      setLoading(false); // Останавливаем индикатор загрузки
    }
  };

  // Функция для выбора случайного изображения
  const getRandomImage = () => {
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    return null;
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Введите запрос..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)} // Обновление значения при изменении
          required
        />
        <button type="submit" disabled={loading}>Поиск</button>
      </form>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      <div className="products-container">
        {products.length > 0 ? (
          products.map((product, index) => {
            const randomImage = getRandomImage(); // Получаем случайное изображение для каждого продукта

            return (
              <div key={index} className="product-card">
                {/* Отображаем изображение, если оно есть */}
                <div className="product-card__image">
                  {randomImage ? (
                    <img 
                      src={`http://127.0.0.1:8000/static/${randomImage}`} 
                      alt={product.name} 
                      style={{ width: "100%", height: "auto" }} // Можно настроить стили
                    />
                  ) : (
                    <p>Изображение не найдено</p>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p>Цена: {product.price} ₽</p>
                <a className="classes" href={`http://127.0.0.1:8000${product.link}`} target="_blank" rel="noopener noreferrer">
                  Перейти
                </a>
              </div>
            );
          })
        ) : (
          !loading && <p>Продукты не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
