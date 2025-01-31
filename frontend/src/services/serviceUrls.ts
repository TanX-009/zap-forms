const Services = {
  refresh: "account/refresh/",

  login: "account/login/",
  logout: "account/logout/",

  register: "account/",
  delete: "account/",
  update: "account/",

  users: "account/users/",

  addSurvey: "survey/surveys/",
  deleteSurvey: "survey/surveys/",
  updateSurvey: "survey/surveys/",
  getSurveys: "survey/surveys/",
  getSurvey: "survey/surveys/",

  getSurveyQuestions: "survey/surveys/$$survey_id$$/questions/",

  addQuestion: "survey/questions/",
  deleteQuestion: "survey/questions/",
  updateQuestion: "survey/questions/",

  submitSurvey: "survey/submit-response/",
} as const;

export default Services;
