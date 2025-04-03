"use client";

import SurveyService from "@/services/survey";
import { TQuestion } from "@/types/survey";
import { Dispatch, SetStateAction, useState, useCallback, useRef } from "react";
import useNetworkStatus from "./networkStatus";
import useSurveyIDB from "./surveyIDB";

export default function useFetchQuestions(
  setter: Dispatch<SetStateAction<TQuestion[] | null>>,
) {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOnline = useNetworkStatus();
  const { getQuestions, updateQuestions } = useSurveyIDB();

  const fetchQuestions = useCallback(
    async (id: number) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      try {
        setIsLoading(true);
        let response;
        if (isOnline) {
          response = await SurveyService.getSurveyQuestions(id);
          if (response.success) await updateQuestions(response.data, id);
        } else {
          const data = await getQuestions(id);
          response = { success: true, data: data };
        }
        if (response.success) setter(response.data || []);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [setter, getQuestions, updateQuestions, isOnline],
  );

  return { isLoading, fetchQuestions };
}
