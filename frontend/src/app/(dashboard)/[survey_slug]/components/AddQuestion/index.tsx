import Tabs from "@/components/Tabs";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Form from "@/components/Form";
import Button from "@/components/Button";
import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Message from "@/components/Message";

const tabs = ["Text", "Number", "Multiple choice"];

interface TProps {
  survey: TSurvey;
  updateTick: () => void;
}

export default function AddQuestion({ survey, updateTick }: TProps) {
  const [questionType, setQuestionType] = useState(tabs[0]);
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "Adding...", status: "neutral" });

    const form = new FormData(event.currentTarget);

    const text = form.get("text") as string;
    const required = form.get("required") as string;
    let options: string[] = [];

    let type: "text" | "number" | "multiple-choice" = "text";
    switch (questionType) {
      case "Text":
        type = "text";
        break;
      case "Number":
        type = "number";
        break;
      case "Multiple choice":
        type = "multiple-choice";
        const optionsStr = form.get("options") as string;
        options = optionsStr ? optionsStr.split(",") : [];
        options = options.map((option) => option.trim());
        // check if there are at least 2 options
        if (options.length < 2) {
          setMessage({
            value: "Multiple choice questions must have at least 2 options!",
            status: "error",
          });
          return;
        }
        // check if there are no duplicate options
        if (new Set(options).size !== options.length) {
          setMessage({
            value: "Multiple choice questions must have unique options!",
            status: "error",
          });
          return;
        }
        break;
    }

    const response = await SurveyService.addQuestion({
      text,
      type,
      required: required === "yes",
      survey: survey.id,
      options,
    });

    if (response.success) {
      setMessage({ value: "Question added successfully!", status: "success" });
      updateTick();
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

  useEffect(() => {
    setMessage({ value: "", status: "neutral" });
  }, [questionType]);

  return (
    <div className={styles.addQuestion}>
      <Tabs current={questionType} setter={setQuestionType} tabs={tabs} />
      <Form onSubmit={onSubmit}>
        <Input
          className={styles.question}
          name="text"
          label="Question"
          required
        />
        {questionType === "Multiple choice" ? (
          <>
            <Input
              name="options"
              label='Options (Seperate using commas ",")'
              required
            />
          </>
        ) : null}
        <Select
          name="required"
          label="Required"
          selected={0}
          required
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />

        <Message status={message.status}>{message.value}</Message>

        <Button variant="hiClick" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
}
