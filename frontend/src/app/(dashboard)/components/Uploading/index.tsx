"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Loading from "@/components/Loading";
import useNetworkStatus from "@/hooks/networkStatus";
import useResponsesIDB from "@/hooks/responsesIDB";
import SurveyService from "@/services/survey";
import handleResponse from "@/systems/handleResponse";
import Message, { TMessage } from "@/components/Message";

let isUploadingGlobal = false; // Global flag to persist across renders
let wasOffline = false;

const Uploading = React.memo(() => {
  const [status, setStatus] = useState({ current: 0, total: 0 });
  const [pendingResponsesLength, setPendingResponsesLength] = useState(0);
  const [message, setMessage] = useState<TMessage>({
    value: "",
    status: "neutral",
  });

  const isOnline = useNetworkStatus();
  const { getResponses, deleteResponse } = useResponsesIDB();

  if (!isOnline) wasOffline = true;

  useEffect(() => {
    (async () => {
      if (!isOnline || isUploadingGlobal || wasOffline) return;
      isUploadingGlobal = true;

      const responses = await getResponses();
      setPendingResponsesLength(responses?.length || 0);

      if (!responses || responses.length === 0) {
        isUploadingGlobal = false;
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

      isUploadingGlobal = false;
    })();
  }, [isOnline, getResponses, deleteResponse]);

  useEffect(() => {
    (async () => {
      const responses = await getResponses();
      setPendingResponsesLength(responses?.length || 0);
    })();
  }, [getResponses]);

  if (
    pendingResponsesLength < 1 ||
    status.current > status.total ||
    (status.current === 0 && status.total === 0)
  )
    return null;

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
});

Uploading.displayName = "Uploading";

export default Uploading;
