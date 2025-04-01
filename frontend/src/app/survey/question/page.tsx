"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { TAnswer, TQuestion } from "@/types/survey";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import SubmitSurvey from "./components/SubmitSurvey";
import Loading from "@/components/Loading";
import useProgressIDB from "@/hooks/progressIDB";
import { SurveyContext } from "../components/SurveyContext";
import SurveyNavbar from "../components/SurveyNavbar";
import { ProgressContext } from "@/systems/ProgressContext";
import QuestionInputs from "./components/QuestionInputs";
import RequiredStar from "@/components/RequiredStar";

const findQuestionBySequence = (
  questions: TQuestion[],
  sequence: number,
): TQuestion | undefined => {
  return questions.find((question) => question.sequence === sequence);
};

const findAnswerById = (
  answers: TAnswer[],
  id: TQuestion["id"],
): TAnswer | null => {
  return answers.find((answer) => answer.question === id) || null;
};

function pushOrUpdate(
  arr: TAnswer[],
  newItem: TAnswer,
  key: keyof TAnswer = "question",
): TAnswer[] {
  const index = arr.findIndex((item) => item[key] === newItem[key]);

  if (index !== -1) {
    arr[index] = newItem; // Update existing item
  } else {
    arr.push(newItem); // Push new item
  }
  return arr;
}

export default function SurveyQuestion() {
  const router = useRouter();

  const { survey, questions, audio, location } = useContext(SurveyContext);
  const { progress, setProgress } = useContext(ProgressContext);

  const [questionNo, setQuestionNo] = useState<number>(-1);
  const [question, setQuestion] = useState<TQuestion | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateProgress: updateProgressIDB } = useProgressIDB();

  let savedAnswer = null;
  if (question?.id) savedAnswer = findAnswerById(progress.answers, question.id);

  const onPrev = async () => {
    if (!question || !survey) return;

    const updatedProgress = { ...progress, questionNo: question.sequence - 1 };
    setProgress(updatedProgress);

    await updateProgressIDB(updatedProgress);
  };

  const onNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question || !survey) return;

    const form = new FormData(event.currentTarget);

    const answer = form.get("answer") as string;

    const answerObj: TAnswer = {
      question: question.id,
      text_answer: null,
      numeric_answer: null,
      choice_answer: null,
      checkbox_answers: [],
    };
    switch (question.type) {
      case "text":
        answerObj.text_answer = answer || null;
        break;
      case "number":
        answerObj.numeric_answer = answer || null;
        break;
      case "multiple-choice":
        answerObj.choice_answer = answer || null;
        break;
      case "checkbox":
        const checkboxAnswers: string[] = [];
        for (const [key, value] of form.entries()) {
          if (key === "answer" && typeof value === "string") {
            checkboxAnswers.push(value);
          }
        }

        answerObj.checkbox_answers =
          checkboxAnswers.length > 0 ? checkboxAnswers : [];
        break;
    }
    const allAnswers = progress.answers;
    pushOrUpdate(allAnswers, answerObj);
    const updatedProgress = {
      ...progress,
      questionNo: question.sequence,
      answers: allAnswers,
    };

    if (questions?.length === questionNo) {
      setIsSubmitting(true);
    } else {
      updatedProgress.questionNo = question.sequence + 1;
    }
    await updateProgressIDB(updatedProgress);
    setProgress(updatedProgress);
  };

  // set current question number
  useEffect(() => {
    if (progress.questionNo) {
      setQuestionNo(progress.questionNo);
    }
  }, [progress.questionNo]);

  // set question based on question number
  useEffect(() => {
    if (questions && questionNo !== -1) {
      setQuestion(findQuestionBySequence(questions, questionNo));
    }
  }, [questionNo, questions]);

  useEffect(() => {
    if (!survey) router.push("/");
  }, [survey, router]);

  if (!survey) return <Loading centerStage={true} />;
  return (
    <>
      <Modal
        title="Submit survey"
        isVisible={isSubmitting}
        setIsVisible={setIsSubmitting}
      >
        <SubmitSurvey
          answers={progress.answers}
          survey={survey}
          audio={audio}
          location={location}
        />
      </Modal>

      <form className={styles.form} onSubmit={onNext}>
        <SurveyNavbar
          title={survey.name}
          questions={questions || []}
          current={questionNo}
        />
        <div className={styles.inputs}>
          <QuestionInputs
            key={question?.id}
            question={question || null}
            savedAnswer={savedAnswer}
          />
          <div className={styles.buttons}>
            {question?.sequence && question.sequence !== 1 ? (
              <Button
                className={"loClick"}
                onClick={onPrev}
                aria-label="Previous question"
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            {questions?.length === questionNo ? (
              <Button className={styles.submit} type="submit" variant="hiClick">
                Submit
              </Button>
            ) : (
              <Button type="submit" variant="hiClick">
                Next
              </Button>
            )}
          </div>
        </div>
        <div></div>
        <div className={styles.required}>
          Questions marked with <RequiredStar /> are required.
        </div>
      </form>
    </>
  );
}
