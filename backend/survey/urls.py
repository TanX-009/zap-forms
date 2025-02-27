from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExportSurveyResponsesCSV,
    SurveyAnswersListView,
    SurveyViewSet,
    QuestionViewSet,
    SurveyQuestionsListView,
    SubmitSurveyResponseView,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"survey", SurveyViewSet, basename="survey")
router.register(r"questions", QuestionViewSet, basename="question")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "survey/<int:survey_id>/questions/",
        SurveyQuestionsListView.as_view(),
        name="survey_questions_list",
    ),
    path(
        "survey/<int:survey_id>/responses/",
        SurveyAnswersListView.as_view(),
        name="survey_responses",
    ),
    path(
        "submit-response/",
        SubmitSurveyResponseView.as_view(),
        name="submit_survey_response",
    ),
    path(
        "survey/<int:survey_id>/export/",
        ExportSurveyResponsesCSV.as_view(),
        name="export_survey_responses",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
