from bs4 import BeautifulSoup
import random
import pandas as pd
import requests
from datetime import datetime
from sqlalchemy import create_engine
import psycopg2
from sqlalchemy import Table, Column, MetaData, Integer, Computed

conn = psycopg2.connect(
    dbname='dns_bd',
    user='postgres',
    password='123123',
    host='localhost'
)
conn.autocommit = True
cursor = conn.cursor()

create_prod_categories= """CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    parent_id INT,
    name VARCHAR(255),
    level INT
);
"""
cursor.execute(create_prod_categories)
conn.commit()
create_products = """
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    url VARCHAR(255),
    image_url VARCHAR(255),
    rating FLOAT CHECK(rating BETWEEN 0 AND 5),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
"""
cursor.execute(create_products)
conn.commit()
create_warehouses = """
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255)
);

"""
cursor.execute(create_warehouses)
conn.commit()
create_product_stock = """
CREATE TABLE product_stock (
    product_id INT REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    quantity INT,
    PRIMARY KEY (product_id, warehouse_id)
);
"""
cursor.execute(create_product_stock)
conn.commit()
create_users = """
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""
cursor.execute(create_users)
conn.commit()
create_sales = """
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price DECIMAL(10, 2)
);
"""
cursor.execute(create_sales)
conn.commit()
create_user_preferences = """
CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY REFERENCES users(id),
    gender VARCHAR(10),
    age_range VARCHAR(10),
    categories TEXT
);
"""
cursor.execute(create_user_preferences)
conn.commit()
create_recommendations = """
CREATE TABLE recommendations (
    user_id INT REFERENCES users(id),
    product_id INT REFERENCES products(id),
    score FLOAT,
    PRIMARY KEY (user_id, product_id)
);
"""
cursor.execute(create_recommendations)
conn.commit()

df = pd.DataFrame(columns=['Name', 'Price', 'Link', 'Stars', 'Image'])

# Пробегаемся по страничкам товаров
for page in range(1,25):
    # Отправляем запрос на страничку каталога с помощью options
    url = f'https://www.dns-shop.ru/catalog/markdown/?p={page}'
    response = requests.options(url)

    # Парсим HTML-код с помощью BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Поиск всех элементов catalog-products
    elements = soup.find_all(class_='catalog-products')
    for element in elements:
        # Имя товара
        name = element.find(class_='catalog-product__name').text
        # Ссылка на товар
        link = element.find('a').get('href')
        # Оценка товара (0 если нет)
        try:
            stars = int(element.find(class_='catalog-product__rating').get('data-rating'))
        except ValueError:
            stars = 0
        # Ссылка на картинку товара
        image = element.find(class_='catalog-product__image-link').get('href')
        # Цена (ВРЕМЕННОЕ РЕШЕНИЕ)
        price = random.randint(1000, 15000)

        # Вывод результатов скрейпинга (дебаггинг)
        # ПРИ ПОЛУЧЕНИИ ВОЗМОЖНОСТИ СТОИТ ПОЛУЧИТЬ РЕАЛЬНЫЕ ЦЕНЫ
        # print(name)
        # print(price)
        # print(link)
        # print(stars)
        # print(image)

        # Вставка полученных данных в датафрейм
        df.loc[len(df)] = [name, price, link, stars, image]

# Вывод полученного датафрейма (дебаггинг)
# print(df)

# Сохранение результатов в excel
current_date = datetime.now().strftime('%Y-%m-%d')
filename = f'dns_parsed_data_{current_date}.xlsx'
# df.to_excel(filename, index=False, engine='openpyxl')
print(f'DataFrame saved to {filename}')

products_df = df[['Name', 'Price', 'Link', 'Stars', 'Image']]
products_df['category_id'] = ''  # Оставляем пустым категорию
products_df['description'] = ''  # Оставляем пустым описание
products_df['created_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
products_df['updated_at'] = products_df['created_at']

product_categories_df = pd.DataFrame({
    'id': range(1, len(df) + 1),
    'parent_id': [None] * len(df),
    'name': df['Name'],
    'level': ''
})

product_stock_df = pd.DataFrame({
    'product_id': range(1, len(df) + 1),
    'warehouse_id': [random.randint(1, 5) for _ in range(len(df))],
    'quantity': [random.randint(1, 50) for _ in range(len(df))]
})

def get_short_name(full_name):
    words = full_name.split()
    short_name = ' '.join(words[:2])
    return short_name

products_df['Short_name'] = products_df['Name'].apply(lambda x: get_short_name(x))
products_df

products = [
    'fm-трансмиттер ritmix', 'gps навигатор', 'ip-камера zodikam',
    'kvm переключатель', '500 гб', '1024 гб', 'wi-fi роутер',
    'роутер huawei', 'автопроигрыватель prology',
    'автосигнализация starline', 'внутренний адаптер',
    'аккумуляторная батарея', 'аккумуляторная цепная',
    'дополнительный аккумулятор', 'аккумулятор einhell',
    'блок питания', 'умная колонка', 'аэрогриль dexp',
    'беззеркальный фотоаппарат', 'воздуходувка champion',
    'бензопила carver', 'бензопила patriot', 'бетоносмеситель вихрь',
    'блендер погружной', 'блендер стационарный', 'вакуумный упаковщик',
    'газовая варочная', 'индукционная варочная', 'вентилятор aceline',
    'вентилятор polaris', 'вентилятор aerocool',
    'пылесос вертикальный', 'моющий пылесос',
    'переходник однонаправленный', 'видеокарта msi',
    'видеорегистратор mio', 'видеорегистратор с', 'винный шкаф',
    'водонагреватель газовый', 'водонагреватель электрический',
    'встраиваемая микроволновая', 'встраиваемая посудомоечная',
    'встраиваемый холодильник', 'вытяжка полновстраиваемая',
    'вытяжка островная', 'тепловая пушка',
    'газонокосилка аккумуляторная', 'газонокосилка бензиновая',
    'гайковерт finepower', 'гладильная доска', 'гравировальная машина',
    'гриль dexp', 'декоративный светильник', 'держатель автомобильный',
    'детские часы', 'диктофон ritmix', 'диспенсер apexcool',
    'диспенсер mijia', 'доска магнитно-маркерная', 'насос дренажный',
    'электрический духовой', '12 тб', 'зарядное устройство',
    'точильный станок', 'игровой держатель', 'руль dexp', 'игра the',
    'ибп dexp', 'йогуртница kitfort', 'картридж лазерный',
    'карта памяти', 'квадрокоптер autel', 'клавиатура проводная',
    'ковш polaris', 'шкаф коммутационный', 'компактный фотоаппарат',
    'компрессор поршневой', 'стол компьютерный'
]

keywords = [
    "вытяжка", "водонагреватель", "газонокосилка", "пылесос",
    "видеорегистратор", "блендер", "вентилятор", "аккумулятор",
    "компрессор", "микроволновая", "холодильник", "гладильная",
    "диспенсер", "игровой", "декоративный", "гравировальная",
    "бензопила", "аэрогриль", "душ", "доска", "шкаф", "квадрокоптер",
    "руль", "игра", "диктофон", "йогуртница", "светильник", "переходник",
    "адаптер", "роутер", "навигатор", "часы"
]

categories = {}
category_id = 1


# Функция для определения категории на основе ключевых слов
def get_category(product_name):
    for keyword in keywords:
        if keyword in product_name.lower():
            return keyword
    return None


# Определяем категории для каждого товара и заполняем словарь categories
for product in products:
    category = get_category(product)

    # Если категория найдена, добавляем её в словарь с уникальным id
    if category:
        if category not in categories:
            categories[category] = category_id
            category_id += 1

# Создаем DataFrame из списка продуктов
# Добавляем новый столбец category_id, заполняя его значениями из словаря categories
products_df['category_id'] = products_df['Name'].apply(
    lambda x: categories.get(get_category(x), 0)
)

# Выводим результат
print("Найденные категории и их идентификаторы:")
print(categories)

print("\nDataFrame с продуктами и категориями:")

