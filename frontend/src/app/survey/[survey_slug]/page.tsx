"use client";

import React, { FormEvent, useContext, useEffect } from "react";
import styles from "./styles.module.css";
import { SurveyContext } from "../components/SurveyContext";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import useFetchSurvey from "@/hooks/fetchSurvey";
import useFetchQuestions from "@/hooks/fetchQuestions";

export default function Survey() {
  const params = useParams();
  const router = useRouter();
  const { survey, setSurvey, setUser, setQuestions } =
    useContext(SurveyContext);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const email = form.get("email") as string;
    const name = form.get("name") as string;

    setUser({ name: name, email: email });
    if (survey?.slug) router.push(`/survey/${survey.slug}/1`);
  };

  const {
    isLoading: isSurveyLoading,
    fetchSurvey,
    error,
  } = useFetchSurvey(setSurvey);

  const { isLoading: areQuestionsLoading, fetchQuestions } =
    useFetchQuestions(setQuestions);

  useEffect(() => {
    if (typeof params.survey_slug === "string") {
      fetchSurvey(params.survey_slug);
    }
  }, [params.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (survey?.id) fetchQuestions(survey.id);
  }, [survey, fetchQuestions]);

  if (error === "Not found!") return "Survey not found!";
  if (isSurveyLoading || areQuestionsLoading) return "Loading...";

  if (!survey?.online) return "The survey is not online yet!";

  //setSurvey({ ...survey, status: "post" });
  return (
    <form className={styles.survey} onSubmit={onSubmit}>
      <Logo multiplier={70} />
      <h1>{survey?.name}</h1>
      <p>{survey?.description}</p>
      <Input name="email" label={"Email"} type="email" required />
      <Input name="name" label={"Name"} type="text" required />
      <span className={styles.disclaimer}>
        This survey requires permission to record audio while it is in progress.
        By clicking <strong>&quot;Start Survey&quot;</strong>, you consent to
        this recording.
      </span>

      <Button variant="hiClick" className={styles.start} type="submit">
        Start survey
      </Button>
    </form>
  );
}
