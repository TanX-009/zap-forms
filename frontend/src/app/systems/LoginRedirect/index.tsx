"use client";

import { getLogin } from "@/app/actions/cookies";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// Redirect user to login page if not logged in
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    (async function () {
      const login = await getLogin();
      if (!login) {
        router.push("/auth/login");
      }
    })();
  }, [router]);
  return <></>;
}
