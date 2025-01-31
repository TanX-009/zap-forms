from rest_framework import serializers
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
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ["id", "text", "type", "required", "sequence", "survey", "options"]

    def get_options(self, obj):
        if obj.type == "multiple-choice":
            options = QuestionOption.objects.filter(question=obj)
            return QuestionOptionSerializer(options, many=True).data
        return None


class ResponsesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responses
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"
