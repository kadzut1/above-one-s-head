import React, { useState, useEffect } from "react";
import "../web-scss/DateSelector.scss"; // Подключаем SCSS для стилизации

const DateSelector = () => {
  const [timeLeft, setTimeLeft] = useState({});
  
  // Функция для расчета времени до нового года
  const calculateTimeLeft = () => {
    const currentDate = new Date();
    const newYear = new Date(currentDate.getFullYear() + 1, 0, 1); // Новый год (1 января следующего года)

    const difference = newYear - currentDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({
      days,
      hours,
      minutes,
      
    });
  };

  useEffect(() => {
    const interval = setInterval(calculateTimeLeft, 1000); // Обновляем каждую секунду
    return () => clearInterval(interval); // Останавливаем таймер при размонтировании компонента
  }, []);

  return (
    <div className="date-selector">
      <div className="countdown-container">
        <h2 className="countdown-title">Обратный отсчет до Нового года</h2>

        <div className="countdown-timer">
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Дней</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.hours}</span>
            <span className="countdown-label">Часов</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.minutes}</span>
            <span className="countdown-label">Минут</span>
          </div>
          
          </div>
          <div className="countdown-footer">
          <span className="footer-message">Скоро наступит Новый год!</span>
        </div>
        </div>

        
      </div>
    
  );
};

export default DateSelector;
