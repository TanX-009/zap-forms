from rest_framework.serializers import ModelSerializer, Serializer
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate


class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "role")


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("email", "username", "password", "role")
        extra_kwargs = {"password": {"write_only": True}}


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "role")


class LoginUserSerializer(Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials!")
