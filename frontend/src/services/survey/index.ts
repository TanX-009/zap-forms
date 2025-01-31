import { TQuestion, TSurvey } from "@/types/survey";
import { delete_, get, patch, post, TApiResponse } from "../serviceConfig";
import Services from "../serviceUrls";

interface TAddSurveyRequest {
  name: string;
  description: string;
  online: boolean;
}

interface TAddQuestionRequest {
  text: string;
  type: "text" | "number" | "multiple-choice";
  required: boolean;
  survey: TSurvey["id"];
  options?: string[];
}

interface TUpdateQuestionRequest {
  text: string;
  required: boolean;
  survey: TSurvey["id"];
  options?: string[];
}

async function addSurvey(
  data: TAddSurveyRequest,
): Promise<TApiResponse<TSurvey>> {
  return post(Services.addSurvey, data);
}

async function deleteSurvey(
  slug: TSurvey["slug"],
): Promise<TApiResponse<TSurvey>> {
  return delete_(`${Services.deleteSurvey}${slug}/`);
}

async function updateSurvey(
  data: TAddSurveyRequest,
  slug: TSurvey["slug"],
): Promise<TApiResponse<TSurvey>> {
  return patch(`${Services.updateSurvey}${slug}/`, data);
}

async function getSurveys(): Promise<TApiResponse<TSurvey[]>> {
  return get(Services.getSurveys);
}

async function getSurvey(
  slug: TSurvey["slug"],
): Promise<TApiResponse<TSurvey>> {
  return get(`${Services.getSurvey}${slug}/`);
}

async function getSurveyQuestions(
  id: number,
): Promise<TApiResponse<TQuestion[]>> {
  return get(
    Services.getSurveyQuestions.replace("$$survey_id$$", id.toString()),
  );
}

async function addQuestion(
  data: TAddQuestionRequest,
): Promise<TApiResponse<null>> {
  return post(Services.addQuestion, data);
}

async function deleteQuestion(id: number): Promise<TApiResponse<null>> {
  return delete_(`${Services.deleteQuestion}${id}/`);
}

async function updateQuestion(
  data: TUpdateQuestionRequest,
  id: number,
): Promise<TApiResponse<null>> {
  return patch(`${Services.updateQuestion}${id}/`, data);
}

const SurveyService = {
  addSurvey: addSurvey,
  deleteSurvey: deleteSurvey,
  updateSurvey: updateSurvey,
  getSurveys: getSurveys,
  getSurvey: getSurvey,

  getSurveyQuestions: getSurveyQuestions,

  addQuestion: addQuestion,
  deleteQuestion: deleteQuestion,
  updateQuestion: updateQuestion,
};

export default SurveyService;
