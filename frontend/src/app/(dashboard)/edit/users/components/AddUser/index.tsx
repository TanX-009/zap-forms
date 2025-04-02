import Button from "@/components/Button";
import Input from "@/components/Input";
import React from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message, { TMessage } from "@/components/Message";
import ManagementService from "@/services/management";
import Form from "@/components/Form";
import handleResponse from "@/systems/handleResponse";

interface TProps {
  updateTick: () => void;
}

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function AddUser({ updateTick }: TProps) {
  const [message, setMessage] = React.useState<TMessage>({
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

    handleResponse(response, "User added successfully!", setMessage, () => {
      updateTick();
    });
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
