"use client";

import React, { FormEvent, useContext, useState } from "react";
import styles from "./styles.module.css";
import Form from "@/components/Form";
import { TAnswer, TCoords, TSurvey } from "@/types/survey";
//import SurveyService from "@/services/survey";
import Message from "@/components/Message";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
//import handleResponse from "@/systems/handleResponse";
//import useNetworkStatus from "@/hooks/networkStatus";
import useResponsesIDB from "@/hooks/responsesIDB";
import { ProgressContext } from "@/systems/ProgressContext";
import useProgressIDB from "@/hooks/progressIDB";

interface TProps {
  survey: TSurvey;
  answers: TAnswer[];
  audio: {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => Promise<Blob | null>;
  };
  location: TCoords;
}

export default function SubmitSurvey({
  survey,
  answers,
  audio,
  location,
}: TProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });

  const { progress, deleteProgress } = useContext(ProgressContext);

  //const isOnline = useNetworkStatus();
  const { addResponse } = useResponsesIDB();
  const { deleteProgress: deleteProgressIDB } = useProgressIDB();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.value === "Submitting...") return;
    setMessage({ value: "Submitting...", status: "neutral" });

    const audioBlob = await audio.stopRecording();

    const surveyResponse = {
      survey: survey.id,
      answers: answers,
      audioBlob: audioBlob,
      longitude: location.longitude,
      latitude: location.latitude,
    };
    const onSuccess = async () => {
      // delete progress
      await deleteProgressIDB(survey.slug);
      // delete context progress
      deleteProgress(() => {
        setTimeout(() => {
          router.push(`/`);
        }, 1000);
      });
    };

    //if (isOnline) {
    //  const response = await SurveyService.submitSurvey(surveyResponse);
    //
    //  handleResponse(
    //    response,
    //    "Response submitted successfully!",
    //    setMessage,
    //    onSuccess,
    //  );
    //}
    //else {
    let startTime = progress.startTime;
    if (!startTime) {
      const date = new Date();
      startTime = date.toISOString();
    }

    // store response offline
    await addResponse({
      startTime: startTime,
      surveyResponse: surveyResponse,
    });

    setMessage({
      value: "Response saved to local storage!",
      status: "success",
    });
    onSuccess();
    //}
  };
  return (
    <Form onSubmit={onSubmit} className={styles.submitSurvey}>
      Are you sure you want to submit the survey?
      <Message status={message.status}>{message.value}</Message>
      <Button variant="hiClick" type="submit">
        Submit
      </Button>
    </Form>
  );
}
