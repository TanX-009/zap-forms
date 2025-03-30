"use client";

import { getLogin } from "@/app/actions/cookies";
import { TUser } from "@/types/user";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type TLoginContext = {
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
};

export const LoginContext = createContext<TLoginContext>({
  user: null,
  setUser: () => {},
});

interface TProps {
  children: ReactNode;
}

export default function LoginContextComponent({ children }: TProps) {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    (async function () {
      const userdata = await getLogin();
      setUser(userdata);
    })();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
