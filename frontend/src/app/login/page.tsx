"use client";

import Input from "@/components/Input";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import Message from "@/components/Message";
import { deleteLogin, setLogin } from "@/systems/cookies";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import handleResponse from "@/systems/handleResponse";
import { LoginContext } from "@/systems/LoginContext";
import useNetworkStatus from "@/hooks/networkStatus";

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

  const { user, setUser } = useContext(LoginContext);

  const isOnline = useNetworkStatus();

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOnline) {
      setMessage({ value: "Offline!", status: "error" });
      return;
    }

    setMessage({ value: "Logging in...", status: "neutral" });
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    // clear old tokens
    deleteLogin();
    const response = await AuthService.login({
      email: email,
      password: password,
    });

    handleResponse(response, "Successfully logged in!", setMessage, (data) => {
      setLogin(data.user);
      setUser(data.user);
    });
  };

  // redirect if already logged in
  useEffect(() => {
    (async function () {
      if (user) router.push("/");
    })();
  }, [router, user, message]);

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
