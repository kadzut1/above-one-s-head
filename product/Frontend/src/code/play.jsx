// src/FlappyBird.js
import React, { useEffect, useRef, useState } from "react";
import birdImgSrc from '../assets/pet.png'; // Изображение птички
import pipeImgSrc from '../assets/png.png'; // Изображение трубы
import bgImgSrc from '../assets/2796700.jpeg'; // Изображение фона

const FlappyBird = () => {
    const canvasRef = useRef(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [birdY, setBirdY] = useState(240); // Начальная позиция по Y (по центру)
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false); // Состояние, контролирующее, начата ли игра
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

    const gravity = 0.6; // Сила гравитации
    const lift = +10; // Подъем при нажатии
    const pipeWidth = 50; // Ширина трубы
    const pipeGap = 100; // Промежуток между трубами
    const pipeSpeed = 20; // Скорость движения труб

    // Создание объектов изображений
    const birdImage = new Image();
    birdImage.src = birdImgSrc;

    const pipeImage = new Image();
    pipeImage.src = pipeImgSrc;

    const bgImage = new Image();
    bgImage.src = bgImgSrc;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Проверяем, существует ли canvas

        const ctx = canvas.getContext("2d");

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // Рисуем фон

            // Рисуем птичку с новым размером
            if (birdImage.complete) { // Проверяем, загружено ли изображение
                ctx.drawImage(birdImage, 50, birdY, 40, 40); // Увеличиваем размер птички
            }

            // Обновляем гравитацию и положение птички
            setBirdVelocity((prev) => prev + gravity);
            setBirdY((prev) => prev + birdVelocity);

            // Проверка выхода за границы
            if (birdY + 40 >= canvas.height) {
                setIsGameOver(true);
            }

            // Обновление положения труб
            setPipes((prevPipes) => {
                const newPipes = prevPipes.map(pipe => ({ ...pipe, x: pipe.x - pipeSpeed }));

                // Проверка столкновений
                newPipes.forEach(pipe => {
                    if (
                        50 < pipe.x + pipeWidth &&
                        50 + 40 > pipe.x &&
                        (birdY < pipe.y || birdY + 40 > pipe.y + pipeGap)
                    ) {
                        setIsGameOver(true);
                    }
                });

                // Обновление счёта
                newPipes.forEach(pipe => {
                    if (pipe.x + pipeWidth < 50 && !pipe.scored) {
                        setScore(prevScore => prevScore + 1);
                        pipe.scored = true;
                    }
                });

                // Удаление труб, вышедших за экран
                return newPipes.filter(pipe => pipe.x + pipeWidth > 0);
            });

            // Рисуем трубы
            pipes.forEach(pipe => {
                ctx.drawImage(pipeImage, pipe.x, pipe.y, pipeWidth, canvas.height); // Верхняя труба
                ctx.drawImage(pipeImage, pipe.x, pipe.y + pipeGap + pipeImage.height, pipeWidth, canvas.height); // Нижняя труба
            });
        };

        const gameLoop = () => {
            if (!isGameOver && isGameStarted) { // Игра продолжается только если она начата
                draw();
                requestAnimationFrame(gameLoop);
            } else if (isGameOver) {
                alert(`Game Over! Your score: ${score}. Reload the page to try again.`);
            }
        };

        // Создание труб
        const createPipe = () => {
            const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
            setPipes(prev => [...prev, { x: canvas.width, y: pipeHeight, scored: false }]);
        };

        // Добавление труб со временем
        const pipeInterval = setInterval(() => {
            if (!isGameOver && isGameStarted) {
                createPipe();
            }
        }, 2000);

        gameLoop();

        return () => {
            clearInterval(pipeInterval);
        };
    }, [isGameOver, birdY, birdVelocity, score, isGameStarted]);

    // Управление птичкой с помощью кнопки или клика по игре
    const handleJump = () => {
        if (!isGameOver && isGameStarted) { // Подъем птички только если игра начата
            setBirdVelocity(lift); // Подъем птички
        }
    };

    // Функция для начала игры
    const startGame = () => {
        setIsGameStarted(true);
        setIsGameOver(false);
        setScore(0);
        setBirdY(240); // Устанавливаем птичку по центру
        setBirdVelocity(0);
        setPipes([]);
    };

    // Функция для открытия модального окна
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalOpen(false);
        setIsGameStarted(false); // Сбрасываем состояние игры, если модалка закрыта
    };

    return (
        <div>
            <button 
                onClick={openModal} 
                style={{
                    padding: '10px 20px',
                    fontSize: '20px',
                    cursor: 'pointer'
                }}
            >
                Играть
            </button>

            {/* Модальное окно для игры */}
            {isModalOpen && (
                <div style={modalStyles}>
                    <div style={modalContentStyles}>
                        <h2>Flappy Bird</h2>
                        <canvas 
                            ref={canvasRef} 
                            width={320} 
                            height={480} 
                            onClick={handleJump} // Прыжок при клике на игровое поле
                        />
                        <div style={{ fontSize: '24px', color: '#000' }}>
                            Score: {score}
                        </div>
                        <button 
                            onClick={startGame} 
                            style={{
                                padding: '10px 20px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Начать игру
                        </button>
                        <button 
                            onClick={closeModal} // Закрытие игры
                            style={{
                                padding: '10px 20px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Стили для модального окна
const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Поверх всех элементов
};

const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
};

export default FlappyBird;
