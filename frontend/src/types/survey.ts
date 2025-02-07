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
  type: string;
  required: boolean;
  sequence: number;
  options: { id: number; question: TQuestion["id"]; text: string }[] | null;
}

interface TAnswer {
  question: TQuestion["id"];
  text_answer: string | null;
  choice_answer: number | null;
  numeric_answer: number | null;
}

interface TSurveyResponses {
  answers: TAnswer[];
  audio_file: string;
  created_at: string;
  id: number;
  survey: number;
  user_email: string;
  user_name: string;
  questions: TQuestion[];
}

export type { TSurvey, TQuestion, TAnswer, TSurveyResponses };
