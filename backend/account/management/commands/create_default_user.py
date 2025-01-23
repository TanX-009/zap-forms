import os
from django.core.management.base import BaseCommand
from account.models import CustomUser


class Command(BaseCommand):
    help = "Create a default user from environment variables"

    def handle(self, *args, **options):
        # Retrieve environment variables or use default values
        email = os.getenv("DEFAULT_USER_EMAIL", "admin@email.com")
        password = os.getenv("DEFAULT_USER_PASSWORD", "admin")

        if not CustomUser.objects.filter(email=email).exists():
            CustomUser.objects.create_superuser(email=email, password=password)
            self.stdout.write(f"Default user created: {email}")
        else:
            self.stdout.write(f"Default user already exists: {email}")
