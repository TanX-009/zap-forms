"use client";

import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button/components";
import Image from "next/image";
import AuthService from "@/services/auth";
import Message from "@/components/Message";
import { deleteLogin, getLogin, setLogin } from "@/app/actions/cookies";
import { useRouter } from "next/navigation";

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

    const response = await AuthService.login({
      email: email,
      password: password,
    });

    if (response.success) {
      await setLogin(response.data.user);
      setMessage({ value: "Successfully logged in!", status: "success" });
    } else if (response.status === 401) {
      console.warn("401", response);
      setMessage({ value: "Invalid email or password!", status: "error" });
    } else {
      console.warn("Unknown error!", response);
      setMessage({
        value: "Server error! Please try again later.",
        status: "error",
      });
    }
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
        <Image src="/assets/icon.svg" alt="Logo" width={100} height={100} />
        <h1>ZapForms</h1>
      </div>
      <Input name="email" type="email" label="Email" required />
      <Input name="password" type="password" label="Password" required />

      <Message status={message.status}>{message.value}</Message>

      <Button name="Login" type="submit" variant="hiClick" />
    </form>
  );
}
