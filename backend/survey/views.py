from rest_framework import status, viewsets
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from rest_framework.views import APIView

from .models import QuestionOption, Survey, Question
from .serializers import (
    SurveySerializer,
    QuestionSerializer,
    ResponsesSerializer,
    AnswerSerializer,
)


class SurveyViewSet(
    viewsets.GenericViewSet,
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,  # Add UpdateModelMixin
):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    lookup_field = "slug"  # Use slug as the lookup field

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class QuestionViewSet(
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def create(
        self,
        request,
    ):
        """
        Handles creating a question and
        its options if it's a multiple-choice question.
        """
        with transaction.atomic():
            options = request.data.pop("options", None)
            serializer = QuestionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            question = serializer.save()

            # Handle multiple-choice question options
            if question.type == "multiple-choice" and options:
                option_instances = [
                    QuestionOption(question=question, text=option_text)
                    for option_text in options
                ]
                QuestionOption.objects.bulk_create(option_instances)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *_, **kwargs):
        """
        Handles updating a question and
        its options if it's a multiple-choice question.
        """
        with transaction.atomic():
            partial = kwargs.pop("partial", False)
            options = request.data.pop("options", None)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            question = serializer.save()

            # Handle multiple-choice question options
            if question.type == "multiple-choice":
                print("asdf")
                # Delete existing options
                QuestionOption.objects.filter(question=question).delete()
                if options:
                    option_instances = [
                        QuestionOption(question=question, text=option_text)
                        for option_text in options
                    ]
                    QuestionOption.objects.bulk_create(option_instances)

            return Response(serializer.data)


class QuestionReorderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Update the sequence of multiple questions at once.
        Expecting a list of objects with "id" and "sequence".
        """
        questions_data = request.data.get(
            "questions", []
        )  # Expecting [{"id": 1, "sequence": 2}, ...]

        if not questions_data:
            return Response(
                {"error": "No data provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        question_objects = []
        for question_data in questions_data:
            question = Question.objects.filter(id=question_data["id"]).first()
            if question:
                question.sequence = question_data["sequence"]
                question_objects.append(question)

        Question.objects.bulk_update(
            question_objects, ["sequence"]
        )  # Efficient bulk update

        return Response(
            {"message": "Questions reordered successfully"},
            status=status.HTTP_200_OK,
        )


# Get all questions from a survey
class SurveyQuestionsListView(APIView):
    def get(self, _, survey_id):
        try:
            questions = Question.objects.filter(survey_id=survey_id)
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response(
                {"detail": "Survey not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class SubmitSurveyResponseView(APIView):
    def post(self, request):
        user_email = request.data.get("user_email")
        user_name = request.data.get("user_name")
        survey_id = request.data.get("survey")
        answers_data = request.data.get("answers", [])

        if not user_email or not user_name or not survey_id or not answers_data:
            print(user_email, user_name, survey_id, answers_data)
            return Response(
                {"detail": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Create the Response object
            response_data = {
                "user_email": user_email,
                "user_name": user_name,
                "survey": survey_id,
            }
            response_serializer = ResponsesSerializer(data=response_data)
            if response_serializer.is_valid():
                response = response_serializer.save()
            else:
                return Response(
                    response_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create the Answer objects
            created_answers = []
            for answer_data in answers_data:
                answer_data["response"] = response.id
                answer_serializer = AnswerSerializer(data=answer_data)
                if answer_serializer.is_valid():
                    answer_serializer.save()
                    created_answers.append(answer_serializer.data)
                else:
                    return Response(
                        answer_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response(created_answers, status=status.HTTP_201_CREATED)
