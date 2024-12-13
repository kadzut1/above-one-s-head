import psycopg2
import pandas as pd

# Подключение к базе данных PostgreSQL
conn = psycopg2.connect(
    dbname='registration_db',  # Имя вашей базы данных
    user='postgres',            # Имя пользователя
    password='123123',          # Пароль
    host='localhost'            # Хост (localhost если база на том же сервере)
)
conn.autocommit = True  # Включаем автокоммит, чтобы изменения сохранялись в БД

cursor = conn.cursor()

# Чтение данных из CSV в pandas DataFrame
file_path = 'Идеальный подарок.csv'
df = pd.read_csv(file_path)

# Проверка названий столбцов
print("Названия столбцов:", df.columns)

# Удаление пробелов в названиях столбцов
df.columns = df.columns.str.strip()

# Если столбца 'id' нет в данных, добавим его
if 'id' not in df.columns:
    # Если id отсутствует, мы можем добавить его вручную, например:
    df['id'] = range(1, len(df) + 1)

# Перебираем строки DataFrame и вставляем их в таблицу
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO listing_product (id, name, price, stars, link, image)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (row['id'], row['name'], row['price'], row['stars'], row['link'], row['image']))

# Закрываем соединение с базой данных
cursor.close()
conn.close()

print("Данные успешно вставлены в таблицу 'listing_product'!")
