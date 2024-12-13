from rest_framework import serializers

class UserInputSerializer(serializers.Serializer):
    user_input = serializers.CharField(max_length=500)
