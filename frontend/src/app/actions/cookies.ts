"use server";

import { TUser } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setLogin(user: TUser) {
  const cookieStore = await cookies();
  cookieStore.set("login", JSON.stringify(user));
}

export async function getLogin(): Promise<TUser | null> {
  try {
    const cookieStore = await cookies(); // Assuming cookies() is properly typed
    const userCookie = cookieStore.get("login");

    if (userCookie && typeof userCookie.value === "string") {
      const user: TUser = JSON.parse(userCookie.value) as TUser;
      return user;
    } else {
      console.warn("User cookie not found.");
      return null;
    }
  } catch (error) {
    console.error("Failed to retrieve or parse user cookie:", error);
    return null;
  }
}

export async function deleteLogin(redirectToLogin = true) {
  const cookieStore = await cookies();
  await cookieStore.delete("login");
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  if (redirectToLogin) redirect("/login");
}
