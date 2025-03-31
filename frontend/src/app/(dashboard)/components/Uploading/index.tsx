"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import Loading from "@/components/Loading";
import useNetworkStatus from "@/hooks/networkStatus";
import useResponsesIDB from "@/hooks/responsesIDB";
import SurveyService from "@/services/survey";
import handleResponse from "@/systems/handleResponse";

export default function Uploading() {
  const [status, setStatus] = useState({ current: 0, total: 0 });
  const isUploading = useRef(false); // Prevents duplicate uploads

  const isOnline = useNetworkStatus();
  const { getResponses, deleteResponse } = useResponsesIDB();

  useEffect(() => {
    if (!isOnline || isUploading.current) return;

    isUploading.current = true; // Prevent duplicate uploads

    (async () => {
      const responses = await getResponses();
      if (!responses || responses.length === 0) {
        isUploading.current = false;
        return;
      }

      setStatus({ current: 0, total: responses.length });

      for (let i = 0; i < responses.length; i++) {
        const response = await SurveyService.submitSurvey(
          responses[i].surveyResponse,
        );

        await handleResponse(
          response,
          "",
          () => {},
          async () => {
            await deleteResponse(responses[i].startTime);
            setStatus((prev) => ({ ...prev, current: prev.current + 1 }));
          },
        );
      }

      isUploading.current = false; // Reset flag when done
    })();
  }, [isOnline, getResponses, deleteResponse]);

  if (isOnline || status.current === status.total) return null;

  return (
    <div className={`panel ${styles.uploading}`}>
      <span className={styles.left}>
        Uploading stored surveys <Loading />
      </span>
      <span className={styles.right}>
        <span className={styles.big}>{status.current}</span>/{status.total}
      </span>
    </div>
  );
}
