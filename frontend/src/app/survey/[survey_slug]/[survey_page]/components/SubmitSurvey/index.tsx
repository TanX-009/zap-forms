import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import Form from "@/components/Form";
import { TAnswer, TSurvey } from "@/types/survey";
import SurveyService from "@/services/survey";
import Message from "@/components/Message";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import handleResponse from "@/systems/handleResponse";

interface TProps {
  survey: TSurvey;
  answers: TAnswer[];
  user: { name: string; email: string };
  setComplete: Dispatch<SetStateAction<boolean>>;
  audio: {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => Promise<Blob | null>;
  };
}

export default function SubmitSurvey({
  survey,
  answers,
  user,
  setComplete,
  audio,
}: TProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "Submitting...", status: "neutral" });

    const audioBlob = await audio.stopRecording();

    const response = await SurveyService.submitSurvey({
      user_email: user.email,
      user_name: user.name,
      survey: survey.id,
      answers: answers,
      audioBlob: audioBlob,
    });
    console.log({
      user_email: user.email,
      user_name: user.name,
      survey: survey.id,
      answers: answers,
      audioBlob: audioBlob,
    });

    handleResponse(
      response,
      "Response submitted successfully!",
      setMessage,
      () => {
        setComplete(true);
        router.push(`/survey/${survey.slug}/complete`);
      },
    );
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
