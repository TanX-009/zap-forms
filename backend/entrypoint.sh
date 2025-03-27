#!/bin/sh

# Wait for the database to be ready
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done

# Run database migrations
python manage.py makemigrations --no-input
python manage.py migrate --no-input

# Collect static files
python manage.py collectstatic --no-input

python manage.py create_default_users

# Execute the command passed to the script (e.g., gunicorn)
exec "$@"
