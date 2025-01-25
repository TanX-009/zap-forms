from django.urls import path
from .views import (
    UserRegistrationView,
    LoginView,
    LogoutView,
    CookieTokenRefreshView,
    UsersView,
)

urlpatterns = [
    path("users/", UsersView.as_view(), name="users"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("register/", UserRegistrationView.as_view(), name="register-user"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token-refresh"),
]
