from django.core.files.storage import default_storage
from django.db import models, transaction
from django.utils.text import slugify
from django.db.models.signals import post_delete
from django.dispatch import receiver

from account.models import CustomUser


# Survey Model
class Survey(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)  # Unique identifier for URLs
    description = models.TextField(blank=True)
    online = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure uniqueness of the slug
            original_slug = self.slug
            counter = 1
            while Survey.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


# Question Model
class Question(models.Model):
    QUESTION_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("multiple-choice", "Multiple Choice"),
        ("checkbox", "Checkbox"),  # Added checkbox type
    ]

    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="questions"
    )
    text = models.TextField()
    type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    required = models.BooleanField(default=True)
    sequence = models.PositiveIntegerField(default=0)
    min_length = models.PositiveIntegerField(default=0)
    max_length = models.PositiveIntegerField(default=524288)

    class Meta:
        ordering = ["sequence"]  # Ensures questions are ordered by sequence

    def save(self, *args, **kwargs):
        """Auto-assign sequence if not provided"""
        if not self.pk:
            last_question = (
                Question.objects.filter(survey=self.survey)
                .order_by("-sequence")
                .first()
            )
            self.sequence = (last_question.sequence + 1) if last_question else 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Update sequence of remaining questions after deletion"""
        survey = self.survey
        with transaction.atomic():
            super().delete(*args, **kwargs)
            # Update sequence of remaining questions
            for index, question in enumerate(survey.questions.all(), start=1):
                question.sequence = index
                question.save()

    def __str__(self):
        return self.text


# Choices for Multiple Choice and Checkbox Questions
class QuestionOption(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


# User Response Model
class Responses(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, related_name="responses", null=True
    )
    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="responses"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    audio_file = models.FileField(upload_to="recordings/", blank=True, null=True)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, null=True
    )

    def __str__(self):
        lat = self.latitude if self.latitude is not None else "N/A"
        lon = self.longitude if self.longitude is not None else "N/A"
        return f"{self.survey}: {self.user}, {self.audio_file}, ({lat}, {lon})"


# Answer Model (Stores responses to questions)
class Answer(models.Model):
    response = models.ForeignKey(
        Responses, on_delete=models.CASCADE, related_name="answers"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text_answer = models.TextField(blank=True, null=True)  # For text/number answers
    choice_answer = models.ForeignKey(
        QuestionOption, blank=True, null=True, on_delete=models.SET_NULL
    )  # For single-choice MCQ answers
    numeric_answer = models.FloatField(
        blank=True, null=True
    )  # For scale/number answers
    checkbox_answers = models.ManyToManyField(
        QuestionOption,
        related_name="checkbox_answers",
        blank=True,
    )  # For multiple-choice (checkbox) answers

    def __str__(self) -> str:
        if self.text_answer:
            return f"{self.response}-{self.question}: {self.text_answer}"
        elif self.choice_answer:
            return f"{self.response}-{self.question}: {self.choice_answer}"
        elif self.numeric_answer:
            return f"{self.response}-{self.question}: {self.numeric_answer}"
        elif self.checkbox_answers.exists():
            return f"{self.response}-{self.question}: {', '.join(str(option) for option in self.checkbox_answers.all())}"
        return f"{self.response}-{self.question}"


# delete related audio files
@receiver(post_delete, sender=Responses)
def delete_audio_file(sender, instance, **kwargs):
    """Deletes the associated audio file when a Responses instance is deleted."""
    if instance.audio_file:
        file_path = instance.audio_file.path
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
