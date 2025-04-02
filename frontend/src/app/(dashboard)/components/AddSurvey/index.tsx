import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import Message, { TMessage } from "@/components/Message";
import Form from "@/components/Form";
import SurveyService from "@/services/survey";
import { useRouter } from "next/navigation";
import handleResponse from "@/systems/handleResponse";

export default function AddSurvey() {
  const router = useRouter();
  const [message, setMessage] = useState<TMessage>({
    value: "",
    status: "neutral",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "Adding...", status: "neutral" });

    const form = new FormData(event.currentTarget);

    const name = form.get("name") as string;
    const description = form.get("description") as string;

    const response = await SurveyService.addSurvey({
      name,
      description,
      online: false,
    });

    handleResponse(
      response,
      "Survey added successfully!",
      setMessage,
      (data) => {
        router.push(`/edit/${data.slug}`);
      },
    );
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input name="name" label={"Name"} type="text" required />
      <Input name="description" label={"Description"} type="text" required />

      <Message status={message.status}>{message.value}</Message>

      <Button variant="hiClick" type="submit">
        Add
      </Button>
    </Form>
  );
}
