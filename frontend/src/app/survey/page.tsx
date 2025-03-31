"use client";

import Loading from "@/components/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import SurveyStart from "./components/SurveyStart";

export default function Survey() {
  const searchParams = useSearchParams();
  const survey_slug = searchParams.get("survey_slug");

  const router = useRouter();
  useEffect(() => {
    if (!survey_slug) router.push("/");
  }, [survey_slug, router]);

  if (!survey_slug) return <Loading centerStage />;

  return <SurveyStart survey_slug={survey_slug} />;
}
