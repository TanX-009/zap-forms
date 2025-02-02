"use server";

import { headers } from "next/headers";

export async function getBaseUrl() {
  const headersList = headers();
  const host = await headersList
    .then((headers) => {
      return headers.get("host");
    })
    .catch((error) => {
      console.error("Error getting headers: ", error);
    });
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}
