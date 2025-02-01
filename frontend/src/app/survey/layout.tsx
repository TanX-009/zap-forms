import React from "react";
import SurveyContextComponent from "./components/SurveyContext";

export default function SurveyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SurveyContextComponent>{children}</SurveyContextComponent>;
}
