from django.db import models
from django.utils.text import slugify


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


# Question Model
class Question(models.Model):
    QUESTION_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("multiple-choice", "Multiple Choice"),
    ]

    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="questions"
    )
    text = models.TextField()
    type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    required = models.BooleanField(default=True)
    sequence = models.PositiveIntegerField(default=1)  # New sequence field

    class Meta:
        ordering = ["sequence"]  # Ensures questions are ordered by sequence

    def save(self, *args, **kwargs):
        """Auto-assign sequence if not provided"""
        if not self.sequence:
            last_question = (
                Question.objects.filter(survey=self.survey)
                .order_by("-sequence")
                .first()
            )
            self.sequence = (last_question.sequence + 1) if last_question else 1
        super().save(*args, **kwargs)


# Choices for Multiple Choice Questions
class QuestionOption(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    text = models.CharField(max_length=255)


# User Response Model
class Responses(models.Model):
    user_email = models.EmailField()
    user_name = models.CharField()
    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="responses"
    )
    created_at = models.DateTimeField(auto_now_add=True)


# Answer Model (Stores responses to questions)
class Answer(models.Model):
    response = models.ForeignKey(
        Responses, on_delete=models.CASCADE, related_name="answers"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text_answer = models.TextField(blank=True, null=True)  # For text/number answers
    choice_answer = models.ForeignKey(
        QuestionOption, blank=True, null=True, on_delete=models.SET_NULL
    )  # For MCQ answers
    numeric_answer = models.FloatField(
        blank=True, null=True
    )  # For scale/number answers
