import React from "react";
import Navbar from "./components/Navbar";
import LoginContextComponent from "./components/LoginContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <LoginContextComponent>{children}</LoginContextComponent>

      {/* systems */}
    </>
  );
}
