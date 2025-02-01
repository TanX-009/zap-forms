import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import Form from "@/components/Form";
import { TAnswer, TSurvey } from "@/types/survey";
import SurveyService from "@/services/survey";
import Message from "@/components/Message";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

interface TProps {
  survey: TSurvey;
  answers: TAnswer[];
  user: { name: string; email: string };
  setComplete: Dispatch<SetStateAction<boolean>>;
}

export default function SubmitSurvey({
  survey,
  answers,
  user,
  setComplete,
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

    const response = await SurveyService.submitSurvey({
      user_email: user.email,
      user_name: user.name,
      survey: survey.id,
      answers: answers,
    });

    if (response.success) {
      setMessage({
        value: "Response submitted successfully!",
        status: "success",
      });
      setComplete(true);
      router.push(`/survey/${survey.slug}/complete`);
    } else if (response.status === 400) {
      const message =
        typeof response.error.data === "object"
          ? Object.values(response.error.data)[0]
          : "Something went wrong!";
      setMessage({ value: message, status: "error" });
    } else if (response.status === 403) {
      setMessage({
        value: "You are not authorized to perform this action!",
        status: "error",
      });
    } else {
      setMessage({ value: "Unknown Error !", status: "error" });
    }
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
