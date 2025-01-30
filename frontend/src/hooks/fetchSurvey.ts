"use client";

import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import { Dispatch, SetStateAction, useState } from "react";

export default function useFetchSurvey(
  setter: Dispatch<SetStateAction<TSurvey[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchSurvey = async () => {
    try {
      setIsLoading(true);
      const response = await SurveyService.getSurveys();
      if (response.success) setter(response.data);
      if (!response.success && response.status === 401) {
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchSurvey };
}
