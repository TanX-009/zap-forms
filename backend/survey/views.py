from rest_framework import status, viewsets
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from rest_framework.views import APIView

from .models import Survey, Question
from .serializers import (
    SurveySerializer,
    QuestionSerializer,
    ResponsesSerializer,
    AnswerSerializer,
)


class SurveyViewSet(
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "slug"  # Use slug as the lookup field


# # Create a survey
# class SurveyCreateView(generics.CreateAPIView):
#     queryset = Survey.objects.all()
#     serializer_class = SurveySerializer
#
#
# # Delete a survey
# class SurveyDeleteView(generics.DestroyAPIView):
#     queryset = Survey.objects.all()
#     serializer_class = SurveySerializer
#
#     def perform_destroy(self, instance):
#         instance.delete()


# Set survey online status
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def set_survey_online_status(request, survey_id):
    try:
        survey = Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    survey.online = request.data.get("online", survey.online)
    survey.save()
    return Response(SurveySerializer(survey).data)


class QuestionViewSet(
    CreateModelMixin, UpdateModelMixin, DestroyModelMixin, viewsets.GenericViewSet
):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]


# # Add question to a survey
# class QuestionCreateView(generics.CreateAPIView):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer
#
#
# # Update question from a survey
# class QuestionUpdateView(generics.UpdateAPIView):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer
#
#
# # Delete question from a survey
# class QuestionDeleteView(generics.DestroyAPIView):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer
#
#     def perform_destroy(self, instance):
#         instance.delete()


class QuestionReorderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Update the sequence of multiple questions at once.
        Expecting a list of objects with "id" and "sequence".
        """
        questions_data = request.data.get(
            "questions", []
        )  # Expecting [{"id": 1, "sequence": 2}, ...]

        if not questions_data:
            return Response(
                {"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
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
            {"message": "Questions reordered successfully"}, status=status.HTTP_200_OK
        )


# Get all questions from a survey
class SurveyQuestionsListView(APIView):
    def get(self, request, survey_id, *args, **kwargs):
        try:
            questions = Question.objects.filter(survey_id=survey_id)
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response(
                {"detail": "Survey not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SubmitSurveyResponseView(APIView):
    def post(self, request):
        user_email = request.data.get("user_email")
        user_name = request.data.get("user_name")
        survey_id = request.data.get("survey")
        answers_data = request.data.get("answers", [])

        if not user_email or not user_name or not survey_id or not answers_data:
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
                    response_serializer.errors, status=status.HTTP_400_BAD_REQUEST
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
                        answer_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(created_answers, status=status.HTTP_201_CREATED)


# # Submit response to a survey
# class ResponseCreateView(generics.CreateAPIView):
#     queryset = Responses.objects.all()
#     serializer_class = ResponsesSerializer
#
#
# # Submit answers to a response
# class AnswerCreateView(generics.CreateAPIView):
#     queryset = Answer.objects.all()
#     serializer_class = AnswerSerializer
