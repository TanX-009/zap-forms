import { TAnswer, TQuestion, TSurvey, TSurveyResponses } from "@/types/survey";
import {
  delete_,
  formData_post,
  get,
  patch,
  post,
  TApiResponse,
} from "../serviceConfig";
import Services from "../serviceUrls";
import { getAudioFileExtension } from "@/systems/mimeType";

interface TAddSurveyRequest {
  name: string;
  description: string;
  online: boolean;
}

interface TAddQuestionRequest {
  text: string;
  type: "text" | "number" | "multiple-choice" | "checkbox";
  required: boolean;
  survey: TSurvey["id"];
  min_length: number;
  max_length: number;
  options?: string[];
}

interface TUpdateQuestionRequest {
  text: string;
  required: boolean;
  survey: TSurvey["id"];
  min_length: number;
  max_length: number;
  options?: string[];
}

export interface TSubmitSurveyRequest {
  survey: TSurvey["id"];
  answers: TAnswer[];
  audioBlob: Blob | null;
  latitude: number | null;
  longitude: number | null;
}

export interface TGetSurveyResponsesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    created_today: number;
    created_yesterday: number;
    average_daily: number;
    responses: TSurveyResponses[];
  };
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

async function reorderQuestions(
  data: TQuestion[],
): Promise<TApiResponse<null>> {
  return post(Services.reorderQuestions, data);
}

async function getSurveyQuestions(
  id: number,
): Promise<TApiResponse<TQuestion[]>> {
  return get(
    Services.getSurveyQuestions.replace("$$survey_id$$", id.toString()),
  );
}

async function getSurveyResponses(
  id: number,
  pageNum: number,
  pageSize: number,
): Promise<TApiResponse<TGetSurveyResponsesResponse>> {
  return get(
    Services.getSurveyResponses.replace("$$survey_id$$", id.toString()),
    {
      params: {
        page: pageNum,
        page_size: pageSize,
      },
    },
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

async function submitSurvey(
  data: TSubmitSurveyRequest,
): Promise<TApiResponse<null>> {
  const formData = new FormData();
  formData.append("survey", data.survey.toString());
  formData.append("answers", JSON.stringify(data.answers));
  formData.append("longitude", data.longitude ? data.longitude.toString() : "");
  formData.append("latitude", data.latitude ? data.latitude.toString() : "");

  if (data.audioBlob && data.audioBlob.size < 50 * 1024 * 1024) {
    // 50MB in bytes
    // Determine the file extension based on the MIME type
    const extension = getAudioFileExtension(data.audioBlob.type);

    formData.append("audio", data.audioBlob, `recording${extension}`);
  } else {
    console.warn("Audio file is too large. Maximum allowed size is 50MB.");
  }

  return formData_post(Services.submitSurvey, formData);
}

const SurveyService = {
  addSurvey: addSurvey,
  deleteSurvey: deleteSurvey,
  updateSurvey: updateSurvey,
  getSurveys: getSurveys,
  getSurvey: getSurvey,

  reorderQuestions: reorderQuestions,
  getSurveyQuestions: getSurveyQuestions,
  getSurveyResponses: getSurveyResponses,

  addQuestion: addQuestion,
  deleteQuestion: deleteQuestion,
  updateQuestion: updateQuestion,

  submitSurvey: submitSurvey,
};

export default SurveyService;
