from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import json
import joblib
from keras.models import load_model
from django.http import JsonResponse
import random
from .models import ListingProduct

# Corrected the Product model to match the database table name
  # Corrected the table name to match the database


# Load the vectorizer
try:
    vectorizer = joblib.load('C:\\Users\\хех\\it\\pythonProject1\\isting\\myproject\\vectorizer.pkl')
except FileNotFoundError:
    raise Exception("Vectorizer file not found. Please ensure the file path is correct.")

# Load the trained model
try:
    model = load_model('C:\\Users\\хех\\it\\pythonProject1\\isting\\myproject\\model.keras')
except Exception as e:
    raise Exception(f"Failed to load Keras model. Error: {e}")

# Load the class mapping
try:
    with open('C:\\Users\\хех\\it\\pythonProject1\\isting\\myproject\\class_mapping.json', 'r',
              encoding='utf-8') as f:
        class_mapping = json.load(f)
except FileNotFoundError:
    raise Exception("Class mapping file not found. Please ensure the file path is correct.")


def predict_top_classes(user_input):
    """
    Predict the top 5 categories based on user input and return related products.
    """
    if not user_input:
        raise ValueError("User input is required for prediction.")

    # Vectorize the user input
    user_input_vectorized = vectorizer.transform([user_input])
    user_input_vectorized_dense = user_input_vectorized.toarray()

    # Predict category probabilities
    recommendations = model.predict(user_input_vectorized_dense)

    # Prepare category recommendations
    class_recommendations = [
        {"category": class_mapping.get(str(i), "Unknown Category"), "probability": prob}
        for i, prob in enumerate(recommendations[0])
    ]

    # Sort by probability in descending order and get top 5
    top_classes = sorted(class_recommendations, key=lambda x: x["probability"], reverse=True)[:5]

    # Extract category names for filtering products
    categories = [category['category'] for category in top_classes]
    products = ListingProduct.objects.filter(category_name__in=categories).only('name', 'price', 'stars', 'link',
                                                                                       'image', 'category_name')

    # Create product data list
    product_data = [
        {
            "name": product.name,
            "price": float(product.price),  # Convert Decimal to float for JSON serialization
            "stars": float(product.stars),
            "link": product.link,
            "image": product.image.url if product.image else None,
            "category_name": product.category_name,
        } for product in products
    ]

    return top_classes, product_data


@api_view(['POST'])
def predict(request):
    """
    API endpoint to get the top 5 predicted categories and related products.
    """
    if request.method == 'POST':
        user_input = request.data.get('user_input')

        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            top_5_classes, products = predict_top_classes(user_input)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        result_text = "The top predicted categories for your input are: "
        for i, class_info in enumerate(top_5_classes):
            result_text += f"{class_info['category']} with {class_info['probability']:.2f} probability. "

        return Response({
            "result_text": result_text,
            "top_5_classes": top_5_classes,
            "category_name": [product["category_name"] for product in products],
            "products": products
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
def load_random_products(request):
    """
    API endpoint to load random products and return them with associated categories.
    """
    # Get number of products to return from the query params, default to 5 if not specified
    num_products = int(request.GET.get('num_products', 5))  # Берем из URL-параметра

    # Fetch products from the database
    products = list(ListingProduct.objects.all().only('name', 'price', 'stars', 'link', 'image', 'category_name'))

    if not products:
        return JsonResponse({"error": "No products available in the database."}, status=status.HTTP_404_NOT_FOUND)

    # Get a random sample of products, with a default of 5 products
    random_products = random.sample(products, min(num_products, len(products)))

    response_data = []
    for product in random_products:
        try:
            # Here we use the existing predict_top_classes function to predict the categories for the product name
            predicted_categories = predict_top_classes(product.name)[0]
        except ValueError:
            predicted_categories = []

        # Prepare category information for the product
        matching_categories = []
        for category in predicted_categories:
            category_name = category['category']
            matching_products = ListingProduct.objects.filter(category_name=category_name).only('category_name')

            if matching_products.exists():
                matching_categories.append({
                    "category": category_name,
                    "description": "Description for category is unavailable."
                })
            else:
                matching_categories.append({
                    "category": category_name,
                    "description": f"No information available for category {category_name}. It may be a new category."
                })

        # Add product details to the response data
        response_data.append({
            "name": product.name,
            "price": float(product.price),
            "stars": float(product.stars),
            "link": product.link,
            "image": product.image.url if product.image else None,
            "categories": matching_categories
        })

    return JsonResponse(response_data, safe=False)