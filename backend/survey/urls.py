from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SurveyViewSet,
    QuestionViewSet,
    SurveyQuestionsListView,
    SubmitSurveyResponseView,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"surveys", SurveyViewSet, basename="survey")
router.register(r"questions", QuestionViewSet, basename="question")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "surveys/<int:survey_id>/questions/",
        SurveyQuestionsListView.as_view(),
        name="survey_questions_list",
    ),
    path(
        "submit-response/",
        SubmitSurveyResponseView.as_view(),
        name="submit_survey_response",
    ),
]
