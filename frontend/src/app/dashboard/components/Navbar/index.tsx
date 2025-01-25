"use client";

import { deleteLogin, getLogin } from "@/app/actions/cookies";
import Button from "@/components/Button/components";
import AuthService from "@/services/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [login, setLogin] = React.useState<TUser | null>(null);

  const onLogout = async () => {
    const response = await AuthService.logout();
    console.log(response);
    setLogin(null);
    await deleteLogin();
    router.push("/auth/login");
  };

  useEffect(() => {
    (async function () {
      const userdata = await getLogin();
      if (!userdata) router.push("/auth/login");
      setLogin(userdata);
    })();
  }, [router]);

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/assets/icon.svg" alt="Logo" width={50} height={50} />
        ZapForms
      </div>
      <p>{login ? login.username || "-" : ""}</p>
      <Button
        name="Logout"
        type="button"
        variant="hiClick"
        onClick={onLogout}
      />
    </div>
  );
}
