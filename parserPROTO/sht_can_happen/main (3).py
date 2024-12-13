# Импорты
from bs4 import BeautifulSoup
import requests
import pandas as pd

# Создаём датафрейм для хранения нужных данных
df = pd.DataFrame(columns=['Name', 'Price', 'Link', 'Stars', 'Image'])

# Пробегаемся по страничкам товаров
for page in range(1, 25):
    # Отправляем запрос на страничку каталога с помощью options
    url = f'https://www.dns-shop.ru/catalog/markdown/?p={page}'
    response = requests.options(url)

    # Парсим HTML-код с помощью BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Поиск всех элементов catalog-products
    elements = soup.find_all(class_='catalog-products')
    for element in elements:
        # Find all <picture> elements
        picture_elements = element.find_all('picture')  # Use the current element to find pictures

        # Loop through each <picture> element
        for index, picture in enumerate(picture_elements):
            # Find the <img> tag and get the 'data-src' attribute
            img_tag = picture.find('img')
            if img_tag and 'data-src' in img_tag.attrs:
                img_url = img_tag['data-src']
                
                # Download the image
                img_response = requests.get(img_url)

                # Save the image to a file
                if img_response.status_code == 200:
                    # Create a unique filename for each image using page number and index
                    filename = f'image_element_{page}_img_{index + 1}.jpg'
                    with open(filename, 'wb') as f:
                        f.write(img_response.content)
                    print(f"Image {index + 1} downloaded successfully as {filename}!")
                else:
                    print(f"Failed to download image {index + 1}.")
            else:
                print(f"No valid image found in picture element {index + 1}.")