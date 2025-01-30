import Button from "@/components/Button/components";
import Input from "@/components/Input";
import React, { useState } from "react";
import Message from "@/components/Message";
import Form from "@/components/Form";
import SurveyService from "@/services/survey";
import { useRouter } from "next/navigation";

export default function AddSurvey() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "success" | "error";
  }>({
    value: "",
    status: "neutral",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage({ value: "", status: "neutral" });

    const form = new FormData(event.currentTarget);

    const name = form.get("name") as string;
    const description = form.get("description") as string;

    const response = await SurveyService.addSurvey({
      name,
      description,
      online: false,
    });

    if (response.success) {
      setMessage({ value: "Survey added successfully!", status: "success" });
      router.push(`/${response.data.slug}`);
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
      <Input name="name" label={"Name"} type="text" required />
      <Input name="description" label={"Description"} type="text" required />

      <Message status={message.status}>{message.value}</Message>

      <Button variant="hiClick" type="submit">
        Add
      </Button>
    </Form>
  );
}
