import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import Form from "@/components/Form";
import SurveyService from "@/services/survey";
import { TSurvey } from "@/types/survey";

interface TProps {
  survey: TSurvey;
}

export default function UpdateSurvey({ survey }: TProps) {
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

    const name = form.get("text") as string;
    const description = form.get("required") as string;
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

    if (response.success) {
      setMessage({
        value: "Question updated successfully!",
        status: "success",
      });
      //updateTick();
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
        defaultValue={survey.online ? "Online" : "Offline"}
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
