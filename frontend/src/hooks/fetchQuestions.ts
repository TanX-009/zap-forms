"use client";

import SurveyService from "@/services/survey";
import { TQuestion } from "@/types/survey";
import { Dispatch, SetStateAction, useState, useCallback } from "react";

export default function useFetchQuestions(
  setter: Dispatch<SetStateAction<TQuestion[] | null>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuestions = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const response = await SurveyService.getSurveyQuestions(id);
        if (response.success) setter(response.data);
      } finally {
        setIsLoading(false);
      }
    },
    [setter],
  );

  return { isLoading, fetchQuestions };
}
