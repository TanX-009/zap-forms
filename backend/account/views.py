from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
)
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, UpdateModelMixin
from rest_framework.viewsets import ModelViewSet

from zap_forms.permissions import IsAdminUserRole

from .models import CustomUser
from .serializers import (
    CustomUserSerializer,
    LoginUserSerializer,
    UserSerializer,
)
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
)


class ListUsersView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


class ManageUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]
    lookup_field = "pk"


class LoginView(APIView):
    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.validated_data

        if not isinstance(user, CustomUser):
            return Response(
                {"error": "Invalid request!"}, status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response(
            {"user": CustomUserSerializer(user).data}, status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="None",
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
        )
        return response


class LogoutView(APIView):

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                refresh.blacklist()
            except Exception as e:
                return Response(
                    {"error": "Error invalidating token:" + str(e)},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        response = Response(
            {"message": "Successfully logged out!"}, status=status.HTTP_200_OK
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is missing. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response(
                {"message": "Access token refreshed successfully"},
                status=status.HTTP_200_OK,
            )
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
            )
            return response

        except (TokenError, InvalidToken) as e:
            return Response(
                {"error": "Invalid or expired refresh token. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
