from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    """ Сериализатор для регистрации пользователей """
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """ Создание нового пользователя с хешированным паролем """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """ Сериализатор для авторизации пользователей """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        """ Проверяем корректность учетных данных пользователя """
        email = data.get('email')
        password = data.get('password')

        # Ищем пользователя по email (если email уникален)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Пользователь с таким email не найден.')

        # Проверяем пароль
        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError('Неверный пароль.')

        data['user'] = user
        return data
