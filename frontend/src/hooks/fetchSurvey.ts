"use client";

import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function useFetchSurvey(
  setter: Dispatch<SetStateAction<TSurvey | null>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSurvey = useCallback(
    async (slug: string) => {
      try {
        setIsLoading(true);
        const response = await SurveyService.getSurvey(slug);
        if (response.success) setter(response.data);
        if (!response.success && response.status === 404) {
          setError("Not found!");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setter],
  );

  return { isLoading, fetchSurvey, error };
}
