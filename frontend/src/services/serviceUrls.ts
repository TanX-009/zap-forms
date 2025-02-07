const Services = {
  refresh: "account/refresh/",

  login: "account/login/",
  logout: "account/logout/",

  register: "account/",
  delete: "account/",
  update: "account/",

  users: "account/users/",

  addSurvey: "api/surveys/",
  deleteSurvey: "api/surveys/",
  updateSurvey: "api/surveys/",
  getSurveys: "api/surveys/",
  getSurvey: "api/surveys/",

  getSurveyQuestions: "api/surveys/$$survey_id$$/questions/",
  geTSurveyResponses: "api/surveys/$$survey_id$$/responses/",

  addQuestion: "api/questions/",
  deleteQuestion: "api/questions/",
  updateQuestion: "api/questions/",

  submitSurvey: "api/submit-response/",

  audio: "/api",
} as const;

export default Services;
