"use client";

import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import useNetworkStatus from "./networkStatus";
import useSurveyIDB from "./surveyIDB";

export default function useFetchSurveys(
  setter: Dispatch<SetStateAction<TSurvey[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const isOnline = useNetworkStatus();
  const { getSurveys, updateSurveys } = useSurveyIDB();

  const fetchSurveys = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;
      if (isOnline) {
        response = await SurveyService.getSurveys();
        if (response.success) await updateSurveys(response.data);
      } else {
        response = { success: true, data: await getSurveys() };
      }

      if (response.success) setter(response.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [setter, getSurveys, isOnline, updateSurveys]);

  return { isLoading, fetchSurveys };
}
