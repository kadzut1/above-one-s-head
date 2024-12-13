import pandas as pd
from sqlalchemy import create_engine

# Параметры подключения к базе данных PostgreSQL
DATABASE_URL = 'postgresql://postgres:123123@localhost:5432/registration_db'

# Создание подключения к базе данных
engine = create_engine(DATABASE_URL)

# Загрузка данных из Excel файла
excel_file_path = 'dns_parsed_data_2024-12-11.xlsx'  # Укажите путь к вашему Excel файлу
df = pd.read_excel(excel_file_path)

# Убедитесь, что столбцы соответствуют тем, что в таблице (например, убираем 'id', если он есть в DataFrame)


# Проверка структуры данных (опционально)
print(df.head())

# Запись данных в базу данных (без указания столбца 'id', который будет генерироваться автоматически)
df.to_sql('listing_product', con=engine, if_exists='append', index=False)

print("Данные успешно импортированы в базу данных.")
