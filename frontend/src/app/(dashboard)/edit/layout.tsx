import React from "react";
import LoginRedirect from "@/systems/LoginRedirect";

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginRedirect role={"admin"}>{children}</LoginRedirect>;
}
