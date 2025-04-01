"use server";

import { cookies } from "next/headers";

export async function deleteLogin() {
  const cookieStore = await cookies();
  await cookieStore.delete("login");
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
