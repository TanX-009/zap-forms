"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { SurveyContext } from "../../components/SurveyContext";
import styles from "./styles.module.css";
import { TAnswer, TQuestion } from "@/types/survey";
import Input from "@/components/Input";
import SurveyNavbar from "../../components/SurveyNavbar";
import Button from "@/components/Button";
import Link from "next/link";
import { FaStarOfLife } from "react-icons/fa";
import Modal from "@/components/Modal";
import SubmitSurvey from "./components/SubmitSurvey";
import getOneNestBack from "@/systems/getOneNestBack";
import Loading from "@/components/Loading";
import RadioGroup from "@/components/RadioGroup";
import CheckboxGroup from "@/components/CheckboxGroup";
import useAnswersIDB from "@/hooks/answersIDB";

const findQuestionBySequence = (
  questions: TQuestion[],
  sequence: number,
): TQuestion | undefined => {
  return questions.find((question) => question.sequence === sequence);
};

const findAnswerById = (
  answers: TAnswer[],
  id: TQuestion["id"],
): TAnswer | undefined => {
  return answers.find((answer) => answer.question === id);
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

const convertOptions = (
  options: { id: number; question: TQuestion["id"]; text: string }[] | null,
): { value: string; label: string }[] => {
  if (!options) return [];
  return options.map((option) => ({
    value: option.id.toString(),
    label: option.text,
  }));
};

export default function SurveyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [questionNo, setQuestionNo] = useState<number>(-1);
  const {
    survey,
    questions,
    answers,
    setAnswers,
    setProgress,
    complete,
    setComplete,
    audio,
    location,
  } = useContext(SurveyContext);

  const [question, setQuestion] = useState<TQuestion | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnPath = getOneNestBack(pathname);

  const { updateOrAddAnswer } = useAnswersIDB();

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
    const allAnswers = answers;
    pushOrUpdate(allAnswers, answerObj);
    setAnswers(allAnswers);
    setProgress(question.sequence);
    await updateOrAddAnswer(answerObj);
    if (questions?.length === questionNo) {
      setIsSubmitting(true);
    } else {
      router.push(`/survey/${survey.slug}/${question.sequence + 1}`);
    }
  };

  // set current question number
  useEffect(() => {
    if (params.survey_page && !isNaN(Number(params.survey_page))) {
      setQuestionNo(Number(params.survey_page));
    }
  }, [params.survey_page]);

  // set question based on question number
  useEffect(() => {
    if (questions && questionNo !== -1) {
      setQuestion(findQuestionBySequence(questions, questionNo));
    }
  }, [questionNo, questions]);

  useEffect(() => {
    if (
      questions &&
      questionNo !== -1 &&
      (questionNo > questions.length || questionNo < 1)
    ) {
      router.push(returnPath);
    }
  }, [questionNo, questions, returnPath, router]);

  useEffect(() => {
    if (complete) {
      router.push(`/survey/${survey?.slug}/complete`);
    }
  }, [complete, survey?.slug, router]);

  useEffect(() => {
    if (!survey) router.push(returnPath);
  }, [survey, returnPath, router]);

  if (!survey) return <Loading centerStage={true} />;
  return (
    <>
      <Modal
        title="Submit survey"
        isVisible={isSubmitting}
        setIsVisible={setIsSubmitting}
      >
        <SubmitSurvey
          answers={answers}
          survey={survey}
          setComplete={setComplete}
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
          {question?.type === "text" ? (
            <Input
              name="answer"
              type="text"
              label={
                <>
                  {question.text}
                  {question.required ? (
                    <span className={styles.star}>
                      {" "}
                      <FaStarOfLife />
                    </span>
                  ) : null}
                </>
              }
              defaultValue={
                findAnswerById(answers, question.id)?.text_answer || ""
              }
              minLength={question.min_length}
              maxLength={question.max_length}
              placeholder={"Text answer..."}
              required={question.required}
            />
          ) : null}
          {question?.type === "number" ? (
            <Input
              name="answer"
              type="number"
              label={
                <>
                  {question.text}
                  {question.required ? (
                    <span className={styles.star}>
                      {" "}
                      <FaStarOfLife />
                    </span>
                  ) : null}
                </>
              }
              minLength={question.min_length}
              maxLength={question.max_length}
              defaultValue={
                findAnswerById(answers, question.id)?.numeric_answer || ""
              }
              placeholder={"Numeric answer..."}
              required={question.required}
            />
          ) : null}
          {question?.type === "multiple-choice" ? (
            <RadioGroup
              search
              name="answer"
              label={
                <>
                  {question.text}
                  {question.required ? (
                    <span className={styles.star}>
                      {" "}
                      <FaStarOfLife />
                    </span>
                  ) : null}
                </>
              }
              defaultValue={
                findAnswerById(
                  answers,
                  question.id,
                )?.choice_answer?.toString() || ""
              }
              options={convertOptions(question.options)}
              required={question.required}
            />
          ) : null}
          {question?.type === "checkbox" ? (
            <CheckboxGroup
              search
              name="answer"
              label={
                <>
                  {question.text}
                  {question.required ? (
                    <span className={styles.star}>
                      {" "}
                      <FaStarOfLife />
                    </span>
                  ) : null}
                </>
              }
              defaultValue={
                findAnswerById(answers, question.id)?.checkbox_answers || []
              }
              options={convertOptions(question.options)}
              required={question.required}
            />
          ) : null}
          <div className={styles.buttons}>
            {question?.sequence && question.sequence !== 1 ? (
              <Link
                className={"loClick"}
                href={`/survey/${survey.slug}/${question?.sequence - 1}`}
                aria-label="Previous question"
              >
                Previous
              </Link>
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
          Questions marked with{" "}
          <span className={styles.star}>
            <FaStarOfLife />
          </span>{" "}
          are required.
        </div>
      </form>
    </>
  );
}
