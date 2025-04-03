"use client";

import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import useNetworkStatus from "./networkStatus";
import useSurveyIDB from "./surveyIDB";

export default function useFetchSurvey(
  setter: Dispatch<SetStateAction<TSurvey | null>>,
) {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isOnline = useNetworkStatus();
  const { getSurvey } = useSurveyIDB();

  const fetchSurvey = useCallback(
    async (slug: string) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      try {
        setIsLoading(true);

        let response;
        if (isOnline) {
          response = await SurveyService.getSurvey(slug);
        } else {
          const data = await getSurvey(slug);
          response = { success: true, data: data };
        }
        if (response.success) setter(response.data || null);
        if (!response.success && response.status === 404) {
          setError("Not found!");
        }
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [setter, getSurvey, isOnline],
  );

  return { isLoading, fetchSurvey, error };
}
