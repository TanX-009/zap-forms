from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """
    Custom permission to allow only users with the 'admin' role to modify users.
    """

    def has_permission(self, request, view):
        # Only allow 'admin' users to modify user data
        return request.user.is_authenticated and request.user.role == "admin"
