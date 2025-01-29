import Button from "@/components/Button/components";
import Input from "@/components/Input";
import React from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import ManagementService from "@/services/management";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function AddUser() {
  const [message, setMessage] = React.useState<{
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

    console.log(response);
    if (response.success) {
      setMessage({ value: "User added successfully!", status: "success" });
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
    <form className={styles.addUser} onSubmit={onSubmit}>
      <Input name="email" label={"Email"} type="email" required />
      <Input name="username" label={"Username"} type="text" required />
      <Select name="role" label={"Role"} options={roles} />
      <Input name="password" label={"Password"} type="password" required />
      <Input
        name="confirmPassword"
        label={"Confirm password"}
        type="password"
        required
      />

      <Message status={message.status}>{message.value}</Message>

      <Button type="submit">Add</Button>
    </form>
  );
}
