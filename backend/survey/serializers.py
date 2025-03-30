from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from account.models import CustomUser
from .models import Survey, Question, QuestionOption, Responses, Answer


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = "__all__"


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "type", "required", "sequence", "survey", "options"]

    def get_options(self, obj):
        if obj.type in ["multiple-choice", "checkbox"]:
            options = QuestionOption.objects.filter(question=obj)
            return QuestionOptionSerializer(options, many=True).data
        return None


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class ResponsesAnswerSerializer(serializers.ModelSerializer):
    # question = QuestionSerializer()

    class Meta:
        model = Answer
        fields = "__all__"


class ResponsesSerializer(serializers.ModelSerializer):
    answers = ResponsesAnswerSerializer(many=True, read_only=True)
    questions = SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), required=True  # Allows writing user ID
    )

    class Meta:
        model = Responses
        fields = "__all__"

    def get_questions(self, obj):
        questions = Question.objects.filter(survey=obj.survey)
        return QuestionSerializer(questions, many=True).data
