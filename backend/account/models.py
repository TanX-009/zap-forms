from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    USERNAME_FIELD = "email"
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default="user")
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
