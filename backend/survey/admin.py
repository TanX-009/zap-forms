from django.contrib import admin

from survey.models import Answer, Question, QuestionOption, Responses, Survey

# Register your models here.
admin.site.register(Survey)
admin.site.register(Question)
admin.site.register(QuestionOption)
admin.site.register(Responses)
admin.site.register(Answer)
