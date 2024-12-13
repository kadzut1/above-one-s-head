import React, { useState } from 'react';
import "../web-scss/Header.scss"; // Подключаем SCSS
import axios from 'axios';

const Header = () => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false); // Добавлено состояние для формы регистрации
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userNameDisplay, setUserNameDisplay] = useState('Войти');
  const [accessToken, setAccessToken] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements.search.value;
    console.log(`Поиск по запросу: ${query}`);
  };

  const openNewTab = (url) => {
    window.open(url, '_blank');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', loginData);
      if (response.data.access) {
        // Сохраняем токен и имя пользователя
        setIsAuthenticated(true);
        setUserNameDisplay(response.data.user.username); // Показываем имя пользователя
        setAccessToken(response.data.access); // Сохраняем токен доступа
        setIsLoginFormOpen(false);
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const registrationData = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', registrationData);
      if (response.data.message) {
        setIsAuthenticated(true);
        setUserNameDisplay(username); // Показываем имя пользователя
        setIsRegisterFormOpen(false); // Закрываем форму регистрации после успешной регистрации
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserNameDisplay('Войти');
    setAccessToken(''); // Очистить токен
  };

  return (
    <header className="header">
      {/* Логотип */}
      
      {/* Выпадающий список города */}
      <div className="city-selector">
        <span
          className="logo-location"
          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
        >
          <a className="logo">DNS</a>
        </span>
        {isCityDropdownOpen &&
          <div className="city-dropdown">
            {/* Пример городов */}
            {['Москва', 'Санкт-Петербург', 'Казань'].map((city, index) => (
              <div
                key={index}
                className="city-item"
                onClick={() => {
                  console.log(`Выбран город: ${city}`);
                  setIsCityDropdownOpen(false);
                }}
              >
                {city}
              </div>
            ))}
          </div>
        }
      </div>

      {/* Поле поиска */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Поиск"
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>

      <div className="header-buttons">
        {/* Кнопка Войти/Имя пользователя */}
        <button
          className="login"
          onClick={() => isAuthenticated ? handleLogout() : setIsLoginFormOpen(!isLoginFormOpen)}
        >
          {isAuthenticated ? userNameDisplay : 'Войти'}
        </button>

        {/* Форма входа */}
        {isLoginFormOpen && !isRegisterFormOpen && (
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Войти</button>
              <button type="button" onClick={() => setIsLoginFormOpen(false)}>Закрыть</button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginFormOpen(false);
                  setIsRegisterFormOpen(true); // Открываем форму регистрации
                }}
              >
                Зарегистрироваться
              </button>
            </form>
          </div>
        )}

        {/* Форма регистрации */}
        {isRegisterFormOpen && (
          <div className="register-form">
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Зарегистрироваться</button>
              <button type="button" onClick={() => setIsRegisterFormOpen(false)}>Закрыть</button>
            </form>
          </div>
        )}

        
      </div>
    </header>
  );
};

export default Header;
