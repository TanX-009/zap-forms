"use client";

import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function useFetchSurveys(
  setter: Dispatch<SetStateAction<TSurvey[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchSurveys = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await SurveyService.getSurveys();
      if (response.success) setter(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [setter]);

  return { isLoading, fetchSurveys };
}
