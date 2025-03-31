import React from "react";
import SurveyContextComponent from "./components/SurveyContext";
import LoginRedirect from "@/systems/LoginRedirect";

export default function SurveyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SurveyContextComponent>
        <LoginRedirect>{children}</LoginRedirect>
      </SurveyContextComponent>
    </>
  );
}
