import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import Form from "@/components/Form";
import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";
import handleResponse from "@/systems/handleResponse";

interface TProps {
  survey: TSurvey;
  onSurveyUpdate: () => void;
}

export default function UpdateSurvey({ survey, onSurveyUpdate }: TProps) {
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "Updating...", status: "neutral" });

    const form = new FormData(event.currentTarget);

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const online = form.get("online") as string;

    const onlineBool = online === "online";

    if (
      name === survey.name &&
      onlineBool === survey.online &&
      description === survey.description
    ) {
      setMessage({ value: "No changes detected!", status: "error" });
      return;
    }

    const response = await SurveyService.updateSurvey(
      {
        name,
        description,
        online: onlineBool,
      },
      survey.slug,
    );

    handleResponse(
      response,
      "Question updated successfully!",
      setMessage,
      () => {
        onSurveyUpdate();
      },
    );
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="name"
        label={"Name"}
        type="text"
        defaultValue={survey.name}
        required
      />
      <Input
        name="description"
        label={"Description"}
        type="text"
        required
        defaultValue={survey.description}
      />
      <Select
        name="online"
        label="Online"
        defaultValue={survey.online ? "online" : "offline"}
        required
        options={[
          { value: "online", label: "Online" },
          { value: "offline", label: "Offline" },
        ]}
      />

      <Message status={message.status}>{message.value}</Message>

      <div className={styles.buttons}>
        <Button variant="hiClick" type="submit">
          Update
        </Button>
      </div>
    </Form>
  );
}
