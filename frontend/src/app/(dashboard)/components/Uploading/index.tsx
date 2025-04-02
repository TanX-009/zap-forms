"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import Loading from "@/components/Loading";
import useNetworkStatus from "@/hooks/networkStatus";
import useResponsesIDB from "@/hooks/responsesIDB";
import SurveyService from "@/services/survey";
import handleResponse from "@/systems/handleResponse";
import Message, { TMessage } from "@/components/Message";

export default function Uploading() {
  const [status, setStatus] = useState({ current: 0, total: 0 });
  const [pendingResponsesLength, setPendingResponsesLength] = useState(0);
  const [message, setMessage] = useState<TMessage>({
    value: "",
    status: "neutral",
  });

  const isUploading = useRef(false); // Prevents duplicate uploads

  const isOnline = useNetworkStatus();
  const { getResponses, deleteResponse } = useResponsesIDB();

  useEffect(() => {
    (async () => {
      if (!isOnline || isUploading.current) return;
      isUploading.current = true;

      // get local saved responses for notifying
      const responses = await getResponses();
      setPendingResponsesLength(responses?.length || 0);

      if (!responses || responses.length === 0) {
        isUploading.current = false;
        return;
      }

      setStatus({ current: 1, total: responses.length });

      for (let i = 0; i < responses.length; i++) {
        const response = await SurveyService.submitSurvey(
          responses[i].surveyResponse,
        );

        await handleResponse(response, "", setMessage, async () => {
          await deleteResponse(responses[i].startTime);
          setStatus((prev) => ({ ...prev, current: prev.current + 1 }));
          setMessage({ value: "", status: "neutral" });
        });
      }

      isUploading.current = false; // Reset flag when done
    })();
  }, [isOnline, getResponses, deleteResponse]);

  useEffect(() => {
    (async () => {
      const responses = await getResponses();
      setPendingResponsesLength(responses?.length || 0);
    })();
  }, [getResponses]);

  if (pendingResponsesLength < 1 || status.current > status.total) return null;

  return (
    <div className={`panel ${styles.uploading}`}>
      {isOnline ? (
        <>
          <span className={styles.left}>
            Uploading stored surveys <Loading />
          </span>
          <Message status={message.status}>{message.value}</Message>
          <span className={styles.right}>
            <span className={styles.big}>{status.current}</span>/{status.total}
          </span>
        </>
      ) : (
        <>
          <span>Upload pending responses: </span>
          <span>{pendingResponsesLength}</span>
        </>
      )}
    </div>
  );
}
