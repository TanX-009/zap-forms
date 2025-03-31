"use client";

import React, { FormEvent, useContext, useEffect } from "react";
import styles from "./styles.module.css";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import useFetchSurvey from "@/hooks/fetchSurvey";
import useFetchQuestions from "@/hooks/fetchQuestions";
import Error from "@/components/Error";
import { MdError } from "react-icons/md";
import Loading from "@/components/Loading";
import { IoCloudOffline } from "react-icons/io5";
import { SurveyContext } from "./components/SurveyContext";
import { ProgressContext } from "@/systems/ProgressContext";

export default function Survey() {
  const router = useRouter();

  const { survey, setSurvey, setQuestions, audio, getLocation } =
    useContext(SurveyContext);
  const { progress, updateProgress } = useContext(ProgressContext);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Do nothing if slug isn't present
    if (!survey?.slug) return;

    // start recording
    if (!audio.isRecording) await audio.startRecording();
    // get location
    await getLocation();

    // start new survey
    if (!progress.questionNo) {
      const date = new Date();
      updateProgress(
        {
          survey_slug: survey.slug,
          questionNo: 1,
          startTime: date.toISOString(),
        },
        () => {
          router.push(`/survey/question`);
        },
      );
    }
    // continue last survey
    else {
      router.push(`/survey/question`);
    }
  };

  const {
    isLoading: isSurveyLoading,
    fetchSurvey,
    error,
  } = useFetchSurvey(setSurvey);

  const { isLoading: areQuestionsLoading, fetchQuestions } =
    useFetchQuestions(setQuestions);

  useEffect(() => {
    if (!progress.survey_slug) router.push("/");
  }, [progress.survey_slug, router]);

  useEffect(() => {
    if (typeof progress.survey_slug === "string") {
      fetchSurvey(progress.survey_slug);
    }
  }, [progress.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (survey?.id) fetchQuestions(survey.id);
  }, [survey, fetchQuestions]);

  if (!survey) return <Loading centerStage={true} />;

  if (error === "Not found!")
    return <Error icon={<MdError />}>Survey not found!</Error>;

  if (!survey.online)
    return (
      <Error icon={<IoCloudOffline />}>The survey is not online yet!</Error>
    );

  //setSurvey({ ...survey, status: "post" });
  return (
    <form className={styles.survey} onSubmit={onSubmit}>
      <Logo multiplier={70} />
      <h1>{survey.name}</h1>
      <p>{survey.description}</p>
      <span className={styles.disclaimer}>
        This survey requires permission to record audio and location while it is
        in progress. By clicking <strong>&quot;Start Survey&quot;</strong>, you
        consent to this recording.
      </span>

      {isSurveyLoading || areQuestionsLoading ? (
        <Loading centerStage={true} />
      ) : (
        <Button variant="hiClick" className={styles.start} type="submit">
          Start survey
        </Button>
      )}
    </form>
  );
}
