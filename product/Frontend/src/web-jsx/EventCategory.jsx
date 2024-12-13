import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import "../web-scss/EventCategory.scss";

const EventCategory = ({ title }) => {
  const [images, setImages] = useState([]);  // Для хранения изображений
  const [randomImage, setRandomImage] = useState(null); // Для случайного изображения
  const [products, setProducts] = useState([]); // Состояние для хранения продуктов
  const [loading, setLoading] = useState(true); // Статус загрузки
  const [error, setError] = useState(null); // Ошибки при запросе
  const [imageLoading, setImageLoading] = useState(false); // Статус загрузки изображений

  const scrollRef = useRef(); // Для прокрутки

  // Функция для запроса случайных продуктов
  const fetchRandomProducts = async () => {
    try {
      setLoading(true); // Устанавливаем статус загрузки
      const response = await axios.get("http://127.0.0.1:8000/api/random_products/?num_products=5"); // Запрос с параметром

      if (response.status === 200) {
        setProducts(response.data); // Сохраняем данные о продуктах в состояние
      } else {
        throw new Error("Ошибка при получении данных с сервера");
      }

      setLoading(false); // Завершаем загрузку
    } catch (error) {
      console.error("", error);
      setError("" + (error.message || ""));
      setLoading(false); // Завершаем загрузку
    }
  };

  // Функция для запроса изображений
  const fetchImages = async () => {
    setImageLoading(true); // Устанавливаем статус загрузки изображений
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/images/"); // Запрос на получение списка изображений
      if (response.status === 200) {
        setImages(response.data.images); // Сохраняем список изображений
      } else {
        throw new Error("Ошибка при получении изображений");
      }
    } catch (error) {
      console.error("Ошибка при получении изображений:", error);
    }
    setImageLoading(false); // Завершаем загрузку изображений
  };

  // Загружаем случайные продукты и изображения при монтировании компонента
  useEffect(() => {
    fetchRandomProducts();
    fetchImages();
  }, []);

  // Функция для прокрутки
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollLeft -= 300; // Прокрутка влево
    } else {
      current.scrollLeft += 300; // Прокрутка вправо
    }
  };

  // Выбираем случайное изображение для каждого продукта
  const getRandomImage = () => {
    if (images.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * images.length);
    return `http://127.0.0.1:8000/static/${images[randomIndex]}`;
  };

  return (
    <section className="event-category">
      <h2 className="event-category__title">{title}</h2>
      <div className="event-category__container">
        <button className="scroll-button left" onClick={() => scroll("left")}>
          &#8592;
        </button>
        <div className="event-category__list" ref={scrollRef}>
          {/* Отображаем статус загрузки или ошибку */}
          {loading && <p>Загрузка...</p>}
          {error && <p>{error}</p>}

          {/* Отображаем карточки продуктов, если данные загружены */}
          {products.length > 0 ? (
            products.map((product, index) => {
              const productImage = getRandomImage(); // Получаем случайное изображение для продукта
              return (
                <EventCard
                  key={index}
                  name={product.name}
                  imgSrc={productImage} // Подставляем случайное изображение для продукта
                  price={product.price}  // Подставляем цену из API
                  link={product.link}    // Подставляем ссылку на продукт
                />
              );
            })
          ) : (
            !loading && <p>Нет доступных продуктов.</p> // Если нет данных, показываем сообщение
          )}
        </div>
        <button className="scroll-button right" onClick={() => scroll("right")}>
          &#8594;
        </button>
      </div>
    </section>
  );
};

export default EventCategory;
