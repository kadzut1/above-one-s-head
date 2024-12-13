// components/imgCard.js
import React from "react";
import "../web-scss/images.scss";

const Images = ({ name, imgSrc }) => {
  return (
   
    <div className="img-card">
      <div className="img-card__image">
        <img src={imgSrc} alt={name} />
      </div>
      <div className="img-card__info">
      <h3 className="img-card__name">{name}</h3>
        <p className="img-card__date"></p>
      </div>
      
    </div>
 

  );
};

export default Images;
