import { TUser } from "./user";

interface TSurvey {
  id: number;
  name: string;
  slug: string;
  description: string;
  online: boolean;
  created_at: string; // ISO 8601 date string
}

interface TQuestion {
  id: number;
  survey: number;
  text: string;
  type: "text" | "number" | "multiple-choice" | "checkbox";
  required: boolean;
  sequence: number;
  min_length: number;
  max_length: number;
  options: { id: number; question: TQuestion["id"]; text: string }[] | null;
}

interface TAnswer {
  question: TQuestion["id"];
  text_answer: string | null;
  choice_answer: string | null; // For single-choice questions
  numeric_answer: string | null;
  checkbox_answers: string[]; // For checkbox (multiple selections)
}

interface TProgress {
  startTime: string | null;
  questionNo: TQuestion["sequence"] | null;
  answers: TAnswer[];
}

interface TSurveyResponses {
  answers: TAnswer[];
  audio_file: string;
  created_at: string;
  id: number;
  survey: number;
  user: TUser;
  questions: TQuestion[];
  longitude: number;
  latitude: number;
}

interface TCoords {
  longitude: number | null;
  latitude: number | null;
}

export type {
  TSurvey,
  TQuestion,
  TAnswer,
  TProgress,
  TSurveyResponses,
  TCoords,
};
