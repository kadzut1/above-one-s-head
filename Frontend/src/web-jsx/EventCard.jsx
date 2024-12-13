// components/EventCard.js
import React from "react";
import "../web-scss/EventCard.scss";

const EventCard = ({ name, imgSrc }) => {
  return (
    <div className="event">
      <div className="event-card">
        <div className="event-card__image">
          {/* Используем imgSrc для отображения изображения */}
          <img src={imgSrc} alt={name} />
        </div>
        <div className="event-card__info">
          <p className="event-card__date"></p>
        </div>
      </div>
      <h3 className="event-card__name">{name}</h3>
    </div>
  );
};

export default EventCard;
