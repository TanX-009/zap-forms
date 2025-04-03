"use client";

import SurveyService, { TGetSurveyResponsesResponse } from "@/services/survey";
import { Dispatch, SetStateAction, useState, useCallback, useRef } from "react";

export default function useFetchResponses(
  setter: Dispatch<
    SetStateAction<TGetSurveyResponsesResponse["results"] | null>
  >,
) {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchResponses = useCallback(
    async (id: number, pageNum: number = 1) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      try {
        setIsLoading(true);
        const response = await SurveyService.getSurveyResponses(
          id,
          pageNum,
          pageSize,
        );

        if (response.success) {
          setter(response.data.results);
          setNextPage(response.data.next);
          setPrevPage(response.data.previous);
          setTotalCount(response.data.count);
          setPage(pageNum);
        }
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [setter, pageSize],
  );

  return {
    isLoading,
    fetchResponses,
    page,
    pageSize,
    setPageSize,
    nextPage,
    prevPage,
    totalCount,
    setPage,
  };
}
