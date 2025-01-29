"use client";

import { getLogin } from "@/app/actions/cookies";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface TProps {
  children: ReactNode;
}

export type TLoginContext = [TUser | null, (value: TUser) => void];

export const LoginContext = createContext<TLoginContext>([null, () => {}]);

export default function LoginContextComponent({ children }: TProps) {
  const router = useRouter();
  const [login, setLogin] = useState<TUser | null>(null);

  useEffect(() => {
    (async function () {
      const loginData = await getLogin();
      setLogin(loginData);
      if (!loginData) {
        router.push("/auth/login");
      }
    })();
  }, [router]);

  if (!login) {
    return "Loading...";
  }
  return (
    <LoginContext.Provider
      value={[
        login,
        (value: TUser) => {
          setLogin(value);
        },
      ]}
    >
      {children}
    </LoginContext.Provider>
  );
}
