"use client";

import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import Message from "@/components/Message";
import { deleteLogin, getLogin, setLogin } from "@/app/actions/cookies";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import handleResponse from "@/systems/handleResponse";

interface TMessage {
  value: string;
  status: "error" | "success" | "neutral";
}

export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState<TMessage>({
    value: "",
    status: "success",
  });

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    setMessage({ value: "Logging in...", status: "neutral" });
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    // clear old tokens
    await deleteLogin(false);
    const response = await AuthService.login({
      email: email,
      password: password,
    });

    handleResponse(
      response,
      "Successfully logged in!",
      setMessage,
      async (data) => {
        await setLogin(data.user);
      },
    );
  };

  // redirect if already logged in
  useEffect(() => {
    (async function () {
      const login = await getLogin();
      if (login) router.push("/");
    })();
  }, [router, message]);

  return (
    <form className={styles.login} onSubmit={onLogin}>
      <div className={styles.title}>
        <Logo multiplier={60} />
      </div>
      <Input name="email" type="email" label="Email" required />
      <Input name="password" type="password" label="Password" required />

      <Message status={message.status}>{message.value}</Message>

      <Button type="submit" variant="hiClick">
        Login
      </Button>
    </form>
  );
}
