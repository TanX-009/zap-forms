import { TSurvey } from "@/types/survey";
import { delete_, get, post, TApiResponse } from "../serviceConfig";
import Services from "../serviceUrls";

interface TAddSurveyRequest {
  name: string;
  description: string;
  online: boolean;
}

async function addSurvey(
  data: TAddSurveyRequest,
): Promise<TApiResponse<TSurvey>> {
  return post(Services.addSurvey, data);
}

async function deleteSurvey(id: number): Promise<TApiResponse<TSurvey>> {
  return delete_(`${Services.deleteSurvey}/${id}/`);
}

async function getSurveys(): Promise<TApiResponse<TSurvey[]>> {
  return get(Services.getSurveys);
}

async function getSurvey(id: number): Promise<TApiResponse<TSurvey>> {
  return get(`${Services.getSurvey}${id}/`);
}

async function getSurveyQuestions(id: number): Promise<TApiResponse<TSurvey>> {
  return get(
    Services.getSurveyQuestions.replace("$$survey_id$$", id.toString()),
  );
}

const SurveyService = {
  addSurvey: addSurvey,
  deleteSurvey: deleteSurvey,
  getSurveys: getSurveys,
  getSurvey: getSurvey,
  getSurveyQuestions: getSurveyQuestions,
};

export default SurveyService;
