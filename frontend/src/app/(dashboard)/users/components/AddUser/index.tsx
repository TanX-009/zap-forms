import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import ManagementService from "@/services/management";
import Form from "@/components/Form";

interface TProps {
  updateTick: () => void;
}

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function AddUser({ updateTick }: TProps) {
  const [message, setMessage] = React.useState<{
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

    const email = form.get("email") as string;
    const username = form.get("username") as string;
    const role = form.get("role") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setMessage({ value: "Passwords do not match!", status: "error" });
      return;
    }

    const response = await ManagementService.registerUser({
      email,
      username,
      password,
      role,
    });

    if (response.success) {
      setMessage({ value: "User added successfully!", status: "success" });
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

  return (
    <Form onSubmit={onSubmit}>
      <Input name="email" label={"Email"} type="email" required />
      <Input name="username" label={"Username"} type="text" required />
      <Select name="role" label={"Role"} options={roles} required />
      <Input name="password" label={"Password"} type="password" required />
      <Input
        name="confirmPassword"
        label={"Confirm password"}
        type="password"
        required
      />

      <Message status={message.status}>{message.value}</Message>

      <Button variant="hiClick" className={styles.addButton} type="submit">
        Add
      </Button>
    </Form>
  );
}
