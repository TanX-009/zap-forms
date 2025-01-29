from rest_framework.serializers import ModelSerializer, Serializer
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate


class CustomUserSerializer(ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "role")

    def list(self):
        users = CustomUser.objects.all()
        return users


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("email", "username", "password", "role")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "username", "role")

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        instance.role = validated_data.get("role", instance.role)
        instance.save()
        return instance


class LoginUserSerializer(Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials!")
