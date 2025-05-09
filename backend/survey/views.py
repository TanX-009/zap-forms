import csv
from django.utils.timezone import now, timedelta
from django.conf import settings
from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.fields import json
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from rest_framework.views import APIView

from .models import Answer, QuestionOption, Responses, Survey, Question
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
        its options if it's a multiple-choice or checkbox question.
        """
        with transaction.atomic():
            options = request.data.pop("options", None)
            serializer = QuestionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            question = serializer.save()

            # Handle multiple-choice and checkbox question options
            if question.type in ["multiple-choice", "checkbox"] and options:
                option_instances = [
                    QuestionOption(question=question, text=option_text)
                    for option_text in options
                ]
                QuestionOption.objects.bulk_create(option_instances)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *_, **kwargs):
        """
        Handles updating a question and
        its options if it's a multiple-choice or checkbox question.
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

            # Handle multiple-choice and checkbox question options
            if question.type in ["multiple-choice", "checkbox"]:
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
        questions_data = request.data  # Expecting [{"id": 1, "sequence": 2}, ...]

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
    parser_classes = (MultiPartParser, FormParser)  # Enable file handling

    def post(self, request):
        user = request.user
        survey_id = request.data.get("survey")
        answers_data = request.data.get("answers", "[]")
        longitude = request.data.get("longitude")
        latitude = request.data.get("latitude")
        audio_file = request.FILES.get("audio")  # Get uploaded audio file

        if not user or not survey_id or not answers_data:
            return Response(
                {"detail": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Parse the answers_data from JSON string to list of dictionaries
        try:
            answers_data = json.loads(answers_data)
        except json.JSONDecodeError:
            return Response(
                {"detail": "Invalid answers data format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            # Create the Response object
            response_data = {
                "user": user.id,
                "survey": survey_id,
                "longitude": longitude,
                "latitude": latitude,
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

            # Save audio file if provided
            if audio_file:
                original_filename = audio_file.name
                response.audio_file.save(
                    f"{response.id}_{original_filename}", audio_file
                )

            return Response(created_answers, status=status.HTTP_201_CREATED)


class SurveyResponsesPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class SurveyAnswersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, survey_id):
        try:
            survey = Survey.objects.get(id=survey_id)
            responses = Responses.objects.filter(survey=survey).order_by("created_at")

            # Date filters
            today = now().date()
            yesterday = today - timedelta(days=1)

            created_today = responses.filter(created_at__date=today).count()
            created_yesterday = responses.filter(created_at__date=yesterday).count()

            # Compute average daily count
            first_response = responses.first()
            if first_response:
                total_days = max((today - first_response.created_at.date()).days, 1)
                average_daily = responses.count() / total_days
            else:
                average_daily = 0

            # Paginate responses
            paginator = SurveyResponsesPagination()
            paginated_responses = paginator.paginate_queryset(responses, request)

            serializer = ResponsesSerializer(paginated_responses, many=True)
            response_data = {
                "created_today": created_today,
                "created_yesterday": created_yesterday,
                "average_daily": round(average_daily, 2),
                "responses": serializer.data,
            }

            return paginator.get_paginated_response(response_data)

        except Survey.DoesNotExist:
            return Response(
                {"detail": "Survey not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ExportSurveyResponsesCSV(APIView):
    def get(self, _, survey_id):
        try:
            survey = Survey.objects.get(id=survey_id)
            responses = Responses.objects.filter(survey=survey).order_by("created_at")

            if not responses.exists():
                return Response(
                    {"detail": "No responses found for this survey"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = (
                f'attachment; filename="survey_{survey_id}_responses.csv"'
            )

            writer = csv.writer(response)

            # Writing the header
            header = ["Name", "Audio"]
            questions = list(
                Question.objects.filter(survey=survey).order_by("sequence")
            )
            question_ids = [question.id for question in questions]

            for question in questions:
                header.append(question.text)

            header.extend(["Created at", "Longitude", "Latitude"])
            writer.writerow(header)

            # Writing response data
            backend_url = settings.BACKEND_URL
            answers = Answer.objects.filter(
                response__in=responses, question__in=question_ids
            ).select_related("question", "choice_answer")
            answer_map = {
                (answer.response_id, answer.question_id): answer for answer in answers
            }

            for response_obj in responses:
                row = [
                    response_obj.user,
                    (
                        f"{backend_url}{response_obj.audio_file.url}"
                        if response_obj.audio_file
                        else ""
                    ),
                ]

                for question in questions:
                    answer = answer_map.get((response_obj.id, question.id))
                    if answer:
                        if answer.text_answer:
                            row.append(answer.text_answer)
                        elif answer.numeric_answer is not None:
                            row.append(str(answer.numeric_answer))
                        elif answer.choice_answer:
                            row.append(answer.choice_answer.text)
                        elif answer.checkbox_answers.exists():
                            options = answer.checkbox_answers.values_list(
                                "text", flat=True
                            )
                            row.append(", ".join(options))
                        else:
                            row.append("-")
                    else:
                        row.append("-")

                row.extend(
                    [
                        response_obj.created_at,
                        response_obj.longitude,
                        response_obj.latitude,
                    ]
                )
                writer.writerow(row)

            return response
        except Survey.DoesNotExist:
            return Response(
                {"detail": "Survey not found"}, status=status.HTTP_404_NOT_FOUND
            )
