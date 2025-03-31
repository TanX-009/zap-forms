import React from "react";
import LoginRedirect from "@/systems/LoginRedirect";
import SurveyContextComponent from "./components/SurveyContext";

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
