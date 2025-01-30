from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ListUsersView,
    LoginView,
    LogoutView,
    CookieTokenRefreshView,
    ManageUserViewSet,
)

router = DefaultRouter()
router.register(r"", ManageUserViewSet)

urlpatterns = [
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token-refresh"),
    path("users/", ListUsersView.as_view(), name="users"),
]

urlpatterns += router.urls
