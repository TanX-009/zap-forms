"use client";

import { TAnswer, TQuestion, TSurvey } from "@/types/survey";
import React, {
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export type TSurveyContext = {
  survey: TSurvey | null;
  setSurvey: Dispatch<SetStateAction<TSurvey | null>>;
  questions: TQuestion[] | null;
  setQuestions: Dispatch<SetStateAction<TQuestion[] | null>>;
  answers: TAnswer[];
  setAnswers: Dispatch<SetStateAction<TAnswer[]>>;
  user: {
    name: string;
    email: string;
  };
  setUser: Dispatch<SetStateAction<{ name: string; email: string }>>;
  complete: boolean;
  setComplete: Dispatch<SetStateAction<boolean>>;
};

export const SurveyContext = createContext<TSurveyContext>({
  survey: null,
  setSurvey: () => {},
  questions: [],
  setQuestions: () => {},
  answers: [],
  setAnswers: () => {},
  user: { name: "", email: "" },
  setUser: () => {},
  complete: false,
  setComplete: () => {},
});

interface TProps {
  children: ReactNode;
}

export default function SurveyContextComponent({ children }: TProps) {
  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [questions, setQuestions] = useState<TQuestion[] | null>([]);
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [complete, setComplete] = useState(false);

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurvey,
        questions,
        setQuestions,
        answers,
        setAnswers,
        user,
        setUser,
        complete,
        setComplete,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
