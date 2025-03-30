import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import Form from "@/components/Form";
import { TQuestion } from "@/types/survey";
import SurveyService from "@/services/survey";
import handleResponse from "@/systems/handleResponse";

interface TProps {
  question: TQuestion;
  updateTick: () => void;
}

export default function UpdateQuestion({ question, updateTick }: TProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });
  let presetOptions = "";

  if (question.options) {
    question.options.map((option) => {
      presetOptions += option.text + ",";
    });
    presetOptions = presetOptions.slice(0, -1);
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "Updating...", status: "neutral" });

    const form = new FormData(event.currentTarget);

    const text = form.get("text") as string;
    const required = form.get("required") as string;
    const min_length = form.get("min_length");
    const max_length = form.get("max_length");
    const optionsStr = (form.get("options") as string) || "";
    let options: string[] = [];

    const requiredBool = required === "yes";

    if (
      text === question.text &&
      requiredBool === question.required &&
      optionsStr === presetOptions &&
      Number(min_length) === question.min_length &&
      Number(max_length) === question.max_length
    ) {
      setMessage({ value: "No changes detected!", status: "error" });
      return;
    }

    if (question.type === "multiple-choice") {
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
    }

    const response = await SurveyService.updateQuestion(
      {
        text,
        required: required === "yes",
        options,
        survey: question.survey,
        min_length: Number(min_length),
        max_length: Number(max_length),
      },
      question.id,
    );

    handleResponse(
      response,
      "Question updated successfully!",
      setMessage,
      () => {
        updateTick();
      },
    );
  };

  const onDelete = async () => {
    setMessage({ value: "Deleting...", status: "neutral" });
    const response = await SurveyService.deleteQuestion(question.id);

    handleResponse(
      response,
      "Question deleted successfully!",
      setMessage,
      () => {
        updateTick();
      },
    );
  };

  if (isDeleting) {
    return (
      <div className={styles.isDeleting}>
        <p>Are you sure you want to delete this question?</p>
        <div className={styles.buttons}>
          <Button className={styles.delete} type="button" onClick={onDelete}>
            Delete
          </Button>
          <Button type="button" onClick={() => setIsDeleting(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="text"
        label={"Question"}
        type="text"
        defaultValue={question.text}
        required
      />
      {question.type === "multiple-choice" || question.type === "checkbox" ? (
        <Input
          name="options"
          label={"Options"}
          type="text"
          required
          defaultValue={presetOptions}
        />
      ) : (
        <>
          <Input
            name="min_length"
            label="Min Length"
            defaultValue={question.min_length}
            required
          />
          <Input
            name="max_length"
            label="Max Length"
            defaultValue={question.max_length}
            required
          />
        </>
      )}
      <Select
        name="required"
        label="Required"
        defaultValue={question.required ? "yes" : "no"}
        required
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />

      <Message status={message.status}>{message.value}</Message>

      <div className={styles.buttons}>
        <Button variant="hiClick" type="submit">
          Update
        </Button>
        <Button
          className={styles.delete}
          type="button"
          onClick={() => setIsDeleting(true)}
        >
          Delete
        </Button>
      </div>
    </Form>
  );
}
