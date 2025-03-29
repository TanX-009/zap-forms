"use client";

import SurveyService from "@/services/survey";
import { TSurveyResponses } from "@/types/survey";
import { Dispatch, SetStateAction, useState, useCallback } from "react";

export default function useFetchResponses(
  setter: Dispatch<SetStateAction<TSurveyResponses[] | null>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchResponses = useCallback(
    async (id: number, pageNum: number = 1) => {
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
