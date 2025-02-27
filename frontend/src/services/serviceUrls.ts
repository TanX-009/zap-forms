const Services = {
  refresh: "account/refresh/",

  login: "account/login/",
  logout: "account/logout/",

  register: "account/",
  delete: "account/",
  update: "account/",

  users: "account/users/",

  addSurvey: "api/survey/",
  deleteSurvey: "api/survey/",
  updateSurvey: "api/survey/",
  getSurveys: "api/survey/",
  getSurvey: "api/survey/",

  getSurveyQuestions: "api/survey/$$survey_id$$/questions/",
  geTSurveyResponses: "api/survey/$$survey_id$$/responses/",

  addQuestion: "api/questions/",
  deleteQuestion: "api/questions/",
  updateQuestion: "api/questions/",

  submitSurvey: "api/submit-response/",
  exportSurvey: "api/survey/$$survey_id$$/export/",

  audio: "/api",
} as const;

export default Services;
