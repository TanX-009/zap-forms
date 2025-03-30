import React from "react";
import Navbar from "./components/Navbar";
import LoginRedirect from "@/systems/LoginRedirect";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoginRedirect>
      <Navbar />
      {children}
    </LoginRedirect>
  );
}
