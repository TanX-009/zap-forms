import Button from "@/components/Button";
import Input from "@/components/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Select from "@/components/Select";
import Message from "@/components/Message";
import ManagementService from "@/services/management";
import { TUser } from "@/types/user";
import Form from "@/components/Form";
import handleResponse from "@/systems/handleResponse";

interface TProps {
  user: TUser;
  updateTick: () => void;
}

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function UpdateUser({ user, updateTick }: TProps) {
  const [isDeleting, setIsDeleting] = useState(false);
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

    const email = form.get("email") as string;
    const username = form.get("username") as string;
    const role = form.get("role") as string;

    if (
      email === user.email &&
      username === user.username &&
      role === user.role
    ) {
      setMessage({ value: "No changes detected!", status: "error" });
      return;
    }

    const response = await ManagementService.updateUser({
      id: user.id,
      email,
      username,
      role,
    });

    handleResponse(response, "User updated successfully!", setMessage, () => {
      updateTick();
    });
  };

  const onDelete = async () => {
    setMessage({ value: "Deleting...", status: "neutral" });
    const response = await ManagementService.deleteUser(user.id);

    handleResponse(response, "User deleted successfully!", setMessage, () => {
      updateTick();
    });
  };

  if (isDeleting) {
    return (
      <div className={styles.isDeleting}>
        <p>Are you sure you want to delete this user?</p>
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
        name="email"
        label={"Email"}
        type="email"
        defaultValue={user.email}
        required
      />
      <Input
        name="username"
        label={"Username"}
        type="text"
        required
        defaultValue={user.username}
      />
      <Select
        name="role"
        label={"Role"}
        options={roles}
        defaultValue={user.role}
        required
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
