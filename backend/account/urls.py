from django.urls import path
from .views import (
    ListUsersView,
    LoginView,
    LogoutView,
    CookieTokenRefreshView,
    ManageUserView,
)

urlpatterns = [
    path("", ManageUserView.as_view(), name="users"),
    path("<int:pk>/", ManageUserView.as_view(), name="users-manage"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token-refresh"),
    path("users/", ListUsersView.as_view(), name="users"),
]
