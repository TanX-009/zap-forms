import os
from django.core.management.base import BaseCommand
from account.models import CustomUser


class Command(BaseCommand):
    help = "Create a default user from environment variables"

    def handle(self, *args, **options):
        # Retrieve environment variables or use default values
        django_admin_email = os.getenv(
            "DEFAULT_DJANGO_ADMIN_USER_EMAIL", "admin@email.com"
        )
        django_admin_password = os.getenv("DEFAULT_DJANGO_ADMIN_USER_PASSWORD", "admin")

        if not CustomUser.objects.filter(email=django_admin_email).exists():
            CustomUser.objects.create_superuser(
                email=django_admin_email, password=django_admin_password, role="admin"
            )
            self.stdout.write(f"Default admin user created: {django_admin_email}")
        else:
            self.stdout.write(
                f"Default admin user already exists: {django_admin_email}"
            )

        admin_email = os.getenv("DEFAULT_ADMIN_USER_EMAIL", "user@email.com")
        admin_username = os.getenv("DEFAULT_ADMIN_USER_USERNAME", "username")
        admin_password = os.getenv("DEFAULT_ADMIN_USER_PASSWORD", "user")

        if not CustomUser.objects.filter(email=admin_email).exists():
            CustomUser.objects.create_user(
                email=admin_email,
                password=admin_password,
                username=admin_username,
                role="admin",
            )
            self.stdout.write(f"Default user created: {admin_email}")
        else:
            self.stdout.write(f"Default user already exists: {admin_email}")
