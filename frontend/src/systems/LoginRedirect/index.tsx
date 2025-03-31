"use client";

import React, { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginContext } from "../LoginContext";
import Loading from "@/components/Loading";

interface TProps {
  children: ReactNode;
  role?: string | null;
}

export default function LoginRedirect({ children, role = null }: TProps) {
  const router = useRouter();
  const { user } = useContext(LoginContext);

  useEffect(() => {
    (async () => {
      if (user && role && user.role !== role) router.push("/");
      if (!user) router.push("/login");
    })();
  }, [router, role, user]);
  if (!user || (user && role && user.role !== role))
    return <Loading centerStage />;
  return <>{children}</>;
}
