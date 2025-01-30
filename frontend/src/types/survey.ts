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
  options: { id: number; question: TQuestion["id"]; text: string }[] | null;
}

export type { TSurvey, TQuestion };
