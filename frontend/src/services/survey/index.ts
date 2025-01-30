import { TQuestion, TSurvey } from "@/types/survey";
import { delete_, get, post, TApiResponse } from "../serviceConfig";
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

async function addSurvey(
  data: TAddSurveyRequest,
): Promise<TApiResponse<TSurvey>> {
  return post(Services.addSurvey, data);
}

async function deleteSurvey(slug: string): Promise<TApiResponse<TSurvey>> {
  return delete_(`${Services.deleteSurvey}${slug}/`);
}

async function getSurveys(): Promise<TApiResponse<TSurvey[]>> {
  return get(Services.getSurveys);
}

async function getSurvey(slug: string): Promise<TApiResponse<TSurvey>> {
  return get(`${Services.getSurvey}${slug}/`);
}

async function getSurveyQuestions(
  id: number,
): Promise<TApiResponse<TQuestion[]>> {
  return get(
    Services.getSurveyQuestions.replace("$$survey_id$$", id.toString()),
    { withCredentials: false },
  );
}

async function addQuestion(
  data: TAddQuestionRequest,
): Promise<TApiResponse<TQuestion>> {
  return post(Services.addQuestion, data);
}

const SurveyService = {
  addSurvey: addSurvey,
  deleteSurvey: deleteSurvey,
  getSurveys: getSurveys,
  getSurvey: getSurvey,

  getSurveyQuestions: getSurveyQuestions,

  addQuestion: addQuestion,
};

export default SurveyService;
