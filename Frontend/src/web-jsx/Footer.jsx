import React from "react";
import "../web-scss/Footer.scss";  // Прямой импорт стилей

export const Footer = () => {
  return (
    <div className="Footer">  {/* Использование классов без переменной styles */}
      {/* Раздел 1 */}
      <div className="Section">
        <div className="DNS">DNS</div>
        <ul className="List">
          {[
            "Компания",
            "О компании",
            "Новости",
            "Партнерам",
            "Вакансии",
            "Политика конфиденциальности",
            "Персональные данные",
            "Правила продаж",
            "Правила пользования сайта",
            "На информационном ресурсе применяются рекомендательные технологии",
            "Сервисные центры",
          ].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Раздел 2 */}
      <div className="Section">
        <div className="DNSClub">
          <div className="DNS">DNS</div>
          <div className="Club">Клуб</div>
        </div>
        <ul className="List">
          {[
            "Покупателям",
            "Как оформить заказ",
            "Способы оплаты",
            "Кредиты",
            "Доставка",
            "Статус заказа",
            "Обмен, возврат, гарантия",
            "Проверка статуса ремонта",
          ].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Раздел 3 */}
      <div className="Section">
        <div className="DNSTechnologies">
          <div className="DNS">DNS</div>
          <div className="Technologies">Технологии</div>
        </div>
        <ul className="List">
          {[
            "Юридическим лицам",
            "Проверка счета",
            "Корпоративные отделы",
            "Подарочные карты",
            "Бонусная программа",
            "Помощь",
            "Обратная связь",
          ].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
