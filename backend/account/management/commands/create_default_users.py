from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings


class Command(BaseCommand):
    help = "Create a default user and admin user from settings"

    def handle(self, *args, **options):
        # Retrieve default values from settings
        django_admin_email = settings.DEFAULT_DJANGO_ADMIN_USER_EMAIL
        django_admin_username = settings.DEFAULT_DJANGO_ADMIN_USER_USERNAME
        django_admin_password = settings.DEFAULT_DJANGO_ADMIN_USER_PASSWORD

        if not User.objects.filter(email=django_admin_email).exists():
            User.objects.create_superuser(
                email=django_admin_email,
                username=django_admin_username,
                password=django_admin_password,
            )
            self.stdout.write(f"Default admin user created: {django_admin_email}")
        else:
            self.stdout.write(
                f"Default admin user already exists: {django_admin_email}"
            )

        admin_email = settings.DEFAULT_ADMIN_USER_EMAIL
        admin_username = settings.DEFAULT_ADMIN_USER_USERNAME
        admin_password = settings.DEFAULT_ADMIN_USER_PASSWORD

        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_user(
                email=admin_email,
                username=admin_username,
                password=admin_password,
            )
            self.stdout.write(f"Default user created: {admin_email}")
        else:
            self.stdout.write(f"Default user already exists: {admin_email}")
