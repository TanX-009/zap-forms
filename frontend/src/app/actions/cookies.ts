"use server";

import { cookies } from "next/headers";

export async function deleteLogin() {
  const cookieStore = await cookies();
  await cookieStore.delete("login");
  await cookieStore.delete("access_token");
  await cookieStore.delete("refresh_token");
}
