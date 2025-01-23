"use client";

import Input from "@/components/Input";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button/components";
import Image from "next/image";
import AuthService from "@/services/auth";
import Message from "@/components/Message";
import { deleteLogin, getLogin, setLogin } from "@/app/actions/cookies";

export default function Login() {
  const [message, setMessage] = React.useState("");

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    const response = await AuthService.login({
      email: email,
      password: password,
    });

    if (response.success) {
      await setLogin(response.data.user);
    } else {
      console.log(response);
      setMessage(response.error.detail);
    }
  };

  const onRefresh = async () => {
    const response = await AuthService.refresh();
    console.log(response);
  };
  const onLogout = async () => {
    const response = await AuthService.logout();
    console.log(response);
    if (!response.success && response.status === 401) {
      const refreshResponse = await AuthService.refresh();
      console.log(refreshResponse);

      const logoutResponse = await AuthService.logout();
      console.log(logoutResponse);
    }
    deleteLogin();
  };

  useEffect(() => {
    async function getData() {
      console.log(await getLogin());
    }
    getData();
  }, []);

  return (
    <form className={styles.login} onSubmit={onLogin}>
      <div className={styles.title}>
        <Image src="/assets/icon.svg" alt="Logo" width={100} height={100} />
        <h1>ZapForms</h1>
      </div>
      <Input name="email" type="email" label="Email" required />
      <Input name="password" type="password" label="Password" required />

      <Message>{message}</Message>

      <Button name="Login" type="submit" variant="hiClick" />
      <Button
        name="Refresh"
        type="button"
        variant="loClick"
        onClick={onRefresh}
      />
      <Button
        name="Logout"
        type="button"
        variant="loClick"
        onClick={onLogout}
      />
    </form>
  );
}
