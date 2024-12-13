import React, { useState } from 'react';
import '../web-scss/navigation.scss'; // Подключаем SCSS стили

const NavigationMenu = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggleMore = () => {
    setShowMore(!showMore);
  };

  return (
    <nav>
      <ul>
        <li><button>Акции</button></li>
        <li><button>Магазин</button></li>
        <li><button>Доставка</button></li>
        <li><button>Покупателям</button></li>
        <li><button>Юридическим лицам</button></li>
        <li><button>Клуб DNS</button></li>
        <li><button>Вакансии</button></li>

        {/* Кнопка "Ещё" с выпадающим меню */}
        <li>
          

          
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
